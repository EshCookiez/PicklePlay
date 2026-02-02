-- =====================================================
-- PICKLEPLAY - SHOP, PAYMENTS, EVENTS & SEARCH
-- =====================================================
-- This file creates tables for shop, payments, events, news, and search features
-- Run this in Supabase SQL Editor AFTER 08_reviews_ratings.sql

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.products (
    id BIGSERIAL PRIMARY KEY,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    
    -- Category & Type
    category VARCHAR(50) NOT NULL
        CHECK (category IN ('paddles', 'balls', 'apparel', 'accessories', 'equipment', 'other')),
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    sale_price DECIMAL(10, 2) CHECK (sale_price >= 0),
    currency VARCHAR(3) DEFAULT 'PHP',
    cost_price DECIMAL(10, 2), -- For profit calculation
    
    -- Inventory
    sku VARCHAR(100) UNIQUE NOT NULL,
    stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    is_in_stock BOOLEAN DEFAULT TRUE,
    track_inventory BOOLEAN DEFAULT TRUE,
    
    -- Product Details
    weight DECIMAL(8, 2), -- In grams
    dimensions JSONB, -- Object: { "length": 40, "width": 20, "height": 5 }
    color VARCHAR(50),
    size VARCHAR(50),
    material VARCHAR(100),
    
    -- Variants
    has_variants BOOLEAN DEFAULT FALSE,
    variants JSONB, -- Array of variant objects
    
    -- Media
    images JSONB, -- Array of image paths
    featured_image TEXT,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    meta_keywords VARCHAR(255),
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    is_on_sale BOOLEAN DEFAULT FALSE,
    
    -- Statistics
    view_count INTEGER DEFAULT 0,
    sales_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_products_is_featured ON public.products(is_featured);
CREATE INDEX idx_products_is_on_sale ON public.products(is_on_sale);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_rating ON public.products(rating);
CREATE INDEX idx_products_deleted_at ON public.products(deleted_at) WHERE deleted_at IS NULL;

-- Full-text search
CREATE INDEX idx_products_search ON public.products USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '') || ' ' || coalesce(brand, ''))
);

-- Add RLS policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published products"
    ON public.products FOR SELECT
    USING (status = 'published' AND deleted_at IS NULL);

-- =====================================================
-- SHOPPING CART TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.shopping_cart (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- Nullable for guest carts
    session_id VARCHAR(255), -- For guest users
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id BIGINT, -- If product has variants
    quantity INTEGER NOT NULL CHECK (quantity > 0) DEFAULT 1,
    price_at_time DECIMAL(10, 2) NOT NULL, -- Price when added to cart
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, product_id, variant_id)
);

-- Add indexes
CREATE INDEX idx_shopping_cart_user ON public.shopping_cart(user_id);
CREATE INDEX idx_shopping_cart_session ON public.shopping_cart(session_id);
CREATE INDEX idx_shopping_cart_product ON public.shopping_cart(product_id);

