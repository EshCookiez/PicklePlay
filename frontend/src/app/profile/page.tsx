"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/images/PicklePlayLogo.jpg';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  UserProfile,
  UserRole,
  DashboardTab,
} from '@/types/profile';
import {
  MOCK_USER,
  MOCK_STATS,
  MOCK_APPLICATIONS,
  NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  SUPER_ADMIN_NAV_ITEMS,
  ROLE_COLORS
} from '@/lib/profile-constants';
import { Card, Badge, Button } from '@/components/profile/ui/Common';
import ProfileOverview from '@/components/profile/ProfileOverview';
import RolesManagement from '@/components/profile/RolesManagement';
import Statistics from '@/components/profile/Statistics';
import Settings from '@/components/profile/Settings';
import Security from '@/components/profile/Security';
import Verification from '@/components/profile/Verification';
import PaymentInfo from '@/components/profile/PaymentInfo';
import ProfessionalInfo from '@/components/profile/ProfessionalInfo';
import ProfileCompletion from '@/components/profile/ProfileCompletion';
import EditProfileModal from '@/components/profile/Modals/EditProfile';
import { Menu, Star, ExternalLink, Settings as SettingsIcon, Camera, MapPin, LogOut, ShieldAlert } from 'lucide-react';

// Admin Components
import AdminOverview from '@/components/admin/AdminOverview';
import UserManagement from '@/components/admin/UserManagement';
import CourtManagement from '@/components/admin/CourtManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';

