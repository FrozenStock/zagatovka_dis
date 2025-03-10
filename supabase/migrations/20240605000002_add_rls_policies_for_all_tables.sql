-- Add RLS policies for all tables

-- Social Links
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own social links" ON social_links;
CREATE POLICY "Users can view their own social links"
  ON social_links FOR SELECT
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own social links" ON social_links;
CREATE POLICY "Users can insert their own social links"
  ON social_links FOR INSERT
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own social links" ON social_links;
CREATE POLICY "Users can update their own social links"
  ON social_links FOR UPDATE
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own social links" ON social_links;
CREATE POLICY "Users can delete their own social links"
  ON social_links FOR DELETE
  USING (profile_id = auth.uid());

-- Releases
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own releases" ON releases;
CREATE POLICY "Users can view their own releases"
  ON releases FOR SELECT
  USING (artist_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own releases" ON releases;
CREATE POLICY "Users can insert their own releases"
  ON releases FOR INSERT
  WITH CHECK (artist_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own releases" ON releases;
CREATE POLICY "Users can update their own releases"
  ON releases FOR UPDATE
  USING (artist_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own releases" ON releases;
CREATE POLICY "Users can delete their own releases"
  ON releases FOR DELETE
  USING (artist_id = auth.uid());

-- Tracks
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own tracks" ON tracks;
CREATE POLICY "Users can view their own tracks"
  ON tracks FOR SELECT
  USING (
    release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert their own tracks" ON tracks;
CREATE POLICY "Users can insert their own tracks"
  ON tracks FOR INSERT
  WITH CHECK (
    release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update their own tracks" ON tracks;
CREATE POLICY "Users can update their own tracks"
  ON tracks FOR UPDATE
  USING (
    release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own tracks" ON tracks;
CREATE POLICY "Users can delete their own tracks"
  ON tracks FOR DELETE
  USING (
    release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )
  );

-- Streaming Stats
ALTER TABLE streaming_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own streaming stats" ON streaming_stats;
CREATE POLICY "Users can view their own streaming stats"
  ON streaming_stats FOR SELECT
  USING (
    (release_id IS NULL OR release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )) AND
    (track_id IS NULL OR track_id IN (
      SELECT t.id FROM tracks t
      JOIN releases r ON t.release_id = r.id
      WHERE r.artist_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can insert their own streaming stats" ON streaming_stats;
CREATE POLICY "Users can insert their own streaming stats"
  ON streaming_stats FOR INSERT
  WITH CHECK (
    (release_id IS NULL OR release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )) AND
    (track_id IS NULL OR track_id IN (
      SELECT t.id FROM tracks t
      JOIN releases r ON t.release_id = r.id
      WHERE r.artist_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can update their own streaming stats" ON streaming_stats;
CREATE POLICY "Users can update their own streaming stats"
  ON streaming_stats FOR UPDATE
  USING (
    (release_id IS NULL OR release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )) AND
    (track_id IS NULL OR track_id IN (
      SELECT t.id FROM tracks t
      JOIN releases r ON t.release_id = r.id
      WHERE r.artist_id = auth.uid()
    ))
  );

DROP POLICY IF EXISTS "Users can delete their own streaming stats" ON streaming_stats;
CREATE POLICY "Users can delete their own streaming stats"
  ON streaming_stats FOR DELETE
  USING (
    (release_id IS NULL OR release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )) AND
    (track_id IS NULL OR track_id IN (
      SELECT t.id FROM tracks t
      JOIN releases r ON t.release_id = r.id
      WHERE r.artist_id = auth.uid()
    ))
  );
