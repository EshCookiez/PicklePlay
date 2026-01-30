export type TournamentStatus = 'upcoming' | 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
export type SanctioningBody = 'PPA' | 'MLP' | 'USAP' | 'USSP' | 'None';
export type EventCategory = 'singles' | 'doubles' | 'mixed_doubles' | 'coed';

export interface Tournament {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  
  // Dates
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  cancellation_deadline: string | null;
  
  // Location
  location_name: string;
  address: string | null;
  city: string;
  state_province: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  
  // Status & Type
  status: TournamentStatus;
  sanctioning_type: SanctioningBody;
  
  // Fees & Organizer
  base_fee: number;
  organizer_id: string | null;
  
  // Media
  image_url: string | null;
  website_url: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface TournamentEvent {
  id: string;
  tournament_id: string;
  name: string;
  category: EventCategory;
  gender: 'men' | 'women' | 'mixed' | 'any';
  
  min_skill: number | null;
  max_skill: number | null;
  min_age: number | null;
  max_age: number | null;
  
  format: string;
  fee: number;
  max_teams: number | null;
  current_teams: number;
  
  starts_at: string | null;
  scoring_format: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  event_id: string;
  player_id: string;
  partner_id: string | null;
  
  payment_status: 'pending' | 'paid' | 'refunded';
  registration_status: 'confirmed' | 'waitlisted' | 'withdrawn';
  
  created_at: string;
  updated_at: string;
}
