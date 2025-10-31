export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      doors_d_rhk: {
        Row: {
          created_at: string
          direction: string
          id: string
          size: string
          total: number
          type_0096d: number
          type_7126d: number
          type_9001t: number
          type_9016t: number
          type_mr09: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          size: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          size?: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Relationships: []
      }
      doors_d100: {
        Row: {
          created_at: string
          direction: string
          id: string
          size: string
          total: number
          type_0096d: number
          type_7126d: number
          type_9001t: number
          type_9016t: number
          type_mr09: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          size: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          size?: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Relationships: []
      }
      doors_d6: {
        Row: {
          created_at: string
          direction: string
          id: string
          size: string
          total: number
          type_0096d: number
          type_7126d: number
          type_9001t: number
          type_9016t: number
          type_mr09: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          size: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          size?: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Relationships: []
      }
      doors_d7: {
        Row: {
          created_at: string
          direction: string
          id: string
          size: string
          total: number
          type_0096d: number
          type_7126d: number
          type_9001t: number
          type_9016t: number
          type_mr09: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          size: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          size?: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Relationships: []
      }
      doors_d80: {
        Row: {
          created_at: string
          direction: string
          id: string
          size: string
          total: number
          type_0096d: number
          type_7126d: number
          type_9001t: number
          type_9016t: number
          type_mr09: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          size: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          size?: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Relationships: []
      }
      doors_d82: {
        Row: {
          created_at: string
          direction: string
          id: string
          size: string
          total: number
          type_0096d: number
          type_7126d: number
          type_9001t: number
          type_9016t: number
          type_mr09: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          direction: string
          id?: string
          size: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          size?: string
          total?: number
          type_0096d?: number
          type_7126d?: number
          type_9001t?: number
          type_9016t?: number
          type_mr09?: number
          updated_at?: string
        }
        Relationships: []
      }
      hardware_inventory: {
        Row: {
          color: string
          created_at: string
          hardware_type: string
          id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          hardware_type: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          hardware_type?: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      locking_products_inventory: {
        Row: {
          created_at: string
          id: string
          item_type: string
          quantity: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_type: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_type?: string
          quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          clamp_holes: string | null
          construction_frame: string | null
          cover_frame: string | null
          created_at: string
          customer_name: string
          door_color: string | null
          drilling: string | null
          electric_lock: boolean | null
          frame_height: number | null
          handle_hole: boolean | null
          id: string
          installer_price: number
          katif_blocker: string | null
          order_number: string
          price: number
          product_type: string
          product_width: number | null
          quantity: number
          side: string | null
          updated_at: string
        }
        Insert: {
          clamp_holes?: string | null
          construction_frame?: string | null
          cover_frame?: string | null
          created_at?: string
          customer_name: string
          door_color?: string | null
          drilling?: string | null
          electric_lock?: boolean | null
          frame_height?: number | null
          handle_hole?: boolean | null
          id?: string
          installer_price?: number
          katif_blocker?: string | null
          order_number: string
          price?: number
          product_type: string
          product_width?: number | null
          quantity?: number
          side?: string | null
          updated_at?: string
        }
        Update: {
          clamp_holes?: string | null
          construction_frame?: string | null
          cover_frame?: string | null
          created_at?: string
          customer_name?: string
          door_color?: string | null
          drilling?: string | null
          electric_lock?: boolean | null
          frame_height?: number | null
          handle_hole?: boolean | null
          id?: string
          installer_price?: number
          katif_blocker?: string | null
          order_number?: string
          price?: number
          product_type?: string
          product_width?: number | null
          quantity?: number
          side?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pull_handles_inventory: {
        Row: {
          color: string
          created_at: string
          handle_type: string
          id: string
          quantity: number
          updated_at: string
        }
        Insert: {
          color: string
          created_at?: string
          handle_type: string
          id?: string
          quantity?: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          handle_type?: string
          id?: string
          quantity?: number
          updated_at?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
