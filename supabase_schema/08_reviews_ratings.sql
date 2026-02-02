-- =====================================================
-- PICKLEPLAY - REVIEWS & RATINGS SYSTEM
-- =====================================================
-- This file creates all tables related to reviews and ratings
-- Run this in Supabase SQL Editor AFTER 07_community_features.sql

-- =====================================================
-- COURT REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.court_reviews (
    id BIGSERIAL PRIMARY KEY,
    court_id BIGINT NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id BIGINT REFERENCES public.bookings(id) ON DELETE SET NULL,
    
    -- Rating
    overall_rating DECIMAL(3, 2) NOT NULL CHECK (overall_rating BETWEEN 0 AND 5),
    cleanliness_rating DECIMAL(3, 2) CHECK (cleanliness_rating BETWEEN 0 AND 5),
    facility_rating DECIMAL(3, 2) CHECK (facility_rating BETWEEN 0 AND 5),
    staff_rating DECIMAL(3, 2) CHECK (staff_rating BETWEEN 0 AND 5),
    value_rating DECIMAL(3, 2) CHECK (value_rating BETWEEN 0 AND 5),
    
    -- Review
    title VARCHAR(255),
    review TEXT NOT NULL,
    pros TEXT,
    cons TEXT,
    
    -- Media
    photos JSONB, -- Array of photo paths
    
    -- Helpful
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    -- Visit Info
    visit_date DATE,
    would_recommend BOOLEAN DEFAULT TRUE,
    
    -- Response
    owner_response TEXT,
    owner_response_date TIMESTAMPTZ,
    
    -- Moderation
    is_verified_visit BOOLEAN DEFAULT FALSE, -- Based on booking
    status VARCHAR(20) DEFAULT 'published'
        CHECK (status IN ('pending', 'published', 'hidden', 'flagged')),
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(court_id, user_id, booking_id)
);

-- Add indexes
CREATE INDEX idx_court_reviews_court ON public.court_reviews(court_id);
CREATE INDEX idx_court_reviews_user ON public.court_reviews(user_id);
CREATE INDEX idx_court_reviews_booking ON public.court_reviews(booking_id);
CREATE INDEX idx_court_reviews_status ON public.court_reviews(status);
CREATE INDEX idx_court_reviews_rating ON public.court_reviews(overall_rating);
CREATE INDEX idx_court_reviews_created_at ON public.court_reviews(created_at DESC);

-- Full-text search
CREATE INDEX idx_court_reviews_search ON public.court_reviews USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(review, ''))
);

-- Add RLS policies
ALTER TABLE public.court_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published court reviews"
    ON public.court_reviews FOR SELECT
    USING (status = 'published');

CREATE POLICY "Users can view their own reviews"
    ON public.court_reviews FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews"
    ON public.court_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.court_reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Court owners can respond to reviews"
    ON public.court_reviews FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.courts
            WHERE courts.id = court_reviews.court_id
            AND courts.owner_id = auth.uid()
        )
    );

-- =====================================================
-- COACH REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.coach_reviews (
    id BIGSERIAL PRIMARY KEY,
    coach_id BIGINT NOT NULL REFERENCES public.coaches(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_id BIGINT REFERENCES public.coaching_sessions(id) ON DELETE SET NULL,
    
    -- Rating
    overall_rating DECIMAL(3, 2) NOT NULL CHECK (overall_rating BETWEEN 0 AND 5),
    teaching_quality DECIMAL(3, 2) CHECK (teaching_quality BETWEEN 0 AND 5),
    communication DECIMAL(3, 2) CHECK (communication BETWEEN 0 AND 5),
    professionalism DECIMAL(3, 2) CHECK (professionalism BETWEEN 0 AND 5),
    value_for_money DECIMAL(3, 2) CHECK (value_for_money BETWEEN 0 AND 5),
    
    -- Review
    title VARCHAR(255),
    review TEXT NOT NULL,
    what_i_learned TEXT,
    
    -- Helpful
    helpful_count INTEGER DEFAULT 0,
    
    -- Recommendation
    would_recommend BOOLEAN DEFAULT TRUE,
    skill_improvement VARCHAR(30) CHECK (skill_improvement IN ('significant', 'moderate', 'minimal', 'none')),
    
    -- Response
    coach_response TEXT,
    coach_response_date TIMESTAMPTZ,
    
    -- Moderation
    is_verified_session BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'published'
        CHECK (status IN ('pending', 'published', 'hidden')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(coach_id, user_id, session_id)
);

-- Add indexes
CREATE INDEX idx_coach_reviews_coach ON public.coach_reviews(coach_id);
CREATE INDEX idx_coach_reviews_user ON public.coach_reviews(user_id);
CREATE INDEX idx_coach_reviews_session ON public.coach_reviews(session_id);
CREATE INDEX idx_coach_reviews_status ON public.coach_reviews(status);
CREATE INDEX idx_coach_reviews_rating ON public.coach_reviews(overall_rating);
CREATE INDEX idx_coach_reviews_created_at ON public.coach_reviews(created_at DESC);

-- Full-text search
CREATE INDEX idx_coach_reviews_search ON public.coach_reviews USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(review, ''))
);

