-- =====================================================
-- PICKLEPLAY - COACHING SYSTEM
-- =====================================================
-- This file creates all tables related to coaching services
-- Run this in Supabase SQL Editor AFTER 04_tournaments_system.sql

-- =====================================================
-- COACHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.coaches (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Professional Info
    bio TEXT,
    specialties JSONB, -- Array: ['beginners', 'advanced_techniques', 'tournament_prep']
    years_of_experience INTEGER CHECK (years_of_experience >= 0),
    coaching_philosophy TEXT,
    
    -- Certifications
    certifications JSONB, -- Array of certification objects
    certifications_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    
    -- Services
    offers_private_lessons BOOLEAN DEFAULT TRUE,
    offers_group_lessons BOOLEAN DEFAULT FALSE,
    offers_online_coaching BOOLEAN DEFAULT FALSE,
    offers_tournament_coaching BOOLEAN DEFAULT FALSE,
    
    -- Pricing
    hourly_rate DECIMAL(8, 2) NOT NULL,
    group_rate DECIMAL(8, 2),
    package_deals JSONB, -- Array of package objects
    currency VARCHAR(3) DEFAULT 'PHP',
    
    -- Availability
    is_accepting_students BOOLEAN DEFAULT TRUE,
    max_students INTEGER,
    current_students INTEGER DEFAULT 0,
    availability_schedule JSONB, -- Weekly schedule
    
    -- Location
    service_areas JSONB, -- Array of cities/regions
    willing_to_travel BOOLEAN DEFAULT FALSE,
    max_travel_distance_km INTEGER,
    travel_fee DECIMAL(8, 2),
    
    -- Media
    profile_video TEXT,
    action_photos JSONB,
    
    -- Statistics
    total_lessons_given INTEGER DEFAULT 0,
    total_students INTEGER DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
    is_featured BOOLEAN DEFAULT FALSE,
    featured_until TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_coaches_user_id ON public.coaches(user_id);
CREATE INDEX IF NOT EXISTS idx_coaches_status ON public.coaches(status);
CREATE INDEX IF NOT EXISTS idx_coaches_is_accepting ON public.coaches(is_accepting_students);
CREATE INDEX IF NOT EXISTS idx_coaches_is_featured ON public.coaches(is_featured);
CREATE INDEX IF NOT EXISTS idx_coaches_average_rating ON public.coaches(average_rating);
CREATE INDEX IF NOT EXISTS idx_coaches_certifications_verified ON public.coaches(certifications_verified);

-- Full-text search
CREATE INDEX IF NOT EXISTS idx_coaches_search ON public.coaches USING gin(
    to_tsvector('english', coalesce(bio, '') || ' ' || coalesce(coaching_philosophy, ''))
);

-- Add RLS policies
ALTER TABLE public.coaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coaches"
    ON public.coaches FOR SELECT
    USING (status = 'active');

CREATE POLICY "Coaches can view their own profile"
    ON public.coaches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create coach profile"
    ON public.coaches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Coaches can update their own profile"
    ON public.coaches FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- COACHING SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.coaching_sessions (
    id BIGSERIAL PRIMARY KEY,
    coach_id BIGINT NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Session Type
    session_type VARCHAR(30) NOT NULL
        CHECK (session_type IN ('private', 'group', 'online', 'tournament_prep')),
    skill_focus JSONB, -- Array: ['serves', 'volleys', 'strategy']
    
    -- Scheduling
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    
    -- Location
    location_type VARCHAR(20) NOT NULL
        CHECK (location_type IN ('court', 'online', 'other')),
    court_id BIGINT REFERENCES public.courts(id) ON DELETE SET NULL,
    location_details TEXT,
    meeting_link VARCHAR(500),
    
    -- Group Sessions
    is_group_session BOOLEAN DEFAULT FALSE,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 1,
    
    -- Pricing
    rate DECIMAL(8, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    payment_status VARCHAR(30) DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partially_refunded')),
    payment_id BIGINT, -- Will be linked to payments table
    
    -- Status
    status VARCHAR(30) DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    confirmation_code VARCHAR(20) UNIQUE,
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancelled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    cancellation_reason TEXT,
    cancellation_fee DECIMAL(8, 2),
    
    -- Notes
    student_goals TEXT,
    coach_notes_before TEXT,
    coach_notes_after TEXT,
    homework_assigned TEXT,
    
    -- Completion
    completed_at TIMESTAMPTZ,
    student_attended BOOLEAN,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CHECK (end_time > start_time)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_coach ON public.coaching_sessions(coach_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_student ON public.coaching_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_date ON public.coaching_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_status ON public.coaching_sessions(status);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_payment_status ON public.coaching_sessions(payment_status);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_court ON public.coaching_sessions(court_id);
CREATE INDEX IF NOT EXISTS idx_coaching_sessions_confirmation ON public.coaching_sessions(confirmation_code);

-- Add RLS policies
ALTER TABLE public.coaching_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own sessions"
    ON public.coaching_sessions FOR SELECT
    USING (auth.uid() = student_id);

CREATE POLICY "Coaches can view their sessions"
    ON public.coaching_sessions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.coaches
            WHERE coaches.id = coaching_sessions.coach_id
            AND coaches.user_id = auth.uid()
        )
    );

CREATE POLICY "Students can create sessions"
    ON public.coaching_sessions FOR INSERT
    WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their sessions"
    ON public.coaching_sessions FOR UPDATE
    USING (auth.uid() = student_id);

CREATE POLICY "Coaches can update their sessions"
    ON public.coaching_sessions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.coaches
            WHERE coaches.id = coaching_sessions.coach_id
            AND coaches.user_id = auth.uid()
        )
    );

