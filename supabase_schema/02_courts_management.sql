-- =====================================================
-- PICKLEPLAY - COURT MANAGEMENT
-- =====================================================
-- This file creates all tables related to court management
-- Run this in Supabase SQL Editor AFTER 01_authentication_user_management.sql

-- =====================================================
-- COURTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.courts (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('indoor', 'outdoor', 'both')),
    surface VARCHAR(30) NOT NULL CHECK (surface IN ('concrete', 'asphalt', 'sport_court', 'wood', 'other')),
    number_of_courts INTEGER NOT NULL CHECK (number_of_courts >= 1),
    
    -- Location Fields
    address VARCHAR(500) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state_province VARCHAR(255),
    country VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8) CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11, 8) CHECK (longitude BETWEEN -180 AND 180),
    
    -- Amenities & Features
    amenities JSONB, -- Array: ['parking', 'restrooms', 'water', 'lighting', 'seating', 'pro_shop', 'locker_rooms']
    hours_of_operation JSONB, -- Object: { "monday": "6am-10pm", "tuesday": "6am-10pm", ... }
    
    -- Pricing Fields
    is_free BOOLEAN DEFAULT FALSE,
    price_per_hour DECIMAL(8, 2),
    peak_hour_price DECIMAL(8, 2),
    currency VARCHAR(3) DEFAULT 'PHP',
    
    -- Contact Information
    phone_number VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    booking_url VARCHAR(255),
    requires_booking BOOLEAN DEFAULT FALSE,
    
    -- Media Fields
    images JSONB, -- Array of image paths
    cover_image TEXT,
    
    -- Status & Approval
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Statistics
    view_count INTEGER DEFAULT 0,
    total_bookings INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    
    -- Visibility
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add indexes for courts
CREATE INDEX idx_courts_owner_id ON public.courts(owner_id);
CREATE INDEX idx_courts_status ON public.courts(status);
CREATE INDEX idx_courts_city ON public.courts(city);
CREATE INDEX idx_courts_country ON public.courts(country);
CREATE INDEX idx_courts_location ON public.courts USING gist (
    point(longitude, latitude)
);
CREATE INDEX idx_courts_is_active ON public.courts(is_active);
CREATE INDEX idx_courts_is_featured ON public.courts(is_featured);
CREATE INDEX idx_courts_rating ON public.courts(rating);
CREATE INDEX idx_courts_created_at ON public.courts(created_at);
CREATE INDEX idx_courts_deleted_at ON public.courts(deleted_at) WHERE deleted_at IS NULL;

-- Add full-text search index
CREATE INDEX idx_courts_search ON public.courts USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(city, ''))
);

-- Add RLS policies for courts
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view approved active courts"
    ON public.courts FOR SELECT
    USING (status = 'approved' AND is_active = TRUE AND deleted_at IS NULL);

CREATE POLICY "Court owners can view their own courts"
    ON public.courts FOR SELECT
    USING (auth.uid() = owner_id);

CREATE POLICY "Court owners can create courts"
    ON public.courts FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Court owners can update their own courts"
    ON public.courts FOR UPDATE
    USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all courts"
    ON public.courts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can update any court"
    ON public.courts FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- COURT AMENITIES TABLE (Normalized)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.court_amenities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    icon TEXT, -- Icon name or path
    description TEXT,
    category VARCHAR(50), -- e.g., 'facility', 'service', 'equipment'
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default amenities
INSERT INTO public.court_amenities (name, slug, category, display_order) VALUES
    ('Parking', 'parking', 'facility', 1),
    ('Restrooms', 'restrooms', 'facility', 2),
    ('Water Fountain', 'water', 'facility', 3),
    ('Night Lighting', 'lighting', 'facility', 4),
    ('Seating Area', 'seating', 'facility', 5),
    ('Pro Shop', 'pro_shop', 'service', 6),
    ('Locker Rooms', 'locker_rooms', 'facility', 7),
    ('Equipment Rental', 'equipment_rental', 'service', 8),
    ('Coaching Available', 'coaching', 'service', 9),
    ('Food & Beverage', 'food_beverage', 'service', 10),
    ('WiFi', 'wifi', 'facility', 11),
    ('Air Conditioning', 'air_conditioning', 'facility', 12),
    ('Covered Courts', 'covered', 'facility', 13),
    ('Spectator Seating', 'spectator_seating', 'facility', 14),
    ('Shower Facilities', 'showers', 'facility', 15)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- COURT AMENITY RELATIONS (Junction Table)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.court_amenity_relations (
    id BIGSERIAL PRIMARY KEY,
    court_id BIGINT NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    amenity_id BIGINT NOT NULL REFERENCES public.court_amenities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(court_id, amenity_id)
);

-- Add indexes
CREATE INDEX idx_court_amenity_relations_court ON public.court_amenity_relations(court_id);
CREATE INDEX idx_court_amenity_relations_amenity ON public.court_amenity_relations(amenity_id);

-- =====================================================
-- COURT IMAGES TABLE (Normalized)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.court_images (
    id BIGSERIAL PRIMARY KEY,
    court_id BIGINT NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    width INTEGER,
    height INTEGER,
    file_size INTEGER, -- in bytes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_court_images_court_id ON public.court_images(court_id);
CREATE INDEX idx_court_images_is_cover ON public.court_images(is_cover);

-- Add RLS policies
ALTER TABLE public.court_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view court images for approved courts"
    ON public.court_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courts
            WHERE courts.id = court_images.court_id
            AND courts.status = 'approved'
            AND courts.is_active = TRUE
        )
    );

CREATE POLICY "Court owners can manage their court images"
    ON public.court_images FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.courts
            WHERE courts.id = court_images.court_id
            AND courts.owner_id = auth.uid()
        )
    );

-- =====================================================
-- SAVED COURTS TABLE (User Favorites)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.saved_courts (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    court_id BIGINT NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, court_id)
);

-- Add indexes
CREATE INDEX idx_saved_courts_user_id ON public.saved_courts(user_id);
CREATE INDEX idx_saved_courts_court_id ON public.saved_courts(court_id);

-- Add RLS policies
ALTER TABLE public.saved_courts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their saved courts"
    ON public.saved_courts FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON public.courts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_court_amenities_updated_at BEFORE UPDATE ON public.court_amenities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment court view count
CREATE OR REPLACE FUNCTION increment_court_views(court_id_param BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE public.courts
    SET view_count = view_count + 1
    WHERE id = court_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update court rating
CREATE OR REPLACE FUNCTION update_court_rating(court_id_param BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE public.courts
    SET 
        rating = (
            SELECT COALESCE(AVG(overall_rating), 0)
            FROM public.court_reviews
            WHERE court_id = court_id_param
            AND status = 'published'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM public.court_reviews
            WHERE court_id = court_id_param
            AND status = 'published'
        )
    WHERE id = court_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.courts IS 'Pickleball court listings';
COMMENT ON TABLE public.court_amenities IS 'Available amenities that courts can have';
COMMENT ON TABLE public.court_amenity_relations IS 'Junction table linking courts to their amenities';
COMMENT ON TABLE public.court_images IS 'Images for court listings';
COMMENT ON TABLE public.saved_courts IS 'User favorite/bookmarked courts';
