export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      babytracker_diapers: {
        Row: {
          created_at: string
          has_pee: boolean | null
          has_poo: boolean | null
          id: number
          logged_for: number
          notes: string | null
          pee_color: string | null
          poo_color: string | null
          poo_texture: string | null
        }
        Insert: {
          created_at?: string
          has_pee?: boolean | null
          has_poo?: boolean | null
          id?: number
          logged_for: number
          notes?: string | null
          pee_color?: string | null
          poo_color?: string | null
          poo_texture?: string | null
        }
        Update: {
          created_at?: string
          has_pee?: boolean | null
          has_poo?: boolean | null
          id?: number
          logged_for?: number
          notes?: string | null
          pee_color?: string | null
          poo_color?: string | null
          poo_texture?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "babytracker_diapers_logged_for_fkey"
            columns: ["logged_for"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      babytracker_feeds: {
        Row: {
          amount_ml: number | null
          created_at: string
          end: string | null
          feed_type: string | null
          id: number
          logged_for: number
          notes: string | null
          start: string | null
        }
        Insert: {
          amount_ml?: number | null
          created_at?: string
          end?: string | null
          feed_type?: string | null
          id?: number
          logged_for: number
          notes?: string | null
          start?: string | null
        }
        Update: {
          amount_ml?: number | null
          created_at?: string
          end?: string | null
          feed_type?: string | null
          id?: number
          logged_for?: number
          notes?: string | null
          start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "babytracker_feeds_logged_for_fkey"
            columns: ["logged_for"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      babytracker_pumping: {
        Row: {
          created_at: string
          end: string | null
          id: number
          logged_for: number
          notes: string | null
          side: string | null
          start: string | null
        }
        Insert: {
          created_at?: string
          end?: string | null
          id?: number
          logged_for: number
          notes?: string | null
          side?: string | null
          start?: string | null
        }
        Update: {
          created_at?: string
          end?: string | null
          id?: number
          logged_for?: number
          notes?: string | null
          side?: string | null
          start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "babytracker_pumping_logged_for_fkey"
            columns: ["logged_for"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      babytracker_sleep: {
        Row: {
          created_at: string
          end_time: string | null
          id: number
          logged_for: number
          start_time: string | null
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          id?: number
          logged_for: number
          start_time?: string | null
        }
        Update: {
          created_at?: string
          end_time?: string | null
          id?: number
          logged_for?: number
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "babytracker_sleep_logged_for_fkey"
            columns: ["logged_for"]
            isOneToOne: false
            referencedRelation: "babytracker_sleep"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          created_at: string
          first_name: string | null
          id: number
          last_name: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
