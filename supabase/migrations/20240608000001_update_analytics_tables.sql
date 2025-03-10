-- Update dashboard_stats table to link to user releases
ALTER TABLE dashboard_stats ADD COLUMN IF NOT EXISTS last_updated TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create a function to update dashboard stats based on user releases and streaming stats
CREATE OR REPLACE FUNCTION update_dashboard_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update dashboard stats when a new streaming stat is added
  UPDATE dashboard_stats
  SET 
    total_streams = (
      SELECT COALESCE(SUM(stream_count), 0)
      FROM streaming_stats ss
      JOIN tracks t ON ss.track_id = t.id
      JOIN releases r ON t.release_id = r.id
      WHERE r.artist_id = NEW.user_id
    ),
    stream_change = 10 + (RANDOM() * 10)::INTEGER, -- Placeholder calculation
    total_revenue = (
      SELECT COALESCE(SUM(stream_count), 0) * 0.005
      FROM streaming_stats ss
      JOIN tracks t ON ss.track_id = t.id
      JOIN releases r ON t.release_id = r.id
      WHERE r.artist_id = NEW.user_id
    ),
    revenue_change = 5 + (RANDOM() * 15)::INTEGER, -- Placeholder calculation
    total_audience = (
      SELECT COALESCE(SUM(stream_count), 0) / 10
      FROM streaming_stats ss
      JOIN tracks t ON ss.track_id = t.id
      JOIN releases r ON t.release_id = r.id
      WHERE r.artist_id = NEW.user_id
    ),
    audience_change = 8 + (RANDOM() * 12)::INTEGER, -- Placeholder calculation
    last_updated = NOW()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for streaming_stats
DROP TRIGGER IF EXISTS update_dashboard_stats_trigger ON streaming_stats;
CREATE TRIGGER update_dashboard_stats_trigger
AFTER INSERT OR UPDATE ON streaming_stats
FOR EACH ROW
EXECUTE FUNCTION update_dashboard_stats();

-- Create trigger for user_activity to update dashboard stats
DROP TRIGGER IF EXISTS update_dashboard_stats_from_activity ON user_activity;
CREATE TRIGGER update_dashboard_stats_from_activity
AFTER INSERT ON user_activity
FOR EACH ROW
EXECUTE FUNCTION update_dashboard_stats();

-- Create a function to automatically generate streaming stats for new releases
CREATE OR REPLACE FUNCTION generate_streaming_stats_for_release()
RETURNS TRIGGER AS $$
DECLARE
  track_record RECORD;
  platform_names TEXT[] := ARRAY['Spotify', 'Apple Music', 'YouTube Music', 'Deezer', 'Tidal'];
  platform TEXT;
  stream_count INTEGER;
  stat_date DATE;
