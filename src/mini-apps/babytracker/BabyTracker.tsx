import React from 'react';
import { DiaperRecord, diaperClient } from './babyTrackerClient';

// Helper function to format date to 'yyyy-MM-ddThh:mm'
const formatDateForInput = (date: Date) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const BabyTracker: React.FC = () => {
    const [activeForm, setActiveForm] = React.useState<null | 'diapers' | 'feeding'>(null);

    const [diaperRecord, setDiaperRecord] = React.useState<DiaperRecord>({
        person_id: 1, // Fenn is numba 1
        created_at: new Date().toISOString(),
        has_pee: false,
        has_poo: false,
        pee_color: null,
        poo_color: null,
        poo_texture: null,
    } as DiaperRecord);

    function clearDiaperRecord() {
        setDiaperRecord({
            person_id: 1,
            created_at: new Date().toISOString(),
            has_pee: false,
            has_poo: false,
            pee_color: null,
            poo_color: null,
            poo_texture: null,
        });
        setActiveForm(null);
    }

    function submitDiaperRecord() {
        diaperClient.insert(diaperRecord!).then((record) => {
            setDiaperRecord(record);
            setActiveForm(null);
        }
        ).catch((error) => {
            console.error('Error inserting diaper record:', error);
        });
    }

    return (
        <div className='flex flex-col h-full'>
            <h1>Baby Tracker</h1>
            <p>Track your baby's activities and milestones.</p>
            <div className='mt-auto p-2'>
                {
                    activeForm === null &&
                    <div className='flex flex-row-reverse'>
                        <div className='m-1 border px-2 py-1'
                            onClick={() => setActiveForm('diapers')}>
                            diapers
                        </div>
                    </div>
                }

                {
                    activeForm === 'diapers' && <div>
                        <h2>Diaper Change</h2>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            submitDiaperRecord();
                        }}>
                            <div className="mb-3">
                                <label className="block mb-1">Date/Time:</label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-2 border"
                                    value={diaperRecord?.created_at ? formatDateForInput(new Date(diaperRecord.created_at)) : formatDateForInput(new Date())}
                                    onChange={(e) => setDiaperRecord({
                                        ...(diaperRecord || { person_id: 1 }),
                                        created_at: new Date(e.target.value).toISOString()
                                    })}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="block mb-1">Diaper Contents:</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        className={`px-4 py-2 border rounded flex-1 ${diaperRecord?.has_pee ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                        onClick={() => setDiaperRecord({
                                            ...(diaperRecord || { person_id: 1 }),
                                            has_pee: !diaperRecord?.has_pee,
                                            pee_color: !diaperRecord?.has_pee ? 'Light' : null
                                        })}
                                    >
                                        {diaperRecord?.has_pee ? 'Pee ✓' : 'Pee'}
                                    </button>
                                    
                                    <button
                                        type="button"
                                        className={`px-4 py-2 border rounded flex-1 ${diaperRecord?.has_poo ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                        onClick={() => setDiaperRecord({
                                            ...(diaperRecord || { person_id: 1 }),
                                            has_poo: !diaperRecord?.has_poo,
                                            poo_color: !diaperRecord?.has_poo ? 'Yellow' : null,
                                            poo_texture: !diaperRecord?.has_poo ? 'Seedy' : null
                                        })}
                                    >
                                        {diaperRecord?.has_poo ? 'Poo ✓' : 'Poo'}
                                    </button>
                                </div>
                            </div>

                            {
                                diaperRecord?.has_pee && <div className="mb-3">
                                    <label className="block mb-1">Pee Color:</label>
                                    <div className="flex gap-2">
                                        {["Light", "Medium", "Dark"].map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`px-3 py-1 border rounded ${diaperRecord?.pee_color === color ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                                onClick={() => setDiaperRecord({
                                                    ...(diaperRecord || { person_id: 1 }),
                                                    pee_color: color as DiaperRecord['pee_color']
                                                })}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            }

                            {
                                diaperRecord?.has_poo && <div className="mb-3">
                                    <label className="block mb-1">Poo Color:</label>
                                    <div className="flex gap-2 mb-2">
                                        {["Green", "Yellow", "Brown"].map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                className={`px-3 py-1 border rounded ${diaperRecord?.poo_color === color ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                                onClick={() => setDiaperRecord({
                                                    ...(diaperRecord || { person_id: 1 }),
                                                    poo_color: color as DiaperRecord['poo_color']
                                                })}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>

                                    <label className="block mb-1">Poo Texture:</label>
                                    <div className="flex flex-wrap gap-2">
                                        {["Solid", "Seedy", "Runny", "Mucousy"].map((texture) => (
                                            <button
                                                key={texture}
                                                type="button"
                                                className={`px-3 py-1 border rounded ${diaperRecord?.poo_texture === texture ? 'bg-blue-500 text-white' : 'bg-white'}`}
                                                onClick={() => setDiaperRecord({
                                                    ...(diaperRecord || { person_id: 1 }),
                                                    poo_texture: texture as DiaperRecord['poo_texture']
                                                })}
                                            >
                                                {texture}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            }
                            

                            <div className="flex justify-between">
                                <button 
                                className='border px-2 py-1'
                                onClick={() => clearDiaperRecord()}>Back</button>
                                
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                    disabled={!diaperRecord}
                                >
                                    Save
                                </button>
                                
                            </div>
                        </form>

                    </div>
                }

                {
                    activeForm === 'feeding' && <div>
                        <h2>Feeding</h2>
                        <p>Record feeding times.</p>
                        <button onClick={() => setActiveForm(null)}>Back</button>
                    </div>
                }
            </div>
        </div>
    );
};

export default BabyTracker;