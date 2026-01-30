"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { tournamentService } from '@/services/tournamentService';
import { Tournament, TournamentEvent } from '@/types/tournament';
import { 
  Calendar, MapPin, Trophy, Users, Star, Info, 
  BarChart3, Clock, DollarSign, ChevronRight, Loader2,
  AlertCircle, ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

// Mock data for static mode
const MOCK_TOURNAMENT_DETAILS: Record<string, Tournament & { tournament_events: TournamentEvent[] }> = {
  'philippine-pickleball-open-2026': {
    id: '1',
    name: 'Philippine Pickleball Open 2026',
    slug: 'philippine-pickleball-open-2026',
    description: 'The biggest pickleball event in the Philippines. Join hundreds of players from all over the country and competing across various skill levels. This tournament follows USAP standards and will be a major ranking event for the 2026 season.',
    start_date: '2026-03-15',
    end_date: '2026-03-17',
    registration_start: '2026-01-01T00:00:00Z',
    registration_end: '2026-02-28T23:59:59Z',
    cancellation_deadline: '2026-03-01T00:00:00Z',
    location_name: 'Philsports Arena',
    address: 'Meralco Ave',
    city: 'Pasig',
    state_province: 'Metro Manila',
    country: 'Philippines',
    latitude: null,
    longitude: null,
    status: 'open',
    sanctioning_type: 'USAP',
    base_fee: 1500,
    organizer_id: null,
    image_url: 'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&q=80&w=800',
    website_url: 'https://philippinepickleball.com',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tournament_events: [
      {
        id: 'e1',
        tournament_id: '1',
        name: 'Men\'s Doubles 4.0+',
        category: 'doubles',
        gender: 'men',
        min_skill: 4.0,
        max_skill: 5.0,
        min_age: 19,
        max_age: null,
        format: 'round_robin',
        fee: 500,
        max_teams: 16,
        current_teams: 12,
        starts_at: '2026-03-15T08:00:00Z',
        scoring_format: 'best_of_3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'e2',
        tournament_id: '1',
        name: 'Mixed Doubles 3.5',
        category: 'mixed_doubles',
        gender: 'mixed',
        min_skill: 3.5,
        max_skill: 3.5,
        min_age: 19,
        max_age: null,
        format: 'double_elimination',
        fee: 500,
        max_teams: 24,
        current_teams: 20,
        starts_at: '2026-03-16T09:00:00Z',
        scoring_format: 'one_to_15',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ]
  }
};

export default function TournamentDetailPage() {
  const params = useParams() as { slug: string };
  const { slug } = params;
  const router = useRouter();
  const { user, openAuthModal } = useAuth();
  
  const [tournament, setTournament] = useState<(Tournament & { tournament_events: TournamentEvent[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [userRegistrations, setUserRegistrations] = useState<string[]>([]);

  useEffect(() => {
    const loadTournament = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        // Static mode: Use mock data based on slug
        const data = MOCK_TOURNAMENT_DETAILS[slug as string] || MOCK_TOURNAMENT_DETAILS['philippine-pickleball-open-2026'];
        setTournament(data);
        
        // No real registrations in static mode
        setUserRegistrations([]);
      } catch (error) {
        console.error('Error loading tournament:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTournament();
  }, [slug, user]);

  const handleRegister = async (event: TournamentEvent) => {
    if (!user) {
      openAuthModal();
      return;
    }

    setRegistering(event.id);
    try {
      // Static mode: Simulate successful registration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserRegistrations(prev => [...prev, event.id]);
      alert(`Successfully registered (Demo) for ${event.name}!`);
    } catch (error: any) {
      alert('Failed to register. Please try again.');
    } finally {
      setRegistering(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#a3e635] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading tournament details...</p>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tournament Not Found</h1>
        <p className="text-gray-500 mb-8">The tournament you are looking for doesn't exist or has been moved.</p>
        <button 
          onClick={() => router.push('/tournaments')}
          className="px-6 py-3 bg-[#a3e635] text-[#365314] font-bold rounded-xl"
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-96 w-full">
        <img 
          src={tournament.image_url || '/images/tournament-placeholder.jpg'} 
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6 z-30">
          <Link 
            href="/tournaments"
            className="flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-xl font-bold transition-all border border-white/10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Tournaments</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 bg-[#a3e635] text-[#365314] rounded-full text-xs font-bold uppercase tracking-wider">
                {tournament.status.replace('_', ' ')}
              </span>
              {tournament.sanctioning_type !== 'None' && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-wider">
                  {tournament.sanctioning_type} Sanctioned
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 line-clamp-2">
              {tournament.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#a3e635]" />
                <span>{format(new Date(tournament.start_date), 'MMMM d')} - {format(new Date(tournament.end_date), 'd, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                <span>{tournament.location_name}, {tournament.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content - Details & Events */}
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Info className="w-6 h-6 text-[#a3e635]" />
                  <h2 className="text-2xl font-bold text-gray-900">About Tournament</h2>
                </div>
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {tournament.description || "No description provided for this tournament."}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <Clock className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Registration Deadline</h4>
                        <p className="text-gray-600 text-sm">{format(new Date(tournament.registration_end), 'MMM d, yyyy h:mm a')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <DollarSign className="w-6 h-6 text-green-500 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">Base Registration Fee</h4>
                        <p className="text-gray-600 text-sm">₱{tournament.base_fee}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Events Section */}
              <section id="events">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-6 h-6 text-[#a3e635]" />
                  <h2 className="text-2xl font-bold text-gray-900">Available Events</h2>
                </div>
                
                <div className="space-y-4">
                  {tournament.tournament_events && tournament.tournament_events.length > 0 ? (
                    tournament.tournament_events.map((event) => (
                      <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-lime-200 transition-colors">
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" /> 
                              Level: {event.min_skill ? `${event.min_skill}${event.max_skill ? ` - ${event.max_skill}` : '+'}` : 'All Skills'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.max_teams ? `${event.current_teams}/${event.max_teams} Teams` : 'Unlimited'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              Format: {event.format.replace('_', ' ')}
                            </span>
                          </div>
                          {(event.category === 'doubles' || event.category === 'mixed_doubles') && (
                            <p className="mt-2 text-xs text-blue-600 font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                              Partner selection will be available after initial registration.
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Event Fee</p>
                            <p className="text-xl font-black text-gray-900">₱{event.fee}</p>
                          </div>
                          <button
                            onClick={() => handleRegister(event)}
                            disabled={registering === event.id || tournament.status !== 'open' || userRegistrations.includes(event.id)}
                            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
                              userRegistrations.includes(event.id)
                                ? 'bg-green-100 text-green-700 cursor-default'
                                : tournament.status === 'open'
                                  ? 'bg-[#a3e635] text-[#365314] hover:bg-[#84cc16]'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            } flex items-center gap-2 whitespace-nowrap`}
                          >
                            {registering === event.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : userRegistrations.includes(event.id) ? (
                              <>
                                <Users className="w-4 h-4" />
                                Registered
                              </>
                            ) : (
                              'Register'
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                      <p className="text-gray-500">No events have been listed for this tournament yet.</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Sidebar - Info & Actions */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-lime-900/5 border border-lime-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#a3e635] fill-[#a3e635]" />
                  Tournament Info
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Location</p>
                    <p className="text-gray-900 font-bold">{tournament.location_name}</p>
                    <p className="text-gray-500 text-sm">{tournament.address}</p>
                    <p className="text-gray-500 text-sm">{tournament.city}, {tournament.state_province}</p>
                  </div>
                  
                  <div className="h-px bg-gray-100"></div>
                  
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Sanctioning</p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-black text-xs text-gray-400">
                        {tournament.sanctioning_type === 'None' ? '?' : '✓'}
                      </div>
                      <p className="text-gray-900 font-bold">{tournament.sanctioning_type} Sanctioned</p>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100"></div>

                  <div className="pt-2">
                    <button 
                      onClick={() => {
                        const el = document.getElementById('events');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-4 bg-[#365314] text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10"
                    >
                      Join Tournament
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Share/External Link */}
              {tournament.website_url && (
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="text-blue-900 font-bold mb-2">Official Website</h4>
                  <p className="text-blue-700 text-sm mb-4">Visit the official tournament website for more detailed information.</p>
                  <a 
                    href={tournament.website_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1"
                  >
                    Visit Website <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