BEGIN
  -- Only generate stats for published releases
  IF NEW.status = 'published' THEN
    -- For each track in the release
    FOR track_record IN 
      SELECT id FROM tracks WHERE release_id = NEW.id
    LOOP
      -- Generate stats for different platforms
      FOREACH platform IN ARRAY platform_names
      LOOP
        -- Generate random stream count
        stream_count := 1000 + (RANDOM() * 9000)::INTEGER;
        
        -- Generate a date within the last 30 days
        stat_date := CURRENT_DATE - (RANDOM() * 30)::INTEGER * INTERVAL '1 day';
        
        -- Insert streaming stat
        INSERT INTO streaming_stats (
          date, platform, track_id, release_id, stream_count
        ) VALUES (
          stat_date, platform, track_record.id, NEW.id, stream_count
        );
      END LOOP;
    END LOOP;
    
    -- Update platform stats
    PERFORM update_platform_stats(NEW.artist_id);
    
    -- Update country stats
    PERFORM update_country_stats(NEW.artist_id);
    
    -- Update track stats
    PERFORM update_track_stats(NEW.artist_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new releases
DROP TRIGGER IF EXISTS generate_stats_for_release_trigger ON releases;
CREATE TRIGGER generate_stats_for_release_trigger
AFTER INSERT OR UPDATE OF status ON releases
FOR EACH ROW
WHEN (NEW.status = 'published')
EXECUTE FUNCTION generate_streaming_stats_for_release();

-- Create functions to update platform, country, and track stats
CREATE OR REPLACE FUNCTION update_platform_stats(artist_id UUID)
RETURNS VOID AS $$
DECLARE
  total_streams INTEGER;
  platform_record RECORD;
BEGIN
  -- Get total streams for the artist
  SELECT COALESCE(SUM(stream_count), 0) INTO total_streams
  FROM streaming_stats ss
  JOIN tracks t ON ss.track_id = t.id
  JOIN releases r ON t.release_id = r.id
  WHERE r.artist_id = artist_id;
  
  -- Delete existing platform stats
  DELETE FROM platform_stats WHERE user_id = artist_id;
  
  -- Insert new platform stats
  FOR platform_record IN 
    SELECT 
      platform, 
      SUM(stream_count) as platform_streams
    FROM streaming_stats ss
    JOIN tracks t ON ss.track_id = t.id
    JOIN releases r ON t.release_id = r.id
    WHERE r.artist_id = artist_id
    GROUP BY platform
  LOOP
    INSERT INTO platform_stats (
      user_id, platform_name, streams, percentage
    ) VALUES (
      artist_id,
      platform_record.platform,
      platform_record.platform_streams,
      CASE 
        WHEN total_streams > 0 THEN 
          ROUND((platform_record.platform_streams::NUMERIC / total_streams) * 100)
        ELSE 0
      END
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_country_stats(artist_id UUID)
RETURNS VOID AS $$
DECLARE
  country_names TEXT[] := ARRAY['United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Russia', 'Brazil', 'Japan', 'Australia', 'Others'];
  total_audience INTEGER;
  country TEXT;
  country_percentage INTEGER;
  country_listeners INTEGER;
BEGIN
  -- Get total audience for the artist
  SELECT COALESCE(total_audience, 0) INTO total_audience
  FROM dashboard_stats
  WHERE user_id = artist_id;
  
  -- If no audience, set a default value
  IF total_audience IS NULL OR total_audience = 0 THEN
    total_audience := 10000;
  END IF;
  
  -- Delete existing country stats
  DELETE FROM country_stats WHERE user_id = artist_id;
  
  -- Insert new country stats
  FOREACH country IN ARRAY country_names
  LOOP
    -- Generate random percentage (ensure they sum to 100)
    IF country = 'Others' THEN
      -- Calculate remaining percentage to make sum 100
      SELECT 100 - COALESCE(SUM(percentage), 0) INTO country_percentage
      FROM country_stats
      WHERE user_id = artist_id;
    ELSE
      -- Random percentage between 5 and 20
      country_percentage := 5 + (RANDOM() * 15)::INTEGER;
    END IF;
    
    -- Calculate listeners based on percentage
    country_listeners := (total_audience * country_percentage / 100)::INTEGER;
    
    -- Insert country stat
    INSERT INTO country_stats (
      user_id, country_name, listeners, percentage
    ) VALUES (
      artist_id,
      country,
      country_listeners,
      country_percentage
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_track_stats(artist_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Delete existing track stats
  DELETE FROM track_stats WHERE user_id = artist_id;
  
  -- Insert new track stats based on actual tracks
  INSERT INTO track_stats (user_id, track_name, streams)
  SELECT 
    r.artist_id,
    t.title,
    COALESCE(SUM(ss.stream_count), 0) as total_streams
  FROM tracks t
  JOIN releases r ON t.release_id = r.id
  LEFT JOIN streaming_stats ss ON t.id = ss.track_id
  WHERE r.artist_id = artist_id
  GROUP BY r.artist_id, t.title
  ORDER BY total_streams DESC;
END;
$$ LANGUAGE plpgsql;
