
import React from 'react';
import { 
  UserRole, 
  AccountStatus, 
  ApplicationStatus, 
  UserProfile, 
  UserStatistics, 
  RoleApplication, 
  LoginActivity 
} from './types';
import { 
  Briefcase, 
  Activity, 
  LayoutDashboard, 
  Lock,
  Shield,
  Settings,
  CreditCard
} from 'lucide-react';

export const MOCK_LOGIN_HISTORY: LoginActivity[] = [
  {
    id: 'l-1',
    date: '2024-02-20T14:30:00Z',
    ip: '192.168.1.1',
    device: 'MacBook Pro - Chrome',
    location: 'Cebu City, PH',
    isActive: true
  },
  {
    id: 'l-2',
    date: '2024-02-19T09:15:00Z',
    ip: '172.58.204.12',
    device: 'iPhone 15 - Safari',
    location: 'Cebu City, PH',
    isActive: false
  },
  {
    id: 'l-3',
    date: '2024-02-15T18:45:00Z',
    ip: '192.168.1.1',
    device: 'MacBook Pro - Chrome',
    location: 'Cebu City, PH',
    isActive: false
  }
];

export const MOCK_USER: UserProfile = {
  id: 'u-123',
  fullName: 'Casey Pickleballer',
  email: 'casey@pickleplay.com',
  phone: '+1 (555) 123-4567',
  dob: '1992-05-24',
  location: {
    city: 'Cebu City',
    state: 'Cebu',
    country: 'Philippines'
  },
  address: {
    street: '123 Pickle St',
    city: 'Cebu City',
    state: 'Cebu',
    postalCode: '6000',
    country: 'Philippines',
    coordinates: {
      lat: 10.3157,
      lng: 123.8854
    }
  },
  bio: 'Pickleball enthusiast with 5 years of competitive play. Currently training for the regional championships in the Philippines. I love coaching beginners and seeing them fall in love with the game!',
  websiteUrl: 'https://caseyplays.com',
  socialLinks: {
    instagram: 'https://instagram.com/caseyplays',
    linkedin: 'https://linkedin.com/in/caseypickleballer',
    twitter: 'https://twitter.com/casey_pb'
  },
  memberSince: '2021-08-15',
  status: AccountStatus.ACTIVE,
  avatarUrl: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&h=200',
  rating: 4.8,
  isEmailVerified: true,
  isPhoneVerified: true,
  isIdVerified: true,
  isBackgroundChecked: true,
  preferences: {
    language: 'English (US)',
    timezone: '(UTC+08:00) Philippine Standard Time',
    privacyLevel: 'public',
    dateFormat: 'MM/DD/YYYY',
    currencyDisplay: 'PHP',
    notifications: {
      email: true,
      push: true,
      sms: false,
      emailFrequency: 'daily'
    },
    emailSubscriptions: {
      bookingConfirmations: true,
      lessonReminders: true,
      tournamentUpdates: false,
      marketingCommunications: false,
      productNews: true
    }
  },
  security: {
    passwordInfo: {
      lastChanged: '2023-10-14T00:00:00Z',
      requiresChange: false
    },
    twoFactorAuth: {
      enabled: true,
      method: 'authenticator_app',
      backupCodes: ['XXXX-XXXX', 'YYYY-YYYY']
    },
    loginSessions: MOCK_LOGIN_HISTORY,
    connectedApps: [
      {
        id: 'app-1',
        name: 'Google',
        connectedAt: '2022-01-15T10:00:00Z',
        permissions: ['profile', 'email'],
        icon: 'google'
      }
    ]
  },
  financials: {
    totalSpent: 12500,
    totalEarned: 4500,
    walletBalance: 1200,
    stripeCustomerId: 'cus_12345678',
    paymentMethods: [
      { id: 'pm_1', type: 'card', brand: 'Visa', last4: '4242', isDefault: true, expiry: '12/25' },
      { id: 'pm_2', type: 'paypal', isDefault: false }
    ],
    transactions: [
      { id: 'tx_1', date: '2024-02-25', description: 'Court Booking - Downtown Arena', amount: -500, status: 'completed', type: 'debit' },
      { id: 'tx_2', date: '2024-02-22', description: 'Coaching Session - Payment Received', amount: 1500, status: 'completed', type: 'credit' },
      { id: 'tx_3', date: '2024-02-18', description: 'Tournament Entry Fee', amount: -2000, status: 'completed', type: 'debit' }
    ]
  },
  professional: {
    title: 'Certified PPR Coach',
    yearsExperience: 5,
    certifications: [
      { name: 'Professional Pickleball Registry (PPR)', issuer: 'PPR', year: 2021 }
    ],
    specializations: ['Beginner Strategy', 'Dinking Mechanics', 'Tournament Prep'],
    hourlyRate: 1500
  }
};

export const MOCK_STATS: UserStatistics = {
  bookings: {
    total: 124,
    upcoming: 3,
    completed: 121,
    completionRate: 98
  },
  reviews: {
    average: 4.8,
    total: 45,
    breakdown: {
      5: 38,
      4: 5,
      3: 2,
      2: 0,
      1: 0
    }
  },
  playerStats: {
    lessonsTaken: 12,
    ranking: 'Gold III',
    tournamentWins: 4,
    matchesPlayed: 85
  },
  coachStats: {
    lessonsGiven: 56,
    activeStudents: 14,
    totalEarnings: 2800,
    lessonsThisMonth: 8
  }
};

export const MOCK_APPLICATIONS: RoleApplication[] = [
  {
    id: 'app-1',
    role: UserRole.COACH,
    status: ApplicationStatus.APPROVED,
    appliedDate: '2022-01-10'
  },
  {
    id: 'app-2',
    role: UserRole.COURT_OWNER,
    status: ApplicationStatus.PENDING,
    appliedDate: '2024-02-15'
  }
];

export const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'roles', label: 'My Roles', icon: Briefcase },
  { id: 'stats', label: 'Activity Stats', icon: Activity },
  { id: 'financials', label: 'Wallet & Billing', icon: CreditCard },
  { id: 'settings', label: 'Preferences', icon: Settings },
  { id: 'security', label: 'Account Security', icon: Lock },
  { id: 'verification', label: 'Verification', icon: Shield },
];

export const ROLE_COLORS = {
  [UserRole.CUSTOMER]: 'bg-slate-100 text-slate-700 border-slate-200',
  [UserRole.PLAYER]: 'bg-blue-100 text-blue-700 border-blue-200',
  [UserRole.COACH]: 'bg-[#ccff001a] text-[#a8d600] border-[#a8d60033]',
  [UserRole.COURT_OWNER]: 'bg-amber-100 text-amber-700 border-amber-200',
  [UserRole.ADMIN]: 'bg-rose-100 text-rose-700 border-rose-200',
  [UserRole.SUPER_ADMIN]: 'bg-purple-100 text-purple-700 border-purple-200',
};
