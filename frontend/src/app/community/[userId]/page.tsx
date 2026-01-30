"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, UserPlus, Share2, Trophy, Zap, MapPin, Calendar, Star, Mail } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Pro";
  bio: string;
  location: string;
  joinDate: string;
  stats: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    rating: number;
  };
  badges: string[];
  recentPosts: number;
}

const userProfiles: Record<string, UserProfile> = {
  "alexrivera": {
    id: "1",
    name: "Alex Rivera",
    handle: "@alexrivera",
    avatar: "A",
    level: "Pro",
    bio: "Professional pickleball player | Tournament winner | Love the game 🎾",
    location: "Manila, Philippines",
    joinDate: "January 2024",
    stats: {
      matchesPlayed: 245,
      wins: 198,
      losses: 47,
      rating: 4.8,
    },
    badges: ["Tournament Winner", "Top Player", "Community Leader"],
    recentPosts: 28,
  },
  "mariasantos": {
    id: "2",
    name: "Maria Santos",
    handle: "@mariasantos",
    avatar: "M",
    level: "Advanced",
    bio: "Passionate about pickleball and fitness 💪 Always up for a challenge",
    location: "Makati, Philippines",
    joinDate: "March 2024",
    stats: {
      matchesPlayed: 156,
      wins: 112,
      losses: 44,
      rating: 4.6,
    },
    badges: ["Consistent Player", "Great Attitude"],
    recentPosts: 12,
  },
  "carlomendez": {
    id: "3",
    name: "Carlo Mendez",
    handle: "@carlomendez",
    avatar: "C",
    level: "Intermediate",
    bio: "Learning and growing in pickleball journey 🚀",
    location: "Quezon City, Philippines",
    joinDate: "June 2024",
    stats: {
      matchesPlayed: 87,
      wins: 45,
      losses: 42,
      rating: 4.2,
    },
    badges: ["Friendly", "Quick Learner"],
    recentPosts: 15,
  },
  "lisawong": {
    id: "4",
    name: "Lisa Wong",
    handle: "@lisawong",
    avatar: "L",
    level: "Advanced",
    bio: "Pickleball enthusiast | Team captain 👥",
    location: "Taguig, Philippines",
    joinDate: "February 2024",
    stats: {
      matchesPlayed: 178,
      wins: 135,
      losses: 43,
      rating: 4.7,
    },
    badges: ["Team Leader", "Community Builder"],
    recentPosts: 45,
  },
  "jamespark": {
    id: "5",
    name: "James Park",
    handle: "@jamespark",
    avatar: "J",
    level: "Beginner",
    bio: "New to pickleball but loving every minute! 🎾😊",
    location: "BGC, Philippines",
    joinDate: "December 2024",
    stats: {
      matchesPlayed: 12,
      wins: 6,
      losses: 6,
      rating: 3.8,
    },
    badges: ["Enthusiastic", "Friendly"],
    recentPosts: 8,
  },
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "Pro":
      return "bg-[#FFD700] text-[#654321]";
    case "Advanced":
      return "bg-[#a3e635] text-[#0f2e22]";
    case "Intermediate":
      return "bg-[#60a5fa] text-white";
    case "Beginner":
      return "bg-[#94a3b8] text-white";
    default:
      return "bg-slate-200 text-slate-700";
  }
};