-- Add RLS policies
ALTER TABLE public.coach_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published coach reviews"
    ON public.coach_reviews FOR SELECT
    USING (status = 'published');

CREATE POLICY "Users can view their own reviews"
    ON public.coach_reviews FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create coach reviews"
    ON public.coach_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.coach_reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Coaches can respond to reviews"
    ON public.coach_reviews FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.coaches
            WHERE coaches.id = coach_reviews.coach_id
            AND coaches.user_id = auth.uid()
        )
    );

-- =====================================================
-- PRODUCT REVIEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    order_id BIGINT, -- Will be linked to orders table
    
    -- Rating
    rating DECIMAL(3, 2) NOT NULL CHECK (rating BETWEEN 0 AND 5),
    quality_rating DECIMAL(3, 2) CHECK (quality_rating BETWEEN 0 AND 5),
    value_rating DECIMAL(3, 2) CHECK (value_rating BETWEEN 0 AND 5),
    
    -- Review
    title VARCHAR(255),
    review TEXT NOT NULL,
    
    -- Media
    photos JSONB,
    videos JSONB,
    
    -- Helpful
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0,
    
    -- Purchase verification
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    would_recommend BOOLEAN DEFAULT TRUE,
    
    -- Moderation
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'published', 'hidden', 'flagged')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_product_reviews_product ON public.product_reviews(product_id);
CREATE INDEX idx_product_reviews_user ON public.product_reviews(user_id);
CREATE INDEX idx_product_reviews_order ON public.product_reviews(order_id);
CREATE INDEX idx_product_reviews_status ON public.product_reviews(status);
CREATE INDEX idx_product_reviews_rating ON public.product_reviews(rating);
CREATE INDEX idx_product_reviews_verified ON public.product_reviews(is_verified_purchase);
CREATE INDEX idx_product_reviews_created_at ON public.product_reviews(created_at DESC);

-- Full-text search
CREATE INDEX idx_product_reviews_search ON public.product_reviews USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(review, ''))
);

-- Add RLS policies
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published product reviews"
    ON public.product_reviews FOR SELECT
    USING (status = 'published');

CREATE POLICY "Users can view their own reviews"
    ON public.product_reviews FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create product reviews"
    ON public.product_reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.product_reviews FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- REVIEW HELPFUL VOTES TABLE (Polymorphic)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
    id BIGSERIAL PRIMARY KEY,
    review_type VARCHAR(50) NOT NULL, -- CourtReview, CoachReview, ProductReview
    review_id BIGINT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL, -- true = helpful, false = not helpful
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(review_type, review_id, user_id)
);

-- Add indexes
CREATE INDEX idx_review_votes_review ON public.review_helpful_votes(review_type, review_id);
CREATE INDEX idx_review_votes_user ON public.review_helpful_votes(user_id);

-- Add RLS policies
ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own helpful votes"
    ON public.review_helpful_votes FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_court_reviews_updated_at BEFORE UPDATE ON public.court_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coach_reviews_updated_at BEFORE UPDATE ON public.coach_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON public.product_reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update court rating when review is added/updated
