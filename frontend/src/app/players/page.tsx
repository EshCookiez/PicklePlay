"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, TrendingUp, Trophy, Award, Users, MapPin, Target, Zap, 
  Filter, X, Calendar, BarChart, ChevronRight, History, Instagram, 
  Youtube, User as UserIcon 
} from 'lucide-react';
import { playerService, PlayerStats } from '@/services/playerService';

const MOCK_PLAYERS: PlayerStats[] = [
  {
    id: '1',
    name: 'Ben Johns',
    age: 26,
    location: 'Florida, USA',
    rank: 1,
    rating: 6.0,
    games_played: 1420,
    wins: 1350,
    losses: 70,
    win_rate: 95.1,
    level: 'Pro',
    recent_performance: '15-2 in last 17 matches',
    specialty: 'Aggressive baseline play',
    dominant_hand: 'Right-Handed',
    height: '6\'1" / 185 cm',
    weight: '185 lbs',
    gender: 'MALE',
    turned_pro: '2016',
    resides: 'FLORIDA',
    title: 'TOUR PRO',
    dupr_id: 'V8DYL8',
    dupr_rating: 7.22,
    social_links: {
      instagram: 'https://instagram.com/benjohns',
      youtube: 'https://youtube.com/@benjohns'
    },
    recent_games: [
      { date: 'Jan 28', opponent: 'Sofia Cruz', result: 'W', score: '11-8, 11-9', points: 15 },
      { date: 'Jan 24', opponent: 'Ana Mendoza', result: 'W', score: '11-5, 11-4', points: 12 },
      { date: 'Jan 20', opponent: 'Miguel Torres', result: 'W', score: '11-7, 11-9', points: 14 }
    ]
  },
  {
    id: '2',
    name: 'Aanik Lohani',
    age: 27,
    location: 'Golden Valley, MN',
    rank: 115,
    rating: 5.8,
    games_played: 156,
    wins: 124,
    losses: 32,
    win_rate: 79.5,
    level: 'Pro',
    recent_performance: 'Won 8 straight',
    specialty: 'Dink mastery',
    dominant_hand: 'Right-Handed',
    height: '5\'10" / 177 cm',
    weight: '165 lbs',
    gender: 'MALE',
    turned_pro: '2023',
    resides: 'GOLDEN VALLEY, MN',
    title: 'TOUR PRO',
    dupr_id: '8E9L4V',
    dupr_rating: 5.78,
    social_links: {
      instagram: 'https://instagram.com/aaniklohani',
      youtube: 'https://youtube.com/@aaniklohani'
    },
    recent_games: [
      { date: 'Jan 27', opponent: 'Juan Dela Cruz', result: 'W', score: '11-9, 11-7', points: 13 },
      { date: 'Jan 22', opponent: 'Miguel Torres', result: 'W', score: '11-4, 11-6', points: 10 }
    ]
  },
  {
    id: '3',
    name: 'Sofia Cruz',
    age: 25,
    location: 'Makati, PH',
    rank: 3,
    rating: 4.7,
    games_played: 98,
    wins: 76,
    losses: 22,
    win_rate: 77.6,
    level: 'Advanced',
    recent_performance: '12-3 this month',
    specialty: 'Net dominance',
    dominant_hand: 'Left-Handed',
    height: '5\'4" / 162 cm',
    weight: '125 lbs',
    gender: 'FEMALE',
    turned_pro: '2024',
    resides: 'MAKATI, PH',
    title: 'ADVANCED PRO'
  },
  {
    id: '4',
    name: 'Juan Dela Cruz',
    age: 35,
    location: 'Quezon City, PH',
    rank: 4,
    rating: 4.6,
    games_played: 187,
    wins: 138,
    losses: 49,
    win_rate: 73.8,
    level: 'Advanced',
    recent_performance: 'Consistent performer',
    specialty: 'Strategic positioning',
    dominant_hand: 'Right-Handed',
    height: '5\'11" / 180 cm',
    weight: '175 lbs',
    gender: 'MALE',
    resides: 'QUEZON CITY, PH',
    title: 'ADVANCED'
  },
  {
    id: '5',
    name: 'Ana Mendoza',
    age: 22,
    location: 'Davao, PH',
    rank: 5,
    rating: 4.5,
    games_played: 67,
    wins: 48,
    losses: 19,
    win_rate: 71.6,
    level: 'Advanced',
    recent_performance: 'Rising star - 9-1 streak',
    specialty: 'Power serves',
    dominant_hand: 'Right-Handed',
    height: '5\'5" / 165 cm',
    weight: '120 lbs',
    gender: 'FEMALE',
    resides: 'DAVAO, PH',
    title: 'RISING STAR'
  }
];

