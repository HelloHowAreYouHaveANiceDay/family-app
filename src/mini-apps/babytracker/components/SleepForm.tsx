import { FormEvent, useState, useEffect } from 'react';
import { SleepFormData } from '../types';
import { SleepService } from '../database-service';

interface Props {
  loggedForId: number;
  recordId?: number;
  onComplete?: () => void;
}

export function SleepForm({ loggedForId, recordId, onComplete }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SleepFormData>({
    logged_for: loggedForId,
  });

  useEffect(() => {
    async function fetchData() {
      if (recordId) {
        setIsLoading(true);
        const { data } = await SleepService.get(recordId);
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
        await SleepService.update(recordId, formData);
      } else {
        await SleepService.create(formData);
      }
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving sleep record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          Start Time:
          <input 
            type="datetime-local" 
            name="start_time"
            value={formData.start_time || ''}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div>
        <label>
          End Time:
          <input 
            type="datetime-local" 
            name="end_time"
            value={formData.end_time || ''}
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
