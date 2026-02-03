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
      <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
          {court.cover_image ? (
            <Image
              src={court.cover_image}
              alt={court.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-blue-300" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {court.is_featured && (
              <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                Featured
              </span>
            )}
            {court.status === 'approved' && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <Check className="w-3 h-3" /> Verified
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors disabled:opacity-50"
          >
            <Heart
              className={`w-5 h-5 ${favorited ? 'fill-red-500 text-red-500' : 'text-gray-600'} ${isLoading ? 'animate-pulse' : ''}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Price & Name */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {court.name}
              </h3>
              <span className={`text-lg font-bold whitespace-nowrap ${court.is_free ? 'text-green-600' : 'text-slate-900'}`}>
                {priceDisplay}
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{court.city}, {court.state_province || court.country}</span>
          </div>

          {/* Details Row */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {/* Courts Count */}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{court.number_of_courts} {court.number_of_courts === 1 ? 'court' : 'courts'}</span>
            </div>

            {/* Type Badge */}
            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
              {court.type}
            </span>
          </div>

          {/* Rating & Distance */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm text-slate-900">
                {court.rating > 0 ? court.rating.toFixed(1) : 'New'}
              </span>
              {court.total_reviews > 0 && (
                <span className="text-xs text-gray-500">({court.total_reviews})</span>
              )}
            </div>

            {distance !== undefined && (
              <span className="text-sm text-gray-600">
                📍 {formatDistance(distance)}
              </span>
            )}
          </div>

          {/* Amenities */}
          {court.amenities && court.amenities.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              {court.amenities.slice(0, 4).map((amenity) => (
                <div
                  key={amenity}
                  className="p-1.5 bg-gray-50 text-gray-600 rounded-lg"
                  title={amenity}
                >
                  {amenityIcons[amenity] || <Check className="w-4 h-4" />}
                </div>
              ))}
              {court.amenities.length > 4 && (
                <span className="text-xs text-gray-500">+{court.amenities.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
