"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Activity, Calendar, MapPin, Users, Clock } from "lucide-react";

export default function ActivityPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4] pt-6 sm:pt-8 pb-24 lg:pb-16">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-gradient-to-br from-[#0f2e22] to-[#1a4332] rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 relative overflow-hidden text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 bg-[#a3e635]/20 rounded-2xl">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-[#a3e635]" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Activity & Stats</h1>
            </div>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl">
              Track your pickleball journey and performance statistics
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute right-0 bottom-0 w-32 sm:w-64 h-32 sm:h-64 bg-[#a3e635] opacity-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Total Games Card */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#a3e635]/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-[#65a30d]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Total Games</p>
                <p className="text-2xl sm:text-3xl font-black text-[#0f2e22] mt-1">0</p>
              </div>
            </div>
          </div>

          {/* Win Rate Card */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#a3e635]/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#65a30d]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Win Rate</p>
                <p className="text-2xl sm:text-3xl font-black text-[#0f2e22] mt-1">0%</p>
              </div>
            </div>
          </div>

          {/* Hours Played Card */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#a3e635]/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-[#65a30d]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Hours Played</p>
                <p className="text-2xl sm:text-3xl font-black text-[#0f2e22] mt-1">0</p>
              </div>
            </div>
          </div>

          {/* Courts Visited Card */}
          <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#a3e635]/20 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-[#65a30d]" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-slate-600 font-bold uppercase tracking-wide">Courts Visited</p>
                <p className="text-2xl sm:text-3xl font-black text-[#0f2e22] mt-1">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-900">
            <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all h-full">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#a3e635]" />
                Recent Activity
              </h2>
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium text-sm sm:text-base">No recent activity to display</p>
                <p className="text-slate-400 text-xs sm:text-sm mt-2">Start playing to track your games!</p>
              </div>
            </div>
          </div>

          {/* Performance Trends */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-900" style={{ animationDelay: "100ms" }}>
            <div className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 border border-slate-200 hover:border-[#a3e635] hover:shadow-lg hover:shadow-[#a3e635]/10 transition-all h-full">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#a3e635]" />
                Performance Trends
              </h2>
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium text-sm sm:text-base">No data available yet</p>
                <p className="text-slate-400 text-xs sm:text-sm mt-2">Your performance will be tracked here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
