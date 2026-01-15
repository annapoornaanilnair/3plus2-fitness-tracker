-- ============================================================================
-- 3+2 Fitness Tracker - Database Security Setup
-- ============================================================================
-- This file contains the complete database schema with Row-Level Security
-- Run this in your Supabase SQL Editor: 
-- https://supabase.com/dashboard/project/ngsvaqyttrfvsivvdhtc/sql
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  start_weight DECIMAL(5,2),
  current_weight DECIMAL(5,2),
  goal_weight DECIMAL(5,2),
  equipment TEXT[] DEFAULT '{}',
  notification_time TIME,
  creative_notes TEXT,
  energy_mode VARCHAR(10) DEFAULT 'high',
  is_admin BOOLEAN DEFAULT false,
  invited_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Users can only read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (after signup)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. APPROVED USERS TABLE (Invite-only system)
-- ============================================================================
CREATE TABLE IF NOT EXISTS approved_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for email lookup
CREATE INDEX IF NOT EXISTS approved_users_email_idx ON approved_users(email);

-- Enable RLS
ALTER TABLE approved_users ENABLE ROW LEVEL SECURITY;

-- Only admins can view approved users
DROP POLICY IF EXISTS "Admins can view approved users" ON approved_users;
CREATE POLICY "Admins can view approved users"
  ON approved_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Only admins can add approved users
DROP POLICY IF EXISTS "Admins can insert approved users" ON approved_users;
CREATE POLICY "Admins can insert approved users"
  ON approved_users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- ============================================================================
-- 3. USER WORKOUT DATA TABLE (Replaces kv_store)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_workout_data (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  app_state JSONB NOT NULL DEFAULT '{}'::jsonb,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS user_workout_data_user_id_idx ON user_workout_data(user_id);

-- Enable RLS
ALTER TABLE user_workout_data ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
DROP POLICY IF EXISTS "Users can view own workout data" ON user_workout_data;
CREATE POLICY "Users can view own workout data"
  ON user_workout_data FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own workout data" ON user_workout_data;
CREATE POLICY "Users can insert own workout data"
  ON user_workout_data FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own workout data" ON user_workout_data;
CREATE POLICY "Users can update own workout data"
  ON user_workout_data FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. SYNC LOGS TABLE (Track sync history)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT,
  sync_direction VARCHAR(20), -- 'upload' or 'download'
  data_size INTEGER,
  conflicts JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying user sync history
CREATE INDEX IF NOT EXISTS sync_logs_user_id_idx ON sync_logs(user_id, synced_at DESC);

-- Enable RLS
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own sync logs
DROP POLICY IF EXISTS "Users can view own sync logs" ON sync_logs;
CREATE POLICY "Users can view own sync logs"
  ON sync_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own sync logs" ON sync_logs;
CREATE POLICY "Users can insert own sync logs"
  ON sync_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- 4.5. CUSTOM EXERCISES TABLE (User workout customizations)
-- ============================================================================
CREATE TABLE IF NOT EXISTS custom_exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day_name VARCHAR(20) NOT NULL,
  replaced_exercise_id VARCHAR(100) NOT NULL,
  exercise_name VARCHAR(255) NOT NULL,
  video_url TEXT NOT NULL,
  sets INTEGER NOT NULL CHECK (sets >= 1 AND sets <= 10),
  reps INTEGER NOT NULL CHECK (reps >= 1 AND reps <= 100),
  rest_seconds INTEGER NOT NULL CHECK (rest_seconds >= 0 AND rest_seconds <= 600),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, day_name, replaced_exercise_id)
);

-- Index for user + day lookups
CREATE INDEX IF NOT EXISTS custom_exercises_user_day_idx ON custom_exercises(user_id, day_name);

-- Enable RLS
ALTER TABLE custom_exercises ENABLE ROW LEVEL SECURITY;

-- Users can only access their own custom exercises
DROP POLICY IF EXISTS "Users can view own custom exercises" ON custom_exercises;
CREATE POLICY "Users can view own custom exercises"
  ON custom_exercises FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own custom exercises" ON custom_exercises;
CREATE POLICY "Users can insert own custom exercises"
  ON custom_exercises FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own custom exercises" ON custom_exercises;
CREATE POLICY "Users can update own custom exercises"
  ON custom_exercises FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own custom exercises" ON custom_exercises;
CREATE POLICY "Users can delete own custom exercises"
  ON custom_exercises FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_workout_data
DROP TRIGGER IF EXISTS update_user_workout_data_updated_at ON user_workout_data;
CREATE TRIGGER update_user_workout_data_updated_at
  BEFORE UPDATE ON user_workout_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to custom_exercises
DROP TRIGGER IF EXISTS update_custom_exercises_updated_at ON custom_exercises;
CREATE TRIGGER update_custom_exercises_updated_at
  BEFORE UPDATE ON custom_exercises
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. FUNCTION TO AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================================

-- Function to create profile when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. FUNCTION TO CHECK IF EMAIL IS APPROVED (For invite-only)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_email_approved(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM approved_users 
    WHERE email = user_email 
    AND used = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. INSERT YOUR ADMIN EMAIL (IMPORTANT: Replace with your actual email)
-- ============================================================================

-- Replace 'your-email@example.com' with your actual email address
-- This will allow you to be the first admin who can invite others
-- Run this AFTER you create your first account

-- INSERT INTO approved_users (email, invited_by, used) 
-- VALUES ('your-email@example.com', NULL, false);

-- After you sign up, run this to make yourself admin:
-- UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';

-- ============================================================================
-- 9. VERIFICATION QUERIES (Run these to test)
-- ============================================================================

-- Check if RLS is enabled (should return 't' for all)
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- View all policies
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- ============================================================================
-- SETUP COMPLETE! Next steps:
-- ============================================================================
-- 1. Run this entire SQL file in Supabase SQL Editor
-- 2. Replace 'your-email@example.com' above with your actual email
-- 3. Uncomment and run the INSERT statement to add yourself
-- 4. Create your account in the app
-- 5. Run the UPDATE statement to make yourself admin
-- 6. You can now invite family/friends from the admin panel
-- ============================================================================
