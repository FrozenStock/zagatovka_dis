export interface Release {
  id: string;
  title: string;
  artist_id: string;
  cover_art_url?: string;
  status: 'draft' | 'published' | 'scheduled' | 'rejected';
  release_date: string;
  genre?: string;
  upc?: string;
  description?: string;
}

export interface Track {
  id: string;
  release_id: string;
  title: string;
  track_number: number;
  duration: number;
  isrc?: string;
  audio_url?: string;
}

export interface StreamingStat {
  platform: string;
  sum: number;
}