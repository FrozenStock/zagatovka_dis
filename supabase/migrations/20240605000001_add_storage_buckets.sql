-- Create storage buckets for profile images and release artwork
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('profile-images', 'Profile Images', true),
  ('release-artwork', 'Release Artwork', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the buckets
-- Allow users to read any profile image
DROP POLICY IF EXISTS "Public read access for profile images" ON storage.objects;
CREATE POLICY "Public read access for profile images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

-- Allow users to upload their own profile images
DROP POLICY IF EXISTS "Users can upload their own profile images" ON storage.objects;
CREATE POLICY "Users can upload their own profile images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own profile images
DROP POLICY IF EXISTS "Users can update their own profile images" ON storage.objects;
CREATE POLICY "Users can update their own profile images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own profile images
DROP POLICY IF EXISTS "Users can delete their own profile images" ON storage.objects;
CREATE POLICY "Users can delete their own profile images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'profile-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to read any release artwork
DROP POLICY IF EXISTS "Public read access for release artwork" ON storage.objects;
CREATE POLICY "Public read access for release artwork"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'release-artwork');

-- Allow users to upload their own release artwork
DROP POLICY IF EXISTS "Users can upload their own release artwork" ON storage.objects;
CREATE POLICY "Users can upload their own release artwork"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'release-artwork' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to update their own release artwork
DROP POLICY IF EXISTS "Users can update their own release artwork" ON storage.objects;
CREATE POLICY "Users can update their own release artwork"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'release-artwork' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own release artwork
DROP POLICY IF EXISTS "Users can delete their own release artwork" ON storage.objects;
CREATE POLICY "Users can delete their own release artwork"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'release-artwork' AND (storage.foldername(name))[1] = auth.uid()::text);
