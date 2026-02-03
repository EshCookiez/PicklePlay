import { createClient } from '@/lib/supabase/client'

export interface UserFavorite {
  id: number
  user_id: string
  court_id: number
  created_at: string
}

export const favoriteService = {
  /**
   * Get user's favorite court IDs
   */
  async getFavorites(userId: string): Promise<number[]> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('court_id')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching favorites:', error)
      return []
    }
    
    return data.map(f => f.court_id)
  },

  /**
   * Get user's favorite courts with full court details
   */
  async getFavoriteCourts(userId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('court_id, courts(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching favorite courts:', error)
      return []
    }
    
    return data.map(f => f.courts)
  },

  /**
   * Add court to favorites
   */
  async addFavorite(userId: string, courtId: number): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('user_favorites')
      .insert({ user_id: userId, court_id: courtId })
    
    if (error) {
      console.error('Error adding favorite:', error)
      return false
    }
    
    return true
  },

  /**
   * Remove court from favorites
   */
  async removeFavorite(userId: string, courtId: number): Promise<boolean> {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', userId)
      .eq('court_id', courtId)
    
    if (error) {
      console.error('Error removing favorite:', error)
      return false
    }
    
    return true
  },

  /**
   * Toggle favorite (add if not exists, remove if exists)
   */
  async toggleFavorite(userId: string, courtId: number): Promise<boolean> {
    const favorites = await this.getFavorites(userId)
    
    if (favorites.includes(courtId)) {
      return await this.removeFavorite(userId, courtId)
    } else {
      return await this.addFavorite(userId, courtId)
    }
  },

  /**
   * Check if court is favorited
   */
  async isFavorited(userId: string, courtId: number): Promise<boolean> {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('user_favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('court_id', courtId)
      .single()
    
    if (error) return false
    return !!data
  }
}