-- =====================================================
-- COACHING SESSION PARTICIPANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.coaching_session_participants (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES public.coaching_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    attended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(session_id, user_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_session_participants_session ON public.coaching_session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_user ON public.coaching_session_participants(user_id);

-- Add RLS policies
ALTER TABLE public.coaching_session_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can view session participants"
    ON public.coaching_session_participants FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.coaching_sessions
            WHERE coaching_sessions.id = coaching_session_participants.session_id
            AND (
                coaching_sessions.student_id = auth.uid()
                OR EXISTS (
                    SELECT 1 FROM public.coaches
                    WHERE coaches.id = coaching_sessions.coach_id
                    AND coaches.user_id = auth.uid()
                )
            )
        )
    );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON public.coaches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coaching_sessions_updated_at BEFORE UPDATE ON public.coaching_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update coach statistics
CREATE OR REPLACE FUNCTION update_coach_statistics(coach_id_param BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE public.coaches
    SET 
        total_lessons_given = (
            SELECT COUNT(*)
            FROM public.coaching_sessions
            WHERE coach_id = coach_id_param
            AND status = 'completed'
        ),
        average_rating = (
            SELECT COALESCE(AVG(overall_rating), 0)
            FROM public.coach_reviews
            WHERE coach_id = coach_id_param
            AND status = 'published'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.coach_reviews
            WHERE coach_id = coach_id_param
            AND status = 'published'
        )
    WHERE id = coach_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update coach stats when session is completed
CREATE OR REPLACE FUNCTION trigger_update_coach_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed') OR TG_OP = 'INSERT' THEN
        PERFORM update_coach_statistics(NEW.coach_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coach_stats_trigger
    AFTER INSERT OR UPDATE ON public.coaching_sessions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_coach_stats();

-- Function to generate coaching session confirmation code
CREATE OR REPLACE FUNCTION generate_session_confirmation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        code := 'CS-' || upper(substring(md5(random()::text) from 1 for 8));
        done := NOT EXISTS (SELECT 1 FROM public.coaching_sessions WHERE confirmation_code = code);
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate session confirmation code
CREATE OR REPLACE FUNCTION set_session_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL OR NEW.confirmation_code = '' THEN
        NEW.confirmation_code := generate_session_confirmation_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_session_confirmation_code_trigger
    BEFORE INSERT ON public.coaching_sessions
    FOR EACH ROW
    EXECUTE FUNCTION set_session_confirmation_code();

-- Function to update session participant count
CREATE OR REPLACE FUNCTION update_session_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.coaching_sessions
        SET current_participants = current_participants + 1
        WHERE id = NEW.session_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.coaching_sessions
        SET current_participants = GREATEST(current_participants - 1, 1)
        WHERE id = OLD.session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_participant_count_trigger
    AFTER INSERT OR DELETE ON public.coaching_session_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_session_participant_count();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.coaches IS 'Coach profiles and information';
COMMENT ON TABLE public.coaching_sessions IS 'Scheduled coaching sessions';
COMMENT ON TABLE public.coaching_session_participants IS 'Participants in group coaching sessions';
