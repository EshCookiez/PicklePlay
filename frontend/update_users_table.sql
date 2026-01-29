-- PicklePlay Users Table Update
-- Run this in Supabase SQL Editor

-- 1. FIRST: Disable RLS temporarily to fix the issue
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Remove unnecessary columns (Laravel legacy)
ALTER TABLE public.users 
DROP COLUMN IF EXISTS remember_token;

-- 4. Make date_of_birth and location nullable temporarily
ALTER TABLE public.users 
ALTER COLUMN date_of_birth DROP NOT NULL;

ALTER TABLE public.users 
ALTER COLUMN location DROP NOT NULL;

-- 5. Add missing columns (if they don't exist)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS location TEXT;

-- 6. Add optional columns for profile updates (not used in signup)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS profile_picture_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skill_level TEXT,
ADD COLUMN IF NOT EXISTS play_frequency TEXT;

-- 7. Ensure proper columns exist
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user',
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;

-- 8. Grant necessary permissions
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- 9. Create function to handle new user creation (NO AUTO TRIGGER)
-- We'll manually insert from our app code instead
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This function exists but we won't use it automatically
  -- We'll handle user creation manually in our app
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Verify the table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- Expected columns:
-- ✅ id (uuid, NOT NULL, references auth.users)
-- ✅ email (text, NOT NULL)
-- ✅ first_name (text, NOT NULL)
-- ✅ last_name (text, NOT NULL)
-- ✅ date_of_birth (date, NOT NULL) - SIGNUP FIELD
-- ✅ location (text, NOT NULL) - SIGNUP FIELD
-- ✅ phone_number (text, nullable) - SIGNUP FIELD (optional)
-- ✅ password (text, nullable) - Keep for compatibility
-- ✅ role (text, NOT NULL, default 'user')
-- ✅ status (text, NOT NULL, default 'active')
-- ✅ profile_picture_url (text, nullable) - PROFILE UPDATE
-- ✅ bio (text, nullable) - PROFILE UPDATE
-- ✅ skill_level (text, nullable) - PROFILE UPDATE
-- ✅ play_frequency (text, nullable) - PROFILE UPDATE
-- ✅ email_verified_at (timestamptz, nullable)
-- ✅ created_at (timestamptz, NOT NULL)
-- ✅ updated_at (timestamptz, NOT NULL)
