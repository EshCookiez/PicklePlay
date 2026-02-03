import { createClient } from '@/lib/supabase/client'

export interface CourtReview {
  id: number
  court_id: number
  user_id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
  updated_at: string
}

export interface ReviewStats {
  average_rating: number
  review_count: number
  rating_distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}

export const reviewService = {
  /**
   * Get reviews for a specific court
   */
  async getCourtReviews(courtId: number): Promise<CourtReview[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('court_reviews')
      .select('*')
      .eq('court_id', courtId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
    
    return data as CourtReview[]
  },

  /**
   * Get review statistics for a court
   */
  async getReviewStats(courtId: number): Promise<ReviewStats> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('court_reviews')
      .select('rating')
      .eq('court_id', courtId)
    
    if (error || !data) {
      return {
        average_rating: 0,
        review_count: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      }
    }
    
    const ratings = data.map(r => r.rating)
    const average = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : 0
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    ratings.forEach(rating => {
      distribution[rating as keyof typeof distribution]++
    })
    
    return {
      average_rating: Math.round(average * 10) / 10,
      review_count: ratings.length,
      rating_distribution: distribution
    }
  },

  /**
   * Add a new review
   */
  async addReview(
    courtId: number,
    userId: string,
    userName: string,
    rating: number,
    comment: string
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    
    // Check if user already reviewed this court
    const { data: existing } = await supabase
      .from('court_reviews')
      .select('id')
      .eq('court_id', courtId)
      .eq('user_id', userId)
      .single()
    
    if (existing) {
      return { success: false, error: 'You have already reviewed this court' }
    }
    
    const { error } = await supabase
      .from('court_reviews')
      .insert({
        court_id: courtId,
        user_id: userId,
        user_name: userName,
        rating,
        comment
      })
    
    if (error) {
      console.error('Error adding review:', error)
      return { success: false, error: 'Failed to submit review' }
    }
    
    return { success: true }
  },

  /**
   * Update an existing review
   */
  async updateReview(
    reviewId: number,
    rating: number,
    comment: string
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('court_reviews')
      .update({
        rating,
        comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', reviewId)
    
    if (error) {
      console.error('Error updating review:', error)
      return { success: false, error: 'Failed to update review' }
    }
    
    return { success: true }
  },

  /**
   * Delete a review
   */
  async deleteReview(reviewId: number): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('court_reviews')
      .delete()
      .eq('id', reviewId)
    
    if (error) {
      console.error('Error deleting review:', error)
      return false
    }
    
    return true
  },

  /**
   * Check if user has reviewed a court
   */
  async hasUserReviewed(courtId: number, userId: string): Promise<CourtReview | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('court_reviews')
      .select('*')
      .eq('court_id', courtId)
      .eq('user_id', userId)
      .single()
    
    if (error) return null
    return data as CourtReview
  }
}
