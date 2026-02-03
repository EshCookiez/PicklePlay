import { createClient } from '@/lib/supabase/client'

export interface Booking {
  id: number
  user_id: string
  court_id: number
  booking_date: string
  start_time: string
  end_time: string
  duration_hours: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  cancellation_reason?: string
  price_per_hour: number
  total_price: number
  discount_amount: number
  payment_method: 'gcash' | 'credit_card' | 'bank_transfer' | 'cash' | 'free'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  transaction_id?: string
  customer_notes?: string
  owner_notes?: string
  booked_at: string
  completed_at?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
}

export interface CreateBookingRequest {
  court_id: number
  booking_date: string
  start_time: string
  end_time: string
  duration_hours: number
  price_per_hour: number
  total_price: number
  payment_method: string
  customer_notes?: string
}

export interface BookingAvailability {
  available_date: string
  is_available: boolean
}

export const bookingService = {
  /**
   * Create a new booking
   */
  async createBooking(request: CreateBookingRequest): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Check availability first
    const isAvailable = await this.checkAvailability(request.court_id, request.booking_date)
    if (!isAvailable) {
      return { success: false, error: 'Court is not available on this date' }
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        court_id: request.court_id,
        booking_date: request.booking_date,
        start_time: request.start_time,
        end_time: request.end_time,
        duration_hours: request.duration_hours,
        price_per_hour: request.price_per_hour,
        total_price: request.total_price,
        discount_amount: 0,
        payment_method: request.payment_method,
        payment_status: 'pending',
        status: 'pending',
        customer_notes: request.customer_notes
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return { success: false, error: 'Failed to create booking' }
    }

    return { success: true, booking: data as Booking }
  },

  /**
   * Get user's bookings
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('booking_date', { ascending: false })
    
    if (error) {
      console.error('Error fetching bookings:', error)
      return []
    }
    
    return (data || []) as Booking[]
  },

  /**
   * Get bookings for a specific court (owner view)
   */
  async getCourtBookings(courtId: number): Promise<Booking[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('court_id', courtId)
      .in('status', ['pending', 'confirmed', 'completed'])
      .order('booking_date', { ascending: true })
    
    if (error) {
      console.error('Error fetching court bookings:', error)
      return []
    }
    
    return (data || []) as Booking[]
  },

  /**
   * Check if court is available on a specific date
   */
  async checkAvailability(courtId: number, bookingDate: string): Promise<boolean> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('court_id', courtId)
      .eq('booking_date', bookingDate)
      .in('status', ['confirmed', 'pending'])
      .limit(1)
    
    if (error) {
      console.error('Error checking availability:', error)
      return false
    }
    
    // Court is available if no confirmed/pending bookings exist
    return !data || data.length === 0
  },

  /**
   * Get available dates for next 30 days
   */
  async getAvailableDates(courtId: number): Promise<string[]> {
    const supabase = createClient()
    const availableDates: string[] = []
    const today = new Date()
    
    // Check next 30 days
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      const isAvailable = await this.checkAvailability(courtId, dateStr)
      if (isAvailable) {
        availableDates.push(dateStr)
      }
    }
    
    return availableDates
  },

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: number, reason?: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('bookings')
      .update({
        status: 'cancelled',
        payment_status: 'refunded',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error cancelling booking:', error)
      return { success: false, error: 'Failed to cancel booking' }
    }
    
    return { success: true }
  },

  /**
   * Confirm payment for a booking
   */
  async confirmPayment(bookingId: number, transactionId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'paid',
        transaction_id: transactionId,
        status: 'confirmed'
      })
      .eq('id', bookingId)
    
    if (error) {
      console.error('Error confirming payment:', error)
      return { success: false, error: 'Failed to confirm payment' }
    }
    
    return { success: true }
  },

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: number): Promise<Booking | null> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()
    
    if (error) {
      console.error('Error fetching booking:', error)
      return null
    }
    
    return data as Booking
  },

  /**
   * Update booking status (owner only)
   */
  async updateBookingStatus(bookingId: number, status: string, notes?: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('bookings')
      .update({
        status,
        owner_notes: notes,
        completed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', bookingId)
    
    if (error) {
      console.error('Error updating booking status:', error)
      return { success: false, error: 'Failed to update booking' }
    }
    
    return { success: true }
  }
}