export default function PlayersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [players, setPlayers] = useState<PlayerStats[]>(MOCK_PLAYERS);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true);
      try {
        const data = await playerService.getPlayers({ 
          level: filterLevel === 'all' ? undefined : filterLevel,
          search: searchQuery || undefined
        });
        if (data) {
          setPlayers(data);
        } else {
          // If no data (table doesn't exist), use mock but apply filters
          const filtered = MOCK_PLAYERS.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 p.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLevel = filterLevel === 'all' || p.level === filterLevel;
            return matchesSearch && matchesLevel;
          });
          setPlayers(filtered);
        }
      } catch (err) {
        console.error('Failed to fetch players:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPlayers, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [searchQuery, filterLevel]);

  const handlePlayerSelect = async (player: PlayerStats) => {
    setSelectedPlayer(player);
    setActiveTab('overview');
    try {
      const details = await playerService.getPlayerDetails(player.id);
      if (details) setSelectedPlayer(details);
    } catch (err) {
      console.error('Error fetching details:', err);
    }
  };

  const topPerformer = players[0] || MOCK_PLAYERS[0];
  const risingStars = players.slice(1, 4).length > 0 ? players.slice(1, 4) : MOCK_PLAYERS.slice(1, 4);

  return (
    <>
      {/* Player Detail Modal */}
      {mounted && selectedPlayer && createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-[#0f2e22] text-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              {/* Banner Decoration */}
              <div className="h-32 bg-gradient-to-r from-[#a3e635]/20 to-transparent absolute top-0 left-0 right-0" />
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="relative pt-12 px-8 pb-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center md:items-end gap-8 mb-12">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-[#a3e635] shadow-xl bg-[#0a1f17]">
                      <img 
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedPlayer.name}`}
                        alt={selectedPlayer.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-4 -right-4 bg-[#a3e635] text-[#0f2e22] px-4 py-2 rounded-xl font-black text-xl shadow-lg border-4 border-[#0f2e22]">
                      #{selectedPlayer.rank}
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-3 py-1 rounded-full bg-[#a3e635]/10 text-[#a3e635] text-xs font-bold tracking-widest uppercase mb-3">
                      {selectedPlayer.title || (selectedPlayer.level === 'Pro' ? 'TOUR PRO' : 'RANKED PLAYER')}
                    </div>
                    <h2 className="text-5xl font-black mb-4 tracking-tight uppercase leading-none">{selectedPlayer.name}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-white/60">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#a3e635]" /> {selectedPlayer.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-[#a3e635]" /> {selectedPlayer.age} Years Old
                      </span>
                      <div className="flex items-center gap-3 ml-2">
                        {selectedPlayer.social_links?.instagram && (
                          <a href={selectedPlayer.social_links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#a3e635] transition-colors">
                            <Instagram className="w-5 h-5" />
                          </a>
                        )}
                        {selectedPlayer.social_links?.youtube && (
                          <a href={selectedPlayer.social_links.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-[#a3e635] transition-colors">
                            <Youtube className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Core Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                  {[
                    { label: 'DUPR RATING', value: selectedPlayer.dupr_rating?.toFixed(2) || selectedPlayer.rating.toFixed(2), color: 'text-[#a3e635]' },
                    { label: 'WORLD RANK', value: `#${selectedPlayer.rank}`, color: 'text-white' },
                    { label: 'WIN RATE', value: `${selectedPlayer.win_rate}%`, color: 'text-white' },
                    { label: 'GAMES', value: selectedPlayer.games_played, color: 'text-white' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center group hover:border-[#a3e635]/50 transition-colors">
                      <div className="text-[10px] font-bold text-white/40 tracking-[0.2em] mb-2">{stat.label}</div>
                      <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto scrollbar-hide">
                  {['OVERVIEW', 'TOURNAMENT HISTORY', 'UPCOMING EVENTS'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-xs font-black tracking-widest whitespace-nowrap transition-colors relative ${
                        activeTab === tab ? 'text-[#a3e635]' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#a3e635] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'OVERVIEW' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-[#a3e635]" />
                        BIOGRAPHICAL DATA
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10 rounded-2xl overflow-hidden">
                        {[
                          { label: 'GENDER', value: selectedPlayer.gender || 'MALE' },
                          { label: 'TURNED PRO', value: selectedPlayer.turned_pro || 'N/A' },
                          { label: 'RESIDES', value: selectedPlayer.resides || selectedPlayer.location },
                          { label: 'DOMINANT HAND', value: selectedPlayer.dominant_hand },
                          { label: 'HEIGHT', value: selectedPlayer.height },
                          { label: 'SPECIALTY', value: selectedPlayer.specialty }
                        ].map((item, i) => (
                          <div key={i} className="bg-[#0f2e22] p-6 flex justify-between items-center group hover:bg-white/5 transition-colors">
                            <span className="text-[11px] font-bold text-white/40 tracking-wider text-left">{item.label}</span>
                            <span className="font-bold text-sm tracking-wide text-right">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      {selectedPlayer.recent_games && (
                        <div className="mt-12">
                          <h3 className="text-xl font-bold mb-6 flex items-center gap-3 uppercase tracking-tight">
                            <History className="w-5 h-5 text-[#a3e635]" />
                            Recent Performance
                          </h3>
                          <div className="space-y-3">
                            {selectedPlayer.recent_games.map((game, i) => (
                              <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black ${
                                  game.result === 'W' ? 'bg-[#a3e635]/20 text-[#a3e635]' : 'bg-red-500/20 text-red-500'
                                }`}>
                                  {game.result}
                                </div>
                                <div className="flex-1">
                                  <div className="text-xs font-bold text-white/40 mb-1">{game.date}</div>
                                  <div className="font-bold">vs {game.opponent}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-mono text-lg font-bold">{game.score}</div>
                                  <div className="text-[10px] font-bold text-[#a3e635]">+{game.points} PTS</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-[#1a3a2f] to-[#0f2e22] p-8 rounded-3xl border border-[#a3e635]/20">
                        <h4 className="text-[#a3e635] font-black text-sm tracking-widest uppercase mb-6">Pro Rating Detail</h4>
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between text-xs font-bold text-white/40 mb-2 tracking-widest uppercase">Singles DUPR</div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#a3e635] w-[85%]" />
                            </div>
                            <div className="mt-2 text-2xl font-black">{selectedPlayer.dupr_rating || 7.20}</div>
                          </div>
                          <div>
                            <div className="flex justify-between text-xs font-bold text-white/40 mb-2 tracking-widest uppercase">Doubles DUPR</div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#a3e635] w-[92%]" />
                            </div>
                            <div className="mt-2 text-2xl font-black">7.15</div>
                          </div>
                          <div className="pt-6 border-t border-white/10">
                            <p className="text-xs text-white/60 leading-relaxed italic">
                              "Ratings are updated weekly based on tournament results and DUPR verified matches."
                            </p>
                          </div>
                        </div>
                      </div>

                      <button className="w-full bg-[#a3e635] hover:bg-[#b4f34d] text-[#0f2e22] py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-[#a3e635]/20">
                        Follow Player
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'TOURNAMENT HISTORY' && (
                  <div className="py-12 text-center">
                    <Award className="w-16 h-16 text-[#a3e635]/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Tournament Records</h3>
                    <p className="text-white/40">Coming soon for {selectedPlayer.name}</p>
                  </div>
                )}

                {activeTab === 'UPCOMING EVENTS' && (
                  <div className="py-12 text-center">
                    <Calendar className="w-16 h-16 text-[#a3e635]/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Upcoming Schedule</h3>
                    <p className="text-white/40">No scheduled events found for this player.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0f2e22] to-[#1a4d35] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-10 h-10 text-[#a3e635]" />
            <h1 className="text-4xl md:text-5xl font-bold">Player Directory</h1>
          </div>
          <p className="text-lg text-gray-200 max-w-2xl">
            Discover talented pickleball players across the Philippines. Find partners, rivals, and rising stars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Player */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-[#a3e635]" />
            <h2 className="text-2xl font-bold text-slate-900">Top Performer</h2>
          </div>
          
          <div className="bg-gradient-to-br from-[#0f2e22] to-[#1a4d35] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden cursor-pointer" onClick={() => handlePlayerSelect(topPerformer)}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#a3e635] opacity-10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10 grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[#a3e635] text-sm font-semibold mb-1">RANK #{topPerformer.rank}</div>
                    <h3 className="text-3xl font-bold mb-2">{topPerformer.name}</h3>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{topPerformer.location}</span>
                      <span className="mx-2">•</span>
                      <span>{topPerformer.age} years old</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-[#a3e635] to-green-600 rounded-full flex items-center justify-center text-3xl font-bold">
                    {topPerformer.rating}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#a3e635]" />
                    <span className="font-semibold">{topPerformer.recent_performance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#a3e635]" />
                    <span>{topPerformer.specialty}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-[#a3e635] text-2xl font-bold">{topPerformer.games_played}</div>
                  <div className="text-sm text-gray-300">Games</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-[#a3e635] text-2xl font-bold">{topPerformer.wins}</div>
                  <div className="text-sm text-gray-300">Wins</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-[#a3e635] text-2xl font-bold">{topPerformer.win_rate}%</div>
                  <div className="text-sm text-gray-300">Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Players */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-[#a3e635]" />
            <h2 className="text-2xl font-bold text-slate-900">Trending Performance</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {risingStars.map((player, idx) => {
              const colors = [
                'from-red-600 to-red-800',
                'from-purple-600 to-purple-800',
                'from-blue-600 to-blue-800'
              ];
              return (
                <div key={player.id} className={`bg-gradient-to-br ${colors[idx]} rounded-xl p-6 text-white relative overflow-hidden cursor-pointer hover:scale-105 transition-transform`} onClick={() => handlePlayerSelect(player)}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold opacity-90">RANK #{player.rank}</div>
                      <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                        {player.level}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-1">{player.name}</h3>
                    <div className="text-sm opacity-80 mb-4">{player.location} • {player.age}y</div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span className="font-semibold">{player.recent_performance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Win Rate:</span>
                        <span className="font-bold">{player.win_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span className="font-bold">{player.rating}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search players by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2e22] focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f2e22] focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Pro">Pro</option>
            </select>
          </div>
        </div>

        {/* Player Rankings Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 bg-gradient-to-r from-[#0f2e22] to-[#1a4d35] border-b border-gray-200">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#a3e635]" />
              Player Rankings
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Player</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Games</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Record</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Win %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {players.map((player) => (
                  <tr key={player.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handlePlayerSelect(player)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          player.rank <= 3 ? 'bg-[#a3e635] text-[#0f2e22]' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {player.rank}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-semibold text-gray-900">{player.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {player.location}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        player.level === 'Pro' ? 'bg-[#a3e635]/20 text-[#0f2e22] border border-[#a3e635]' :
                        player.level === 'Advanced' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        player.level === 'Intermediate' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}>
                        {player.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[#0f2e22]">{player.rating}</span>
                        <span className="text-gray-400 text-sm">/5.0</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {player.games_played}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-600 font-semibold">{player.wins}</span>
                      <span className="text-gray-400 mx-1">-</span>
                      <span className="text-red-600 font-semibold">{player.losses}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                          <div 
                            className="bg-[#a3e635] h-2 rounded-full" 
                            style={{ width: `${player.win_rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{player.win_rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
