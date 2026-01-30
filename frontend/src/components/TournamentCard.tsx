import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Trophy, Users, Star } from 'lucide-react';
import { Tournament } from '@/types/tournament';
import { format } from 'date-fns';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-lime-100 text-lime-800 border-lime-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img 
          src={tournament.image_url || '/images/tournament-placeholder.jpg'} 
          alt={tournament.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(tournament.status)} shadow-sm`}>
            {tournament.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        {tournament.sanctioning_type !== 'None' && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#a3e635]/90 backdrop-blur-md text-[#365314] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              {tournament.sanctioning_type} Sanctioned
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-[#65a30d] transition-colors">
            {tournament.name}
          </h3>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm gap-2">
            <Calendar className="w-4 h-4 text-[#84cc16]" />
            <span>
              {format(new Date(tournament.start_date), 'MMM d')} - {format(new Date(tournament.end_date), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="line-clamp-1">{tournament.location_name}, {tournament.city}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Base Fee: ₱{tournament.base_fee}</span>
          </div>
        </div>

        <Link 
          href={`/tournaments/${tournament.slug}`}
          className="block w-full text-center py-2.5 bg-[#a3e635] hover:bg-[#84cc16] text-[#365314] font-bold rounded-lg transition-colors border border-[#84cc16]/20"
        >
          View Tournament
        </Link>
      </div>
    </div>
  );
};

export default TournamentCard;
