import { createClient } from '@/lib/supabase/client'

export interface PlayerStats {
  id: string;
  name: string;
  age: number;
  location: string;
  rank: number;
  rating: number;
  games_played: number;
  wins: number;
  losses: number;
  win_rate: number;
  level: string;
  avatar_url?: string;
  recent_performance?: string;
  specialty?: string;
  height?: string;
  weight?: string;
  dominant_hand?: string;
  gender?: string;
  turned_pro?: string;
  resides?: string;
  title?: string;
  dupr_id?: string;
  dupr_rating?: number;
  social_links?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  recent_games?: Array<{
    date: string;
    opponent: string;
    result: 'W' | 'L';
    score: string;
    points?: number;
  }>;
}

export const playerService = {
  /**
   * Get all players with optional filters
   * In a real Supabase setup, this would join users, user_statistics, and player_profiles
   */
  async getPlayers(filters?: {
    level?: string;
    search?: string;
  }) {
    const supabase = createClient()
    
    // In direct Supabase mode, we use the specific table that stores player stats
    // or a view that joins all necessary data.
    let query = supabase
      .from('player_rankings') // Assuming a view or table named player_rankings
      .select('*')

    if (filters?.level && filters.level !== 'all') {
      query = query.eq('level', filters.level)
    }

    if (filters?.search) {
      // Search in both name and location fields
      query = query.or(`name.ilike.%${filters.search}%,location.ilike.%${filters.search}%`)
    }

    const { data, error } = await query.order('rank', { ascending: true })

    if (error) {
      console.error('Error fetching players from Supabase:', error)
      // Return null to indicate error - the component will handle it
      return null
    }

    return data as PlayerStats[]
  },

  /**
   * Get detailed player stats including recent games
   */
  async getPlayerDetails(playerId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('player_rankings')
      .select('*')
      .eq('id', playerId)
      .single()

    if (error) throw error
    
    // In a real app, also fetch recent games
    // const { data: games } = await supabase.from('player_games')...

    return data as PlayerStats
  }
}