-- Add RLS policies
ALTER TABLE public.shopping_cart ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cart"
    ON public.shopping_cart FOR ALL
    USING (auth.uid() = user_id);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Order Status
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(30) DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partially_refunded')),
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    
    -- Shipping Information
    shipping_first_name VARCHAR(255) NOT NULL,
    shipping_last_name VARCHAR(255) NOT NULL,
    shipping_address VARCHAR(500) NOT NULL,
    shipping_city VARCHAR(255) NOT NULL,
    shipping_state VARCHAR(255),
    shipping_country VARCHAR(255) NOT NULL,
    shipping_postal_code VARCHAR(20),
    shipping_phone VARCHAR(20) NOT NULL,
    shipping_email VARCHAR(255) NOT NULL,
    
    -- Billing Information
    billing_first_name VARCHAR(255) NOT NULL,
    billing_last_name VARCHAR(255) NOT NULL,
    billing_address VARCHAR(500) NOT NULL,
    billing_city VARCHAR(255) NOT NULL,
    billing_state VARCHAR(255),
    billing_country VARCHAR(255) NOT NULL,
    billing_postal_code VARCHAR(20),
    
    -- Payment Information
    payment_method VARCHAR(50),
    payment_transaction_id VARCHAR(255),
    paid_at TIMESTAMPTZ,
    
    -- Shipping
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Notes
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Cancellation/Refund
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    refunded_at TIMESTAMPTZ,
    refund_amount DECIMAL(10, 2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_orders_user ON public.orders(user_id);
CREATE INDEX idx_orders_number ON public.orders(order_number);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Add RLS policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_id BIGINT,
    
    -- Product Details (snapshot at time of order)
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    variant_details JSONB, -- Color, size, etc.
    
    -- Pricing
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.payments (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Polymorphic - can be linked to Order, Booking, Tournament, etc.
    payable_type VARCHAR(100) NOT NULL, -- Order, Booking, Tournament, etc.
    payable_id BIGINT NOT NULL,
    
    -- Payment Details
    payment_method VARCHAR(50) NOT NULL
        CHECK (payment_method IN ('credit_card', 'debit_card', 'gcash', 'maya', 'paymaya', 'grabpay', 'shopeepay', 'bank_transfer', 'cash', 'wallet')),
    payment_gateway VARCHAR(50) NOT NULL, -- xendit, stripe, etc.
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    gateway_transaction_id VARCHAR(255),
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    fee_amount DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_status VARCHAR(30) DEFAULT 'authorized'
        CHECK (payment_status IN ('authorized', 'captured', 'refunded', 'partially_refunded')),
    
    -- Card Details (if applicable, should be encrypted)
    card_last_four VARCHAR(4),
    card_brand VARCHAR(50),
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    -- Timestamps
    authorized_at TIMESTAMPTZ,
    captured_at TIMESTAMPTZ,
    failed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    
    -- Error Handling
    error_code VARCHAR(50),
    error_message TEXT,
    
    -- Metadata
    metadata JSONB,
    ip_address VARCHAR(45),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_payments_user ON public.payments(user_id);
CREATE INDEX idx_payments_payable ON public.payments(payable_type, payable_id);
CREATE INDEX idx_payments_transaction ON public.payments(transaction_id);
CREATE INDEX idx_payments_gateway_transaction ON public.payments(gateway_transaction_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_payment_status ON public.payments(payment_status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);

-- Add RLS policies
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
    ON public.payments FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- TRANSACTIONS LOG TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions_log (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    payment_id BIGINT REFERENCES public.payments(id) ON DELETE SET NULL,
    
    -- Transaction Details
    type VARCHAR(30) NOT NULL
        CHECK (type IN ('payment', 'refund', 'credit', 'debit', 'transfer', 'fee')),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    
    -- Description
    description VARCHAR(500) NOT NULL,
    reference_type VARCHAR(100), -- Polymorphic
    reference_id BIGINT, -- Polymorphic
    
    -- Status
    status VARCHAR(30) DEFAULT 'completed'
        CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    
    -- Metadata
    metadata JSONB,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_transactions_log_user ON public.transactions_log(user_id);
CREATE INDEX idx_transactions_log_payment ON public.transactions_log(payment_id);
CREATE INDEX idx_transactions_log_type ON public.transactions_log(type);
CREATE INDEX idx_transactions_log_reference ON public.transactions_log(reference_type, reference_id);
CREATE INDEX idx_transactions_log_created_at ON public.transactions_log(created_at DESC);

-- Add RLS policies
ALTER TABLE public.transactions_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
    ON public.transactions_log FOR SELECT
    USING (auth.uid() = user_id);

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    organizer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    
    -- Event Type
    type VARCHAR(30) NOT NULL
        CHECK (type IN ('tournament', 'social', 'training', 'clinic', 'league', 'other')),
    category VARCHAR(100),
    
    -- Date & Time
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    timezone VARCHAR(50) DEFAULT 'Asia/Manila',
    
    -- Location
    location_type VARCHAR(20) NOT NULL
        CHECK (location_type IN ('physical', 'online', 'hybrid')),
    venue_name VARCHAR(255),
    address VARCHAR(500),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8) CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11, 8) CHECK (longitude BETWEEN -180 AND 180),
    online_meeting_url VARCHAR(500),
    
    -- Registration
    registration_required BOOLEAN DEFAULT FALSE,
    registration_deadline TIMESTAMPTZ,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    registration_fee DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'PHP',
    
    -- Skill Level
    skill_level_required VARCHAR(30) DEFAULT 'all'
        CHECK (skill_level_required IN ('all', 'beginner', 'intermediate', 'advanced', 'professional')),
    age_restriction VARCHAR(100), -- e.g., "18+", "Under 16"
    
    -- Media
    featured_image TEXT,
    images JSONB,
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Contact
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Additional Info
    rules TEXT,
    prizes JSONB,
    sponsors JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CHECK (end_date >= start_date)
);

-- Add indexes
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_type ON public.events(type);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_is_featured ON public.events(is_featured);
CREATE INDEX idx_events_deleted_at ON public.events(deleted_at) WHERE deleted_at IS NULL;

-- Full-text search
CREATE INDEX idx_events_search ON public.events USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
);

