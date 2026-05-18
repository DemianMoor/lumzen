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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      affirmations: {
        Row: {
          category: string
          chakra: string | null
          created_at: string
          id: string
          is_active: boolean
          subcategory: string | null
          tags: string[]
          text: string
        }
        Insert: {
          category: string
          chakra?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          subcategory?: string | null
          tags?: string[]
          text: string
        }
        Update: {
          category?: string
          chakra?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          subcategory?: string | null
          tags?: string[]
          text?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          content: string | null
          created_at: string
          created_by: string | null
          excerpt: string | null
          hero_image_url: string | null
          id: string
          pillar: string
          published_at: string | null
          scheduled_for: string | null
          slug: string
          status: string
          subtitle: string | null
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          hero_image_url?: string | null
          id?: string
          pillar: string
          published_at?: string | null
          scheduled_for?: string | null
          slug: string
          status?: string
          subtitle?: string | null
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          hero_image_url?: string | null
          id?: string
          pillar?: string
          published_at?: string | null
          scheduled_for?: string | null
          slug?: string
          status?: string
          subtitle?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      audio_tracks: {
        Row: {
          category: string
          cover_image_url: string | null
          created_at: string
          duration_seconds: number | null
          frequency_hz: number | null
          id: string
          is_active: boolean
          license: string | null
          source: string
          source_id: string | null
          stream_url: string
          subcategory: string | null
          tags: string[]
          title: string
        }
        Insert: {
          category: string
          cover_image_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          frequency_hz?: number | null
          id?: string
          is_active?: boolean
          license?: string | null
          source: string
          source_id?: string | null
          stream_url: string
          subcategory?: string | null
          tags?: string[]
          title: string
        }
        Update: {
          category?: string
          cover_image_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          frequency_hz?: number | null
          id?: string
          is_active?: boolean
          license?: string | null
          source?: string
          source_id?: string | null
          stream_url?: string
          subcategory?: string | null
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      audiobook_chapters: {
        Row: {
          book_id: string
          chapter_number: number
          duration_seconds: number | null
          id: string
          stream_url: string
          title: string | null
        }
        Insert: {
          book_id: string
          chapter_number: number
          duration_seconds?: number | null
          id?: string
          stream_url: string
          title?: string | null
        }
        Update: {
          book_id?: string
          chapter_number?: number
          duration_seconds?: number | null
          id?: string
          stream_url?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audiobook_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "audiobooks"
            referencedColumns: ["id"]
          },
        ]
      }
      audiobooks: {
        Row: {
          author: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          duration_total: number | null
          genre: string[]
          id: string
          is_featured: boolean
          language: string
          librivox_id: string | null
          rss_url: string | null
          title: string
          zip_url: string | null
        }
        Insert: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          duration_total?: number | null
          genre?: string[]
          id?: string
          is_featured?: boolean
          language?: string
          librivox_id?: string | null
          rss_url?: string | null
          title: string
          zip_url?: string | null
        }
        Update: {
          author?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          duration_total?: number | null
          genre?: string[]
          id?: string
          is_featured?: boolean
          language?: string
          librivox_id?: string | null
          rss_url?: string | null
          title?: string
          zip_url?: string | null
        }
        Relationships: []
      }
      daily_practices: {
        Row: {
          affirmation_done: boolean
          gratitude_done: boolean
          id: string
          journaling_done: boolean
          meditation_done: boolean
          practice_date: string
          tarot_done: boolean
          user_id: string
        }
        Insert: {
          affirmation_done?: boolean
          gratitude_done?: boolean
          id?: string
          journaling_done?: boolean
          meditation_done?: boolean
          practice_date?: string
          tarot_done?: boolean
          user_id: string
        }
        Update: {
          affirmation_done?: boolean
          gratitude_done?: boolean
          id?: string
          journaling_done?: boolean
          meditation_done?: boolean
          practice_date?: string
          tarot_done?: boolean
          user_id?: string
        }
        Relationships: []
      }
      editors: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
      landing_pages: {
        Row: {
          created_at: string
          gtm_id: string | null
          id: string
          is_active: boolean
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          gtm_id?: string | null
          id?: string
          is_active?: boolean
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          gtm_id?: string | null
          id?: string
          is_active?: boolean
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      natal_charts: {
        Row: {
          ai_interpretation: string | null
          birth_city: string | null
          birth_date: string
          birth_lat: number | null
          birth_lng: number | null
          birth_time: string | null
          birth_timezone: string | null
          chart_data: Json | null
          chart_svg: string | null
          created_at: string
          id: string
          moon_sign: string | null
          name: string | null
          rising_sign: string | null
          sun_sign: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_interpretation?: string | null
          birth_city?: string | null
          birth_date: string
          birth_lat?: number | null
          birth_lng?: number | null
          birth_time?: string | null
          birth_timezone?: string | null
          chart_data?: Json | null
          chart_svg?: string | null
          created_at?: string
          id?: string
          moon_sign?: string | null
          name?: string | null
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_interpretation?: string | null
          birth_city?: string | null
          birth_date?: string
          birth_lat?: number | null
          birth_lng?: number | null
          birth_time?: string | null
          birth_timezone?: string | null
          chart_data?: Json | null
          chart_svg?: string | null
          created_at?: string
          id?: string
          moon_sign?: string | null
          name?: string | null
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      spiritual_guides: {
        Row: {
          author: string | null
          category: string
          content: string | null
          cover_image_url: string | null
          created_at: string
          description: string | null
          difficulty: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          read_time_minutes: number | null
          related_chakra: string | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category: string
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          read_time_minutes?: number | null
          related_chakra?: string | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          read_time_minutes?: number | null
          related_chakra?: string | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          email_consent_at: string | null
          id: string
          ip_address: string | null
          phone: string | null
          sms_consent_at: string | null
          source: string | null
          unsubscribed_at: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          email: string
          email_consent_at?: string | null
          id?: string
          ip_address?: string | null
          phone?: string | null
          sms_consent_at?: string | null
          source?: string | null
          unsubscribed_at?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          email_consent_at?: string | null
          id?: string
          ip_address?: string | null
          phone?: string | null
          sms_consent_at?: string | null
          source?: string | null
          unsubscribed_at?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      tarot_cards: {
        Row: {
          description: string | null
          id: string
          image_url: string | null
          meaning_reversed: string | null
          meaning_upright: string | null
          name: string
          suit: string | null
          type: string
          value: number | null
        }
        Insert: {
          description?: string | null
          id: string
          image_url?: string | null
          meaning_reversed?: string | null
          meaning_upright?: string | null
          name: string
          suit?: string | null
          type: string
          value?: number | null
        }
        Update: {
          description?: string | null
          id?: string
          image_url?: string | null
          meaning_reversed?: string | null
          meaning_upright?: string | null
          name?: string
          suit?: string | null
          type?: string
          value?: number | null
        }
        Relationships: []
      }
      tarot_readings: {
        Row: {
          ai_interpretation: string | null
          cards: Json
          created_at: string
          id: string
          question: string | null
          spread_type: string
          user_id: string
        }
        Insert: {
          ai_interpretation?: string | null
          cards: Json
          created_at?: string
          id?: string
          question?: string | null
          spread_type: string
          user_id: string
        }
        Update: {
          ai_interpretation?: string | null
          cards?: Json
          created_at?: string
          id?: string
          question?: string | null
          spread_type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_affirmation_sessions: {
        Row: {
          activity_type: string
          affirmation_id: string
          completed: boolean
          created_at: string
          id: string
          notes: string | null
          session_date: string
          user_id: string
        }
        Insert: {
          activity_type: string
          affirmation_id: string
          completed?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          session_date?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          affirmation_id?: string
          completed?: boolean
          created_at?: string
          id?: string
          notes?: string | null
          session_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_affirmation_sessions_affirmation_id_fkey"
            columns: ["affirmation_id"]
            isOneToOne: false
            referencedRelation: "affirmations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_audio_history: {
        Row: {
          duration_played: number | null
          id: string
          played_at: string
          track_id: string
          user_id: string
        }
        Insert: {
          duration_played?: number | null
          id?: string
          played_at?: string
          track_id: string
          user_id: string
        }
        Update: {
          duration_played?: number | null
          id?: string
          played_at?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_audio_history_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "audio_tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_audiobook_progress: {
        Row: {
          book_id: string
          chapter_id: string | null
          completed: boolean
          id: string
          position_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_id?: string | null
          completed?: boolean
          id?: string
          position_seconds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_id?: string | null
          completed?: boolean
          id?: string
          position_seconds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_audiobook_progress_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "audiobooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_audiobook_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "audiobook_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          day_streak: number
          display_name: string | null
          id: string
          last_practice_date: string | null
          moon_sign: string | null
          onboarding_completed: boolean
          rising_sign: string | null
          sun_sign: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          day_streak?: number
          display_name?: string | null
          id: string
          last_practice_date?: string | null
          moon_sign?: string | null
          onboarding_completed?: boolean
          rising_sign?: string | null
          sun_sign?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          day_streak?: number
          display_name?: string | null
          id?: string
          last_practice_date?: string | null
          moon_sign?: string | null
          onboarding_completed?: boolean
          rising_sign?: string | null
          sun_sign?: string | null
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
