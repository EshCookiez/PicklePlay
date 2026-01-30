-- SQL Migration for Tournaments System

-- 1. Tournament Status Enum
DO $$ BEGIN
    CREATE TYPE tournament_status AS ENUM ('upcoming', 'open', 'closed', 'in_progress', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Tournament Sanctioning Body Enum
DO $$ BEGIN
    CREATE TYPE sanctioning_body AS ENUM ('PPA', 'MLP', 'USAP', 'USSP', 'None');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Event Category Enum
DO $$ BEGIN
    CREATE TYPE event_category AS ENUM ('singles', 'doubles', 'mixed_doubles', 'coed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Tournaments Table
CREATE TABLE IF NOT EXISTS tournaments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancellation_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Location
    location_name TEXT NOT NULL,
    address TEXT,
    city TEXT NOT NULL,
    state_province TEXT,
    country TEXT NOT NULL DEFAULT 'Philippines',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    -- Status & Type
    status tournament_status NOT NULL DEFAULT 'upcoming',
    sanctioning_type sanctioning_body NOT NULL DEFAULT 'None',
    
    -- Fees & Organizer
    base_fee DECIMAL(10, 2) DEFAULT 0.00,
    organizer_id UUID REFERENCES auth.users(id),
    
    -- Media
    image_url TEXT,
    website_url TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tournament Events (Brackets)
CREATE TABLE IF NOT EXISTS tournament_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "Men's Doubles 3.5 (19-49)"
    
    category event_category NOT NULL,
    gender TEXT, -- 'men', 'women', 'mixed', 'any'
    
    -- Requirements
    min_skill DECIMAL(3, 2), -- e.g., 3.50
    max_skill DECIMAL(3, 2), -- e.g., 4.00
    min_age INTEGER,
    max_age INTEGER,
    
    -- Format & Fee
    format TEXT DEFAULT 'round_robin', -- 'round_robin', 'double_elimination', etc.
    fee DECIMAL(10, 2) DEFAULT 0.00, -- Extra fee for this specific event
    max_teams INTEGER,
    current_teams INTEGER DEFAULT 0,
    
    -- Schedule
    starts_at TIMESTAMP WITH TIME ZONE,
    scoring_format TEXT, -- e.g., "2/3 to 11"
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tournament Registrations
CREATE TABLE IF NOT EXISTS tournament_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES tournament_events(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES auth.users(id),
    partner_id UUID REFERENCES auth.users(id), -- Only for doubles
    
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    registration_status TEXT DEFAULT 'confirmed', -- 'confirmed', 'waitlisted', 'withdrawn'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a player can't register for the same event twice
    UNIQUE(event_id, player_id)
);

-- 7. Add RLS Policies (Read access for everyone)
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Allow public read access for tournament events" ON tournament_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to view registrations" ON tournament_registrations FOR SELECT USING (auth.role() = 'authenticated');

-- 8. Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tournament_events_updated_at BEFORE UPDATE ON tournament_events FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tournament_registrations_updated_at BEFORE UPDATE ON tournament_registrations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 9. Trigger to update current_teams in tournament_events
CREATE OR REPLACE FUNCTION update_event_team_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE tournament_events 
        SET current_teams = current_teams + 1 
        WHERE id = NEW.event_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE tournament_events 
        SET current_teams = current_teams - 1 
        WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_event_team_count_on_registration
AFTER INSERT OR DELETE ON tournament_registrations
FOR EACH ROW EXECUTE PROCEDURE update_event_team_count();
