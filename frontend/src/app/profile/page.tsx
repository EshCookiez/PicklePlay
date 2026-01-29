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
