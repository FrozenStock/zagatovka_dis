-- Add ISRC field to tracks table
ALTER TABLE tracks ADD COLUMN IF NOT EXISTS isrc VARCHAR(12);

-- Create a function to generate ISRC code when a track is created
CREATE OR REPLACE FUNCTION generate_isrc_for_track()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate ISRC for tracks that don't have one yet
  IF NEW.isrc IS NULL OR NEW.isrc = '' THEN
    -- Generate a 12-character ISRC code
    -- Format: CC-XXX-YY-NNNNN
    -- CC: Country code (2 chars)
    -- XXX: Registrant code (3 chars)
    -- YY: Year (2 chars)
    -- NNNNN: Designation code (5 chars)
    
    -- Use RU as country code, VIB as registrant code, current year, and random number
    NEW.isrc := 'RU-VIB-' || 
                to_char(CURRENT_DATE, 'YY') || '-' || 
                LPAD(floor(random() * 100000)::text, 5, '0');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ISRC generation
DROP TRIGGER IF EXISTS generate_isrc_trigger ON tracks;
CREATE TRIGGER generate_isrc_trigger
BEFORE INSERT ON tracks
FOR EACH ROW
EXECUTE FUNCTION generate_isrc_for_track();

-- Add activity for track upload
CREATE OR REPLACE FUNCTION add_track_activity()
RETURNS TRIGGER AS $$
DECLARE
  artist_id UUID;
BEGIN
  -- Get artist_id from the release
  SELECT artist_id INTO artist_id FROM releases WHERE id = NEW.release_id;
  
  -- Add activity
  INSERT INTO user_activity (
    user_id,
    activity_type,
    title,
    activity_time
  ) VALUES (
    artist_id,
    'track-added',
    'Трек "' || NEW.title || '" добавлен к релизу',
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for track activity
DROP TRIGGER IF EXISTS add_track_activity_trigger ON tracks;
CREATE TRIGGER add_track_activity_trigger
AFTER INSERT ON tracks
FOR EACH ROW
EXECUTE FUNCTION add_track_activity();

-- Create storage bucket for audio files if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'audio-files'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('audio-files', 'audio-files', true);
    
    -- Set up RLS policy for audio-files bucket
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Audio Files Policy',
      '(bucket_id = ''audio-files''::text AND (storage.foldername(name))[1] = auth.uid()::text)',
      'audio-files'
    );
  END IF;
END $$;