export default function ProfilePage() {
  const { user: authUser, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isSuperAdmin = authUser?.role === 'super_admin';
  const isAdmin = authUser?.role === 'admin';
  const isAnyAdmin = isAdmin || isSuperAdmin;

  const navItems = isSuperAdmin
    ? SUPER_ADMIN_NAV_ITEMS
    : isAdmin
      ? ADMIN_NAV_ITEMS
      : NAV_ITEMS;

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (navItems.some(item => item.id === hash)) {
      setActiveTab(hash);
    } else {
      setActiveTab(isAnyAdmin ? 'admin-overview' : 'overview');
    }
  }, [isAnyAdmin, isSuperAdmin, isAdmin, navItems]);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/'); // Redirect to home if not logged in
      return;
    }

    if (authUser) {
      // Map Auth User to Profile User
      setUser(prev => ({
        ...prev,
        id: authUser.id.toString(),
        fullName: `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() || "Guest User",
        email: authUser.email,
        phone: authUser.phone_number,
        dob: authUser.date_of_birth,
        location: {
          city: authUser.location || "Unknown",
          state: "Philippines",
          country: "PH"
        },
        avatarUrl: `https://ui-avatars.com/api/?name=${authUser.first_name || 'U'}+${authUser.last_name || 'U'}&background=0D8ABC&color=fff`
      }));

      // Map backend role to frontend UserRole enum
      const roleMap: Record<string, UserRole> = {
        'user': UserRole.CUSTOMER,
        'coach': UserRole.COACH,
        'court_owner': UserRole.COURT_OWNER,
        'admin': UserRole.ADMIN,
        'super_admin': UserRole.SUPER_ADMIN
      };

      if (authUser.role && roleMap[authUser.role]) {
        setActiveRole(roleMap[authUser.role]);
      }
    }
  }, [authUser, authLoading, router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    window.location.hash = tab;
    setIsSidebarOpen(false);
  };

  const handleEditSave = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
    setIsEditModalOpen(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e3a5f]"></div>
      </div>
    );
  }

  if (!authUser) return null;

  const isProfessionalRole = activeRole === UserRole.COACH || activeRole === UserRole.COURT_OWNER;

  return (
    <div className="flex min-h-screen overflow-hidden bg-slate-50">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-[#0056b3] text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-3">
            <Link href="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity cursor-pointer">
              <Image
                src={logo}
                alt="PicklePlay Logo"
                width={36}
                height={36}
                className="rounded-full shadow-lg"
              />
              <div>
                <h1 className="text-sm font-black tracking-tight leading-none uppercase text-white drop-shadow-sm">PICKLEPLAY</h1>
                <p className="text-[10px] font-semibold text-[#fbbf24] uppercase tracking-wider mt-0.5">PHILIPPINES</p>
              </div>
            </Link>

            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === item.id ? 'bg-[#fbbf24] text-[#1e3a5f] shadow-lg shadow-black/10' : 'text-blue-100/70 hover:text-white hover:bg-white/10'}`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#1e3a5f]' : 'text-blue-100/50'}`} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-3 bg-black/10 border-t border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <img src={user.avatarUrl} className="w-8 h-8 rounded-full border-2 border-[#fbbf24]" alt="Avatar" />
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold truncate">{user.fullName}</p>
                <p className="text-[10px] text-blue-100/60 uppercase font-semibold tracking-tight">Active Member</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-100/70 hover:text-white hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              LOGOUT SESSION
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#f4f7fa]">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 bg-[#0056b3] px-4 py-2 flex lg:hidden items-center justify-between border-b border-blue-400/20 text-white">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt="PicklePlay Logo"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-black uppercase text-xs">PICKLEPLAY</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 rounded-lg bg-white/10 border border-white/20 text-white">
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Hero Profile Section */}
        <div className="relative">
          <div className="h-20 md:h-24 w-full bg-gradient-to-br from-[#1e3a5f] via-[#0a56a7] to-[#0066cc] overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=2000"
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              alt="Banner"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f4f7fa] to-transparent"></div>
          </div>

          <div className="max-w-7xl mx-auto px-3 md:px-4 -mt-10 md:-mt-12 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end gap-2 justify-between">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-3">
                <div className="relative shrink-0">
                  <div className="p-0.5 rounded-2xl bg-white shadow-lg">
                    <img
                      src={user.avatarUrl}
                      alt="Profile"
                      className="w-18 h-18 md:w-22 md:h-22 rounded-2xl border-2 border-white object-cover"
                      style={{ width: '72px', height: '72px' }}
                    />
                  </div>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-0.5 right-0.5 p-1.5 bg-[#fbbf24] text-[#1e3a5f] rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-all border-2 border-white"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-center md:text-left pb-0.5">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <h1 className="text-xl md:text-2xl font-black text-[#1e3a5f] tracking-tight uppercase flex items-center gap-2">
                      {isAnyAdmin && <ShieldAlert size={20} className={isSuperAdmin ? "text-purple-500" : "text-rose-500"} />}
                      {isSuperAdmin ? 'System Executive' : isAdmin ? 'System Administrator' : user.fullName}
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge className={`${ROLE_COLORS[activeRole]} text-[10px] font-black px-2 py-0.5 border rounded uppercase tracking-wide`}>
                        {activeRole}
                      </Badge>
                      {isAnyAdmin && (
                        <Badge className={`${isSuperAdmin ? 'bg-purple-500' : 'bg-rose-500'} text-white border-none text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide`}>
                          {isSuperAdmin ? 'Root Access' : 'Staff'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs font-bold text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {user.rating} <span className="text-slate-400 font-medium">(45 Reviews)</span></span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full hidden md:block"></span>
                    <span className="flex items-center gap-1 uppercase tracking-wide"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {user.location.city}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center pb-0.5">
                <Button variant="outline" className="bg-white border-slate-200 text-[#1e3a5f] font-bold uppercase text-xs tracking-wide px-4 py-1.5" onClick={() => setActiveTab('settings')}>
                  Settings
                </Button>
                <Button onClick={() => setIsEditModalOpen(true)} className="bg-[#1e3a5f] text-white hover:bg-[#0a56a7] shadow-lg shadow-blue-500/20 font-bold uppercase text-xs tracking-wide px-4 py-1.5">
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-2 py-1.5 md:px-3 space-y-1.5">

          <ProfileCompletion user={user} />

          {/* Tab Content Area */}
          <div className="min-h-[150px]">
            {isAnyAdmin ? (
              <div className="space-y-6">
                {activeTab === 'admin-overview' && <AdminOverview />}
                {activeTab === 'user-mgmt' && <UserManagement />}
                {activeTab === 'court-mgmt' && <CourtManagement />}
                {isSuperAdmin && activeTab === 'analytics' && <AdminAnalytics />}
                {activeTab === 'security' && <Security />}

                {/* Access Protection for standard admins */}
                {isAdmin && ['analytics', 'roles-perms', 'system-settings'].includes(activeTab) && (
                  <Card className="p-20 flex flex-col items-center justify-center bg-rose-50/50 border-rose-100 border-dashed border-2">
                    <ShieldAlert size={48} className="text-rose-300 mb-4" />
                    <h2 className="text-lg font-black text-rose-800 uppercase tracking-tight mb-2">Access Denied</h2>
                    <p className="text-[10px] font-black uppercase text-rose-400 tracking-widest text-center max-w-xs">
                      This module is restricted to Super Admin accounts only.
                      Please contact system executive for permissions.
                    </p>
                  </Card>
                )}

                {/* Maintenance / Coming Soon fallback */}
                {!['admin-overview', 'user-mgmt', 'court-mgmt', 'analytics', 'security'].includes(activeTab) && (
                  <Card className="p-20 flex flex-col items-center justify-center bg-white/50 border-dashed border-2">
                    <ShieldAlert size={48} className="text-slate-200 mb-4" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Module under maintenance</p>
                  </Card>
                )}
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <>
                    <ProfileOverview user={user} onEdit={() => setIsEditModalOpen(true)} />
                    {isProfessionalRole && (
                      <div className="mt-3">
                        <h3 className="text-sm font-black text-slate-800 uppercase italic tracking-tighter mb-2">Professional Details</h3>
                        <ProfessionalInfo role={activeRole} />
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'roles' && (
                  <RolesManagement
                    activeRole={activeRole}
                    applications={MOCK_APPLICATIONS}
                    onSwitchRole={() => setActiveRole(activeRole === UserRole.COACH ? UserRole.PLAYER : UserRole.COACH)}
                    onApplyRole={(r) => console.log('apply', r)}
                  />
                )}
                {activeTab === 'stats' && <Statistics stats={MOCK_STATS} activeRole={activeRole} />}
                {activeTab === 'financials' && <PaymentInfo />}
                {activeTab === 'settings' && <Settings />}
                {activeTab === 'security' && <Security />}
                {activeTab === 'verification' && <Verification user={user} />}
              </>
            )}
          </div>
        </div>

        {/* Brand Footer */}
        <footer className="px-4 py-4 md:px-6 bg-gradient-to-br from-[#1e3a5f] to-[#0a56a7] text-white mt-4 overflow-hidden relative">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 justify-between items-center relative z-10">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5">
                <Image
                  src={logo}
                  alt="PicklePlay Logo"
                  width={28}
                  height={28}
                  className="rounded-full"
                />
                <h3 className="text-sm font-black uppercase">PICKLEPLAY PHILIPPINES</h3>
              </div>
              <p className="text-blue-100/70 text-[10px] font-medium">Join the fastest growing sports community.</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="text-[10px] font-bold uppercase tracking-wide hover:text-[#fbbf24] transition-colors">Privacy</button>
              <button className="text-[10px] font-bold uppercase tracking-wide hover:text-[#fbbf24] transition-colors">Terms</button>
              <button className="text-[10px] font-bold uppercase tracking-wide hover:text-[#fbbf24] transition-colors">Support</button>
            </div>
          </div>
        </footer>
      </main>

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditSave}
      />
    </div>
  );
}
