"use client"

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'
import { bookingService, Booking } from '@/services/bookingService'
import { Button } from '@/components/ui/button'
import { AlertCircle, Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'

const statusConfig = {
  pending: { color: 'bg-yellow-50', textColor: 'text-yellow-700', icon: '⏳', label: 'Pending' },
  confirmed: { color: 'bg-blue-50', textColor: 'text-blue-700', icon: '✓', label: 'Confirmed' },
  completed: { color: 'bg-green-50', textColor: 'text-green-700', icon: '✓✓', label: 'Completed' },
  cancelled: { color: 'bg-red-50', textColor: 'text-red-700', icon: '✗', label: 'Cancelled' },
  'no-show': { color: 'bg-gray-50', textColor: 'text-gray-700', icon: '✗', label: 'No Show' }
}

const paymentConfig = {
  pending: { color: 'text-yellow-600', label: 'Pending Payment' },
  paid: { color: 'text-green-600', label: 'Paid' },
  failed: { color: 'text-red-600', label: 'Payment Failed' },
  refunded: { color: 'text-blue-600', label: 'Refunded' }
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('all')
  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      fetchBookings()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const data = await bookingService.getUserBookings(user.id)
      setBookings(data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    
    setCancellingId(bookingId)
    const result = await bookingService.cancelBooking(bookingId, 'Cancelled by user')
    
    if (result.success) {
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b)
      )
    }
    setCancellingId(null)
  }

  const getFilteredBookings = () => {
    const today = new Date().toISOString().split('T')[0]
    
    return bookings.filter(b => {
      switch (filter) {
        case 'upcoming':
          return b.booking_date >= today && b.status !== 'cancelled'
        case 'past':
          return b.booking_date < today && b.status !== 'cancelled'
        case 'cancelled':
          return b.status === 'cancelled'
        default:
          return true
      }
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredBookings = getFilteredBookings()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Login Required</h2>
            <p className="text-gray-500 mb-6">Please login to view your bookings</p>
            <Button onClick={() => router.push('/auth')}>
              Login
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">My Bookings</h1>
          </div>
          <p className="text-gray-600">
            {filteredBookings.length} {filteredBookings.length === 1 ? 'booking' : 'bookings'} found
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(['all', 'upcoming', 'past', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-400'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-gray-200">
            <Calendar className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Bookings</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' && "You haven't made any bookings yet"}
              {filter === 'upcoming' && "You don't have any upcoming bookings"}
              {filter === 'past' && "You don't have any past bookings"}
              {filter === 'cancelled' && "You don't have any cancelled bookings"}
            </p>
            <Button onClick={() => router.push('/courts')}>
              Browse Courts
            </Button>
          </div>
        ) : (
          /* Bookings List */
          <div className="space-y-4">
            {filteredBookings.map(booking => {
              const status = statusConfig[booking.status as keyof typeof statusConfig] || statusConfig.pending
              const paymentStatus = paymentConfig[booking.payment_status as keyof typeof paymentConfig] || paymentConfig.pending
              const bookingDate = new Date(booking.booking_date)
              const today = new Date()
              const isUpcoming = bookingDate > today && booking.status !== 'cancelled'
              
              return (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Header with Status */}
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Booking #{booking.id}</h3>
                      <p className="text-sm text-gray-500">Court ID: {booking.court_id}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color} ${status.textColor}`}>
                        {status.label}
                      </span>
                      <span className={`text-sm font-medium ${paymentStatus.color}`}>
                        {paymentStatus.label}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="font-semibold text-slate-900">{formatDate(booking.booking_date)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Time</div>
                        <div className="font-semibold text-slate-900">
                          {booking.start_time} - {booking.end_time}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Total Price</div>
                        <div className="font-bold text-lg text-blue-600">₱{booking.total_price.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-500">Duration</div>
                        <div className="font-semibold text-slate-900">{booking.duration_hours} hour(s)</div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {booking.customer_notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-600">
                        <strong>Your Note:</strong> {booking.customer_notes}
                      </div>
                    </div>
                  )}

                  {booking.owner_notes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-700">
                        <strong>Owner Note:</strong> {booking.owner_notes}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {isUpcoming && booking.status !== 'cancelled' && (
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={() => router.push(`/courts/${booking.court_id}`)}
                        variant="outline"
                        className="flex-1"
                      >
                        View Court
                      </Button>
                      <Button
                        onClick={() => handleCancelBooking(booking.id)}
                        variant="destructive"
                        disabled={cancellingId === booking.id}
                        className="flex-1"
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
