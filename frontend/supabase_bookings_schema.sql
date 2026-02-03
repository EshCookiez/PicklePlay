-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  
  -- Booking details
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours INTEGER NOT NULL,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no-show')),
  cancellation_reason TEXT,
  
  -- Pricing
  price_per_hour DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  
  -- Payment
  payment_method TEXT CHECK (payment_method IN ('gcash', 'credit_card', 'bank_transfer', 'cash', 'free')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  transaction_id TEXT UNIQUE,
  
  -- Notes
  customer_notes TEXT,
  owner_notes TEXT,
  
  -- Timestamps
  booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_court_id ON bookings(court_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_court_date ON bookings(user_id, court_id, booking_date);

-- Court availability view
CREATE OR REPLACE VIEW court_availability AS
SELECT 
  c.id as court_id,
  c.name,
  DATE(CURRENT_DATE + INTERVAL '1 day' * series.num) as available_date,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM bookings 
      WHERE court_id = c.id 
      AND DATE(booking_date) = DATE(CURRENT_DATE + INTERVAL '1 day' * series.num)
      AND status IN ('confirmed', 'pending')
    ) THEN false
    ELSE true
  END as is_available
FROM courts c
CROSS JOIN GENERATE_SERIES(0, 30) as series(num)
WHERE c.is_active = true;

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Court owners can view bookings for their courts
CREATE POLICY "Court owners can view court bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM courts 
      WHERE courts.id = bookings.court_id 
      AND courts.owner_id = auth.uid()
    )
  );

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = user_id AND status = 'pending'
  );

-- Users can cancel their own bookings
CREATE POLICY "Users can cancel own bookings" ON bookings
  FOR UPDATE USING (
    auth.uid() = user_id AND status IN ('pending', 'confirmed')
  );

-- Court owners can update bookings for their courts
CREATE POLICY "Court owners can update court bookings" ON bookings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM courts 
      WHERE courts.id = bookings.court_id 
      AND courts.owner_id = auth.uid()
    )
  );

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_booking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_booking_timestamp ON bookings;
CREATE TRIGGER trigger_update_booking_timestamp
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_booking_timestamp();
