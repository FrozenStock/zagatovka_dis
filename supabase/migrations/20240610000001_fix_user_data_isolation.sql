-- Add indexes to improve query performance for user-specific data
CREATE INDEX IF NOT EXISTS idx_releases_artist_id ON releases (artist_id);
CREATE INDEX IF NOT EXISTS idx_tracks_release_id ON tracks (release_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_stats_user_id ON dashboard_stats (user_id);
CREATE INDEX IF NOT EXISTS idx_platform_stats_user_id ON platform_stats (user_id);
CREATE INDEX IF NOT EXISTS idx_country_stats_user_id ON country_stats (user_id);
CREATE INDEX IF NOT EXISTS idx_track_stats_user_id ON track_stats (user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity (user_id);

-- Ensure RLS policies are in place for user data isolation
-- Releases table policies
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

-- Tracks table policies
DROP POLICY IF EXISTS "Users can view tracks for their releases" ON tracks;
CREATE POLICY "Users can view tracks for their releases"
  ON tracks FOR SELECT
  USING (
    release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert tracks for their releases" ON tracks;
CREATE POLICY "Users can insert tracks for their releases"
  ON tracks FOR INSERT
  WITH CHECK (
    release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update tracks for their releases" ON tracks;
CREATE POLICY "Users can update tracks for their releases"
  ON tracks FOR UPDATE
  USING (
    release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete tracks for their releases" ON tracks;
CREATE POLICY "Users can delete tracks for their releases"
  ON tracks FOR DELETE
  USING (
    release_id IN (
      SELECT id FROM releases WHERE artist_id = auth.uid()
    )
  );

-- Dashboard stats policies
DROP POLICY IF EXISTS "Users can view their own dashboard stats" ON dashboard_stats;
CREATE POLICY "Users can view their own dashboard stats"
  ON dashboard_stats FOR SELECT
  USING (user_id = auth.uid());

-- Platform stats policies
DROP POLICY IF EXISTS "Users can view their own platform stats" ON platform_stats;
CREATE POLICY "Users can view their own platform stats"
  ON platform_stats FOR SELECT
  USING (user_id = auth.uid());

-- Country stats policies
DROP POLICY IF EXISTS "Users can view their own country stats" ON country_stats;
CREATE POLICY "Users can view their own country stats"
  ON country_stats FOR SELECT
  USING (user_id = auth.uid());

-- Track stats policies
DROP POLICY IF EXISTS "Users can view their own track stats" ON track_stats;
CREATE POLICY "Users can view their own track stats"
  ON track_stats FOR SELECT
  USING (user_id = auth.uid());

-- User activity policies
DROP POLICY IF EXISTS "Users can view their own activity" ON user_activity;
CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  USING (user_id = auth.uid());

-- Enable RLS on all tables
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;
