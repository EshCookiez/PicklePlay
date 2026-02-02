-- =====================================================
-- PICKLEPLAY - AUTHENTICATION & USER MANAGEMENT
-- =====================================================
-- This file creates all tables related to user authentication and management
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
-- Note: Supabase creates auth.users table automatically
-- We extend it with a public.users table for additional fields

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Credentials
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    location VARCHAR(255),
    
    -- System Fields
    role VARCHAR(50) NOT NULL DEFAULT 'user' 
        CHECK (role IN ('user', 'coach', 'admin', 'super_admin', 'court_owner')),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified_at TIMESTAMPTZ,
    phone_verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    last_password_change_at TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    last_ip_address VARCHAR(45),
    
    -- Security Fields
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_method VARCHAR(20) CHECK (two_factor_method IN ('sms', 'email', 'app')),
    two_factor_backup_codes JSONB,
    
    -- Financial Fields
    stripe_customer_id VARCHAR(255),
    xendit_customer_id VARCHAR(255),
    wallet_balance DECIMAL(10, 2) DEFAULT 0.00,
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    total_earnings DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Profile Fields
    profile_picture TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON public.users(email_verified_at);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Add RLS policies for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Profile Information
    profile_photo TEXT,
    bio TEXT,
    gender VARCHAR(30) CHECK (gender IN ('male', 'female', 'non_binary', 'prefer_not_to_say')),
    cover_photo TEXT,
    
    -- Social Links
    instagram_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    website_url VARCHAR(255),
    
    -- Address
    street_address VARCHAR(255),
    city VARCHAR(255),
    state_province VARCHAR(255),
    country VARCHAR(255),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8) CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11, 8) CHECK (longitude BETWEEN -180 AND 180),
    
    -- Professional Information
    title_occupation VARCHAR(255),
    company_organization VARCHAR(255),
    years_in_sport INTEGER CHECK (years_in_sport >= 0),
    certifications JSONB,
    
    -- Billing Address
    billing_street_address VARCHAR(255),
    billing_city VARCHAR(255),
    billing_state_province VARCHAR(255),
    billing_country VARCHAR(255),
    billing_postal_code VARCHAR(20),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_city ON public.user_profiles(city);
CREATE INDEX IF NOT EXISTS idx_user_profiles_location ON public.user_profiles(latitude, longitude);

-- Add RLS policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- USER PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Localization
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    -- Privacy
    privacy_level VARCHAR(20) DEFAULT 'public' 
        CHECK (privacy_level IN ('public', 'private', 'friends_only')),
    
    -- Email Notifications
    email_booking_confirmations BOOLEAN DEFAULT TRUE,
    email_lesson_reminders BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT FALSE,
    email_frequency VARCHAR(20) DEFAULT 'immediate'
        CHECK (email_frequency IN ('immediate', 'daily', 'weekly')),
    
    -- Other Notifications
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    sms_notifications_enabled BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON public.user_preferences(user_id);

-- Add RLS policies
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own preferences" ON public.user_preferences;
CREATE POLICY "Users can manage their own preferences"
    ON public.user_preferences FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- USER STATISTICS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_statistics (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Booking Statistics
    total_bookings_made INTEGER DEFAULT 0,
    
    -- Lesson Statistics
    total_lessons_taken INTEGER DEFAULT 0,
    total_lessons_given INTEGER DEFAULT 0,
    
    -- Rating & Reviews
    average_rating_received DECIMAL(3, 2) DEFAULT 0.00,
    total_review_count INTEGER DEFAULT 0,
    
    -- Tournament Statistics
    tournament_participations INTEGER DEFAULT 0,
    tournament_wins INTEGER DEFAULT 0,
    current_ranking INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_statistics_user_id ON public.user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_statistics_ranking ON public.user_statistics(current_ranking);

-- Add RLS policies
ALTER TABLE public.user_statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own statistics" ON public.user_statistics;
CREATE POLICY "Users can view their own statistics"
    ON public.user_statistics FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- AUTHENTICATION LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.authentication_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    
    -- Action details
    action VARCHAR(50) NOT NULL, -- login, logout, register, password_change, etc.
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed')),
    
    -- Request information
    ip_address VARCHAR(45),
    user_agent TEXT,
    details TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_auth_logs_user_id ON public.authentication_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_logs_action ON public.authentication_logs(action);
CREATE INDEX IF NOT EXISTS idx_auth_logs_status ON public.authentication_logs(status);
CREATE INDEX IF NOT EXISTS idx_auth_logs_created_at ON public.authentication_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_logs_email ON public.authentication_logs(email);

-- Add RLS policies (admins only can view)
ALTER TABLE public.authentication_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Only admins can view auth logs" ON public.authentication_logs;
CREATE POLICY "Only admins can view auth logs"
    ON public.authentication_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- ROLE APPLICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.role_applications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role_applied_for VARCHAR(50) NOT NULL
        CHECK (role_applied_for IN ('coach', 'court_owner', 'organizer')),
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    
    -- Application Details
    business_name VARCHAR(255),
    business_registration VARCHAR(255),
    certifications JSONB,
    experience_years INTEGER,
    description TEXT NOT NULL,
    
    -- Documents
    documents JSONB, -- Array of document paths
    id_verification TEXT,
    
    -- Review
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_role_applications_user_id ON public.role_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_role_applications_status ON public.role_applications(status);
CREATE INDEX IF NOT EXISTS idx_role_applications_role ON public.role_applications(role_applied_for);
CREATE INDEX IF NOT EXISTS idx_role_applications_created_at ON public.role_applications(created_at);

-- Add RLS policies
ALTER TABLE public.role_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own applications" ON public.role_applications;
CREATE POLICY "Users can view their own applications"
    ON public.role_applications FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own applications" ON public.role_applications;
CREATE POLICY "Users can create their own applications"
    ON public.role_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all applications" ON public.role_applications;
CREATE POLICY "Admins can view all applications"
    ON public.role_applications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

DROP POLICY IF EXISTS "Admins can update applications" ON public.role_applications;
CREATE POLICY "Admins can update applications"
    ON public.role_applications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON public.user_preferences;
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_statistics_updated_at ON public.user_statistics;
CREATE TRIGGER update_user_statistics_updated_at BEFORE UPDATE ON public.user_statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_role_applications_updated_at ON public.role_applications;
CREATE TRIGGER update_role_applications_updated_at BEFORE UPDATE ON public.role_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-create related records when user is created
CREATE OR REPLACE FUNCTION create_user_related_records()
RETURNS TRIGGER AS $$
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (user_id)
    VALUES (NEW.id);
    
    -- Create user preferences
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    -- Create user statistics
    INSERT INTO public.user_statistics (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_created ON public.users;
CREATE TRIGGER on_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_user_related_records();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.users IS 'Extended user information linked to auth.users';
COMMENT ON TABLE public.user_profiles IS 'Detailed user profile information';
COMMENT ON TABLE public.user_preferences IS 'User notification and privacy preferences';
COMMENT ON TABLE public.user_statistics IS 'User activity and performance statistics';
COMMENT ON TABLE public.authentication_logs IS 'Audit log of authentication events';
COMMENT ON TABLE public.role_applications IS 'Applications for elevated roles (coach, court owner, etc.)';
