import supabase from "../../client";

// Diapers

type PeeColors = null | 'Light' | 'Medium' | 'Dark';
type PooColors = null | 'Green' | 'Yellow' | 'Brown';
type PooTextures = null | 'Solid' | 'Seedy' | 'Runny' | 'Mucousy';

interface Record {
    id?: number;
    user_id?: number;
    person_id: number;
    created_at?: string;
    notes?: string;
}

export interface DiaperRecord extends Record {
    has_pee?: boolean;
    has_poo?: boolean;
    pee_color?: PeeColors;
    poo_color?: PooColors;
    poo_texture?: PooTextures;
}

export const diaperClient = {
    async insert(diaper: DiaperRecord): Promise<DiaperRecord> {
        const { data, error } = await supabase.from('babytracker_diapers').insert(diaper).select();
        if (error) {
            throw error;
        }
        return data?.[0];
    },
    async update(diaper: DiaperRecord): Promise<DiaperRecord> {
        const { data, error } = await supabase.from('babytracker_diapers').update(diaper).eq('id', diaper.id).select();
        if (error) {
            throw error;
        }
        return data?.[0];
    },
    async delete(diaper: DiaperRecord): Promise<void> {
        const { error } = await supabase.from('babytracker_diapers').delete().eq('id', diaper.id);
        if (error) {
            throw error;
        }
    },
    async select(id: number): Promise<DiaperRecord[]> {
        const { data, error } = await supabase.from('babytracker_diapers').select().eq('id', id);
        if (error) {
            throw error;
        }
        return data || [];
    }
}


export default  {
    diaperClient,
}

// Feeding
