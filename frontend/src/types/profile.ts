
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PLAYER = 'PLAYER',
  COACH = 'COACH',
  COURT_OWNER = 'COURT_OWNER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED'
}

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

export interface UserAddress {
  street?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UserPreferences {
  language: string;
  timezone: string;
  privacyLevel: 'public' | 'private' | 'friends_only';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY';
  currencyDisplay: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    emailFrequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  };
  emailSubscriptions: {
    bookingConfirmations: boolean;
    lessonReminders: boolean;
    tournamentUpdates: boolean;
    marketingCommunications: boolean;
    productNews: boolean;
  };
}

export interface SecuritySettings {
  passwordInfo: {
    lastChanged: string;
    requiresChange: boolean;
  };
  twoFactorAuth: {
    enabled: boolean;
    method?: 'sms' | 'email' | 'authenticator_app';
    backupCodes?: string[];
  };
  loginSessions: LoginActivity[];
  connectedApps: {
    id: string;
    name: string;
    connectedAt: string;
    permissions: string[];
    icon: string;
  }[];
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank';
  last4?: string;
  expiry?: string;
  brand?: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  type: 'credit' | 'debit';
}

export interface FinancialData {
  totalSpent: number;
  totalEarned: number;
  walletBalance: number;
  stripeCustomerId?: string;
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
}

export interface ProfessionalDetails {
  title?: string; // Coach specific
  yearsExperience?: number;
  certifications?: { name: string; issuer: string; year: number }[];
  specializations?: string[];
  hourlyRate?: number;
  
  businessName?: string; // Owner specific
  businessType?: 'Owner' | 'Manager' | 'Operator';
  courtsManaged?: number;
  facilities?: string[];
  operatingHours?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  dob?: string;
  location: { // Legacy simplified location
    city: string;
    state: string;
    country: string;
  };
  address: UserAddress; // New detailed address
  bio: string;
  websiteUrl?: string;
  socialLinks: SocialLinks;
  memberSince: string;
  status: AccountStatus;
  avatarUrl: string;
  rating: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isIdVerified: boolean;
  isBackgroundChecked: boolean;
  preferences: UserPreferences;
  security: SecuritySettings;
  financials: FinancialData;
  professional?: ProfessionalDetails;
}

export interface UserStatistics {
  bookings: {
    total: number;
    upcoming: number;
    completed: number;
    completionRate: number;
  };
  reviews: {
    average: number;
    total: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  coachStats?: {
    lessonsGiven: number;
    activeStudents: number;
    totalEarnings: number;
    lessonsThisMonth: number;
  };
  playerStats?: {
    lessonsTaken: number;
    ranking?: string;
    tournamentWins: number;
    matchesPlayed: number;
  };
  courtOwnerStats?: {
    totalBookings: number;
    totalRevenue: number;
    averageCourtRating: number;
    courtsManaged: number;
  };
}

export interface RoleApplication {
  id: string;
  role: UserRole;
  status: ApplicationStatus;
  appliedDate: string;
  rejectionReason?: string;
}

export interface LoginActivity {
  id: string;
  date: string;
  ip: string;
  device: string;
  location: string;
  isActive: boolean;
}

export type DashboardTab = 'overview' | 'roles' | 'stats' | 'settings' | 'security' | 'financials' | 'verification';
