-- =====================================================
-- PICKLEPLAY - TOURNAMENTS SYSTEM
-- =====================================================
-- This file creates all tables related to tournaments
-- Run this in Supabase SQL Editor AFTER 03_court_booking_system.sql

-- =====================================================
-- TOURNAMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tournaments (
    id BIGSERIAL PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    
    -- Tournament Type
    format VARCHAR(50) NOT NULL
        CHECK (format IN ('singles', 'doubles', 'mixed_doubles', 'round_robin', 'single_elimination', 'double_elimination')),
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('recreational', 'competitive', 'professional', 'junior', 'senior')),
    skill_level VARCHAR(30) DEFAULT 'all'
        CHECK (skill_level IN ('all', 'beginner', 'intermediate', 'advanced', 'professional')),
    
    -- Date & Time
    registration_start TIMESTAMPTZ NOT NULL,
    registration_end TIMESTAMPTZ NOT NULL,
    tournament_start_date DATE NOT NULL,
    tournament_end_date DATE NOT NULL,
    check_in_time TIME,
    start_time TIME,
    
    -- Location
    court_id BIGINT REFERENCES public.courts(id) ON DELETE SET NULL,
    venue_name VARCHAR(255),
    address VARCHAR(500),
    city VARCHAR(255) NOT NULL,
    state VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8) CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11, 8) CHECK (longitude BETWEEN -180 AND 180),
    
    -- Participation
    min_participants INTEGER DEFAULT 4,
    max_participants INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    team_size INTEGER DEFAULT 1 CHECK (team_size > 0),
    age_restriction VARCHAR(100),
    gender_restriction VARCHAR(20) DEFAULT 'all'
        CHECK (gender_restriction IN ('all', 'male', 'female', 'mixed')),
    
    -- Fees & Prizes
    entry_fee DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'PHP',
    prize_pool DECIMAL(10, 2),
    prizes JSONB, -- Array of prize objects
    
    -- Rules & Scoring
    rules TEXT,
    scoring_format VARCHAR(255),
    match_duration INTEGER, -- in minutes
    
    -- Points & Ranking
    points_awarded JSONB, -- Points for 1st, 2nd, 3rd, etc.
    affects_ranking BOOLEAN DEFAULT TRUE,
    
    -- Media
    banner_image TEXT,
    images JSONB,
    
    -- Status
    status VARCHAR(30) DEFAULT 'draft'
        CHECK (status IN ('draft', 'registration_open', 'registration_closed', 'in_progress', 'completed', 'cancelled')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    
    -- Contact
    contact_name VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20),
    
    -- Additional
    sponsors JSONB,
    special_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CHECK (registration_end >= registration_start),
    CHECK (tournament_end_date >= tournament_start_date),
    CHECK (max_participants >= min_participants)
);

-- Add indexes
CREATE INDEX idx_tournaments_organizer ON public.tournaments(organizer_id);
CREATE INDEX idx_tournaments_status ON public.tournaments(status);
CREATE INDEX idx_tournaments_slug ON public.tournaments(slug);
CREATE INDEX idx_tournaments_city ON public.tournaments(city);
CREATE INDEX idx_tournaments_start_date ON public.tournaments(tournament_start_date);
CREATE INDEX idx_tournaments_registration_dates ON public.tournaments(registration_start, registration_end);
CREATE INDEX idx_tournaments_is_featured ON public.tournaments(is_featured);
CREATE INDEX idx_tournaments_is_public ON public.tournaments(is_public);
CREATE INDEX idx_tournaments_deleted_at ON public.tournaments(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_tournaments_location ON public.tournaments USING gist (
    point(longitude, latitude)
) WHERE longitude IS NOT NULL AND latitude IS NOT NULL;

-- Full-text search
CREATE INDEX idx_tournaments_search ON public.tournaments USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, ''))
);

-- Add RLS policies
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public tournaments"
    ON public.tournaments FOR SELECT
    USING (is_public = TRUE AND status != 'draft' AND deleted_at IS NULL);

CREATE POLICY "Organizers can view their own tournaments"
    ON public.tournaments FOR SELECT
    USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can create tournaments"
    ON public.tournaments FOR INSERT
    WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own tournaments"
    ON public.tournaments FOR UPDATE
    USING (auth.uid() = organizer_id);

-- =====================================================
-- TOURNAMENT PARTICIPANTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tournament_participants (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Team Information
    team_name VARCHAR(255),
    partner_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL, -- For doubles
    seed_number INTEGER,
    
    -- Registration
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'checked_in', 'withdrawn', 'disqualified')),
    payment_status VARCHAR(30)
        CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    payment_id BIGINT, -- Will be linked to payments table later
    
    -- Check-in
    checked_in_at TIMESTAMPTZ,
    check_in_notes TEXT,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Performance
    placement INTEGER, -- Final ranking (1st, 2nd, 3rd, etc.)
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    matches_lost INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    
    -- Additional
    waiver_signed BOOLEAN DEFAULT FALSE,
    waiver_signed_at TIMESTAMPTZ,
    special_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(tournament_id, user_id)
);

