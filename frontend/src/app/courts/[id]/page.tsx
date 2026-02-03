"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CourtReviews from '@/components/courts/CourtReviews'
import { Court } from '@/types/database'
import { courtService } from '@/services/courtService'
import { bookingService } from '@/services/bookingService'
import { mockCourts } from '@/data/mockCourts'
import { useAuth } from '@/contexts/AuthContext'
import {
  MapPin, Phone, Mail, Globe, Calendar, MessageCircle, Loader, Check, X, AlertCircle,
  Heart, Share2, ArrowLeft, Zap, Wifi, Car, UtensilsCrossed, Shield, Camera, Clock, Users, Star
} from 'lucide-react'
import { favoriteService } from '@/services/favoriteService'
import { Button } from '@/components/ui/button'
import { SkeletonCard } from '@/components/ui/skeleton'
import Image from 'next/image'
import { calculateDistance, getUserLocation, formatDistance } from '@/lib/geolocation'

export default function CourtDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const courtId = Number(params?.id)
  const { user } = useAuth()

  const [court, setCourt] = useState<Court | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [distance, setDistance] = useState<number | null>(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)

  // Booking form state
  const [bookingDate, setBookingDate] = useState('')
  const [startTime, setStartTime] = useState('08:00')
  const [duration, setDuration] = useState('2')
  const [bookingNotes, setBookingNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('gcash')
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState('')

  // Message form state
  const [messageText, setMessageText] = useState('')
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false)

  useEffect(() => {
    if (courtId) {
      fetchCourt()
      checkUserLocation()
    }
    if (courtId && user) {
      checkFavoriteStatus()
    }
  }, [courtId, user])

  const checkFavoriteStatus = async () => {
    try {
      const isFav = await favoriteService.isFavorited(user!.id, courtId)
      setIsFavorited(isFav)
    } catch (error) {
      console.error('Failed to check favorite status:', error)
    }
  }

  const fetchCourt = async () => {
    setIsLoading(true)
    try {
      // Try to get from mock data first (for presentation)
      const mockCourt = mockCourts.find(c => c.id === courtId)
      if (mockCourt) {
        setCourt(mockCourt as Court)
      } else {
        // Fallback to real data
        const data = await courtService.getCourt(courtId)
        setCourt(data)
      }
    } catch (error) {
      console.error('Failed to fetch court:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkUserLocation = async () => {
    try {
      const userLocation = await getUserLocation()
      if (court?.latitude && court?.longitude) {
        const dist = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          court.latitude,
          court.longitude
        )
        setDistance(dist)
      }
    } catch (error) {
      console.log('Location not available')
    }
  }

  const handleFavorite = async () => {
    if (!user) {
      alert('Please login to add favorites')
      router.push('/auth')
      return
    }

    try {
      const success = await favoriteService.toggleFavorite(user.id, courtId)
      if (success) {
        setIsFavorited(!isFavorited)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: court?.name,
        text: `Check out ${court?.name} on PicklePlay`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handleBooking = () => {
    if (!user) {
      alert('Please login to make a booking')
      router.push('/auth')
      return
    }
    setShowBookingModal(true)
  }

  const submitBooking = async () => {
    if (!user || !court) return

    setIsSubmittingBooking(true)
    setBookingError('')
    setBookingSuccess('')

    try {
      if (!bookingDate) {
        setBookingError('Please select a date')
        return
      }

      // Calculate end time
      const [hours, minutes] = startTime.split(':')
      const startDate = new Date()
      startDate.setHours(parseInt(hours), parseInt(minutes))
      const endDate = new Date(startDate.getTime() + parseInt(duration) * 60 * 60 * 1000)
      const endTimeStr = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`

      // Calculate total price
      const pricePerHour = court.price_per_hour || 0
      const totalPrice = pricePerHour * parseInt(duration)

      // Create booking
      const result = await bookingService.createBooking({
        court_id: courtId,
        booking_date: bookingDate,
        start_time: startTime,
        end_time: endTimeStr,
        duration_hours: parseInt(duration),
        price_per_hour: pricePerHour,
        total_price: totalPrice,
        payment_method: paymentMethod,
        customer_notes: bookingNotes
      })

      if (result.success && result.booking) {
        setBookingSuccess(`Booking created! Booking ID: ${result.booking.id}. Proceeding to payment...`)

        // Redirect to payment if not free
        if (!court.is_free) {
          // TODO: Integrate Xendit payment here
          setTimeout(() => {
            setShowBookingModal(false)
            router.push(`/profile/bookings`)
          }, 2000)
        } else {
          setTimeout(() => {
            setShowBookingModal(false)
            router.push(`/profile/bookings`)
          }, 2000)
        }
      } else {
        setBookingError(result.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      setBookingError('An error occurred while creating the booking')
    } finally {
      setIsSubmittingBooking(false)
    }
  }

  const handleMessage = () => {
    if (!user) {
      alert('Please login to send a message')
      router.push('/auth')
      return
    }
    setShowMessageModal(true)
  }

  const submitMessage = async () => {
    if (!messageText.trim()) {
      alert('Please enter a message')
      return
    }

    setIsSubmittingMessage(true)
    try {
      alert(`Message sent to ${court?.name} owner! They will respond to your inquiry soon.`)
      setShowMessageModal(false)
      setMessageText('')
    } finally {
      setIsSubmittingMessage(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <SkeletonCard />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-6">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonCard />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!court) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Court Not Found</h2>
            <Button onClick={() => router.push('/courts')} className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courts
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const images = court.images && court.images.length > 0 ? court.images : [court.cover_image || '']
  const priceDisplay = court.is_free ? 'Free' : `₱${court.price_per_hour?.toFixed(0)}/hour`

  const amenityIcons: Record<string, { icon: React.ReactNode; label: string }> = {
    lights: { icon: <Zap className="w-5 h-5" />, label: 'Lighting' },
    equipment: { icon: <Check className="w-5 h-5" />, label: 'Equipment Rental' },
    parking: { icon: <Car className="w-5 h-5" />, label: 'Parking' },
    restrooms: { icon: <Users className="w-5 h-5" />, label: 'Restrooms' },
    wifi: { icon: <Wifi className="w-5 h-5" />, label: 'WiFi' },
    food: { icon: <UtensilsCrossed className="w-5 h-5" />, label: 'Food & Drinks' },
    lockers: { icon: <Shield className="w-5 h-5" />, label: 'Lockers' },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Image Gallery */}
        <div className="mb-8 bg-white rounded-xl overflow-hidden border border-gray-200">
          <div className="relative h-96 bg-gradient-to-br from-blue-50 to-blue-100">
            {images[selectedImage] ? (
              <Image
                src={images[selectedImage]}
                alt={court.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-300" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                onClick={handleFavorite}
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                size="icon"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </Button>
              <Button
                onClick={handleShare}
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                size="icon"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {court.is_featured && (
                <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full">
                  Featured
                </span>
              )}
              {court.status === 'approved' && (
                <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                  <Check className="w-4 h-4" /> Verified
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="p-4 flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                >
                  {img ? (
                    <Image src={img} alt={`View ${index + 1}`} fill className="object-cover" />
                  ) : (
                    <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                      <Camera className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{court.name}</h1>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-lg">
                        {court.rating > 0 ? court.rating.toFixed(1) : 'New'}
                      </span>
                      {court.total_reviews > 0 && (
                        <span className="text-gray-500">({court.total_reviews} reviews)</span>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full capitalize">
                      {court.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold ${court.is_free ? 'text-green-600' : 'text-slate-900'}`}>
                    {priceDisplay}
                  </div>
                  {!court.is_free && court.peak_hour_price && (
                    <div className="text-sm text-gray-600">
                      Peak: ₱{court.peak_hour_price}/hr
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{court.city}, {court.state_province || court.country}</span>
                </div>
                {distance && (
                  <div className="flex items-center gap-2">
                    <span>📍 {formatDistance(distance)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{court.number_of_courts} {court.number_of_courts === 1 ? 'Court' : 'Courts'}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {court.description && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-slate-900 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{court.description}</p>
              </div>
            )}

            {/* Amenities */}
            {court.amenities && court.amenities.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {court.amenities.map((amenity) => {
                    const amenityInfo = amenityIcons[amenity] || {
                      icon: <Check className="w-5 h-5" />,
                      label: amenity
                    }
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-blue-600">{amenityInfo.icon}</div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {amenityInfo.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Operating Hours */}
            {court.hours_of_operation && Object.keys(court.hours_of_operation).length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Operating Hours
                </h2>
                <div className="space-y-2">
                  {Object.entries(court.hours_of_operation).map(([day, hours]) => {
                    const hoursText = typeof hours === 'string'
                      ? hours
                      : `${(hours as any).open || ''} - ${(hours as any).close || ''}`
                    return (
                      <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                        <span className="font-medium text-gray-700 capitalize">{day}</span>
                        <span className="text-gray-600">{hoursText}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <CourtReviews courtId={courtId} />
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Contact & Book</h3>

              <div className="space-y-4 mb-6">
                {court.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Address</div>
                      <div className="text-sm text-gray-600">{court.address}</div>
                    </div>
                  </div>
                )}

                {court.phone_number && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Phone</div>
                      <a href={`tel:${court.phone_number}`} className="text-sm text-blue-600 hover:underline">
                        {court.phone_number}
                      </a>
                    </div>
                  </div>
                )}

                {court.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Email</div>
                      <a href={`mailto:${court.email}`} className="text-sm text-blue-600 hover:underline break-all">
                        {court.email}
                      </a>
                    </div>
                  </div>
                )}

                {court.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-700">Website</div>
                      <a
                        href={court.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline break-all"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                </Button>
                <Button
                  onClick={handleMessage}
                  variant="outline"
                  className="w-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message Owner
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${court.latitude},${court.longitude}`, '_blank')}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setShowBookingModal(false)}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full my-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Book {court?.name}</h3>
                <button onClick={() => setShowBookingModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Booking Date *
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Time Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (hours)
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                    </select>
                  </div>
                </div>

                {/* Payment Method */}
                {!court?.is_free && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="gcash">GCash</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash on Site</option>
                    </select>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    rows={3}
                    placeholder="Any special requests or questions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-blue-50 p-3 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Rate per hour:</span>
                    <span className="font-semibold text-slate-900">{court?.is_free ? 'Free' : `₱${court?.price_per_hour}`}</span>
                  </div>
                  {!court?.is_free && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">{duration} hour(s)</span>
                    </div>
                  )}
                  {!court?.is_free && (
                    <div className="flex justify-between font-bold text-blue-600 pt-2 border-t border-blue-200">
                      <span>Total:</span>
                      <span>₱{(parseInt(duration) * (court?.price_per_hour || 0)).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {bookingError && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{bookingError}</span>
                  </div>
                )}

                {/* Success Message */}
                {bookingSuccess && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
                    <Check className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{bookingSuccess}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => setShowBookingModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={submitBooking}
                  disabled={isSubmittingBooking}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmittingBooking ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMessageModal(false)}>
            <div className="bg-white rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Message Owner</h3>
                <button onClick={() => setShowMessageModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    value={messageText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessageText(e.target.value)}
                    rows={6}
                    placeholder="Hi! I'm interested in booking your court. Can you provide more details about..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="text-xs text-gray-500">
                  Your message will be sent to the court owner. They typically respond within 24 hours.
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setShowMessageModal(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    onClick={submitMessage}
                    disabled={!messageText.trim() || isSubmittingMessage}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmittingMessage ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}