"use client"

import { Court } from '@/types/database'
import { Heart, MapPin, Star, Users, Clock, Zap, DollarSign, Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { formatDistance } from '@/lib/geolocation'
import { favoriteService } from '@/services/favoriteService'
import { useAuth } from '@/contexts/AuthContext'

interface CourtCardProps {
  court: Court
  distance?: number
  onFavorite?: (courtId: number, isFavorited: boolean) => void
  initialFavorited?: boolean
}

export default function CourtCard({ court, distance, onFavorite, initialFavorited = false }: CourtCardProps) {
  const [favorited, setFavorited] = useState(initialFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    setFavorited(initialFavorited)
  }, [initialFavorited])

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      alert('Please login to add favorites')
      return
    }

    setIsLoading(true)
    const success = await favoriteService.toggleFavorite(user.id, court.id)
    
    if (success) {
      const newFavoritedState = !favorited
      setFavorited(newFavoritedState)
      onFavorite?.(court.id, newFavoritedState)
    }
    
    setIsLoading(false)
  }

  const priceDisplay = court.is_free 
    ? 'Free' 
    : `₱${court.price_per_hour?.toFixed(0)}/hr`

  const amenityIcons: Record<string, React.ReactNode> = {
    lights: <Zap className="w-4 h-4" />,
    equipment: <Check className="w-4 h-4" />,
    parking: <MapPin className="w-4 h-4" />,
    restrooms: <Users className="w-4 h-4" />,
  }

  return (
    <Link href={`/courts/${court.id}`}>
      <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] animate-fadeIn">
        {/* Image */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
          {/* Shimmer skeleton when loading */}
          {court.cover_image && !imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer" />
          )}
          {court.cover_image ? (
            <Image
              src={court.cover_image}
              alt={court.name}
              fill
              className={`object-cover group-hover:scale-110 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-10 h-10 sm:w-12 sm:h-12 text-blue-300" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex gap-1.5 sm:gap-2 flex-wrap">
            {court.is_featured && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold rounded-full">
                Featured
              </span>
            )}
            {court.status === 'approved' && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-0.5 sm:gap-1">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Verified
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={isLoading}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white active:scale-90 transition-all disabled:opacity-50 touch-target"
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'} ${isLoading ? 'animate-pulse' : ''}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* Price & Name */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {court.name}
              </h3>
              <span className={`text-base sm:text-lg font-bold whitespace-nowrap ${court.is_free ? 'text-green-600' : 'text-slate-900'}`}>
                {priceDisplay}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="line-clamp-1">{court.city}, {court.state_province || court.country}</span>
          </div>

          {/* Details Row */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 flex-wrap">
            {/* Courts Count */}
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{court.number_of_courts} {court.number_of_courts === 1 ? 'court' : 'courts'}</span>
            </div>

            {/* Type Badge */}
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-medium rounded-full capitalize">
              {court.type}
            </span>
          </div>

          {/* Rating & Distance */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-xs sm:text-sm text-slate-900">
                {court.rating > 0 ? court.rating.toFixed(1) : 'New'}
              </span>
              {court.total_reviews > 0 && (
                <span className="text-[10px] sm:text-xs text-gray-500">({court.total_reviews})</span>
              )}
            </div>

            {distance !== undefined && (
              <span className="text-xs sm:text-sm text-gray-600">
                📍 {formatDistance(distance)}
              </span>
            )}
          </div>

          {/* Amenities */}
          {court.amenities && court.amenities.length > 0 && (
            <div className="flex items-center gap-1.5 sm:gap-2 pt-2">
              {court.amenities.slice(0, 4).map((amenity) => (
                <div
                  key={amenity}
                  className="p-1 sm:p-1.5 bg-gray-50 text-gray-600 rounded-lg"
                  title={amenity}
                >
                  {amenityIcons[amenity] || <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
              ))}
              {court.amenities.length > 4 && (
                <span className="text-[10px] sm:text-xs text-gray-500">+{court.amenities.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
