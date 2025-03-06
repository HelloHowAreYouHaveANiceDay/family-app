import { FormEvent, useState, useEffect } from 'react';
import { PumpingFormData } from '../types';
import { PumpingService } from '../database-service';

interface Props {
  loggedForId: number;
  recordId?: number;
  onComplete?: () => void;
}

export function PumpingForm({ loggedForId, recordId, onComplete }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<PumpingFormData>({
    logged_for: loggedForId,
  });

  useEffect(() => {
    async function fetchData() {
      if (recordId) {
        setIsLoading(true);
        const { data } = await PumpingService.get(recordId);
        if (data) {
          setFormData(data);
        }
        setIsLoading(false);
      }
    }
    fetchData();
  }, [recordId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (recordId) {
        await PumpingService.update(recordId, formData);
      } else {
        await PumpingService.create(formData);
      }
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving pumping record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading && recordId) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Side:
          <select 
            name="side"
            value={formData.side || ''}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
            <option value="both">Both</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Start Time:
          <input 
            type="datetime-local" 
            name="start"
            value={formData.start || ''}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div>
        <label>
          End Time:
          <input 
            type="datetime-local" 
            name="end"
            value={formData.end || ''}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div>
        <label>
          Notes:
          <textarea 
            name="notes"
            value={formData.notes || ''}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : (recordId ? 'Update' : 'Create')}
      </button>
    </form>
  );
}
