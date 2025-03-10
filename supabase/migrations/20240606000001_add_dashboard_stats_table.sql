-- Create dashboard_stats table to store user-specific statistics
CREATE TABLE IF NOT EXISTS dashboard_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_streams INTEGER NOT NULL DEFAULT 0,
  stream_change DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  revenue_change DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_audience INTEGER NOT NULL DEFAULT 0,
  audience_change DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for dashboard_stats
ALTER TABLE dashboard_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own dashboard stats" ON dashboard_stats;
CREATE POLICY "Users can view their own dashboard stats"
  ON dashboard_stats FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own dashboard stats" ON dashboard_stats;
CREATE POLICY "Users can update their own dashboard stats"
  ON dashboard_stats FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own dashboard stats" ON dashboard_stats;
CREATE POLICY "Users can insert their own dashboard stats"
  ON dashboard_stats FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create platform_stats table to store streaming platform statistics
CREATE TABLE IF NOT EXISTS platform_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_name VARCHAR(255) NOT NULL,
  streams INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for platform_stats
ALTER TABLE platform_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own platform stats" ON platform_stats;
CREATE POLICY "Users can view their own platform stats"
  ON platform_stats FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own platform stats" ON platform_stats;
CREATE POLICY "Users can update their own platform stats"
  ON platform_stats FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own platform stats" ON platform_stats;
CREATE POLICY "Users can insert their own platform stats"
  ON platform_stats FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create country_stats table to store audience geography statistics
CREATE TABLE IF NOT EXISTS country_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  country_name VARCHAR(255) NOT NULL,
  listeners INTEGER NOT NULL DEFAULT 0,
  percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for country_stats
ALTER TABLE country_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own country stats" ON country_stats;
CREATE POLICY "Users can view their own country stats"
  ON country_stats FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own country stats" ON country_stats;
CREATE POLICY "Users can update their own country stats"
  ON country_stats FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own country stats" ON country_stats;
CREATE POLICY "Users can insert their own country stats"
  ON country_stats FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create track_stats table to store track-specific statistics
CREATE TABLE IF NOT EXISTS track_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_name VARCHAR(255) NOT NULL,
  streams INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for track_stats
ALTER TABLE track_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own track stats" ON track_stats;
CREATE POLICY "Users can view their own track stats"
  ON track_stats FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own track stats" ON track_stats;
CREATE POLICY "Users can update their own track stats"
  ON track_stats FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own track stats" ON track_stats;
CREATE POLICY "Users can insert their own track stats"
  ON track_stats FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create user_activity table to store recent user activities
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  activity_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for user_activity
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own activities" ON user_activity;
CREATE POLICY "Users can view their own activities"
  ON user_activity FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own activities" ON user_activity;
CREATE POLICY "Users can insert their own activities"
  ON user_activity FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Add realtime publication for all tables
alter publication supabase_realtime add table dashboard_stats;
alter publication supabase_realtime add table platform_stats;
alter publication supabase_realtime add table country_stats;
alter publication supabase_realtime add table track_stats;
alter publication supabase_realtime add table user_activity;
