import { FormEvent, useState, useEffect } from 'react';
import { FeedsFormData } from '../types';
import { FeedsService } from '../database-service';

interface Props {
  loggedForId: number;
  recordId?: number;
  onComplete?: () => void;
}

export function FeedsForm({ loggedForId, recordId, onComplete }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FeedsFormData>({
    logged_for: loggedForId,
  });

  useEffect(() => {
    async function fetchData() {
      if (recordId) {
        setIsLoading(true);
        const { data } = await FeedsService.get(recordId);
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
        await FeedsService.update(recordId, formData);
      } else {
        await FeedsService.create(formData);
      }
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving feed record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({ ...formData, [name]: value ? Number(value) : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (isLoading && recordId) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Feed Type:
          <select 
            name="feed_type"
            value={formData.feed_type || ''}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            <option value="breast">Breast</option>
            <option value="bottle">Bottle</option>
            <option value="formula">Formula</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Amount (ml):
          <input 
            type="number" 
            name="amount_ml"
            value={formData.amount_ml || ''}
            onChange={handleInputChange}
          />
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
