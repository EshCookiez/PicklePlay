import { createClient } from '@/lib/supabase/client'
import { User, UserRole, UserStatus } from '@/types/database'

/**
 * User Management Service
 * Replaces Laravel user API calls with direct Supabase queries
 */

export const userService = {
  /**
   * Get all users with optional filtering
   */
  async getUsers(filters?: {
    role?: UserRole
    status?: UserStatus
    search?: string
    page?: number
    limit?: number
  }) {
    const supabase = createClient()
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })

    if (filters?.role) {
      query = query.eq('role', filters.role)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.search) {
      query = query.or(
        `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
      )
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
      data: data as User[],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    }
  },

  /**
   * Get single user by ID
   */
  async getUser(id: string) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as User
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const supabase = createClient()

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()

    if (!authUser) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error) throw error
    return data as User
  },

  /**
   * Update user
   */
  async updateUser(id: string, updates: Partial<User>) {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as User
  },

  /**
   * Update user role
   */
  async updateUserRole(userId: string, role: UserRole) {
    return this.updateUser(userId, { role })
  },

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: UserStatus) {
    return this.updateUser(userId, { status })
  },

  /**
   * Suspend user
   */
  async suspendUser(userId: string) {
    return this.updateUserStatus(userId, 'suspended')
  },

  /**
   * Activate user
   */
  async activateUser(userId: string) {
    return this.updateUserStatus(userId, 'active')
  },

  /**
   * Delete user (soft delete via status)
   */
  async deleteUser(userId: string) {
    return this.updateUserStatus(userId, 'inactive')
  },

  /**
   * Get user statistics
   */
  async getStatistics() {
    const supabase = createClient()

    const [
      { count: total },
      { count: active },
      { count: suspended },
      { count: coaches },
      { count: courtOwners },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'suspended'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'coach'),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'court_owner'),
    ])

    return {
      total: total || 0,
      active: active || 0,
      suspended: suspended || 0,
      coaches: coaches || 0,
      courtOwners: courtOwners || 0,
    }
  },
}
