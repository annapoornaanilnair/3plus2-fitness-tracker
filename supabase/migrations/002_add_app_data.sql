-- Add app_data column to profiles table for cloud sync
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS app_data JSONB DEFAULT '{}'::jsonb;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_app_data ON profiles USING gin(app_data);

-- Add updated_at column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policy to allow users to update their own app_data
DROP POLICY IF EXISTS "Users can update their own profile data" ON profiles;
CREATE POLICY "Users can update their own profile data" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);
