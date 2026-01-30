import { createClient } from '@/lib/supabase/client';
import { Tournament, TournamentEvent, TournamentRegistration } from '@/types/tournament';

export const tournamentService = {
  /**
   * Fetch all tournaments with optional filters
   */
  async getTournaments(limit = 10) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('start_date', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching tournaments:', error);
      return [];
    }

    return data as Tournament[];
  },

  /**
   * Fetch a single tournament by slug
   */
  async getTournamentBySlug(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tournaments')
      .select('*, tournament_events(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching tournament detail:', error);
      return null;
    }

    return data as (Tournament & { tournament_events: TournamentEvent[] });
  },

  /**
   * Get events for a specific tournament
   */
  async getEvents(tournamentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tournament_events')
      .select('*')
      .eq('tournament_id', tournamentId)
      .order('starts_at', { ascending: true });

    if (error) {
      console.error('Error fetching tournament events:', error);
      return [];
    }

    return data as TournamentEvent[];
  },

  /**
   * Register for a tournament event
   */
  async registerForEvent(registration: Omit<TournamentRegistration, 'id' | 'created_at' | 'updated_at'>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tournament_registrations')
      .insert(registration)
      .select()
      .single();

    if (error) {
      console.error('Error registering for event:', error);
      throw error;
    }

    return data as TournamentRegistration;
  },

  /**
   * Get registrations for a player
   */
  async getPlayerRegistrations(playerId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('*, tournaments(*), tournament_events(*)')
      .eq('player_id', playerId);

    if (error) {
      console.error('Error fetching player registrations:', error);
      return [];
    }

    return data;
  },

  /**
   * Get registrations for a player in a specific tournament
   */
  async getPlayerTournamentRegistrations(playerId: string, tournamentId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tournament_registrations')
      .select('event_id')
      .eq('player_id', playerId)
      .eq('tournament_id', tournamentId);

    if (error) {
      console.error('Error fetching tournament registrations:', error);
      return [];
    }

    return data.map(r => r.event_id);
  }
};
