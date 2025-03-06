import { useState, useEffect } from 'react';
import { supabase } from '../../client';
import { Modal } from './components/Modal';
import { SleepForm } from './components/SleepForm';
import { FeedsForm } from './components/FeedsForm';
import { DiapersForm } from './components/DiapersForm';
import { PumpingForm } from './components/PumpingForm';

export default function BabyTracker() {
    // Define types for state variables
    interface Activity {
        id: number;
        type: string;
        timestamp: string;
        notes?: string;
    }
    
    interface SleepRecord {
        id: number;
        start_time: string;
        end_time: string;
    }
    
    interface FeedRecord {
        id: number;
        feed_type: string;
        start: string;
        end: string;
        amount_ml?: number;
        notes?: string;
    }
    
    interface DiaperRecord {
        id: number;
        created_at: string;
        has_pee: boolean;
        pee_color?: string;
        has_poo: boolean;
        poo_color?: string;
        poo_texture?: string;
        notes?: string;
    }
    
    interface PumpingRecord {
        id: number;
        side: string;
        start: string;
        end: string;
        notes?: string;
    }
    
    // State for activities
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    
    // State for last entries
    const [lastSleep, setLastSleep] = useState<SleepRecord | null>(null);
    const [lastFeed, setLastFeed] = useState<FeedRecord | null>(null);
    const [lastDiaper, setLastDiaper] = useState<DiaperRecord | null>(null);
    const [lastPumping, setLastPumping] = useState<PumpingRecord | null>(null);
    
    // Modal states
    const [modalType, setModalType] = useState<string | null>(null);
    const [editingRecordId, setEditingRecordId] = useState<number | undefined>(undefined);
    const [loggedForId] = useState<number>(1); // Default user ID, removed unused setter
    
    useEffect(() => {
        fetchActivities();
        fetchLastEntries();
    }, []);

    async function fetchActivities() {
        setLoading(true);
        const { data, error } = await supabase
            .from('baby_activities')
            .select('*')
            .order('timestamp', { ascending: false })
            .limit(10);

        if (error) {
            console.error('Error fetching activities:', error);
        } else {
            setActivities(data || []);
        }
        setLoading(false);
    }
    
    async function fetchLastEntries() {
        // Fetch last sleep entry
        const { data: sleepData } = await supabase
            .from('sleep')
            .select('*')
            .order('start_time', { ascending: false })
            .limit(1);
        
        if (sleepData && sleepData.length > 0) {
            setLastSleep(sleepData[0]);
        }
        
        // Fetch last feed entry
        const { data: feedData } = await supabase
            .from('feeds')
            .select('*')
            .order('start', { ascending: false })
            .limit(1);
            
        if (feedData && feedData.length > 0) {
            setLastFeed(feedData[0]);
        }
        
        // Fetch last diaper entry
        const { data: diaperData } = await supabase
            .from('diapers')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(1);
            
        if (diaperData && diaperData.length > 0) {
            setLastDiaper(diaperData[0]);
        }
        
        // Fetch last pumping entry
        const { data: pumpingData } = await supabase
            .from('pumping')
            .select('*')
            .order('start', { ascending: false })
            .limit(1);
            
        if (pumpingData && pumpingData.length > 0) {
            setLastPumping(pumpingData[0]);
        }
    }

    function openModal(type: string, recordId?: number) {
        setModalType(type);
        setEditingRecordId(recordId);
    }

    function closeModal() {
        setModalType(null);
        setEditingRecordId(undefined);
    }
    
    function handleFormComplete() {
        closeModal();
        fetchLastEntries();
        fetchActivities();
    }

    // Format datetime for display
    function formatDateTime(dateStr: string) {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleString();
    }
    
    // Format duration between two dates
    function formatDuration(startStr?: string, endStr?: string) {
        if (!startStr || !endStr) return 'N/A';
        
        const start = new Date(startStr);
        const end = new Date(endStr);
        const diffMs = end.getTime() - start.getTime();
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        return `${hours}h ${minutes}m`;
    }

    return (
        <div className="baby-tracker">
            <h1>Baby Tracker</h1>
            
            <div className="tracker-cards">
                {/* Sleep Tracking Section */}
                <div className="tracker-card">
                    <h2>Sleep</h2>
                    {lastSleep ? (
                        <div className="last-entry">
                            <h3>Last Sleep Record</h3>
                            <p><strong>Start:</strong> {formatDateTime(lastSleep.start_time)}</p>
                            <p><strong>End:</strong> {formatDateTime(lastSleep.end_time)}</p>
                            <p><strong>Duration:</strong> {formatDuration(lastSleep.start_time, lastSleep.end_time)}</p>
                            <button onClick={() => openModal('sleep', lastSleep.id)}>Edit</button>
                        </div>
                    ) : (
                        <p>No sleep records found.</p>
                    )}
                    <button onClick={() => openModal('sleep')}>Record New Sleep</button>
                </div>
                
                {/* Feeds Tracking Section */}
                <div className="tracker-card">
                    <h2>Feeds</h2>
                    {lastFeed ? (
                        <div className="last-entry">
                            <h3>Last Feed Record</h3>
                            <p><strong>Type:</strong> {lastFeed.feed_type}</p>
                            <p><strong>Start:</strong> {formatDateTime(lastFeed.start)}</p>
                            <p><strong>End:</strong> {formatDateTime(lastFeed.end)}</p>
                            {lastFeed.amount_ml && <p><strong>Amount:</strong> {lastFeed.amount_ml} ml</p>}
                            {lastFeed.notes && <p><strong>Notes:</strong> {lastFeed.notes}</p>}
                            <button onClick={() => openModal('feeds', lastFeed.id)}>Edit</button>
                        </div>
                    ) : (
                        <p>No feeding records found.</p>
                    )}
                    <button onClick={() => openModal('feeds')}>Record New Feed</button>
                </div>
                
                {/* Diaper Tracking Section */}
                <div className="tracker-card">
                    <h2>Diapers</h2>
                    {lastDiaper ? (
                        <div className="last-entry">
                            <h3>Last Diaper Record</h3>
                            <p><strong>Time:</strong> {formatDateTime(lastDiaper.created_at)}</p>
                            <p><strong>Pee:</strong> {lastDiaper.has_pee ? 'Yes' : 'No'}</p>
                            {lastDiaper.has_pee && lastDiaper.pee_color && (
                                <p><strong>Pee Color:</strong> {lastDiaper.pee_color.replace('_', ' ')}</p>
                            )}
                            <p><strong>Poo:</strong> {lastDiaper.has_poo ? 'Yes' : 'No'}</p>
                            {lastDiaper.has_poo && (
                                <>
                                    {lastDiaper.poo_color && <p><strong>Poo Color:</strong> {lastDiaper.poo_color}</p>}
                                    {lastDiaper.poo_texture && <p><strong>Poo Texture:</strong> {lastDiaper.poo_texture}</p>}
                                </>
                            )}
                            {lastDiaper.notes && <p><strong>Notes:</strong> {lastDiaper.notes}</p>}
                            <button onClick={() => openModal('diapers', lastDiaper.id)}>Edit</button>
                        </div>
                    ) : (
                        <p>No diaper records found.</p>
                    )}
                    <button onClick={() => openModal('diapers')}>Record New Diaper Change</button>
                </div>
                
                {/* Pumping Tracking Section */}
                <div className="tracker-card">
                    <h2>Pumping</h2>
                    {lastPumping ? (
                        <div className="last-entry">
                            <h3>Last Pumping Record</h3>
                            <p><strong>Side:</strong> {lastPumping.side}</p>
                            <p><strong>Start:</strong> {formatDateTime(lastPumping.start)}</p>
                            <p><strong>End:</strong> {formatDateTime(lastPumping.end)}</p>
                            <p><strong>Duration:</strong> {formatDuration(lastPumping.start, lastPumping.end)}</p>
                            {lastPumping.notes && <p><strong>Notes:</strong> {lastPumping.notes}</p>}
                            <button onClick={() => openModal('pumping', lastPumping.id)}>Edit</button>
                        </div>
                    ) : (
                        <p>No pumping records found.</p>
                    )}
                    <button onClick={() => openModal('pumping')}>Record New Pumping</button>
                </div>
            </div>
            
            {/* Recent Activities List */}
            <div className="activity-list">
                <h2>Recent Activities</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : activities.length === 0 ? (
                    <p>No activities recorded yet.</p>
                ) : (
                    <ul>
                        {activities.map((activity) => (
                            <li key={activity.id}>
                                <strong>{activity.type}</strong>
                                <span> - {new Date(activity.timestamp).toLocaleString()}</span>
                                {activity.notes && <p>{activity.notes}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {/* Modals for forms */}
            <Modal 
                isOpen={modalType === 'sleep'} 
                onClose={closeModal} 
                title={editingRecordId ? 'Edit Sleep Record' : 'New Sleep Record'}
            >
                <SleepForm 
                    loggedForId={loggedForId} 
                    recordId={editingRecordId} 
                    onComplete={handleFormComplete} 
                />
            </Modal>
            
            <Modal 
                isOpen={modalType === 'feeds'} 
                onClose={closeModal} 
                title={editingRecordId ? 'Edit Feed Record' : 'New Feed Record'}
            >
                <FeedsForm 
                    loggedForId={loggedForId} 
                    recordId={editingRecordId} 
                    onComplete={handleFormComplete} 
                />
            </Modal>
            
            <Modal 
                isOpen={modalType === 'diapers'} 
                onClose={closeModal} 
                title={editingRecordId ? 'Edit Diaper Record' : 'New Diaper Record'}
            >
                <DiapersForm 
                    loggedForId={loggedForId} 
                    recordId={editingRecordId} 
                    onComplete={handleFormComplete} 
                />
            </Modal>
            
            <Modal 
                isOpen={modalType === 'pumping'} 
                onClose={closeModal} 
                title={editingRecordId ? 'Edit Pumping Record' : 'New Pumping Record'}
            >
                <PumpingForm 
                    loggedForId={loggedForId} 
                    recordId={editingRecordId} 
                    onComplete={handleFormComplete} 
                />
            </Modal>
        </div>
    );
}
