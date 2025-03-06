import { FormEvent, useState, useEffect } from 'react';
import { DiapersFormData } from '../types';
import { DiapersService } from '../database-service';

interface Props {
  loggedForId: number;
  recordId?: number;
  onComplete?: () => void;
}

export function DiapersForm({ loggedForId, recordId, onComplete }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DiapersFormData>({
    logged_for: loggedForId,
  });

  useEffect(() => {
    async function fetchData() {
      if (recordId) {
        setIsLoading(true);
        const { data } = await DiapersService.get(recordId);
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
        await DiapersService.update(recordId, formData);
      } else {
        await DiapersService.create(formData);
      }
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving diaper record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (name === 'has_pee' || name === 'has_poo') {
      setFormData({ ...formData, [name]: value === 'true' });
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
          Has Pee:
          <select 
            name="has_pee"
            value={formData.has_pee?.toString() || ''}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Pee Color:
          <select 
            name="pee_color"
            value={formData.pee_color || ''}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            <option value="clear">Clear</option>
            <option value="pale_yellow">Pale Yellow</option>
            <option value="dark_yellow">Dark Yellow</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Has Poo:
          <select 
            name="has_poo"
            value={formData.has_poo?.toString() || ''}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Poo Color:
          <select 
            name="poo_color"
            value={formData.poo_color || ''}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            <option value="yellow">Yellow</option>
            <option value="brown">Brown</option>
            <option value="green">Green</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Poo Texture:
          <select 
            name="poo_texture"
            value={formData.poo_texture || ''}
            onChange={handleInputChange}
          >
            <option value="">Select...</option>
            <option value="liquid">Liquid</option>
            <option value="soft">Soft</option>
            <option value="firm">Firm</option>
          </select>
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