-- Add RLS policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
    ON public.events FOR SELECT
    USING (status = 'published' AND deleted_at IS NULL);

CREATE POLICY "Organizers can manage their events"
    ON public.events FOR ALL
    USING (auth.uid() = organizer_id);

-- =====================================================
-- EVENT REGISTRATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Registration Details
    registration_date TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'attended', 'no_show')),
    payment_status VARCHAR(30)
        CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
    payment_id BIGINT REFERENCES public.payments(id) ON DELETE SET NULL,
    
    -- Participant Info
    team_name VARCHAR(255),
    partner_name VARCHAR(255),
    partner_email VARCHAR(255),
    
    -- Additional
    special_requests TEXT,
    dietary_restrictions VARCHAR(500),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Confirmation
    confirmation_code VARCHAR(20) UNIQUE NOT NULL,
    confirmed_at TIMESTAMPTZ,
    checked_in_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- Add indexes
CREATE INDEX idx_event_registrations_event ON public.event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON public.event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON public.event_registrations(status);
CREATE INDEX idx_event_registrations_confirmation ON public.event_registrations(confirmation_code);

-- Add RLS policies
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations"
    ON public.event_registrations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create registrations"
    ON public.event_registrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- NEWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.news (
    id BIGSERIAL PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Content
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt VARCHAR(500),
    content TEXT NOT NULL,
    
    -- Category
    category VARCHAR(30) NOT NULL
        CHECK (category IN ('announcement', 'update', 'event', 'tournament', 'tips', 'community', 'other')),
    tags JSONB, -- Array of tags
    
    -- Media
    featured_image TEXT,
    images JSONB,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description VARCHAR(500),
    
    -- Status
    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    
    -- Statistics
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX idx_news_author ON public.news(author_id);
CREATE INDEX idx_news_slug ON public.news(slug);
CREATE INDEX idx_news_category ON public.news(category);
CREATE INDEX idx_news_status ON public.news(status);
CREATE INDEX idx_news_published_at ON public.news(published_at DESC);
CREATE INDEX idx_news_is_featured ON public.news(is_featured);
CREATE INDEX idx_news_deleted_at ON public.news(deleted_at) WHERE deleted_at IS NULL;

-- Full-text search
CREATE INDEX idx_news_search ON public.news USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(excerpt, ''))
);

-- Add RLS policies
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news"
    ON public.news FOR SELECT
    USING (status = 'published' AND deleted_at IS NULL);