const getLevelBgColor = (level: string) => {
  switch (level) {
    case "Pro":
      return "from-[#FFD700] to-[#FFC700]";
    case "Advanced":
      return "from-[#a3e635] to-[#84cc16]";
    case "Intermediate":
      return "from-[#60a5fa] to-[#3b82f6]";
    case "Beginner":
      return "from-[#94a3b8] to-[#78716c]";
    default:
      return "from-slate-400 to-slate-500";
  }
};

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.userId as string) || "";
  const [isFollowing, setIsFollowing] = useState(false);

  const userKey = userId ? userId.toLowerCase().replace(/%20/g, "-") : "";
  const user = userKey ? userProfiles[userKey] : undefined;

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">User Not Found</h1>
          <p className="text-slate-600 mb-6">The user profile you're looking for doesn't exist.</p>
          <Link
            href="/community"
            className="inline-flex items-center gap-2 bg-[#a3e635] hover:bg-[#84cc16] text-[#0f2e22] font-bold py-3 px-6 rounded-xl transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  const winRate = user.stats.matchesPlayed > 0 
    ? Math.round((user.stats.wins / user.stats.matchesPlayed) * 100) 
    : 0;

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 overflow-x-hidden animate-in fade-in duration-1000 relative bg-white">
      {/* Decorative Background Ball Images */}
      <div className="absolute top-10 left-10 w-20 h-20 opacity-8 pointer-events-none z-0">
        <Image src="/images/Ball.png" alt="Ball" width={80} height={80} className="object-contain" />
      </div>
      <div className="absolute top-1/3 right-12 w-28 h-28 opacity-10 pointer-events-none z-0 transform rotate-45">
        <Image src="/images/Ball.png" alt="Ball" width={112} height={112} className="object-contain" />
      </div>
      <div className="absolute bottom-1/2 left-1/3 w-24 h-24 opacity-9 pointer-events-none z-0">
        <Image src="/images/Ball.png" alt="Ball" width={96} height={96} className="object-contain" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden relative z-10">
        <main className="flex-1 px-3 sm:px-4 lg:px-6 py-3 overflow-x-hidden mt-16 lg:mt-20 pb-24 lg:pb-6 max-w-full lg:max-w-7xl mx-auto w-full box-border">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#a3e635] hover:text-[#84cc16] font-semibold mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {/* Profile Header */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-100 shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Cover Background */}
            <div className={`h-32 bg-gradient-to-r ${getLevelBgColor(user.level)}`}></div>

            {/* Profile Info */}
            <div className="px-4 sm:px-6 py-6 relative">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center font-bold text-white text-4xl shadow-lg -mt-16 border-4 border-white flex-shrink-0">
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{user.name}</h1>
                  <p className="text-slate-500 text-sm">{user.handle}</p>
                </div>
              </div>

              {/* Level Badge and Bio */}
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${getLevelColor(user.level)}`}>
                    {user.level} Level
                  </span>
                  <span className="flex items-center gap-1 text-[#a3e635] font-semibold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    {user.stats.rating} Rating
                  </span>
                </div>
                <p className="text-slate-700 text-sm sm:text-base mb-3">{user.bio}</p>
                <div className="flex flex-col sm:flex-row gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#a3e635]" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#a3e635]" />
                    Joined {user.joinDate}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isFollowing
                      ? "bg-gray-100 text-slate-600 hover:bg-gray-200"
                      : "bg-[#a3e635] text-[#0f2e22] hover:bg-[#84cc16]"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-100 text-slate-600 hover:bg-[#a3e635]/10 hover:text-[#a3e635] transition-all">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gray-100 text-slate-600 hover:bg-[#a3e635]/10 hover:text-[#a3e635] transition-all">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 text-center hover:border-[#a3e635]/30 transition-all">
              <p className="text-sm text-slate-600 mb-1">Matches Played</p>
              <p className="text-2xl font-black text-[#a3e635]">{user.stats.matchesPlayed}</p>
            </div>
            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 text-center hover:border-[#a3e635]/30 transition-all">
              <p className="text-sm text-slate-600 mb-1">Wins</p>
              <p className="text-2xl font-black text-[#84cc16]">{user.stats.wins}</p>
            </div>
            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 text-center hover:border-[#a3e635]/30 transition-all">
              <p className="text-sm text-slate-600 mb-1">Losses</p>
              <p className="text-2xl font-black text-red-500">{user.stats.losses}</p>
            </div>
            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 text-center hover:border-[#a3e635]/30 transition-all">
              <p className="text-sm text-slate-600 mb-1">Win Rate</p>
              <p className="text-2xl font-black text-blue-500">{winRate}%</p>
            </div>
          </div>

          {/* Badges Section */}
          {user.badges.length > 0 && (
            <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "150ms" }}>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Badges & Achievements</h2>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#a3e635]/10 border-2 border-[#a3e635]/30 px-4 py-2 rounded-lg text-sm font-semibold text-[#0f2e22]"
                  >
                    <Trophy className="w-4 h-4" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center font-bold text-white text-lg">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-500">Posted {user.recentPosts} times this month</p>
                  </div>
                </div>
                <Zap className="w-6 h-6 text-[#a3e635]" />
              </div>
              <div className="text-center py-4 text-slate-500">
                <p className="mb-2">Most recent posts and activities will appear here</p>
                <Link
                  href="/community"
                  className="text-[#a3e635] hover:text-[#84cc16] font-semibold text-sm"
                >
                  View all posts →
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
