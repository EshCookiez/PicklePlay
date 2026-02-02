-- =====================================================
-- CLEANUP SCRIPT FOR FILE 01
-- =====================================================
-- Run this BEFORE running 01_authentication_user_management.sql
-- if you encounter errors about existing objects
-- This will safely drop all objects created by file 01

-- Drop triggers first (dependent on functions and tables)
DROP TRIGGER IF EXISTS on_user_created ON public.users;
DROP TRIGGER IF EXISTS update_role_applications_updated_at ON public.role_applications;
DROP TRIGGER IF EXISTS update_user_statistics_updated_at ON public.user_statistics;
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.role_applications CASCADE;
DROP TABLE IF EXISTS public.authentication_logs CASCADE;
DROP TABLE IF EXISTS public.user_statistics CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Functions can stay (they're used by other files too)
-- But if you want to clean them up:
-- DROP FUNCTION IF EXISTS create_user_related_records() CASCADE;
-- DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =====================================================
-- Now you can run 01_authentication_user_management.sql
-- =====================================================