-- =====================================================
-- SEARCH HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.search_history (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE, -- Nullable for guest users
    session_id VARCHAR(255), -- For guest users
    
    -- Search Query
    search_query VARCHAR(500) NOT NULL,
    search_type VARCHAR(30) NOT NULL
        CHECK (search_type IN ('courts', 'players', 'coaches', 'tournaments', 'products', 'events', 'general')),
    
    -- Filters Applied
    filters JSONB, -- Object of filters applied
    
    -- Results
    results_count INTEGER DEFAULT 0,
    clicked_result_id BIGINT,
    clicked_result_type VARCHAR(100),
    
    -- Location context
    search_latitude DECIMAL(10, 8) CHECK (search_latitude BETWEEN -90 AND 90),
    search_longitude DECIMAL(11, 8) CHECK (search_longitude BETWEEN -180 AND 180),
    search_location VARCHAR(255),
    
    -- Metadata
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_search_history_user ON public.search_history(user_id);
CREATE INDEX idx_search_history_session ON public.search_history(session_id);
CREATE INDEX idx_search_history_type ON public.search_history(search_type);
CREATE INDEX idx_search_history_query ON public.search_history(search_query);
CREATE INDEX idx_search_history_created_at ON public.search_history(created_at DESC);

-- =====================================================
-- TAGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(30) DEFAULT 'general'
        CHECK (type IN ('court', 'player', 'coach', 'tournament', 'product', 'general')),
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_tags_slug ON public.tags(slug);
CREATE INDEX idx_tags_type ON public.tags(type);
CREATE INDEX idx_tags_usage_count ON public.tags(usage_count DESC);

-- =====================================================
-- TAGGABLES TABLE (Polymorphic)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.taggables (
    id BIGSERIAL PRIMARY KEY,
    tag_id BIGINT NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    taggable_type VARCHAR(100) NOT NULL, -- Court, Player, Coach, etc.
    taggable_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(tag_id, taggable_type, taggable_id)
);

-- Add indexes
CREATE INDEX idx_taggables_tag ON public.taggables(tag_id);
CREATE INDEX idx_taggables_taggable ON public.taggables(taggable_type, taggable_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_cart_updated_at BEFORE UPDATE ON public.shopping_cart
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON public.order_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON public.event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_num TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        order_num := 'ORD-' || to_char(NOW(), 'YYYYMMDD') || '-' || upper(substring(md5(random()::text) from 1 for 6));
        done := NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = order_num);
    END LOOP;
    RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
        NEW.order_number := generate_order_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Function to generate event registration confirmation code
CREATE OR REPLACE FUNCTION generate_event_confirmation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        code := 'EV-' || upper(substring(md5(random()::text) from 1 for 8));
        done := NOT EXISTS (SELECT 1 FROM public.event_registrations WHERE confirmation_code = code);
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate event confirmation code
CREATE OR REPLACE FUNCTION set_event_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL OR NEW.confirmation_code = '' THEN
        NEW.confirmation_code := generate_event_confirmation_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_event_confirmation_code_trigger
    BEFORE INSERT ON public.event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION set_event_confirmation_code();

-- Function to update event participant count
CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.events
        SET current_participants = current_participants + 1
        WHERE id = NEW.event_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.events
        SET current_participants = GREATEST(current_participants - 1, 0)
        WHERE id = OLD.event_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
        UPDATE public.events
        SET current_participants = (
            SELECT COUNT(*)
            FROM public.event_registrations
            WHERE event_id = NEW.event_id
            AND status IN ('confirmed', 'attended')
        )
        WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_participant_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_event_participant_count();

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.tags
        SET usage_count = usage_count + 1
        WHERE id = NEW.tag_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.tags
        SET usage_count = GREATEST(usage_count - 1, 0)
        WHERE id = OLD.tag_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tag_usage_count_trigger
    AFTER INSERT OR DELETE ON public.taggables
    FOR EACH ROW
    EXECUTE FUNCTION update_tag_usage_count();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.products IS 'Shop products/merchandise';
COMMENT ON TABLE public.shopping_cart IS 'User shopping carts';
COMMENT ON TABLE public.orders IS 'Customer orders';
COMMENT ON TABLE public.order_items IS 'Items within orders';
COMMENT ON TABLE public.payments IS 'Payment transactions';
COMMENT ON TABLE public.transactions_log IS 'Financial transaction history';
COMMENT ON TABLE public.events IS 'Events and activities';
COMMENT ON TABLE public.event_registrations IS 'Event participant registrations';
COMMENT ON TABLE public.news IS 'News articles and announcements';
COMMENT ON TABLE public.search_history IS 'User search queries';
COMMENT ON TABLE public.tags IS 'Tags for categorization';
COMMENT ON TABLE public.taggables IS 'Polymorphic tag associations';
