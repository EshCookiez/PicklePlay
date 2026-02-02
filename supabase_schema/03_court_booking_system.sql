-- =====================================================
-- PICKLEPLAY - COURT BOOKING SYSTEM
-- =====================================================
-- This file creates all tables related to court bookings
-- Run this in Supabase SQL Editor AFTER 02_courts_management.sql

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    court_id BIGINT NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    
    -- Booking Details
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_hours DECIMAL(4, 2) NOT NULL,
    
    -- Participants
    number_of_players INTEGER CHECK (number_of_players BETWEEN 1 AND 4),
    player_names JSONB, -- Array of player names
    
    -- Pricing
    price_per_hour DECIMAL(8, 2) NOT NULL,
    total_price DECIMAL(8, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PHP',
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
    payment_status VARCHAR(30) DEFAULT 'unpaid'
        CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partially_refunded')),
    
    -- Cancellation
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancelled_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    
    -- Notes
    special_requests TEXT,
    admin_notes TEXT,
    
    -- Confirmation
    confirmation_code VARCHAR(20) UNIQUE NOT NULL,
    confirmed_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint: end_time must be after start_time
    CHECK (end_time > start_time)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_court_id ON public.bookings(court_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation_code ON public.bookings(confirmation_code);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON public.bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_court_date ON public.bookings(court_id, booking_date);

-- Add RLS policies
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
    ON public.bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
    ON public.bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
    ON public.bookings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Court owners can view bookings for their courts"
    ON public.bookings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.courts
            WHERE courts.id = bookings.court_id
            AND courts.owner_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all bookings"
    ON public.bookings FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );

-- =====================================================
-- AVAILABILITY SLOTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.availability_slots (
    id BIGSERIAL PRIMARY KEY,
    court_id BIGINT NOT NULL REFERENCES public.courts(id) ON DELETE CASCADE,
    
    -- Schedule
    day_of_week VARCHAR(20) NOT NULL
        CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Availability
    is_available BOOLEAN DEFAULT TRUE,
    price_per_hour DECIMAL(8, 2),
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint
    CHECK (end_time > start_time),
    UNIQUE(court_id, day_of_week, start_time, end_time)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_availability_slots_court_id ON public.availability_slots(court_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_day ON public.availability_slots(day_of_week);
CREATE INDEX IF NOT EXISTS idx_availability_slots_is_available ON public.availability_slots(is_available);

-- Add RLS policies
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view availability slots"
    ON public.availability_slots FOR SELECT
    USING (TRUE);

CREATE POLICY "Court owners can manage their court slots"
    ON public.availability_slots FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.courts
            WHERE courts.id = availability_slots.court_id
            AND courts.owner_id = auth.uid()
        )
    );

-- =====================================================
-- BOOKING REMINDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.booking_reminders (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    
    -- Reminder details
    reminder_type VARCHAR(20) NOT NULL
        CHECK (reminder_type IN ('email', 'sms', 'push')),
    send_at TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
    
    -- Error tracking
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_booking_reminders_booking_id ON public.booking_reminders(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_send_at ON public.booking_reminders(send_at);
CREATE INDEX IF NOT EXISTS idx_booking_reminders_status ON public.booking_reminders(status);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_slots_updated_at BEFORE UPDATE ON public.availability_slots
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_reminders_updated_at BEFORE UPDATE ON public.booking_reminders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique confirmation code
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TEXT AS $$
DECLARE
    code TEXT;
    done BOOLEAN := FALSE;
BEGIN
    WHILE NOT done LOOP
        code := upper(substring(md5(random()::text) from 1 for 8));
        done := NOT EXISTS (SELECT 1 FROM public.bookings WHERE confirmation_code = code);
    END LOOP;
    RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate confirmation code
CREATE OR REPLACE FUNCTION set_booking_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL OR NEW.confirmation_code = '' THEN
        NEW.confirmation_code := generate_confirmation_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_confirmation_code_trigger
    BEFORE INSERT ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_confirmation_code();

-- Function to check booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict(
    p_court_id BIGINT,
    p_booking_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_booking_id BIGINT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO conflict_count
    FROM public.bookings
    WHERE court_id = p_court_id
    AND booking_date = p_booking_date
    AND status NOT IN ('cancelled', 'no_show')
    AND (
        (start_time < p_end_time AND end_time > p_start_time)
    )
    AND (p_booking_id IS NULL OR id != p_booking_id);
    
    RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to update court booking statistics
CREATE OR REPLACE FUNCTION update_court_booking_stats(court_id_param BIGINT)
RETURNS void AS $$
BEGIN
    UPDATE public.courts
    SET total_bookings = (
        SELECT COUNT(*)
        FROM public.bookings
        WHERE court_id = court_id_param
        AND status IN ('confirmed', 'completed')
    )
    WHERE id = court_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update court stats on booking status change
CREATE OR REPLACE FUNCTION trigger_update_court_booking_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.status != NEW.status) OR TG_OP = 'INSERT' THEN
        PERFORM update_court_booking_stats(NEW.court_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_court_booking_stats_trigger
    AFTER INSERT OR UPDATE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_court_booking_stats();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE public.bookings IS 'Court booking reservations';
COMMENT ON TABLE public.availability_slots IS 'Court availability schedule by day of week';
COMMENT ON TABLE public.booking_reminders IS 'Scheduled reminders for upcoming bookings';
