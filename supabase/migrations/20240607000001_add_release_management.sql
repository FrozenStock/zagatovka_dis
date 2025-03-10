-- Add additional fields to releases table
ALTER TABLE releases ADD COLUMN IF NOT EXISTS genre VARCHAR(100);
ALTER TABLE releases ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE releases ADD COLUMN IF NOT EXISTS moderation_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE releases ADD COLUMN IF NOT EXISTS distribution_status VARCHAR(50) DEFAULT 'not_started';
ALTER TABLE releases ADD COLUMN IF NOT EXISTS upc VARCHAR(100);
ALTER TABLE releases ADD COLUMN IF NOT EXISTS release_type VARCHAR(50) DEFAULT 'single';

-- Create license_agreements table
CREATE TABLE IF NOT EXISTS license_agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  passport_number VARCHAR(100) NOT NULL,
  bank_details TEXT,
  signature_url TEXT,
  agreed_to_terms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for license_agreements
ALTER TABLE license_agreements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own license agreements" ON license_agreements;
CREATE POLICY "Users can view their own license agreements"
  ON license_agreements FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own license agreements" ON license_agreements;
CREATE POLICY "Users can update their own license agreements"
  ON license_agreements FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own license agreements" ON license_agreements;
CREATE POLICY "Users can insert their own license agreements"
  ON license_agreements FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Add realtime publication for license_agreements
alter publication supabase_realtime add table license_agreements;
