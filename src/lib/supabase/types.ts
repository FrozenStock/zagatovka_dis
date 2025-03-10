export interface Profile {
  id: string;
  artist_name: string | null;
  bio: string | null;
  genre: string | null;
  profile_image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Release {
  id: string;
  artist_id: string;
  title: string;
  release_date: string;
  status: string;
  cover_art_url: string | null;
  genre: string | null;
  description: string | null;
  moderation_status: string;
  distribution_status: string;
  upc: string | null;
  release_type: string;
  created_at: string;
  updated_at: string;
}

export interface Track {
  id: string;
  release_id: string;
  title: string;
  track_number: number;
  audio_url: string | null;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  id: string;
  user_id: string;
  total_streams: number;
  stream_change: number;
  total_revenue: number;
  revenue_change: number;
  total_audience: number;
  audience_change: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformStats {
  id: string;
  user_id: string;
  platform_name: string;
  streams: number;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface CountryStats {
  id: string;
  user_id: string;
  country_name: string;
  listeners: number;
  percentage: number;
  created_at: string;
  updated_at: string;
}

export interface TrackStats {
  id: string;
  user_id: string;
  track_name: string;
  streams: number;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  title: string;
  activity_time: string;
  created_at: string;
}

export interface LicenseAgreement {
  id: string;
  user_id: string;
  full_name: string;
  address: string;
  passport_number: string;
  bank_details: string | null;
  signature_url: string | null;
  agreed_to_terms: boolean;
  created_at: string;
  updated_at: string;
}
