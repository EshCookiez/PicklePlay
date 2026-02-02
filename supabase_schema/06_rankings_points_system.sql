-- =====================================================
-- PICKLEPLAY - RANKINGS & POINTS SYSTEM
-- =====================================================
-- This file creates all tables related to player rankings and points
-- Run this in Supabase SQL Editor AFTER 05_coaching_system.sql

-- =====================================================
-- PLAYER RANKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.player_rankings (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Current Rankings
    overall_rank INTEGER,
    singles_rank INTEGER,
    doubles_rank INTEGER,
    mixed_doubles_rank INTEGER,
    
    -- Points
    total_points INTEGER DEFAULT 0,
    singles_points INTEGER DEFAULT 0,
    doubles_points INTEGER DEFAULT 0,
    mixed_doubles_points INTEGER DEFAULT 0,
    
    -- Previous Rankings (for trend)
    previous_overall_rank INTEGER,
    previous_singles_rank INTEGER,
    previous_doubles_rank INTEGER,
    rank_change INTEGER DEFAULT 0, -- Positive = up, Negative = down
    
    -- Regional Rankings
    regional_rank INTEGER,
    region VARCHAR(255),
    city_rank INTEGER,
    
    -- Division/Skill Level
    division VARCHAR(30) DEFAULT 'beginner'
        CHECK (division IN ('beginner', 'intermediate', 'advanced', 'professional', 'elite')),
    skill_rating DECIMAL(4, 2), -- DUPR or similar rating
    
    -- Statistics
    tournaments_played INTEGER DEFAULT 0,
    tournaments_won INTEGER DEFAULT 0,
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    win_rate DECIMAL(5, 2) DEFAULT 0.00,
    
    -- Last Updated
    last_tournament_date DATE,
    last_ranking_update TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'retired')),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_player_rankings_user ON public.player_rankings(user_id);
CREATE INDEX IF NOT EXISTS idx_player_rankings_overall_rank ON public.player_rankings(overall_rank);
CREATE INDEX IF NOT EXISTS idx_player_rankings_singles_rank ON public.player_rankings(singles_rank);
CREATE INDEX IF NOT EXISTS idx_player_rankings_doubles_rank ON public.player_rankings(doubles_rank);
CREATE INDEX IF NOT EXISTS idx_player_rankings_division ON public.player_rankings(division);
CREATE INDEX IF NOT EXISTS idx_player_rankings_region ON public.player_rankings(region);
CREATE INDEX IF NOT EXISTS idx_player_rankings_is_active ON public.player_rankings(is_active);
CREATE INDEX IF NOT EXISTS idx_player_rankings_total_points ON public.player_rankings(total_points);

-- Add RLS policies
ALTER TABLE public.player_rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view player rankings"
    ON public.player_rankings FOR SELECT
    USING (is_active = TRUE);

CREATE POLICY "Users can view their own ranking"
    ON public.player_rankings FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- POINTS TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.points_transactions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Transaction Type
    type VARCHAR(30) NOT NULL
        CHECK (type IN ('earned', 'redeemed', 'bonus', 'penalty', 'expired', 'adjusted')),
    source VARCHAR(30) NOT NULL
        CHECK (source IN ('tournament', 'contest', 'referral', 'purchase', 'admin', 'event', 'achievement')),
    
    -- Points
    points INTEGER NOT NULL,
    balance_before INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    
    -- Reference
    reference_type VARCHAR(100), -- Polymorphic: Tournament, Contest, etc.
    reference_id BIGINT, -- Polymorphic ID
    description VARCHAR(500) NOT NULL,
    
    -- Expiration
    expires_at TIMESTAMPTZ,
    expired BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    metadata JSONB,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_points_transactions_user ON public.points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_type ON public.points_transactions(type);