CREATE OR REPLACE FUNCTION trigger_update_court_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.status = 'published') OR
       (TG_OP = 'UPDATE' AND (OLD.status != NEW.status OR OLD.overall_rating != NEW.overall_rating)) THEN
        PERFORM update_court_rating(NEW.court_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_court_rating_trigger
    AFTER INSERT OR UPDATE ON public.court_reviews
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_court_rating();

-- Trigger to update coach rating when review is added/updated
CREATE OR REPLACE FUNCTION trigger_update_coach_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT' AND NEW.status = 'published') OR
       (TG_OP = 'UPDATE' AND (OLD.status != NEW.status OR OLD.overall_rating != NEW.overall_rating)) THEN
        PERFORM update_coach_statistics(NEW.coach_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coach_rating_trigger
    AFTER INSERT OR UPDATE ON public.coach_reviews
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_coach_rating();

-- Function to update helpful vote counts
CREATE OR REPLACE FUNCTION update_review_helpful_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.is_helpful THEN
            IF NEW.review_type = 'CourtReview' THEN
                UPDATE public.court_reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
            ELSIF NEW.review_type = 'CoachReview' THEN
                UPDATE public.coach_reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
            ELSIF NEW.review_type = 'ProductReview' THEN
                UPDATE public.product_reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
            END IF;
        ELSE
            IF NEW.review_type IN ('CourtReview', 'ProductReview') THEN
                IF NEW.review_type = 'CourtReview' THEN
                    UPDATE public.court_reviews SET not_helpful_count = not_helpful_count + 1 WHERE id = NEW.review_id;
                ELSIF NEW.review_type = 'ProductReview' THEN
                    UPDATE public.product_reviews SET not_helpful_count = not_helpful_count + 1 WHERE id = NEW.review_id;
                END IF;
            END IF;
        END IF;
    ELSIF TG_OP = 'UPDATE' AND OLD.is_helpful != NEW.is_helpful THEN
        -- Handle vote change
        IF OLD.is_helpful THEN
            IF NEW.review_type = 'CourtReview' THEN
                UPDATE public.court_reviews SET helpful_count = GREATEST(helpful_count - 1, 0), not_helpful_count = not_helpful_count + 1 WHERE id = NEW.review_id;
            ELSIF NEW.review_type = 'CoachReview' THEN
                UPDATE public.coach_reviews SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = NEW.review_id;
            ELSIF NEW.review_type = 'ProductReview' THEN
                UPDATE public.product_reviews SET helpful_count = GREATEST(helpful_count - 1, 0), not_helpful_count = not_helpful_count + 1 WHERE id = NEW.review_id;
            END IF;
        ELSE
            IF NEW.review_type = 'CourtReview' THEN
                UPDATE public.court_reviews SET not_helpful_count = GREATEST(not_helpful_count - 1, 0), helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
            ELSIF NEW.review_type = 'CoachReview' THEN
                UPDATE public.coach_reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
            ELSIF NEW.review_type = 'ProductReview' THEN
                UPDATE public.product_reviews SET not_helpful_count = GREATEST(not_helpful_count - 1, 0), helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
            END IF;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.is_helpful THEN
            IF OLD.review_type = 'CourtReview' THEN
                UPDATE public.court_reviews SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = OLD.review_id;
            ELSIF OLD.review_type = 'CoachReview' THEN
                UPDATE public.coach_reviews SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = OLD.review_id;
            ELSIF OLD.review_type = 'ProductReview' THEN
                UPDATE public.product_reviews SET helpful_count = GREATEST(helpful_count - 1, 0) WHERE id = OLD.review_id;
            END IF;
        ELSE
            IF OLD.review_type IN ('CourtReview', 'ProductReview') THEN
                IF OLD.review_type = 'CourtReview' THEN
                    UPDATE public.court_reviews SET not_helpful_count = GREATEST(not_helpful_count - 1, 0) WHERE id = OLD.review_id;
                ELSIF OLD.review_type = 'ProductReview' THEN
                    UPDATE public.product_reviews SET not_helpful_count = GREATEST(not_helpful_count - 1, 0) WHERE id = OLD.review_id;
                END IF;
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_helpful_counts_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.review_helpful_votes
    FOR EACH ROW
    EXECUTE FUNCTION update_review_helpful_counts();

-- Trigger to verify booking-based reviews
CREATE OR REPLACE FUNCTION verify_court_review()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM public.bookings
            WHERE id = NEW.booking_id
            AND user_id = NEW.user_id
            AND court_id = NEW.court_id
            AND status = 'completed'
        ) THEN
            NEW.is_verified_visit := TRUE;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verify_court_review_trigger
    BEFORE INSERT OR UPDATE ON public.court_reviews
    FOR EACH ROW
    EXECUTE FUNCTION verify_court_review();

-- Trigger to verify session-based coach reviews
CREATE OR REPLACE FUNCTION verify_coach_review()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.session_id IS NOT NULL THEN
        IF EXISTS (
            SELECT 1 FROM public.coaching_sessions
            WHERE id = NEW.session_id
            AND student_id = NEW.user_id
            AND coach_id = NEW.coach_id
            AND status = 'completed'
        ) THEN
            NEW.is_verified_session := TRUE;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER verify_coach_review_trigger
    BEFORE INSERT OR UPDATE ON public.coach_reviews
    FOR EACH ROW
    EXECUTE FUNCTION verify_coach_review();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.court_reviews IS 'User reviews and ratings for courts';
COMMENT ON TABLE public.coach_reviews IS 'User reviews and ratings for coaches';
COMMENT ON TABLE public.product_reviews IS 'User reviews and ratings for products';
COMMENT ON TABLE public.review_helpful_votes IS 'Helpful votes on reviews';
