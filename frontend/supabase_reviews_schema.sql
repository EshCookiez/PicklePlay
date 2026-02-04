-- Court Reviews table
CREATE TABLE IF NOT EXISTS court_reviews (
  id BIGSERIAL PRIMARY KEY,
  court_id BIGINT NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, court_id)
);

-- Add user profile reference for review display
ALTER TABLE court_reviews ADD COLUMN IF NOT EXISTS user_name TEXT;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_court_reviews_court_id ON court_reviews(court_id);
CREATE INDEX IF NOT EXISTS idx_court_reviews_user_id ON court_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_court_reviews_created_at ON court_reviews(created_at DESC);

-- Enable RLS
ALTER TABLE court_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews
CREATE POLICY "Anyone can view reviews" ON court_reviews
  FOR SELECT USING (true);

-- Users can add reviews (one per court)
CREATE POLICY "Authenticated users can add reviews" ON court_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON court_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews" ON court_reviews
  FOR DELETE USING (auth.uid() = user_id);

-- Add average rating to courts table
ALTER TABLE courts ADD COLUMN IF NOT EXISTS average_rating DECIMAL(3, 2) DEFAULT 0;
ALTER TABLE courts ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Function to update court average rating
CREATE OR REPLACE FUNCTION update_court_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courts
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM court_reviews
      WHERE court_id = COALESCE(NEW.court_id, OLD.court_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM court_reviews
      WHERE court_id = COALESCE(NEW.court_id, OLD.court_id)
    )
  WHERE id = COALESCE(NEW.court_id, OLD.court_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update court rating on review changes
DROP TRIGGER IF EXISTS trigger_update_court_rating ON court_reviews;
CREATE TRIGGER trigger_update_court_rating
  AFTER INSERT OR UPDATE OR DELETE ON court_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_court_rating();
