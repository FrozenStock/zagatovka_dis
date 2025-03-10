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
      country_stats: {
        Row: {
          country_name: string
          created_at: string | null
          id: string
          listeners: number
          percentage: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          country_name: string
          created_at?: string | null
          id?: string
          listeners?: number
          percentage?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          country_name?: string
          created_at?: string | null
          id?: string
          listeners?: number
          percentage?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dashboard_stats: {
        Row: {
          audience_change: number
          created_at: string | null
          id: string
          revenue_change: number
          stream_change: number
          total_audience: number
          total_revenue: number
          total_streams: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          audience_change?: number
          created_at?: string | null
          id?: string
          revenue_change?: number
          stream_change?: number
          total_audience?: number
          total_revenue?: number
          total_streams?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          audience_change?: number
          created_at?: string | null
          id?: string
          revenue_change?: number
          stream_change?: number
          total_audience?: number
          total_revenue?: number
          total_streams?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      license_agreements: {
        Row: {
          address: string
          agreed_to_terms: boolean | null
          bank_details: string | null
          created_at: string | null
          full_name: string
          id: string
          passport_number: string
          signature_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          agreed_to_terms?: boolean | null
          bank_details?: string | null
          created_at?: string | null
          full_name: string
          id?: string
          passport_number: string
          signature_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          agreed_to_terms?: boolean | null
          bank_details?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          passport_number?: string
          signature_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      platform_stats: {
        Row: {
          created_at: string | null
          id: string
          percentage: number
          platform_name: string
          streams: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          percentage?: number
          platform_name: string
          streams?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          percentage?: number
          platform_name?: string
          streams?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          artist_name: string | null
          bio: string | null
          created_at: string
          genre: string | null
          id: string
          profile_image_url: string | null
          updated_at: string
        }
        Insert: {
          artist_name?: string | null
          bio?: string | null
          created_at?: string
          genre?: string | null
          id: string
          profile_image_url?: string | null
          updated_at?: string
        }
        Update: {
          artist_name?: string | null
          bio?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          profile_image_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      releases: {
        Row: {
          artist_id: string
          cover_art_url: string | null
          created_at: string
          description: string | null
          distribution_status: string | null
          genre: string | null
          id: string
          moderation_status: string | null
          release_date: string
          release_type: string | null
          status: string
          title: string
          upc: string | null
          updated_at: string
        }
        Insert: {
          artist_id: string
          cover_art_url?: string | null
          created_at?: string
          description?: string | null
          distribution_status?: string | null
          genre?: string | null
          id?: string
          moderation_status?: string | null
          release_date: string
          release_type?: string | null
          status?: string
          title: string
          upc?: string | null
          updated_at?: string
        }
        Update: {
          artist_id?: string
          cover_art_url?: string | null
          created_at?: string
          description?: string | null
          distribution_status?: string | null
          genre?: string | null
          id?: string
          moderation_status?: string | null
          release_date?: string
          release_type?: string | null
          status?: string
          title?: string
          upc?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "releases_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string
          id: string
          platform: string
          profile_id: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          profile_id: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          profile_id?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      streaming_stats: {
        Row: {
          created_at: string
          date: string
          id: string
          platform: string
          release_id: string | null
          stream_count: number
          track_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          platform: string
          release_id?: string | null
          stream_count?: number
          track_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          platform?: string
          release_id?: string | null
          stream_count?: number
          track_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "streaming_stats_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streaming_stats_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      track_stats: {
        Row: {
          created_at: string | null
          id: string
          streams: number
          track_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          streams?: number
          track_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          streams?: number
          track_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          audio_url: string | null
          created_at: string
          duration: number | null
          id: string
          release_id: string
          title: string
          track_number: number
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          release_id: string
          title: string
          track_number: number
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          duration?: number | null
          id?: string
          release_id?: string
          title?: string
          track_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          activity_time: string | null
          activity_type: string
          created_at: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          activity_time?: string | null
          activity_type: string
          created_at?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          activity_time?: string | null
          activity_type?: string
          created_at?: string | null
          id?: string
          title?: string
          user_id?: string
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