-- Add indexes
CREATE INDEX idx_tournament_participants_tournament ON public.tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user ON public.tournament_participants(user_id);
CREATE INDEX idx_tournament_participants_status ON public.tournament_participants(status);
CREATE INDEX idx_tournament_participants_partner ON public.tournament_participants(partner_user_id);
CREATE INDEX idx_tournament_participants_placement ON public.tournament_participants(placement);

-- Add RLS policies
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants of public tournaments"
    ON public.tournament_participants FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tournaments
            WHERE tournaments.id = tournament_participants.tournament_id
            AND tournaments.is_public = TRUE
        )
    );

CREATE POLICY "Users can view their own participations"
    ON public.tournament_participants FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can register for tournaments"
    ON public.tournament_participants FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participations"
    ON public.tournament_participants FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- TOURNAMENT MATCHES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tournament_matches (
    id BIGSERIAL PRIMARY KEY,
    tournament_id BIGINT NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL, -- 1, 2, 3, etc.
    match_number INTEGER NOT NULL, -- Match number within the round
    
    -- Participants
    participant_1_id BIGINT NOT NULL REFERENCES public.tournament_participants(id) ON DELETE CASCADE,
    participant_2_id BIGINT NOT NULL REFERENCES public.tournament_participants(id) ON DELETE CASCADE,
    
    -- Scheduling
    court_id BIGINT REFERENCES public.courts(id) ON DELETE SET NULL,
    court_number INTEGER,
    scheduled_date DATE,
    scheduled_time TIME,
    actual_start_time TIMESTAMPTZ,
    actual_end_time TIMESTAMPTZ,
    
    -- Score
    participant_1_score JSONB, -- Array of game scores [11, 8, 11]
    participant_2_score JSONB, -- Array of game scores [9, 11, 7]
    winner_id BIGINT REFERENCES public.tournament_participants(id) ON DELETE SET NULL,
    
    -- Status
    status VARCHAR(30) DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'in_progress', 'completed', 'forfeited', 'postponed', 'cancelled')),
    forfeit_reason TEXT,
    
    -- Officiating
    referee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    referee_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint
    CHECK (participant_1_id != participant_2_id)
);

-- Add indexes
CREATE INDEX idx_tournament_matches_tournament ON public.tournament_matches(tournament_id);
CREATE INDEX idx_tournament_matches_round ON public.tournament_matches(tournament_id, round_number);
CREATE INDEX idx_tournament_matches_participant_1 ON public.tournament_matches(participant_1_id);
CREATE INDEX idx_tournament_matches_participant_2 ON public.tournament_matches(participant_2_id);
CREATE INDEX idx_tournament_matches_winner ON public.tournament_matches(winner_id);
CREATE INDEX idx_tournament_matches_status ON public.tournament_matches(status);
CREATE INDEX idx_tournament_matches_scheduled ON public.tournament_matches(scheduled_date, scheduled_time);

-- Add RLS policies
ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view matches of public tournaments"
    ON public.tournament_matches FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.tournaments
            WHERE tournaments.id = tournament_matches.tournament_id
            AND tournaments.is_public = TRUE
        )
    );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON public.tournaments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournament_participants_updated_at BEFORE UPDATE ON public.tournament_participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournament_matches_updated_at BEFORE UPDATE ON public.tournament_matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update tournament participant count
CREATE OR REPLACE FUNCTION update_tournament_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tournaments
        SET current_participants = current_participants + 1
        WHERE id = NEW.tournament_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tournaments
        SET current_participants = GREATEST(current_participants - 1, 0)
        WHERE id = OLD.tournament_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        -- Recalculate based on confirmed/checked_in participants
        UPDATE public.tournaments
        SET current_participants = (
            SELECT COUNT(*)
            FROM public.tournament_participants
            WHERE tournament_id = NEW.tournament_id
            AND status IN ('confirmed', 'checked_in')
        )
        WHERE id = NEW.tournament_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tournament_participant_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.tournament_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_tournament_participant_count();

-- Function to update participant match statistics
CREATE OR REPLACE FUNCTION update_participant_match_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND NEW.winner_id IS NOT NULL THEN
        -- Update matches played for both participants
        UPDATE public.tournament_participants
        SET matches_played = matches_played + 1
        WHERE id IN (NEW.participant_1_id, NEW.participant_2_id);
        
        -- Update matches won for winner
        UPDATE public.tournament_participants
        SET matches_won = matches_won + 1
        WHERE id = NEW.winner_id;
        
        -- Update matches lost for loser
        UPDATE public.tournament_participants
        SET matches_lost = matches_lost + 1
        WHERE id IN (NEW.participant_1_id, NEW.participant_2_id)
        AND id != NEW.winner_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_participant_match_stats_trigger
    AFTER UPDATE ON public.tournament_matches
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed'))
    EXECUTE FUNCTION update_participant_match_stats();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.tournaments IS 'Pickleball tournament events';
COMMENT ON TABLE public.tournament_participants IS 'Players/teams registered for tournaments';
COMMENT ON TABLE public.tournament_matches IS 'Individual matches within tournaments';
