-- SQL Migration for Courts Table
-- This migration creates the courts table with all necessary fields for court listings

-- 1. Court Status Enum
DO $$ BEGIN
    CREATE TYPE court_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Court Type Enum
DO $$ BEGIN
    CREATE TYPE court_type AS ENUM ('indoor', 'outdoor', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Court Surface Enum
DO $$ BEGIN
    CREATE TYPE court_surface AS ENUM ('concrete', 'asphalt', 'sport_court', 'wood', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Courts Table
CREATE TABLE IF NOT EXISTS courts (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    name TEXT NOT NULL,
    description TEXT,
    type court_type NOT NULL,
    surface court_surface NOT NULL,
    
    -- Location Information
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state_province TEXT,
    country TEXT NOT NULL DEFAULT 'Philippines',
    postal_code TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    -- Court Details
    number_of_courts INTEGER NOT NULL DEFAULT 1,
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[], -- e.g., ['lights', 'equipment']
    
    -- Hours of Operation (JSON)
    -- Structure: { "mon": {"open": "06:00", "close": "22:00"}, ... }
    hours_of_operation JSONB DEFAULT '{}',
    
    -- Pricing & Booking
    is_free BOOLEAN DEFAULT FALSE,
    price_per_hour NUMERIC(10, 2),
    peak_hour_price NUMERIC(10, 2),
    pricing_details TEXT,
    requires_booking BOOLEAN DEFAULT FALSE,
    booking_url TEXT,
    
    -- Contact Information
    phone_number TEXT,
    email TEXT,
    website TEXT,
    
    -- Media
    cover_image TEXT,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Moderation & Status
    status court_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Features
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Statistics
    rating NUMERIC(3, 1) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_courts_owner_id ON courts(owner_id);
CREATE INDEX IF NOT EXISTS idx_courts_status ON courts(status);
CREATE INDEX IF NOT EXISTS idx_courts_city ON courts(city);
CREATE INDEX IF NOT EXISTS idx_courts_type ON courts(type);
CREATE INDEX IF NOT EXISTS idx_courts_is_active ON courts(is_active);
CREATE INDEX IF NOT EXISTS idx_courts_created_at ON courts(created_at DESC);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policy - SELECT: Anyone can view active, approved courts
CREATE POLICY courts_select_active ON courts 
FOR SELECT 
USING (is_active = TRUE AND status = 'approved' AND deleted_at IS NULL);

-- 8. RLS Policy - SELECT: Admins and court owners see all courts (including pending)
CREATE POLICY courts_select_all_admin ON courts 
FOR SELECT 
USING (
    auth.jwt() ->> 'user_role' = 'admin' 
    OR owner_id = auth.uid()
);

-- 9. RLS Policy - INSERT: Authenticated users can create courts
CREATE POLICY courts_insert ON courts 
FOR INSERT 
WITH CHECK (owner_id = auth.uid());

-- 10. RLS Policy - UPDATE: Admins and owners can update their courts
CREATE POLICY courts_update ON courts 
FOR UPDATE 
USING (auth.jwt() ->> 'user_role' = 'admin' OR owner_id = auth.uid())
WITH CHECK (auth.jwt() ->> 'user_role' = 'admin' OR owner_id = auth.uid());

-- 11. RLS Policy - DELETE: Only admins can soft-delete courts
CREATE POLICY courts_delete ON courts 
FOR UPDATE 
USING (auth.jwt() ->> 'user_role' = 'admin')
WITH CHECK (auth.jwt() ->> 'user_role' = 'admin');

-- 12. Updated_at Trigger
CREATE OR REPLACE FUNCTION update_courts_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS courts_update_timestamp ON courts;
CREATE TRIGGER courts_update_timestamp
BEFORE UPDATE ON courts
FOR EACH ROW
EXECUTE FUNCTION update_courts_timestamp();
