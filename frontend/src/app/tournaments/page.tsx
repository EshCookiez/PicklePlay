"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import TournamentCard from '@/components/TournamentCard';
import { tournamentService } from '@/services/tournamentService';
import { Tournament } from '@/types/tournament';
import { Search, Filter, Calendar, Trophy, MapPin, Loader2 } from 'lucide-react';

// Mock data for initial preview if DB is empty
const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    name: 'Philippine Pickleball Open 2026',
    slug: 'philippine-pickleball-open-2026',
    description: 'The biggest pickleball event in the Philippines.',
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
    website_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Cebu Summer Smash',
    slug: 'cebu-summer-smash',
    description: 'Annual summer tournament in the Queen City of the South.',
    start_date: '2026-04-10',
    end_date: '2026-04-12',
    registration_start: '2026-02-01T00:00:00Z',
    registration_end: '2026-03-31T23:59:59Z',
    cancellation_deadline: '2026-04-01T00:00:00Z',
    location_name: 'Cebu City Sports Center',
    address: 'Osmeña Blvd',
    city: 'Cebu City',
    state_province: 'Cebu',
    country: 'Philippines',
    latitude: null,
    longitude: null,
    status: 'upcoming',
    sanctioning_type: 'None',
    base_fee: 1200,
    organizer_id: null,
    image_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    website_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Davao Invitational 2026',
    slug: 'davao-invitational-2026',
    description: 'Exclusive invitational tournament for top players.',
    start_date: '2026-05-20',
    end_date: '2026-05-22',
    registration_start: '2026-03-01T00:00:00Z',
    registration_end: '2026-05-10T23:59:59Z',
    cancellation_deadline: '2026-05-15T00:00:00Z',
    location_name: 'Davao City Recreation Center',
    address: 'Ponciano Reyes St',
    city: 'Davao City',
    state_province: 'Davao del Sur',
    country: 'Philippines',
    latitude: null,
    longitude: null,
    status: 'upcoming',
    sanctioning_type: 'PPA',
    base_fee: 2000,
    organizer_id: null,
    image_url: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?auto=format&fit=crop&q=80&w=800',
    website_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadTournaments = async () => {
      setLoading(true);
      try {
        // Static mode: Always use mock data
        setTournaments(MOCK_TOURNAMENTS);
      } catch (error) {
        console.error('Error loading tournaments:', error);
        setTournaments(MOCK_TOURNAMENTS);
      } finally {
        setLoading(false);
      }
    };

    loadTournaments();
  }, []);

  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         t.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Hero Section with Brand Colors */}
      <section className="relative bg-[#a3e635] py-12 px-4 overflow-hidden">
        {/* Decorative Balls */}
        <div className="absolute top-0 right-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <Image src="/images/Ball.png" alt="" width={300} height={300} />
        </div>
        <div className="absolute bottom-0 left-0 opacity-10 -translate-x-1/4 translate-y-1/4">
          <Image src="/images/Ball.png" alt="" width={200} height={200} />
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#365314]/10 rounded-full text-[#365314] text-sm font-bold mb-6">
            <Trophy className="w-4 h-4" />
            <span>PICKLEBALL TOURNAMENTS PH</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#365314] mb-6 tracking-tight">
            Compete on the <span className="text-white drop-shadow-sm">National</span> Stage
          </h1>
          <p className="text-[#365314]/80 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Join the most exciting pickleball tournaments across the Philippines. Improve your skill, earn rankings, and win prizes.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-16">
          {/* Filters & Search */}
          <div className="bg-white p-6 rounded-2xl shadow-xl shadow-lime-900/5 border border-lime-100 mb-10 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Search tournaments, cities..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a3e635] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="hidden sm:flex items-center gap-2 text-gray-500 font-medium">
                <Filter className="w-4 h-4" />
                <span>Filter:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto no-scrollbar">
                {['all', 'open', 'upcoming', 'in_progress'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                      statusFilter === status 
                        ? 'bg-[#a3e635] text-[#365314] shadow-md shadow-lime-500/20' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tournament Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-[#a3e635] animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading amazing tournaments...</p>
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-lime-100">
              <div className="mx-auto bg-lime-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-[#a3e635]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No tournaments found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                We couldn't find any tournaments matching your current criteria. Try adjusting your filters.
              </p>
              <button 
                onClick={() => {setSearchTerm(''); setStatusFilter('all');}}
                className="mt-8 px-6 py-3 bg-[#a3e635] text-[#365314] font-bold rounded-xl hover:bg-[#84cc16] transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
