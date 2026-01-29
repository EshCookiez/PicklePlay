"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Activity, Calendar, MapPin, Users, Clock } from "lucide-react";

export default function ActivityPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-[#1E40AF] mb-4">
              Activity & Stats
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Track your pickleball journey and performance statistics
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#1E40AF]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Total Games</p>
                  <p className="text-2xl font-black text-[#1E40AF]">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Win Rate</p>
                  <p className="text-2xl font-black text-green-600">0%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-yellow-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Hours Played</p>
                  <p className="text-2xl font-black text-yellow-600">0</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Courts Visited</p>
                  <p className="text-2xl font-black text-purple-600">0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-black text-[#1E40AF] mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6" />
                Recent Activity
              </h2>
              <div className="text-center py-12">
                <p className="text-gray-600">No recent activity to display</p>
                <p className="text-sm text-gray-500 mt-2">Start playing to track your games!</p>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-black text-[#1E40AF] mb-6 flex items-center gap-3">
                <Activity className="w-6 h-6" />
                Performance Trends
              </h2>
              <div className="text-center py-12">
                <p className="text-gray-600">No data available yet</p>
                <p className="text-sm text-gray-500 mt-2">Your performance will be tracked here</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
