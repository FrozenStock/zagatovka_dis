-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own social links" ON social_links;
CREATE POLICY "Users can view their own social links"
  ON social_links FOR SELECT
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can insert their own social links" ON social_links;
CREATE POLICY "Users can insert their own social links"
  ON social_links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can update their own social links" ON social_links;
CREATE POLICY "Users can update their own social links"
  ON social_links FOR UPDATE
  USING (auth.uid() = profile_id);

DROP POLICY IF EXISTS "Users can delete their own social links" ON social_links;
CREATE POLICY "Users can delete their own social links"
  ON social_links FOR DELETE
  USING (auth.uid() = profile_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE social_links;
