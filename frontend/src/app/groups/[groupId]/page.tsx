'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Trophy, MapPin, Clock, Share2, Bell } from 'lucide-react';

interface GroupProfile {
  id: string;
  name: string;
  description: string;
  location: string;
  memberCount: number;
  establishedDate: string;
  level: string;
  image: string;
  coverImage: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
    level: string;
    joinedDate: string;
  }>;
  features: string[];
  upcomingEvents: Array<{
    id: string;
    name: string;
    date: string;
    location: string;
    participants: number;
  }>;
}

const groupProfiles: Record<string, GroupProfile> = {
  'manila-pro-players': {
    id: 'manila-pro-players',
    name: 'Manila Pro Players',
    description: 'A dedicated group of competitive pickleball players based in Manila! Whether you\'re a beginner looking to improve or an advanced player seeking challenging matches, we welcome everyone!',
    location: 'Manila, Philippines',
    memberCount: 156,
    establishedDate: 'June 2023',
    level: 'Mixed (Beginner to Pro)',
    image: 'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=400&h=300&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1552674605-5defe6aa44bb?w=1200&h=300&fit=crop',
    features: [
      'Regular weekly matches and tournaments',
      'Professional coaching sessions',
      'Social events and networking',
      'Group discounts at courts',
      'Skill development programs',
    ],
    members: [
      {
        id: '1',
        name: 'Alex Rivera',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        level: 'Pro',
        joinedDate: 'June 2023',
      },
      {
        id: '2',
        name: 'Maria Santos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        level: 'Advanced',
        joinedDate: 'July 2023',
      },
      {
        id: '3',
        name: 'Carlo Mendez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlo',
        level: 'Intermediate',
        joinedDate: 'August 2023',
      },
      {
        id: '4',
        name: 'Lisa Wong',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        level: 'Advanced',
        joinedDate: 'September 2023',
      },
      {
        id: '5',
        name: 'James Park',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        level: 'Beginner',
        joinedDate: 'January 2024',
      },
    ],
    upcomingEvents: [
      {
        id: '1',
        name: 'Weekly Tuesday Night Matches',
        date: 'February 4, 2026',
        location: 'Makati Sports Complex',
        participants: 24,
      },
      {
        id: '2',
        name: 'Monthly Pro Tournament',
        date: 'February 15, 2026',
        location: 'BGC Pickleball Courts',
        participants: 32,
      },
      {
        id: '3',
        name: 'Beginner Training Session',
        date: 'February 8, 2026',
        location: 'Quezon City Courts',
        participants: 18,
      },
    ],
  },
};

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupId as string | undefined;
  const group = groupId ? groupProfiles[groupId] : undefined;

  if (!group || !groupId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Group Not Found</h1>
          <p className="text-slate-600 mb-8">The group you're looking for doesn't exist.</p>
          <button
            onClick={() => router.back()}
            className="bg-[#a3e635] hover:bg-[#84cc16] text-slate-900 font-semibold px-8 py-3 rounded-lg transition-all"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#a3e635]/10 rounded-lg transition-all text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-slate-900">{group.name}</h1>
        </div>
      </div>

      {/* Hero Cover Section */}
      <div className="relative w-full h-80 overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100">
        <img
          src={group.coverImage}
          alt={group.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Group Header Card */}
        <div className="relative -mt-20 mb-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Group Avatar */}
            <div className="relative">
              <img
                src={group.image}
                alt={group.name}
                className="w-40 h-40 rounded-xl border-4 border-[#a3e635]/20 shadow-lg object-cover"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#a3e635] text-slate-900 rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
                ✓
              </div>
            </div>

            {/* Group Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">{group.name}</h2>
                <p className="text-sm text-slate-500 font-medium">Established {group.establishedDate}</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-gray-200">
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-[#a3e635]">{group.memberCount}</p>
                  <p className="text-xs text-slate-600">Members</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-[#a3e635]">{group.upcomingEvents.length}</p>
                  <p className="text-xs text-slate-600">Events</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl font-bold text-[#a3e635]">⭐ 4.8</p>
                  <p className="text-xs text-slate-600">Rating</p>
                </div>
              </div>

              {/* Info Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#a3e635]/10 border border-[#a3e635]/30 rounded-lg">
                  <MapPin className="w-4 h-4 text-[#a3e635]" />
                  <span className="text-sm text-slate-700 font-medium">{group.location}</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-slate-700 font-medium">{group.level}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-[#a3e635] hover:bg-[#84cc16] text-slate-900 font-bold px-8 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:scale-105">
                  <Bell className="w-5 h-5" />
                  Join Group
                </button>
                <button className="border-2 border-[#a3e635] hover:bg-[#a3e635]/5 text-slate-900 font-semibold px-8 py-3 rounded-lg transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">About</h3>
          <p className="text-slate-600 leading-relaxed text-lg">{group.description}</p>
        </div>

        {/* Features Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">What We Offer</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {group.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-br from-[#a3e635]/5 to-transparent rounded-lg border border-[#a3e635]/20 hover:shadow-md transition-all">
                <div className="flex-shrink-0 w-10 h-10 bg-[#a3e635] rounded-lg flex items-center justify-center text-lg">
                  ✓
                </div>
                <span className="text-slate-700 font-medium pt-1">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-8 bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">📅 Upcoming Events</h3>
          <div className="space-y-4">
            {group.upcomingEvents.map((event, idx) => (
              <div key={event.id} className="relative p-5 border-l-4 border-[#a3e635] bg-gradient-to-r from-[#a3e635]/5 to-transparent rounded-lg hover:shadow-md transition-all group cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-[#84cc16] transition-all">{event.name}</h4>
                  </div>
                  <span className="ml-2 text-xs bg-[#a3e635] text-slate-900 px-3 py-1 rounded-full font-bold">
                    {event.participants} going
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-[#a3e635]" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-[#a3e635]" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Members Section */}
        <div className="mb-12 bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">👥 Group Members</h3>
            <span className="text-sm font-semibold text-slate-600 bg-[#a3e635]/10 px-4 py-2 rounded-lg">
              {group.members.length} Members
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.members.map((member) => (
              <div key={member.id} className="p-4 bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-[#a3e635]/30 transition-all group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-14 h-14 rounded-full border-2 border-[#a3e635]/30"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-[#84cc16] transition-all">{member.name}</h4>
                    <p className="text-xs font-semibold text-[#a3e635]">{member.level}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 pt-2 border-t border-gray-200">Joined {member.joinedDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
