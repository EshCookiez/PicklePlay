/**
 * Database Type Definitions
 * These types match your Supabase/PostgreSQL schema
 */

export type UserRole = 'user' | 'coach' | 'admin' | 'super_admin' | 'court_owner'
export type UserStatus = 'active' | 'inactive' | 'suspended'
export type CourtStatus = 'pending' | 'approved' | 'rejected' | 'suspended'
export type CourtType = 'indoor' | 'outdoor' | 'both'
export type CourtSurface = 'concrete' | 'asphalt' | 'sport_court' | 'wood' | 'acrylic' | 'other'

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  email_verified_at: string | null
  role: UserRole
  phone_number: string | null
  profile_picture: string | null
  avatar_url: string | null
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface Court {
  id: number
  owner_id: string
  
  // Basic Information
  name: string
  description: string | null
  type: CourtType
  surface: CourtSurface
  
  // Location
  address: string
  city: string
  state_province: string | null
  country: string
  postal_code: string | null
  latitude: number | null
  longitude: number | null
  
  // Court Details
  number_of_courts: number
  amenities: string[] | null
  hours_of_operation: Record<string, string | { open: string; close: string }> | null
  
  // Pricing
  is_free: boolean
  price_per_hour: number | null
  peak_hour_price: number | null
  pricing_details: Record<string, any> | null
  
  // Contact & Booking
  phone_number: string | null
  email: string | null
  website: string | null
  requires_booking: boolean
  booking_url: string | null
  
  // Media
  images: string[] | null
  cover_image: string | null
  
  // Verification & Moderation
  status: CourtStatus
  rejection_reason: string | null
  approved_by: string | null
  approved_at: string | null
  
  // Ratings & Stats
  rating: number
  total_reviews: number
  total_bookings: number
  view_count: number
  
  // Features
  is_featured: boolean
  is_active: boolean
  
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
      }
      courts: {
        Row: Court
        Insert: Omit<Court, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Court, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
