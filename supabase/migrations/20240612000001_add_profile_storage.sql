-- Create storage bucket for profile images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'profile-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('profile-images', 'profile-images', true);
    
    -- Set up RLS policy for profile-images bucket
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Profile Images Policy',
      '(bucket_id = ''profile-images''::text AND (storage.foldername(name))[1] = auth.uid()::text)',
      'profile-images'
    );
  END IF;
END $$;

-- Add trigger to create profile when user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, created_at, updated_at)
  VALUES (new.id, now(), now())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the trigger already exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Add activity for profile updates
CREATE OR REPLACE FUNCTION add_profile_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Only add activity if artist_name is being set for the first time
  IF (OLD.artist_name IS NULL OR OLD.artist_name = '') AND (NEW.artist_name IS NOT NULL AND NEW.artist_name != '') THEN
    INSERT INTO user_activity (
      user_id,
      activity_type,
      title,
      activity_time
    ) VALUES (
      NEW.id,
      'profile-created',
      'Профиль артиста создан',
      NOW()
    );
  ELSIF OLD.artist_name != NEW.artist_name OR OLD.bio != NEW.bio OR OLD.genre != NEW.genre OR OLD.profile_image_url != NEW.profile_image_url THEN
    INSERT INTO user_activity (
      user_id,
      activity_type,
      title,
      activity_time
    ) VALUES (
      NEW.id,
      'profile-updated',
      'Профиль артиста обновлен',
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile activity
DROP TRIGGER IF EXISTS add_profile_activity_trigger ON profiles;
CREATE TRIGGER add_profile_activity_trigger
AFTER UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION add_profile_activity();
