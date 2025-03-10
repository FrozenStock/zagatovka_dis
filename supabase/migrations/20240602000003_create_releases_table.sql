-- Create releases table
CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  cover_art_url TEXT,
  release_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own releases" ON releases;
CREATE POLICY "Users can view their own releases"
  ON releases FOR SELECT
  USING (auth.uid() = artist_id);

DROP POLICY IF EXISTS "Users can insert their own releases" ON releases;
CREATE POLICY "Users can insert their own releases"
  ON releases FOR INSERT
  WITH CHECK (auth.uid() = artist_id);

DROP POLICY IF EXISTS "Users can update their own releases" ON releases;
CREATE POLICY "Users can update their own releases"
  ON releases FOR UPDATE
  USING (auth.uid() = artist_id);

DROP POLICY IF EXISTS "Users can delete their own releases" ON releases;
CREATE POLICY "Users can delete their own releases"
  ON releases FOR DELETE
  USING (auth.uid() = artist_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE releases;
