-- =====================================================
-- PICKLEPLAY - ANALYTICS & ADMIN
-- =====================================================
-- This file creates tables for analytics, logging, and admin features
-- Run this in Supabase SQL Editor AFTER 09_shop_payments_events.sql

-- =====================================================
-- ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    log_type VARCHAR(30) NOT NULL
        CHECK (log_type IN ('user_activity', 'system', 'security', 'api', 'error')),
    
    -- Activity Details
    action VARCHAR(100) NOT NULL, -- view, create, update, delete, etc.
    subject_type VARCHAR(100), -- Polymorphic: Court, Booking, etc.
    subject_id BIGINT, -- Polymorphic ID
    description TEXT,
    
    -- Request Info
    ip_address VARCHAR(45),
    user_agent TEXT,
    url VARCHAR(500),
    method VARCHAR(10), -- GET, POST, etc.
    
    -- Additional Data
    properties JSONB, -- Old values, new values, etc.
    metadata JSONB,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_type ON public.activity_logs(log_type);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_subject ON public.activity_logs(subject_type, subject_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_ip ON public.activity_logs(ip_address);

-- Add RLS policies
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all activity logs"
    ON public.activity_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- ANALYTICS DATA TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.analytics_data (
    id BIGSERIAL PRIMARY KEY,
    metric_type VARCHAR(100) NOT NULL, -- court_views, bookings, revenue, etc.
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(15, 2) NOT NULL,
    metric_unit VARCHAR(50), -- count, currency, percentage, etc.
    
    -- Dimensions
    date DATE NOT NULL,
    hour INTEGER CHECK (hour BETWEEN 0 AND 23),
    day_of_week VARCHAR(20),
    month INTEGER CHECK (month BETWEEN 1 AND 12),
    year INTEGER,
    
    -- Segmentation
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    court_id BIGINT REFERENCES public.courts(id) ON DELETE SET NULL,
    category VARCHAR(100),
    
    -- Additional Data
    metadata JSONB,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_analytics_data_metric_type ON public.analytics_data(metric_type);
CREATE INDEX IF NOT EXISTS idx_analytics_data_date ON public.analytics_data(date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_data_user ON public.analytics_data(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_court ON public.analytics_data(court_id);
CREATE INDEX IF NOT EXISTS idx_analytics_data_category ON public.analytics_data(category);
CREATE INDEX IF NOT EXISTS idx_analytics_data_year_month ON public.analytics_data(year, month);
CREATE INDEX IF NOT EXISTS idx_analytics_data_composite ON public.analytics_data(metric_type, date, category);

-- Add RLS policies
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all analytics"
    ON public.analytics_data FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Court owners can view their court analytics"
    ON public.analytics_data FOR SELECT
    USING (
        court_id IS NOT NULL
        AND EXISTS (
            SELECT 1 FROM public.courts
            WHERE courts.id = analytics_data.court_id
            AND courts.owner_id = auth.uid()
        )
    );

-- =====================================================
-- ADMIN AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id BIGSERIAL PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(100), -- Polymorphic
    target_id BIGINT, -- Polymorphic
    
    -- Action Details
    description TEXT NOT NULL,
    changes JSONB, -- Before/after values
    severity VARCHAR(20) DEFAULT 'low'
        CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    
    -- Request Info
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin ON public.admin_audit_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON public.admin_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_target ON public.admin_audit_logs(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_severity ON public.admin_audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);

-- Add RLS policies
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
    ON public.admin_audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can create audit logs"
    ON public.admin_audit_logs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type VARCHAR(50) NOT NULL, -- booking_confirmed, tournament_starting, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Link/Action
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    
    -- Related Entity (Polymorphic)
    related_type VARCHAR(100), -- Booking, Tournament, etc.
    related_id BIGINT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Delivery
    delivery_method VARCHAR(30)
        CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
    sent_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    error_message TEXT,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'normal'
        CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_related ON public.notifications(related_type, related_id);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON public.notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;

-- Add RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.system_settings (
    id BIGSERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    category VARCHAR(50), -- general, email, payment, etc.
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Can be accessed by non-admins
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_category ON public.system_settings(category);
CREATE INDEX IF NOT EXISTS idx_system_settings_is_public ON public.system_settings(is_public);

-- Add RLS policies
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public settings can be viewed by anyone"
    ON public.system_settings FOR SELECT
    USING (is_public = TRUE);

CREATE POLICY "Admins can manage all settings"
    ON public.system_settings FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- Insert default settings
INSERT INTO public.system_settings (key, value, category, description, is_public) VALUES
    ('site_name', '"PicklePlay"', 'general', 'Website name', TRUE),
    ('site_tagline', '"Your Pickleball Community Hub"', 'general', 'Website tagline', TRUE),
    ('default_currency', '"PHP"', 'general', 'Default currency code', TRUE),
    ('default_timezone', '"Asia/Manila"', 'general', 'Default timezone', TRUE),
    ('enable_registrations', 'true', 'general', 'Allow new user registrations', TRUE),
    ('maintenance_mode', 'false', 'general', 'Enable maintenance mode', TRUE),
    ('points_per_tournament_win', '100', 'points', 'Points awarded for tournament win', FALSE),
    ('points_per_tournament_participation', '10', 'points', 'Points for tournament participation', FALSE),
    ('points_expiry_days', '365', 'points', 'Days until points expire', FALSE),
    ('booking_cancellation_hours', '24', 'bookings', 'Hours before booking to allow cancellation', FALSE),
    ('email_from_name', '"PicklePlay"', 'email', 'Email sender name', FALSE),
    ('email_from_address', '"noreply@pickleplay.ph"', 'email', 'Email sender address', FALSE)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- SAVED LOCATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.saved_locations (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- e.g., "Home", "Work", "Favorite Court"
    address VARCHAR(500) NOT NULL,
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8) NOT NULL CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11, 8) NOT NULL CHECK (longitude BETWEEN -180 AND 180),
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_saved_locations_user ON public.saved_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_is_default ON public.saved_locations(is_default);
CREATE INDEX IF NOT EXISTS idx_saved_locations_location ON public.saved_locations USING gist (
    point(longitude, latitude)
);

-- Add RLS policies
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own saved locations"
    ON public.saved_locations FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- PLAYER PROFILES TABLE (Extended from User Profiles)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.player_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Skill Information
    skill_level VARCHAR(30) DEFAULT 'beginner'
        CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
    years_of_experience INTEGER DEFAULT 0 CHECK (years_of_experience >= 0),
    playing_style VARCHAR(30)
        CHECK (playing_style IN ('aggressive', 'defensive', 'balanced', 'all_around')),
    
    -- Playing Preferences
    preferred_hand VARCHAR(20)
        CHECK (preferred_hand IN ('right', 'left', 'ambidextrous')),
    preferred_position VARCHAR(20) DEFAULT 'both'
        CHECK (preferred_position IN ('singles', 'doubles', 'both')),
    preferred_time JSONB, -- Array: ['morning', 'afternoon', 'evening']
    
    -- Certifications & Achievements
    certifications JSONB, -- Array of certification objects
    achievements JSONB, -- Array of achievement objects
    tournament_history JSONB, -- Array of tournament records
    
    -- Availability
    availability_schedule JSONB, -- Object: { "monday": ["9am-12pm", "6pm-9pm"], ... }
    is_available_for_lessons BOOLEAN DEFAULT FALSE,
    lesson_rate_per_hour DECIMAL(8, 2),
    
    -- Court Preferences
    preferred_court_type VARCHAR(20)
        CHECK (preferred_court_type IN ('indoor', 'outdoor', 'both')),
    preferred_surface VARCHAR(30)
        CHECK (preferred_surface IN ('concrete', 'asphalt', 'sport_court', 'wood')),
    max_travel_distance_km INTEGER,
    
    -- Profile Completion
    profile_completion_percentage INTEGER DEFAULT 0 CHECK (profile_completion_percentage BETWEEN 0 AND 100),
    
    -- Media
    profile_photo TEXT,
    action_photos JSONB, -- Array of photo paths
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_player_profiles_user ON public.player_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_player_profiles_skill_level ON public.player_profiles(skill_level);
CREATE INDEX IF NOT EXISTS idx_player_profiles_is_available ON public.player_profiles(is_available_for_lessons);
CREATE INDEX IF NOT EXISTS idx_player_profiles_preferred_position ON public.player_profiles(preferred_position);

-- Add RLS policies
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view player profiles"
    ON public.player_profiles FOR SELECT
    USING (TRUE);

CREATE POLICY "Users can manage their own player profile"
    ON public.player_profiles FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- REFERRALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.referrals (
    id BIGSERIAL PRIMARY KEY,
    referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Referral Details
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    referred_email VARCHAR(255),
    
    -- Status
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending', 'completed', 'rewarded', 'expired')),
    
    -- Rewards
    referrer_reward_points INTEGER DEFAULT 0,
    referred_reward_points INTEGER DEFAULT 0,
    rewarded_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user ON public.referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_referrals_created_at ON public.referrals(created_at DESC);

-- Add RLS policies
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals"
    ON public.referrals FOR SELECT
    USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

CREATE POLICY "Users can create referrals"
    ON public.referrals FOR INSERT
    WITH CHECK (auth.uid() = referrer_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_locations_updated_at BEFORE UPDATE ON public.saved_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_profiles_updated_at BEFORE UPDATE ON public.player_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_user_id UUID,
    p_log_type VARCHAR(30),
    p_action VARCHAR(100),
    p_subject_type VARCHAR(100) DEFAULT NULL,
    p_subject_id BIGINT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_properties JSONB DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    v_log_id BIGINT;
BEGIN
    INSERT INTO public.activity_logs (
        user_id, log_type, action, subject_type, subject_id, description, properties
    )
    VALUES (
        p_user_id, p_log_type, p_action, p_subject_type, p_subject_id, p_description, p_properties
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR(50),
    p_title VARCHAR(255),
    p_message TEXT,
    p_action_url VARCHAR(500) DEFAULT NULL,
    p_related_type VARCHAR(100) DEFAULT NULL,
    p_related_id BIGINT DEFAULT NULL,
    p_priority VARCHAR(20) DEFAULT 'normal'
)
RETURNS BIGINT AS $$
DECLARE
    v_notification_id BIGINT;
BEGIN
    INSERT INTO public.notifications (
        user_id, type, title, message, action_url, related_type, related_id, priority, delivery_method
    )
    VALUES (
        p_user_id, p_type, p_title, p_message, p_action_url, p_related_type, p_related_id, p_priority, 'in_app'
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
    v_done BOOLEAN := FALSE;
BEGIN
    WHILE NOT v_done LOOP
        v_code := upper(substring(md5(p_user_id::text || random()::text) from 1 for 8));
        v_done := NOT EXISTS (SELECT 1 FROM public.referrals WHERE referral_code = v_code);
    END LOOP;
    RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Function to get system setting
CREATE OR REPLACE FUNCTION get_setting(p_key VARCHAR(100), p_default JSONB DEFAULT 'null'::JSONB)
RETURNS JSONB AS $$
DECLARE
    v_value JSONB;
BEGIN
    SELECT value INTO v_value
    FROM public.system_settings
    WHERE key = p_key;
    
    IF v_value IS NULL THEN
        RETURN p_default;
    END IF;
    
    RETURN v_value;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to calculate profile completion
CREATE OR REPLACE FUNCTION calculate_profile_completion(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_completion INTEGER := 0;
    v_total_fields INTEGER := 20;
    v_filled_fields INTEGER := 0;
BEGIN
    -- Check user_profiles fields
    SELECT 
        (CASE WHEN profile_photo IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN bio IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN gender IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN city IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN country IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN instagram_url IS NOT NULL THEN 1 ELSE 0 END)
    INTO v_filled_fields
    FROM public.user_profiles
    WHERE user_id = p_user_id;
    
    -- Check player_profiles fields
    v_filled_fields := v_filled_fields + (
        SELECT 
            (CASE WHEN skill_level IS NOT NULL THEN 1 ELSE 0 END) +
            (CASE WHEN years_of_experience > 0 THEN 1 ELSE 0 END) +
            (CASE WHEN playing_style IS NOT NULL THEN 1 ELSE 0 END) +
            (CASE WHEN preferred_hand IS NOT NULL THEN 1 ELSE 0 END) +
            (CASE WHEN preferred_position IS NOT NULL THEN 1 ELSE 0 END) +
            (CASE WHEN preferred_court_type IS NOT NULL THEN 1 ELSE 0 END)
        FROM public.player_profiles
        WHERE user_id = p_user_id
    );
    
    v_completion := (v_filled_fields * 100) / v_total_fields;
    
    RETURN v_completion;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profile completion percentage
CREATE OR REPLACE FUNCTION update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'user_profiles' THEN
        UPDATE public.player_profiles
        SET profile_completion_percentage = calculate_profile_completion(NEW.user_id)
        WHERE user_id = NEW.user_id;
    ELSIF TG_TABLE_NAME = 'player_profiles' THEN
        NEW.profile_completion_percentage := calculate_profile_completion(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profile_completion
    AFTER INSERT OR UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_completion();

CREATE TRIGGER update_player_profile_completion
    BEFORE INSERT OR UPDATE ON public.player_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_completion();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.activity_logs IS 'User and system activity logs';
COMMENT ON TABLE public.analytics_data IS 'Analytics metrics and KPIs';
COMMENT ON TABLE public.admin_audit_logs IS 'Admin action audit trail';
COMMENT ON TABLE public.notifications IS 'User notifications';
COMMENT ON TABLE public.system_settings IS 'Application configuration settings';
COMMENT ON TABLE public.saved_locations IS 'User saved locations for quick access';
COMMENT ON TABLE public.player_profiles IS 'Extended player profile information';
COMMENT ON TABLE public.referrals IS 'User referral tracking';

-- =====================================================
-- FINAL NOTE
-- =====================================================
-- This completes the PicklePlay database schema!
-- All tables, indexes, RLS policies, triggers, and functions are now created.
-- 
-- Next steps:
-- 1. Verify all tables were created successfully
-- 2. Test RLS policies with different user roles
-- 3. Add sample/seed data for testing
-- 4. Set up Supabase Storage buckets
-- 5. Configure Supabase Auth providers
-- 6. Create Edge Functions for complex operations
