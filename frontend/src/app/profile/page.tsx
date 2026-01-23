"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, LogOut, Heart, Calendar, Bell, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AnimatedContent from "@/animate/AnimatedContent";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
}

interface Booking {
  id: number;
  court: string;
  date: string;
  time: string;
  players: number;
  status: "Confirmed" | "Pending" | "Completed";
}

interface FavoriteCourt {
  id: string;
  name: string;
  city: string;
  rating: number;
  courts: number;
}

interface Notification {
  id: number;
  message: string;
  time: string;
  icon: string;
  read: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock data
  const mockBookings: Booking[] = [
    { id: 1, court: "Makati Pickleball Hub", date: "Jan 25, 2025", time: "10:00 AM", players: 4, status: "Confirmed" },
    { id: 2, court: "BGC Active Courts", date: "Jan 23, 2025", time: "3:00 PM", players: 3, status: "Completed" },
    { id: 3, court: "Cebu Sports Complex", date: "Jan 20, 2025", time: "2:30 PM", players: 4, status: "Completed" },
  ];

  const mockFavoriteCourts: FavoriteCourt[] = [
    { id: "makati", name: "Makati Pickleball Hub", city: "Makati", rating: 4.8, courts: 6 },
    { id: "bgc", name: "BGC Active Courts", city: "Taguig", rating: 4.7, courts: 8 },
    { id: "qc", name: "Quezon City Sports Club", city: "QC", rating: 4.6, courts: 4 },
    { id: "pasig", name: "Pasig Riverside Courts", city: "Pasig", rating: 4.5, courts: 5 },
  ];

  const mockNotifications: Notification[] = [
    { id: 1, message: "Makati court has 2 courts available tomorrow", time: "2 hours ago", icon: "📍", read: false },
    { id: 2, message: "Your booking at BGC is confirmed", time: "1 day ago", icon: "✅", read: false },
    { id: 3, message: "New 5-star review on Makati Pickleball Hub", time: "3 days ago", icon: "⭐", read: true },
    { id: 4, message: "Reminder: Your game starts in 2 hours", time: "5 days ago", icon: "⏰", read: true },
  ];

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setEditForm({ name: userData.name, email: userData.email });
      setNotifications(mockNotifications);
    } else {
      // Redirect to auth if no user
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/auth");
  };

  const handleSaveProfile = () => {
    if (user) {
      const updatedUser = { ...user, name: editForm.name, email: editForm.email };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setIsEditingProfile(false);
    }
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (!user) {
    return null; // Loading state
  }

  const topStats = [
    { label: "Total Bookings", value: mockBookings.length.toString() },
    { label: "Favorite Courts", value: mockFavoriteCourts.length.toString() },
    { label: "Games Played", value: "12" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Banner */}
      <section className="relative">
        {/* Gradient Background Banner */}
        <div className="h-48 bg-gradient-to-r from-orange-400 via-blue-600 to-[#0a56a7] relative overflow-hidden">
          {/* Striped pattern overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 70px)'
          }}></div>
        </div>

        {/* Profile Card Overlay */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 relative -mt-24 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg border-4 border-white">
                  {user.avatar}
                </div>
              </div>

              {/* User Info & Stats */}
              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 mb-1">{user.name}</h1>
                  <p className="text-lg text-gray-600">Pickleball Enthusiast</p>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-3 gap-6 pt-4">
                  {topStats.map((stat, idx) => (
                    <div key={idx}>
                      <p className="text-2xl md:text-3xl font-bold text-[#0a56a7]">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 md:flex-col">
                <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                  <DialogTrigger asChild>
                    <button className="px-6 py-2 bg-[#0a56a7] text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden md:inline">Edit</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Your Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-900 mb-2 block">Full Name</label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-900 mb-2 block">Email</label>
                        <Input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => setIsEditingProfile(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-[#0a56a7] hover:bg-blue-700"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Info & Biography */}
          <div className="space-y-6">
            {/* Info Card */}
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">📧</span>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">EMAIL</p>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">📱</span>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">PHONE</p>
                      <p className="text-sm font-medium text-gray-900">+63-917-555-1234</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-1">📍</span>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">LOCATION</p>
                      <p className="text-sm font-medium text-gray-900">Manila, Philippines</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedContent>

            {/* Biography Card */}
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              delay={0.1}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Biography</h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">About Me</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Passionate pickleball player with 2+ years of experience. Love playing competitive matches and meeting new players in the community.
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">PROFESSION</p>
                    <p className="font-medium text-gray-900">Sports Enthusiast</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">MEMBER SINCE</p>
                    <p className="font-medium text-gray-900">{user.memberSince}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">SKILL LEVEL</p>
                    <p className="font-medium text-gray-900">Intermediate</p>
                  </div>
                </div>
              </div>
            </AnimatedContent>
          </div>

          {/* Right Content - Activity & Bookings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Activity/Timeline Section */}
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              delay={0.2}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
                
                <div className="space-y-4">
                  {mockBookings.map((booking, idx) => (
                    <div key={booking.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-10 h-10 bg-[#a3ff01] rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-[#0a56a7]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{booking.court}</p>
                        <p className="text-sm text-gray-600 mt-1">📅 {booking.date} • {booking.time}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "Confirmed" ? "bg-green-100 text-green-700" :
                            booking.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {booking.status}
                          </span>
                          <span className="text-xs text-gray-500">👥 {booking.players} players</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedContent>

            {/* Favorite Courts - Compact Grid */}
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              delay={0.3}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Favorite Courts</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {mockFavoriteCourts.map((court) => (
                    <div key={court.id} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">{court.name}</h4>
                      <p className="text-xs text-gray-600 mb-3">📍 {court.city}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#0a56a7]">⭐ {court.rating}</span>
                        <span className="text-xs text-gray-600">{court.courts} courts</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedContent>

            {/* Notifications Section */}
            <AnimatedContent
              distance={50}
              direction="vertical"
              duration={0.6}
              ease="power3.out"
              initialOpacity={0}
              animateOpacity
              delay={0.4}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                  <span className="bg-[#a3ff01] text-gray-900 rounded-full px-3 py-1 text-xs font-semibold">
                    {notifications.filter(n => !n.read).length} New
                  </span>
                </div>

                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-lg border transition-all ${
                        notif.read
                          ? "bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg">{notif.icon}</span>
                        <div className="flex-1">
                          <p className={`text-sm ${notif.read ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                        {!notif.read && (
                          <button
                            onClick={() => markNotificationAsRead(notif.id)}
                            className="text-[#0a56a7] hover:text-blue-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedContent>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
