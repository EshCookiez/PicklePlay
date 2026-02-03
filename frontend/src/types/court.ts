import { Court } from '@/types/database'

export interface CourtFilters {
  search?: string
  city?: string
  type?: 'indoor' | 'outdoor' | 'both'
  minPrice?: number
  maxPrice?: number
  minRating?: number
  amenities?: string[]
  isFree?: boolean
  status?: 'approved' | 'pending' | 'rejected'
}

export interface CourtWithDistance extends Court {
  distance?: number // in km
}

export interface LocationCoordinates {
  latitude: number
  longitude: number
}
