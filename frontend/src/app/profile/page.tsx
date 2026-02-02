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
  const initialAuthLoadDone = React.useRef(false);

  const isSuperAdmin = authUser?.role === 'super_admin';
  const isAdmin = authUser?.role === 'admin';
  const isAnyAdmin = isAdmin || isSuperAdmin;

  const navItems = isAnyAdmin
    ? ADMIN_NAV_ITEMS
    : NAV_ITEMS;

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (navItems.some(item => item.id === hash)) {
      setActiveTab(hash);
    } else {
      setActiveTab('overview');
    }
  }, [isAnyAdmin, isSuperAdmin, isAdmin, navItems]);

  useEffect(() => {
    if (!authLoading && !authUser) {
      if (initialAuthLoadDone.current) {
        router.replace('/');
      }
      return;
    }

    if (authUser && !initialAuthLoadDone.current) {
      initialAuthLoadDone.current = true;

      setUser(prev => ({
        ...prev,
        id: authUser.id.toString(),
        fullName: `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() || "Guest User",
        email: authUser.email,
        phone: authUser.phone_number || undefined,
        avatarUrl: authUser.avatar_url || '' // Use uploaded avatar or empty string for default icon
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
    <div className="flex flex-col min-h-screen font-sans text-slate-900 overflow-x-hidden animate-in fade-in duration-1000 relative">
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
      <div className="absolute bottom-20 right-20 w-20 h-20 opacity-7 pointer-events-none z-0 transform -rotate-12">
        <Image src="/images/Ball.png" alt="Ball" width={80} height={80} className="object-contain" />
      </div>
      <div className="absolute top-2/3 right-1/4 w-32 h-32 opacity-11 pointer-events-none z-0">
        <Image src="/images/Ball.png" alt="Ball" width={128} height={128} className="object-contain" />
      </div>

      {/* 2. Main Content */}
      <div className="flex-1 flex flex-col bg-white w-full overflow-x-hidden relative z-10">
        {/* Navigation Tabs */}
        <nav className="sticky top-16 lg:top-20 z-20 bg-white border-b border-gray-200 overflow-x-auto">
          <div className="flex px-3 sm:px-4 lg:px-6 max-w-full lg:max-w-7xl mx-auto w-full box-border">
            {navItems.map((item) => {
              // Get the correct icon component
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${isActive
                      ? 'border-[#0f2e22] text-[#0f2e22]'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-gray-300'
                    }`}
                >
                  <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-[#a3e635]' : 'text-slate-400'
                    }`} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 px-3 sm:px-4 lg:px-6 py-3 overflow-x-hidden mt-16 lg:mt-20 pb-24 lg:pb-6 max-w-full lg:max-w-7xl mx-auto w-full box-border">
          {/* Render content based on active tab - Keep admin components mounted to preserve state */}
          <div style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
            <ProfileOverview user={user} isStatusLoading={false} activeRole={activeRole} onEdit={() => setIsEditModalOpen(true)} />
          </div>

          <div style={{ display: activeTab === 'admin-overview' ? 'block' : 'none' }}>
            {isAnyAdmin && <AdminOverview />}
          </div>

          <div style={{ display: activeTab === 'user-mgmt' ? 'block' : 'none' }}>
            {isAnyAdmin && <UserManagement />}
          </div>

          <div style={{ display: activeTab === 'court-mgmt' ? 'block' : 'none' }}>
            {isAnyAdmin && <CourtManagement />}
          </div>

          <div style={{ display: activeTab === 'analytics' ? 'block' : 'none' }}>
            {isAnyAdmin && <AdminAnalytics />}
          </div>

          {activeTab === 'roles' && <RolesManagement activeRole={activeRole} applications={MOCK_APPLICATIONS} onSwitchRole={() => { }} onApplyRole={(role) => setActiveRole(role)} />}

          {/* Other Profile Tabs */}
          {activeTab === 'stats' && <Statistics stats={MOCK_STATS} activeRole={activeRole} />}
          {activeTab === 'financials' && <PaymentInfo />}
          {activeTab === 'verification' && <Verification user={user} />}
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
