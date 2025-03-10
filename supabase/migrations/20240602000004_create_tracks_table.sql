-- Create tracks table
CREATE TABLE IF NOT EXISTS tracks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  release_id UUID REFERENCES releases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  audio_url TEXT,
  duration INTEGER,
  track_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own tracks" ON tracks;
CREATE POLICY "Users can view their own tracks"
  ON tracks FOR SELECT
  USING (
    auth.uid() IN (
      SELECT artist_id FROM releases WHERE id = tracks.release_id
    )
  );

DROP POLICY IF EXISTS "Users can insert their own tracks" ON tracks;
CREATE POLICY "Users can insert their own tracks"
  ON tracks FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT artist_id FROM releases WHERE id = release_id
    )
  );

DROP POLICY IF EXISTS "Users can update their own tracks" ON tracks;
CREATE POLICY "Users can update their own tracks"
  ON tracks FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT artist_id FROM releases WHERE id = tracks.release_id
    )
  );

DROP POLICY IF EXISTS "Users can delete their own tracks" ON tracks;
CREATE POLICY "Users can delete their own tracks"
  ON tracks FOR DELETE
  USING (
    auth.uid() IN (
      SELECT artist_id FROM releases WHERE id = tracks.release_id
    )
  );

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE tracks;
