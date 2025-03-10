-- Create profiles table that extends the auth.users table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  artist_name TEXT,
  bio TEXT,
  genre TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create social links table for artists
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create releases table
CREATE TABLE IF NOT EXISTS public.releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  cover_art_url TEXT,
  release_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create tracks table
CREATE TABLE IF NOT EXISTS public.tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  audio_url TEXT,
  duration INTEGER,
  track_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create streaming_stats table
CREATE TABLE IF NOT EXISTS public.streaming_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE,
  release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  stream_count INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaming_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Social links policies
DROP POLICY IF EXISTS "Users can view their own social links" ON public.social_links;
CREATE POLICY "Users can view their own social links"
ON public.social_links FOR SELECT
USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own social links" ON public.social_links;
CREATE POLICY "Users can update their own social links"
ON public.social_links FOR UPDATE
USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own social links" ON public.social_links;
CREATE POLICY "Users can insert their own social links"
ON public.social_links FOR INSERT
WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own social links" ON public.social_links;
CREATE POLICY "Users can delete their own social links"
ON public.social_links FOR DELETE
USING (profile_id = auth.uid());

-- Releases policies
DROP POLICY IF EXISTS "Users can view their own releases" ON public.releases;
CREATE POLICY "Users can view their own releases"
ON public.releases FOR SELECT
USING (artist_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own releases" ON public.releases;
CREATE POLICY "Users can update their own releases"
ON public.releases FOR UPDATE
USING (artist_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own releases" ON public.releases;
CREATE POLICY "Users can insert their own releases"
ON public.releases FOR INSERT
WITH CHECK (artist_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own releases" ON public.releases;
CREATE POLICY "Users can delete their own releases"
ON public.releases FOR DELETE
USING (artist_id = auth.uid());

-- Tracks policies
DROP POLICY IF EXISTS "Users can view their own tracks" ON public.tracks;
CREATE POLICY "Users can view their own tracks"
ON public.tracks FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.releases
  WHERE releases.id = tracks.release_id
  AND releases.artist_id = auth.uid()
));

DROP POLICY IF EXISTS "Users can update their own tracks" ON public.tracks;
CREATE POLICY "Users can update their own tracks"
ON public.tracks FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.releases
  WHERE releases.id = tracks.release_id
  AND releases.artist_id = auth.uid()
));

DROP POLICY IF EXISTS "Users can insert their own tracks" ON public.tracks;
CREATE POLICY "Users can insert their own tracks"
ON public.tracks FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.releases
  WHERE releases.id = tracks.release_id
  AND releases.artist_id = auth.uid()
));

DROP POLICY IF EXISTS "Users can delete their own tracks" ON public.tracks;
CREATE POLICY "Users can delete their own tracks"
ON public.tracks FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.releases
  WHERE releases.id = tracks.release_id
  AND releases.artist_id = auth.uid()
));

-- Enable realtime
alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.social_links;
alter publication supabase_realtime add table public.releases;
alter publication supabase_realtime add table public.tracks;
alter publication supabase_realtime add table public.streaming_stats;
