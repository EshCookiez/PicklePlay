import { createClient } from '@/lib/supabase/client'
import { Court, CourtStatus } from '@/types/database'

/**
 * Court Management Service
 * Replaces Laravel API calls with direct Supabase queries
 */

export const courtService = {
  /**
   * Fetch courts with optional filtering
   */
  async getCourts(filters?: {
    status?: CourtStatus
    city?: string
    type?: string
    search?: string
    page?: number
    limit?: number
  }) {
    const supabase = createClient()
    let query = supabase
      .from('courts')
      .select('*, owner:users!owner_id(*)', { count: 'exact' })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.city) {
      query = query.eq('city', filters.city)
    }

    if (filters?.type) {
      query = query.eq('type', filters.type)
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`)
    }

    // Pagination
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query.range(from, to).order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) throw error

    return {
      data: data as Court[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  },

  /**
   * Get court statistics
   */
  async getStatistics() {
    const supabase = createClient()

    const [
      { count: total },
      { count: pending },
      { count: approved },
      { count: rejected },
    ] = await Promise.all([
      supabase.from('courts').select('*', { count: 'exact', head: true }),
      supabase.from('courts').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('courts').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('courts').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    ])

    return {
      total: total || 0,
      pending: pending || 0,
      approved: approved || 0,
      rejected: rejected || 0,
    }
  },

  /**
   * Get single court by ID
   */
  async getCourt(id: number) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courts')
      .select('*, owner:users!owner_id(*)')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Court
  },

  /**
   * Create a new court
   */
  async createCourt(courtData: Partial<Court>) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courts')
      .insert(courtData)
      .select()
      .single()

    if (error) throw error
    return data as Court
  },

  /**
   * Update court
   */
  async updateCourt(id: number, updates: Partial<Court>) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Court
  },

  /**
   * Approve a court
   */
  async approveCourt(courtId: number, approvedBy: string) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courts')
      .update({
        status: 'approved',
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
        rejection_reason: null,
      })
      .eq('id', courtId)
      .select()
      .single()

    if (error) throw error
    return data as Court
  },

  /**
   * Reject a court
   */
  async rejectCourt(courtId: number, reason: string) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courts')
      .update({
        status: 'rejected',
        rejection_reason: reason,
      })
      .eq('id', courtId)
      .select()
      .single()

    if (error) throw error
    return data as Court
  },

  /**
   * Suspend a court
   */
  async suspendCourt(courtId: number, reason?: string) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courts')
      .update({
        status: 'suspended',
        rejection_reason: reason || null,
      })
      .eq('id', courtId)
      .select()
      .single()

    if (error) throw error
    return data as Court
  },

  /**
   * Delete a court (soft delete)
   */
  async deleteCourt(courtId: number) {
    const supabase = createClient()

    const { error } = await supabase
      .from('courts')
      .delete()
      .eq('id', courtId)

    if (error) throw error
  },

  /**
   * Increment view count
   */
  async incrementViewCount(courtId: number) {
    const supabase = createClient()

    const { error } = await supabase.rpc('increment_court_views', {
      court_id: courtId,
    })

    if (error) {
      // Fallback if RPC doesn't exist
      const { data: court } = await supabase
        .from('courts')
        .select('view_count')
        .eq('id', courtId)
        .single()

      if (court) {
        await supabase
          .from('courts')
          .update({ view_count: court.view_count + 1 })
          .eq('id', courtId)
      }
    }
  },

  /**
   * Get courts owned by a specific user
   */
  async getOwnerCourts(ownerId: string) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return {
      data: data as Court[],
      total: data?.length || 0
    }
  },

  /**
   * Search courts by location (proximity)
   */
  async searchNearby(latitude: number, longitude: number, radiusKm: number = 10) {
    const supabase = createClient()

    // Using PostGIS or similar for proximity search
    // This is a simplified version - you may need to implement a proper distance function
    const { data, error } = await supabase
      .from('courts')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .eq('status', 'approved')

    if (error) throw error

    // Client-side distance filtering (consider moving to a Supabase function for better performance)
    const courtsWithDistance = data
      .map((court) => ({
        ...court,
        distance: calculateDistance(
          latitude,
          longitude,
          court.latitude!,
          court.longitude!
        ),
      }))
      .filter((court) => court.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance)

    return courtsWithDistance
  },
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}
