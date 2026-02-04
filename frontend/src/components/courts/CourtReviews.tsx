"use client"

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, Edit2, Trash2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { reviewService, CourtReview, ReviewStats } from '@/services/reviewService'
import { useAuth } from '@/contexts/AuthContext'

interface CourtReviewsProps {
  courtId: number
}

export default function CourtReviews({ courtId }: CourtReviewsProps) {
  const [reviews, setReviews] = useState<CourtReview[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState<CourtReview | null>(null)
  
  // Review form state
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  
  const { user } = useAuth()

  useEffect(() => {
    fetchReviews()
    fetchStats()
    if (user) {
      checkUserReview()
    }
  }, [courtId, user])

  const fetchReviews = async () => {
    const data = await reviewService.getCourtReviews(courtId)
    setReviews(data)
    setIsLoading(false)
  }

  const fetchStats = async () => {
    const data = await reviewService.getReviewStats(courtId)
    setStats(data)
  }

  const checkUserReview = async () => {
    if (!user) return
    const review = await reviewService.hasUserReviewed(courtId, user.id)
    setUserReview(review)
    if (review) {
      setRating(review.rating)
      setComment(review.comment)
    }
  }

  const handleSubmitReview = async () => {
    if (!user) {
      setSubmitMessage('Please login to submit a review')
      return
    }

    if (!comment.trim()) {
      setSubmitMessage('Please write a comment')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    if (userReview) {
      // Update existing review
      const result = await reviewService.updateReview(userReview.id, rating, comment)
      if (result.success) {
        setSubmitMessage('Review updated successfully!')
        setShowReviewForm(false)
        fetchReviews()
        fetchStats()
        checkUserReview()
      } else {
        setSubmitMessage(result.error || 'Failed to update review')
      }
    } else {
      // Add new review
      const result = await reviewService.addReview(
        courtId,
        user.id,
        user.email || 'Anonymous',
        rating,
        comment
      )
      
      if (result.success) {
        setSubmitMessage('Review submitted successfully!')
        setShowReviewForm(false)
        setComment('')
        fetchReviews()
        fetchStats()
        checkUserReview()
      } else {
        setSubmitMessage(result.error || 'Failed to submit review')
      }
    }

    setIsSubmitting(false)
  }

  const handleDeleteReview = async () => {
    if (!userReview) return
    
    if (!confirm('Are you sure you want to delete your review?')) return

    const success = await reviewService.deleteReview(userReview.id)
    if (success) {
      setUserReview(null)
      setRating(5)
      setComment('')
      fetchReviews()
      fetchStats()
    }
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              (interactive ? (hoveredRating || rating) : rating) >= star
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer transition-colors' : ''}`}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-slate-900">
                {stats.average_rating.toFixed(1)}
              </div>
              <div className="flex justify-center mt-2">
                {renderStars(Math.round(stats.average_rating))}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {stats.review_count} {stats.review_count === 1 ? 'review' : 'reviews'}
              </div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600 w-8">{star}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{
                        width: `${stats.review_count > 0 
                          ? (stats.rating_distribution[star as keyof typeof stats.rating_distribution] / stats.review_count) * 100 
                          : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {stats.rating_distribution[star as keyof typeof stats.rating_distribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      {user && !showReviewForm && (
        <Button
          onClick={() => setShowReviewForm(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {userReview ? 'Edit Your Review' : 'Write a Review'}
        </Button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 space-y-4">
          <h3 className="text-xl font-semibold">
            {userReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            {renderStars(rating, true)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review
            </label>
            <Textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Share your experience at this court..."
              rows={4}
              className="w-full"
            />
          </div>

          {submitMessage && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              submitMessage.includes('success') 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{submitMessage}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSubmitReview}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
            </Button>
            <Button
              onClick={() => {
                setShowReviewForm(false)
                setSubmitMessage('')
                if (userReview) {
                  setRating(userReview.rating)
                  setComment(userReview.comment)
                }
              }}
              variant="outline"
            >
              Cancel
            </Button>
            {userReview && (
              <Button
                onClick={handleDeleteReview}
                variant="destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">
          All Reviews ({reviews.length})
        </h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-slate-900">
                    {review.user_name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>
              
              {review.user_id === user?.id && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-blue-600 font-medium">Your review</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