CREATE INDEX IF NOT EXISTS idx_points_transactions_source ON public.points_transactions(source);
CREATE INDEX IF NOT EXISTS idx_points_transactions_reference ON public.points_transactions(reference_type, reference_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_created_at ON public.points_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_points_transactions_expires_at ON public.points_transactions(expires_at);
CREATE INDEX IF NOT EXISTS idx_points_transactions_expired ON public.points_transactions(expired);

-- Add RLS policies
ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own points transactions"
    ON public.points_transactions FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- REWARDS CATALOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.rewards_catalog (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    
    -- Type
    reward_type VARCHAR(30) NOT NULL
        CHECK (reward_type IN ('physical', 'digital', 'discount', 'voucher', 'premium_feature', 'merchandise')),
    category VARCHAR(100),
    
    -- Points
    points_required INTEGER NOT NULL CHECK (points_required > 0),
    
    -- Inventory
    stock_quantity INTEGER, -- Null = unlimited
    is_in_stock BOOLEAN DEFAULT TRUE,
    total_redeemed INTEGER DEFAULT 0,
    
    -- Limits
    limit_per_user INTEGER,
    daily_limit INTEGER,
    
    -- Media
    image TEXT,
    images JSONB,
    
    -- Terms
    terms_and_conditions TEXT,
    redemption_instructions TEXT,
    
    -- Availability
    available_from TIMESTAMPTZ,
    available_until TIMESTAMPTZ,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active'
        CHECK (status IN ('active', 'inactive', 'out_of_stock', 'expired')),
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_rewards_catalog_status ON public.rewards_catalog(status);
CREATE INDEX IF NOT EXISTS idx_rewards_catalog_type ON public.rewards_catalog(reward_type);
CREATE INDEX IF NOT EXISTS idx_rewards_catalog_category ON public.rewards_catalog(category);
CREATE INDEX IF NOT EXISTS idx_rewards_catalog_points ON public.rewards_catalog(points_required);
CREATE INDEX IF NOT EXISTS idx_rewards_catalog_is_featured ON public.rewards_catalog(is_featured);
CREATE INDEX IF NOT EXISTS idx_rewards_catalog_display_order ON public.rewards_catalog(display_order);
CREATE INDEX IF NOT EXISTS idx_rewards_catalog_availability ON public.rewards_catalog(available_from, available_until);

-- Add RLS policies
ALTER TABLE public.rewards_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active rewards"
    ON public.rewards_catalog FOR SELECT
    USING (
        status = 'active'
        AND is_in_stock = TRUE
        AND (available_from IS NULL OR available_from <= NOW())
        AND (available_until IS NULL OR available_until >= NOW())
    );

-- =====================================================
-- REWARD REDEMPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reward_id BIGINT NOT NULL REFERENCES public.rewards_catalog(id) ON DELETE CASCADE,
    points_transaction_id BIGINT NOT NULL REFERENCES public.points_transactions(id) ON DELETE CASCADE,
    
    -- Redemption Details
    points_spent INTEGER NOT NULL,
    redemption_code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'fulfilled', 'shipped', 'delivered', 'cancelled')),
    
    -- Fulfillment
    fulfilled_at TIMESTAMPTZ,
    fulfilled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Shipping (if applicable)
    shipping_address JSONB,
    tracking_number VARCHAR(255),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Notes
    user_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_user ON public.reward_redemptions(user_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_reward ON public.reward_redemptions(reward_id);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_status ON public.reward_redemptions(status);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_code ON public.reward_redemptions(redemption_code);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_created_at ON public.reward_redemptions(created_at);

-- Add RLS policies
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own redemptions"
    ON public.reward_redemptions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create redemptions"
    ON public.reward_redemptions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- PLAYER ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.player_achievements (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Achievement Details
    achievement_type VARCHAR(50) NOT NULL, -- first_tournament, 10_wins, etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon TEXT,
    
    -- Points Awarded
    points_awarded INTEGER DEFAULT 0,
    
    -- Badge Details
    badge_image TEXT,
    badge_level VARCHAR(20), -- bronze, silver, gold, platinum
    
    -- Progress (for multi-step achievements)
    current_progress INTEGER DEFAULT 0,
    required_progress INTEGER,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_type)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_player_achievements_user ON public.player_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_player_achievements_type ON public.player_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_player_achievements_completed ON public.player_achievements(is_completed);
CREATE INDEX IF NOT EXISTS idx_player_achievements_completed_at ON public.player_achievements(completed_at);

-- Add RLS policies
ALTER TABLE public.player_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own achievements"
    ON public.player_achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view other users' completed achievements"
    ON public.player_achievements FOR SELECT
    USING (is_completed = TRUE);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_player_rankings_updated_at BEFORE UPDATE ON public.player_rankings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_catalog_updated_at BEFORE UPDATE ON public.rewards_catalog
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reward_redemptions_updated_at BEFORE UPDATE ON public.reward_redemptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_player_achievements_updated_at BEFORE UPDATE ON public.player_achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to add points to user
CREATE OR REPLACE FUNCTION add_user_points(
    p_user_id UUID,
    p_points INTEGER,
    p_type VARCHAR(30),
    p_source VARCHAR(30),
    p_description VARCHAR(500),
    p_reference_type VARCHAR(100) DEFAULT NULL,
    p_reference_id BIGINT DEFAULT NULL,
    p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    v_current_balance INTEGER;
    v_new_balance INTEGER;
    v_transaction_id BIGINT;
BEGIN
    -- Get current balance from player_rankings
    SELECT COALESCE(total_points, 0) INTO v_current_balance
    FROM public.player_rankings
    WHERE user_id = p_user_id;
    
    -- If no ranking record exists, create one
    IF NOT FOUND THEN
        INSERT INTO public.player_rankings (user_id, total_points)
        VALUES (p_user_id, 0)
        RETURNING total_points INTO v_current_balance;
    END IF;
    
    -- Calculate new balance
    v_new_balance := v_current_balance + p_points;
    
    -- Insert transaction record
    INSERT INTO public.points_transactions (
        user_id, type, source, points, balance_before, balance_after,
        reference_type, reference_id, description, expires_at
    )
    VALUES (
        p_user_id, p_type, p_source, p_points, v_current_balance, v_new_balance,
        p_reference_type, p_reference_id, p_description, p_expires_at
    )
    RETURNING id INTO v_transaction_id;
    
    -- Update player ranking with new balance
    UPDATE public.player_rankings
    SET total_points = v_new_balance,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN v_transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redeem reward
CREATE OR REPLACE FUNCTION redeem_reward(
    p_user_id UUID,
    p_reward_id BIGINT,
    p_shipping_address JSONB DEFAULT NULL,
    p_user_notes TEXT DEFAULT NULL
)
RETURNS BIGINT AS $$
DECLARE
    v_points_required INTEGER;
    v_current_points INTEGER;
    v_transaction_id BIGINT;
    v_redemption_id BIGINT;
    v_redemption_code VARCHAR(50);
BEGIN
    -- Get reward details
    SELECT points_required INTO v_points_required
    FROM public.rewards_catalog
    WHERE id = p_reward_id
    AND status = 'active'
    AND is_in_stock = TRUE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reward not available';
    END IF;
    
    -- Check user has enough points
    SELECT total_points INTO v_current_points
    FROM public.player_rankings
    WHERE user_id = p_user_id;
    
    IF v_current_points < v_points_required THEN
        RAISE EXCEPTION 'Insufficient points';
    END IF;
    
    -- Generate redemption code
    v_redemption_code := 'RW-' || upper(substring(md5(random()::text) from 1 for 10));
    
    -- Deduct points
    SELECT add_user_points(
        p_user_id,
        -v_points_required,
        'redeemed',
        'purchase',
        'Redeemed reward: ' || (SELECT name FROM public.rewards_catalog WHERE id = p_reward_id),
        'reward_redemption',
        p_reward_id
    ) INTO v_transaction_id;
    
    -- Create redemption record
    INSERT INTO public.reward_redemptions (
        user_id, reward_id, points_transaction_id, points_spent,
        redemption_code, shipping_address, user_notes
    )
    VALUES (
        p_user_id, p_reward_id, v_transaction_id, v_points_required,
        v_redemption_code, p_shipping_address, p_user_notes
    )
    RETURNING id INTO v_redemption_id;
    
    -- Update reward statistics
    UPDATE public.rewards_catalog
    SET total_redeemed = total_redeemed + 1,
        stock_quantity = CASE 
            WHEN stock_quantity IS NOT NULL THEN stock_quantity - 1
            ELSE NULL
        END,
        is_in_stock = CASE
            WHEN stock_quantity IS NOT NULL AND stock_quantity - 1 <= 0 THEN FALSE
            ELSE is_in_stock
        END
    WHERE id = p_reward_id;
    
    RETURN v_redemption_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to recalculate rankings
CREATE OR REPLACE FUNCTION recalculate_rankings()
RETURNS void AS $$
BEGIN
    -- Update overall rankings
    WITH ranked_players AS (
        SELECT user_id,
               ROW_NUMBER() OVER (ORDER BY total_points DESC, tournaments_won DESC, matches_won DESC) as new_rank
        FROM public.player_rankings
        WHERE is_active = TRUE
        AND status = 'active'
    )
    UPDATE public.player_rankings pr
    SET previous_overall_rank = pr.overall_rank,
        overall_rank = rp.new_rank,
        rank_change = COALESCE(pr.overall_rank, 0) - rp.new_rank,
        last_ranking_update = NOW()
    FROM ranked_players rp
    WHERE pr.user_id = rp.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.player_rankings IS 'Player ranking and statistics';
COMMENT ON TABLE public.points_transactions IS 'History of all points earned and spent';
COMMENT ON TABLE public.rewards_catalog IS 'Available rewards that can be redeemed with points';
COMMENT ON TABLE public.reward_redemptions IS 'User reward redemptions';
COMMENT ON TABLE public.player_achievements IS 'Player achievements and badges';
