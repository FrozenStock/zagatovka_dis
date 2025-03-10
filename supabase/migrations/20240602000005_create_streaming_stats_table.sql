-- Create streaming_stats table
CREATE TABLE IF NOT EXISTS streaming_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  stream_count INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (track_id IS NOT NULL OR release_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE streaming_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own streaming stats" ON streaming_stats;
CREATE POLICY "Users can view their own streaming stats"
  ON streaming_stats FOR SELECT
  USING (
    (track_id IS NOT NULL AND auth.uid() IN (
      SELECT artist_id FROM releases WHERE id IN (
        SELECT release_id FROM tracks WHERE id = streaming_stats.track_id
      )
    )) OR
    (release_id IS NOT NULL AND auth.uid() IN (
      SELECT artist_id FROM releases WHERE id = streaming_stats.release_id
    ))
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE streaming_stats;
