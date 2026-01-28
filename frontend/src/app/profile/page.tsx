"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  UserProfile,
  UserRole,
} from '@/types/profile';
import {
  MOCK_USER,
  MOCK_STATS,
  MOCK_APPLICATIONS,
  NAV_ITEMS,
  ADMIN_NAV_ITEMS,
  SUPER_ADMIN_NAV_ITEMS,
} from '@/lib/profile-constants';
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
import { 
  Menu, 
  Settings as SettingsIcon, 
  LogOut, 
  Bell,
  Search,
  ChevronDown,
  LayoutDashboard,
  Plus,
  ShoppingBag,
  Users,
  PieChart,
  User
} from 'lucide-react';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open for desktop
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

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
      router.push('/'); 
      return;
    }

    if (authUser) {
      setUser(prev => ({
        ...prev,
        id: authUser.id.toString(),
        fullName: `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() || "Guest User",
        email: authUser.email,
        phone: authUser.phone_number || undefined,
        avatarUrl: `https://ui-avatars.com/api/?name=${authUser.first_name || 'U'}+${authUser.last_name || 'U'}&background=0D8ABC&color=fff`
      }));

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
  };

  const handleEditSave = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
    setIsEditModalOpen(false);
  };

  if (authLoading) return null;
  if (!authUser) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f5f9] font-sans text-slate-900">
      
      {/* 1. Unified Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#1E40AF] text-white border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex items-center gap-4 h-14 px-4">
          
          {/* Left: Brand Icon */}
          <Link href="/" className="flex-shrink-0 w-9 h-9 bg-[#FDE047] rounded-lg flex items-center justify-center text-[#1E40AF] hover:opacity-90 transition-opacity overflow-hidden">
            <Image 
              src="/images/PicklePlayLogo.jpg" 
              alt="PicklePlay Logo" 
              width={36} 
              height={36} 
              className="object-cover rounded-lg"
            />
          </Link>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-xs font-semibold
                  ${activeTab === item.id 
                    ? 'bg-[#FDE047] text-[#1E40AF]' 
                    : 'text-white/60 hover:text-white'}
                `}
              >
                <item.icon size={16} strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              <input 
                type="text"
                placeholder="Search here..."
                className="w-full bg-white/10 border border-white/20 py-1.5 pl-9 pr-3 rounded-lg text-sm text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Notifications */}
            <button className="relative p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <Bell size={18} className="text-white/80" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-[#1E40AF]"></span>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-md text-white"
            >
              <Menu size={18} />
            </button>

            {/* Avatar Button */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                className="hover:opacity-80 transition-opacity"
              >
                <img src={user.avatarUrl} className="w-9 h-9 rounded-full border border-[#FDE047]" alt="User" />
              </button>

              {/* Profile Dropdown */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <img src={user.avatarUrl} className="w-10 h-10 rounded-full border border-[#FDE047]" alt="User" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.fullName}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        handleTabChange('overview');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User size={16} />
                      View Profile
                    </button>
                    <button 
                      onClick={() => {
                        handleTabChange('settings');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <SettingsIcon size={16} />
                      Settings
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-slate-200">
                    <button 
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isSidebarOpen && (
          <div className="md:hidden bg-[#1c3a8f] border-t border-white/10">
            <nav className="flex flex-col gap-0.5 p-3 max-w-7xl mx-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleTabChange(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-xs font-semibold
                    ${activeTab === item.id 
                      ? 'bg-[#FDE047] text-[#1E40AF]' 
                      : 'text-white/60 hover:text-white'}
                  `}
                >
                  <item.icon size={16} strokeWidth={2} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </nav>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col min-h-screen pt-14">
        <main className="flex-1 p-6 overflow-x-hidden">
            {/* Render content based on active tab */}
            {activeTab === 'overview' && (
              isAnyAdmin ? <AdminOverview /> : <ProfileOverview user={user} isStatusLoading={false} activeRole={activeRole} onEdit={() => setIsEditModalOpen(true)} />
            )}
            
            {activeTab === 'admin-overview' && <AdminOverview />}
            
            {activeTab === 'user-mgmt' && isAnyAdmin && <UserManagement />}
            {activeTab === 'court-mgmt' && isAnyAdmin && <CourtManagement />}
            {activeTab === 'analytics' && isAnyAdmin && <AdminAnalytics />}
            {activeTab === 'roles' && <RolesManagement activeRole={activeRole} applications={MOCK_APPLICATIONS} onSwitchRole={() => {}} onApplyRole={(role) => setActiveRole(role)} />}
            
            {/* Other Profile Tabs */}
            {activeTab === 'statistics' && <Statistics stats={MOCK_STATS} activeRole={activeRole} />}
            {activeTab === 'applications' && <Verification user={user} />}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'security' && <Security />}
            {activeTab === 'payment' && <PaymentInfo />}
            {activeTab === 'professional' && <ProfessionalInfo role={activeRole} />}
            {activeTab === 'completion' && <ProfileCompletion user={user} />}
        </main>

      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleEditSave}
      />
    </div>
  );
}
