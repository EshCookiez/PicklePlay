# PicklePlay User Management System - Complete Implementation Guide

**Target Platform:** PicklePlay - Pickleball Platform (Philippines)  
**Tech Stack:** React 19 + TypeScript + Tailwind CSS (Frontend) | Laravel 11 + PostgreSQL (Backend)  
**Purpose:** Implement comprehensive RBAC user management with role applications and admin panel

---

## 📋 TABLE OF CONTENTS

1. [Project Context & Overview](#project-context--overview)
2. [Frontend Structure](#frontend-structure)
3. [API Contract Specifications](#api-contract-specifications)
4. [Database Schema & Models](#database-schema--models)
5. [Integration Guide](#integration-guide)
6. [Deliverables Checklist](#deliverables-checklist)

---

## 🎯 PROJECT CONTEXT & OVERVIEW

### System Description

PicklePlay is a multi-role pickleball platform that allows users to:
- Browse and book courts
- Find and hire coaches
- Apply for professional roles (Player, Coach, Court Owner)
- Manage multiple simultaneous roles
- Admin moderation and user management

### Role-Based Access Control (RBAC) System

**Six User Roles:**

1. **CUSTOMER** (Default) - Regular platform user with basic access
2. **PLAYER** - Competitive player with ranking system access
3. **COACH** - Professional coaching provider
4. **COURT_OWNER** - Pickleball court facility manager
5. **ADMIN** - Platform administrator with moderation rights
6. **SUPER_ADMIN** - System super administrator with full access

**Key Features:**
- Users can hold multiple roles simultaneously
- Role application workflow with admin approval
- Permission-based access control
- Role switching in dashboard
- Audit trail for all role changes

---

## 📱 FRONTEND STRUCTURE

### Required Components

Create a comprehensive React + TypeScript frontend with the following structure:

```
src/
├── components/
│   ├── user-management/
│   │   ├── UserList.tsx
│   │   ├── UserDetails.tsx
│   │   ├── UserRoleManager.tsx
│   │   └── UserSearch.tsx
│   ├── role-applications/
│   │   ├── PlayerApplicationForm.tsx
│   │   ├── CoachApplicationForm.tsx
│   │   ├── CourtOwnerApplicationForm.tsx
│   │   ├── ApplicationList.tsx
│   │   └── ApplicationReview.tsx
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── RoleApprovalQueue.tsx
│   │   ├── UserActionsPanel.tsx
│   │   └── AuditLogViewer.tsx
│   └── shared/
│       ├── RoleBadge.tsx
│       ├── PermissionGuard.tsx
│       ├── FormWizard.tsx
│       └── FileUpload.tsx
├── types/
│   └── user-management.ts
├── services/
│   └── api/
│       ├── users.ts
│       ├── roles.ts
│       └── applications.ts
├── hooks/
│   ├── useUsers.ts
│   ├── useRoles.ts
│   └── usePermissions.ts
└── utils/
    ├── validation.ts
    └── permissions.ts
```

### TypeScript Type Definitions

**File: `src/types/user-management.ts`**

```typescript
// User Roles
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PLAYER = 'PLAYER',
  COACH = 'COACH',
  COURT_OWNER = 'COURT_OWNER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// User Profile Interface
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  location?: string;
  profilePhotoUrl?: string;
  coverPhotoUrl?: string;
  bio?: string;
  
  // Role Information
  roles: UserRoleAssignment[];
  primaryRole: UserRole;
  
  // Verification
  emailVerified: boolean;
  phoneVerified: boolean;
  status: 'active' | 'inactive' | 'suspended';
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserRoleAssignment {
  roleId: string;
  roleName: UserRole;
  assignedAt: string;
  assignedBy?: string;
  isActive: boolean;
  expiresAt?: string;
}

// Role Application
export interface RoleApplication {
  id: string;
  userId: string;
  roleId: string;
  roleName: UserRole;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  applicationData: PlayerApplicationData | CoachApplicationData | CourtOwnerApplicationData;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  canReapplyAt?: string;
  adminNotes?: string;
}

// Player Application Data
export interface PlayerApplicationData {
  basicInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
  };
  playingProfile: {
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    yearsPlaying: number;
    playFrequency: 'casual' | 'regular_1_2x_week' | 'frequent_3_4x_week' | 'competitive';
  };
  experience: {
    tournamentParticipation: 'never' | 'local' | 'regional' | 'national';
    tournamentWins: number;
    achievements: string;
  };
  preferences: {
    preferredCourtType: 'indoor' | 'outdoor' | 'either';
    preferredMatchFormat: 'singles' | 'doubles' | 'both';
    preferredTimeSlots: string[];
  };
  profile: {
    profilePhoto?: string;
    bio: string;
    socialLinks?: {
      instagram?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  agreements: {
    agreeToCodeOfConduct: boolean;
    agreeToRankingSystem: boolean;
    agreeToFairPlay: boolean;
  };
}

// Coach Application Data
export interface CoachApplicationData {
  professionalInfo: {
    fullName: string;
    phone: string;
    yearsOfExperience: number;
    currentSkillLevel: 'beginner' | 'intermediate' | 'advanced' | 'professional';
    specializations: string[];
  };
  credentials: {
    certifications: Array<{
      name: string;
      issuedBy: string;
      issuedDate: string;
      documentUrl: string;
    }>;
    licenses: Array<{
      name: string;
      licenseNumber: string;
      documentUrl: string;
    }>;
  };
  background: {
    playHistory: string;
    tournamentExperience: string;
    previousCoaching: string;
    references?: string;
  };
  coachingDetails: {
    availabilitySchedule: {
      [day: string]: string[]; // e.g., { "monday": ["09:00-12:00", "14:00-18:00"] }
    };
    preferredCourtTypes: Array<'indoor' | 'outdoor'>;
    lessonDurations: Array<'30min' | '60min' | '90min' | '120min'>;
    groupSizePreference: Array<'individual' | 'small_group' | 'classes'>;
  };
  pricing: {
    hourlyRate: number;
    packageDeals?: Array<{
      name: string;
      sessions: number;
      totalPrice: number;
    }>;
    trialLessonRate?: number;
  };
  profile: {
    professionalPhoto: string;
    bio: string;
    socialLinks?: {
      instagram?: string;
      linkedin?: string;
      website?: string;
    };
  };
  agreements: {
    agreeToCoachGuidelines: boolean;
    acceptCommunityStandards: boolean;
    acknowledgePaymentTerms: boolean;
  };
}

// Court Owner Application Data
export interface CourtOwnerApplicationData {
  businessInfo: {
    businessName: string;
    businessType: 'owner' | 'manager' | 'operator';
    yearsInBusiness: number;
    businessLicenseUrl: string;
  };
  facilityDetails: {
    courtNames: string[];
    numberOfCourts: number;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    gpsCoordinates?: {
      latitude: number;
      longitude: number;
    };
    facilityType: 'indoor' | 'outdoor' | 'hybrid';
  };
  operatingHours: {
    [day: string]: { open: string; close: string } | 'closed';
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
    };
  };
  amenities: string[];
  pricing: {
    courtRatePerHour: number;
    peakRate?: number;
    offPeakRate?: number;
    membershipOptions?: Array<{
      tier: string;
      monthlyFee: number;
      benefits: string[];
    }>;
  };
  verificationDocuments: {
    businessLicense: string;
    taxId: string;
    ownershipProof: string;
    leaseAgreement?: string;
  };
  agreements: {
    agreeToCourtGuidelines: boolean;
    acceptCommunityStandards: boolean;
    acknowledgeBookingTerms: boolean;
  };
}

// Admin User Management
export interface AdminUserAction {
  userId: string;
  action: 'suspend' | 'activate' | 'delete' | 'assign_role' | 'remove_role';
  reason?: string;
  roleId?: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorRole: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes: Record<string, any>;
  reason?: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}
```

### Component Requirements

#### 1. Role Application Forms

**Player Application Form (`PlayerApplicationForm.tsx`)**
- Multi-step wizard with 6 steps
- Form validation with Zod/React Hook Form
- File upload for profile photo
- Auto-save draft functionality
- Progress indicator
- Review & submit step

**Coach Application Form (`CoachApplicationForm.tsx`)**
- Multi-step wizard with 7 steps
- Certificate/license document upload
- Availability calendar picker
- Pricing calculator
- Professional photo upload
- Bio with rich text editor
- Terms acceptance checkboxes

**Court Owner Application Form (`CourtOwnerApplicationForm.tsx`)**
- Multi-step wizard with 8 steps
- Business document uploads (license, tax ID, etc.)
- Address autocomplete with map preview
- Operating hours scheduler
- Amenities multi-select
- Pricing tier builder
- Multiple court management

#### 2. Admin Panel Components

**Admin Dashboard (`AdminDashboard.tsx`)**
- User statistics cards
- Role application queue (pending count)
- Recent activity feed
- Quick actions panel

**Role Approval Queue (`RoleApprovalQueue.tsx`)**
- Filterable/sortable application list
- Application detail modal
- Document viewer
- Approve/Reject actions with reason
- Bulk actions support

**User Actions Panel (`UserActionsPanel.tsx`)**
- Suspend/Activate account
- Delete account (with confirmation)
- Assign/Remove roles manually
- View audit logs
- Reset password

#### 3. User Management Components

**User List (`UserList.tsx`)**
- Searchable/filterable user table
- Role badges display
- Status indicators
- Pagination
- Sort by columns
- Bulk selection

**User Details (`UserDetails.tsx`)**
- User profile display
- Role history timeline
- Active applications status
- Quick actions menu
- Activity log

---

## 🔌 API CONTRACT SPECIFICATIONS

### Authentication

All API requests require Bearer token authentication:

```
Authorization: Bearer {access_token}
```

### Base URL

```
https://api.pickleplay.ph/api/v1
```

---

### 1. USER MANAGEMENT ENDPOINTS

#### Get All Users (Admin Only)

```http
GET /users
```

**Query Parameters:**
```typescript
{
  page?: number;           // Default: 1
  perPage?: number;        // Default: 20
  search?: string;         // Search by name/email
  role?: UserRole;         // Filter by role
  status?: 'active' | 'inactive' | 'suspended';
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
```

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "phone": "+639171234567",
      "profilePhotoUrl": "https://cdn.pickleplay.com/photos/alice.jpg",
      "roles": [
        {
          "roleId": "role-uuid-1",
          "roleName": "CUSTOMER",
          "assignedAt": "2025-12-20T14:22:00Z",
          "isActive": true
        },
        {
          "roleId": "role-uuid-2",
          "roleName": "COACH",
          "assignedAt": "2026-01-10T11:15:00Z",
          "isActive": true
        }
      ],
      "primaryRole": "COACH",
      "status": "active",
      "emailVerified": true,
      "phoneVerified": true,
      "createdAt": "2025-12-20T14:22:00Z",
      "lastLoginAt": "2026-01-27T09:30:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "perPage": 20,
    "total": 145,
    "totalPages": 8
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": true,
  "code": "UNAUTHORIZED",
  "message": "Authentication required",
  "statusCode": 401
}

// 403 Forbidden
{
  "error": true,
  "code": "PERMISSION_DENIED",
  "message": "You do not have permission to access this resource",
  "statusCode": 403,
  "details": {
    "requiredRole": "ADMIN",
    "currentRole": "CUSTOMER"
  }
}
```

---

#### Get User by ID

```http
GET /users/{userId}
```

**Response: 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "+639171234567",
  "dateOfBirth": "1995-05-15",
  "location": "Manila, Philippines",
  "profilePhotoUrl": "https://cdn.pickleplay.com/photos/alice.jpg",
  "coverPhotoUrl": "https://cdn.pickleplay.com/covers/alice.jpg",
  "bio": "Passionate pickleball player and certified coach",
  "roles": [
    {
      "roleId": "role-uuid-1",
      "roleName": "CUSTOMER",
      "assignedAt": "2025-12-20T14:22:00Z",
      "assignedBy": "system",
      "isActive": true
    },
    {
      "roleId": "role-uuid-2",
      "roleName": "COACH",
      "assignedAt": "2026-01-10T11:15:00Z",
      "assignedBy": "admin-uuid",
      "isActive": true
    }
  ],
  "primaryRole": "COACH",
  "emailVerified": true,
  "phoneVerified": true,
  "status": "active",
  "createdAt": "2025-12-20T14:22:00Z",
  "updatedAt": "2026-01-22T14:30:00Z",
  "lastLoginAt": "2026-01-27T09:30:00Z"
}
```

---

#### Update User

```http
PATCH /users/{userId}
```

**Request Body:**
```json
{
  "name": "Alice Marie Johnson",
  "phone": "+639171234567",
  "location": "Quezon City, Philippines",
  "bio": "Updated bio text",
  "profilePhotoUrl": "https://cdn.pickleplay.com/photos/alice-new.jpg"
}
```

**Response: 200 OK**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Alice Marie Johnson",
  "email": "alice@example.com",
  "updatedAt": "2026-01-27T10:15:00Z"
}
```

---

#### Suspend User (Admin Only)

```http
POST /users/{userId}/suspend
```

**Request Body:**
```json
{
  "reason": "Violation of community guidelines",
  "duration": 30  // days, null for indefinite
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "suspended",
  "suspendedUntil": "2026-02-26T10:15:00Z"
}
```

---

#### Activate User (Admin Only)

```http
POST /users/{userId}/activate
```

**Response: 200 OK**
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "active"
}
```

---

#### Delete User (Admin Only)

```http
DELETE /users/{userId}
```

**Query Parameters:**
```typescript
{
  reason: string;  // Required reason for deletion
}
```

**Response: 204 No Content**

---

### 2. ROLE APPLICATION ENDPOINTS

#### Submit Role Application

```http
POST /role-applications
```

**Request Body (Coach Application Example):**
```json
{
  "roleId": "role-coach-uuid",
  "applicationData": {
    "professionalInfo": {
      "fullName": "Alice Johnson",
      "phone": "+639171234567",
      "yearsOfExperience": 5,
      "currentSkillLevel": "advanced",
      "specializations": ["technique", "strategy", "fitness"]
    },
    "credentials": {
      "certifications": [
        {
          "name": "IPTPA Coaching Certification",
          "issuedBy": "IPTPA",
          "issuedDate": "2021-06-15",
          "documentUrl": "https://cdn.pickleplay.com/docs/cert-1.pdf"
        }
      ],
      "licenses": []
    },
    "background": {
      "playHistory": "Started playing in 2019",
      "tournamentExperience": "10+ local tournaments",
      "previousCoaching": "3 years at SportsPlex"
    },
    "coachingDetails": {
      "availabilitySchedule": {
        "monday": ["09:00-12:00", "14:00-18:00"],
        "tuesday": ["09:00-12:00", "14:00-18:00"],
        "wednesday": [],
        "thursday": ["09:00-12:00", "14:00-18:00"],
        "friday": ["09:00-12:00", "14:00-18:00"],
        "saturday": ["08:00-16:00"],
        "sunday": ["10:00-14:00"]
      },
      "preferredCourtTypes": ["indoor", "outdoor"],
      "lessonDurations": ["30min", "60min", "90min"],
      "groupSizePreference": ["individual", "small_group"]
    },
    "pricing": {
      "hourlyRate": 75,
      "packageDeals": [
        {
          "name": "5 Lesson Package",
          "sessions": 5,
          "totalPrice": 325
        }
      ],
      "trialLessonRate": 25
    },
    "profile": {
      "professionalPhoto": "https://cdn.pickleplay.com/photos/alice-coach.jpg",
      "bio": "Certified coach with 5+ years experience",
      "socialLinks": {
        "instagram": "https://instagram.com/alicecoaches",
        "linkedin": "https://linkedin.com/in/alicejohnson"
      }
    },
    "agreements": {
      "agreeToCoachGuidelines": true,
      "acceptCommunityStandards": true,
      "acknowledgePaymentTerms": true
    }
  }
}
```

**Response: 201 Created**
```json
{
  "id": "app-uuid-12345",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "roleId": "role-coach-uuid",
  "roleName": "COACH",
  "status": "pending",
  "submittedAt": "2026-01-27T10:30:00Z",
  "message": "Your application has been submitted and is pending review"
}
```

**Validation Errors: 422 Unprocessable Entity**
```json
{
  "error": true,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "statusCode": 422,
  "errors": {
    "professionalInfo.yearsOfExperience": [
      "Years of experience must be at least 1"
    ],
    "agreements.agreeToCoachGuidelines": [
      "You must agree to coach guidelines"
    ]
  }
}
```

---

#### Get My Applications

```http
GET /role-applications/me
```

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "app-uuid-12345",
      "roleId": "role-coach-uuid",
      "roleName": "COACH",
      "status": "pending",
      "submittedAt": "2026-01-27T10:30:00Z",
      "reviewedAt": null,
      "canReapplyAt": null
    },
    {
      "id": "app-uuid-67890",
      "roleId": "role-player-uuid",
      "roleName": "PLAYER",
      "status": "approved",
      "submittedAt": "2026-01-15T08:00:00Z",
      "reviewedAt": "2026-01-16T14:30:00Z"
    }
  ]
}
```

---

#### Get All Applications (Admin Only)

```http
GET /role-applications
```

**Query Parameters:**
```typescript
{
  status?: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  role?: UserRole;
  page?: number;
  perPage?: number;
}
```

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "app-uuid-12345",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "userName": "Alice Johnson",
      "userEmail": "alice@example.com",
      "roleId": "role-coach-uuid",
      "roleName": "COACH",
      "status": "pending",
      "submittedAt": "2026-01-27T10:30:00Z",
      "applicationData": { /* full application data */ }
    }
  ],
  "meta": {
    "currentPage": 1,
    "perPage": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

#### Review Application (Admin Only)

```http
POST /role-applications/{applicationId}/review
```

**Request Body:**
```json
{
  "action": "approve",  // or "reject"
  "adminNotes": "Credentials verified, experience confirmed",
  "rejectionReason": null  // Required if action is "reject"
}
```

**Response: 200 OK (Approved)**
```json
{
  "success": true,
  "applicationId": "app-uuid-12345",
  "status": "approved",
  "message": "Application approved. User has been granted COACH role.",
  "reviewedAt": "2026-01-27T11:00:00Z"
}
```

**Response: 200 OK (Rejected)**
```json
{
  "success": true,
  "applicationId": "app-uuid-12345",
  "status": "rejected",
  "rejectionReason": "Insufficient coaching experience",
  "canReapplyAt": "2026-02-27T11:00:00Z",
  "message": "Application rejected. User can reapply after 30 days."
}
```

---

### 3. ROLE MANAGEMENT ENDPOINTS

#### Get All Roles

```http
GET /roles
```

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "role-uuid-1",
      "name": "CUSTOMER",
      "description": "Regular platform user with basic access",
      "type": "system",
      "isActive": true
    },
    {
      "id": "role-uuid-2",
      "name": "COACH",
      "description": "Professional coaching provider",
      "type": "system",
      "isActive": true
    }
  ]
}
```

---

#### Assign Role to User (Admin Only)

```http
POST /users/{userId}/roles
```

**Request Body:**
```json
{
  "roleId": "role-coach-uuid",
  "reason": "Manual assignment by admin",
  "expiresAt": null  // Optional expiration date
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "roleId": "role-coach-uuid",
  "roleName": "COACH",
  "assignedAt": "2026-01-27T11:30:00Z"
}
```

---

#### Remove Role from User (Admin Only)

```http
DELETE /users/{userId}/roles/{roleId}
```

**Request Body:**
```json
{
  "reason": "Role no longer needed"
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "roleId": "role-coach-uuid",
  "removedAt": "2026-01-27T11:45:00Z"
}
```

---

### 4. AUDIT LOG ENDPOINTS

#### Get Audit Logs (Admin Only)

```http
GET /audit-logs
```

**Query Parameters:**
```typescript
{
  userId?: string;         // Filter by user
  action?: string;         // Filter by action
  resourceType?: string;   // Filter by resource
  startDate?: string;      // ISO 8601 date
  endDate?: string;        // ISO 8601 date
  page?: number;
  perPage?: number;
}
```

**Response: 200 OK**
```json
{
  "data": [
    {
      "id": "audit-uuid-1",
      "actorId": "admin-uuid",
      "actorRole": "ADMIN",
      "action": "APPROVE_ROLE_APPLICATION",
      "resourceType": "role_application",
      "resourceId": "app-uuid-12345",
      "changes": {
        "status": {
          "from": "pending",
          "to": "approved"
        }
      },
      "reason": "Credentials verified",
      "ipAddress": "192.168.1.1",
      "createdAt": "2026-01-27T11:00:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "perPage": 50,
    "total": 1234,
    "totalPages": 25
  }
}
```

---

## 💾 DATABASE SCHEMA & MODELS

### Database Tables

#### 1. users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    location VARCHAR(255),
    profile_photo_url VARCHAR(500),
    cover_photo_url VARCHAR(500),
    bio TEXT,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);
```

**Validation Rules:**
- `email`: Valid RFC 5322 format, unique
- `password`: Min 8 chars, 1 uppercase, 1 number, 1 special char
- `phone`: E.164 format (optional)
- `date_of_birth`: User must be 18+ years old
- `name`: 2-255 characters

---

#### 2. roles

```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    type ENUM('system', 'custom') DEFAULT 'system',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE INDEX idx_role_name (name)
);

-- Seed Data
INSERT INTO roles (name, description, type) VALUES
('CUSTOMER', 'Regular platform user with basic access', 'system'),
('PLAYER', 'Competitive player with ranking system access', 'system'),
('COACH', 'Professional coaching provider', 'system'),
('COURT_OWNER', 'Pickleball court facility manager', 'system'),
('ADMIN', 'Platform administrator with moderation rights', 'system'),
('SUPER_ADMIN', 'System super administrator with full access', 'system');
```

---

#### 3. user_roles (Many-to-Many)

```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (assigned_by) REFERENCES users(id),
    
    UNIQUE INDEX idx_user_role (user_id, role_id),
    INDEX idx_user_id (user_id),
    INDEX idx_role_id (role_id),
    INDEX idx_is_active (is_active)
);
```

---

#### 4. role_applications

```sql
CREATE TABLE role_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'withdrawn') DEFAULT 'pending',
    
    -- Application Data (JSON format for flexibility)
    application_data JSON NOT NULL,
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by UUID REFERENCES users(id),
    
    -- Rejection/Feedback
    rejection_reason TEXT NULL,
    can_reapply_at TIMESTAMP NULL,
    admin_notes TEXT NULL,
    
    -- Tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_user_status (user_id, status)
);
```

**Validation Rules:**
- User cannot have duplicate pending applications for same role
- User cannot apply if already has the role
- JSON data must match role-specific schema
- All required fields in `application_data` must be present

---

#### 5. audit_logs

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Actor
    actor_id UUID NOT NULL REFERENCES users(id),
    actor_role VARCHAR(50),
    
    -- Action
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    
    -- Details
    changes JSON,
    reason TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_actor_id (actor_id),
    INDEX idx_created_at (created_at),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_action (action)
);
```

**Logged Actions:**
- `USER_CREATED`, `USER_UPDATED`, `USER_DELETED`
- `USER_SUSPENDED`, `USER_ACTIVATED`
- `ROLE_ASSIGNED`, `ROLE_REMOVED`
- `APPLICATION_SUBMITTED`, `APPLICATION_APPROVED`, `APPLICATION_REJECTED`
- `PASSWORD_CHANGED`, `EMAIL_VERIFIED`, `PHONE_VERIFIED`

---

## 🔗 INTEGRATION GUIDE

### Frontend API Service Layer

**File: `src/services/api/users.ts`**

```typescript
import axios from 'axios';
import { UserProfile, AdminUserAction } from '@/types/user-management';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.pickleplay.ph/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const usersApi = {
  // Get all users (admin only)
  async getUsers(params?: {
    page?: number;
    perPage?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  // Get user by ID
  async getUserById(userId: string) {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  // Update user
  async updateUser(userId: string, data: Partial<UserProfile>) {
    const response = await apiClient.patch(`/users/${userId}`, data);
    return response.data;
  },

  // Suspend user
  async suspendUser(userId: string, reason: string, duration?: number) {
    const response = await apiClient.post(`/users/${userId}/suspend`, {
      reason,
      duration,
    });
    return response.data;
  },

  // Activate user
  async activateUser(userId: string) {
    const response = await apiClient.post(`/users/${userId}/activate`);
    return response.data;
  },

  // Delete user
  async deleteUser(userId: string, reason: string) {
    const response = await apiClient.delete(`/users/${userId}`, {
      params: { reason },
    });
    return response.data;
  },
};
```

**File: `src/services/api/applications.ts`**

```typescript
import axios from 'axios';
import { RoleApplication, PlayerApplicationData, CoachApplicationData, CourtOwnerApplicationData } from '@/types/user-management';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.pickleplay.ph/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const applicationsApi = {
  // Submit role application
  async submitApplication(
    roleId: string,
    applicationData: PlayerApplicationData | CoachApplicationData | CourtOwnerApplicationData
  ) {
    const response = await apiClient.post('/role-applications', {
      roleId,
      applicationData,
    });
    return response.data;
  },

  // Get my applications
  async getMyApplications() {
    const response = await apiClient.get('/role-applications/me');
    return response.data;
  },

  // Get all applications (admin)
  async getAllApplications(params?: {
    status?: string;
    role?: string;
    page?: number;
    perPage?: number;
  }) {
    const response = await apiClient.get('/role-applications', { params });
    return response.data;
  },

  // Review application (admin)
  async reviewApplication(
    applicationId: string,
    action: 'approve' | 'reject',
    adminNotes?: string,
    rejectionReason?: string
  ) {
    const response = await apiClient.post(`/role-applications/${applicationId}/review`, {
      action,
      adminNotes,
      rejectionReason,
    });
    return response.data;
  },
};
```

### React Hooks

**File: `src/hooks/useUsers.ts`**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api/users';

export function useUsers(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ['users', userId],
    queryFn: () => usersApi.getUserById(userId),
    enabled: !!userId,
  });
}

export function useSuspendUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, reason, duration }: { userId: string; reason: string; duration?: number }) =>
      usersApi.suspendUser(userId, reason, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useActivateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userId: string) => usersApi.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
```

### Form Validation Examples

**File: `src/utils/validation.ts`**

```typescript
import { z } from 'zod';

// Player Application Schema
export const playerApplicationSchema = z.object({
  basicInfo: z.object({
    fullName: z.string().min(2, 'Full name is required').max(255),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+639\d{9}$/, 'Invalid Philippines phone number'),
    location: z.string().min(2, 'Location is required'),
  }),
  playingProfile: z.object({
    skillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
    yearsPlaying: z.number().min(0).max(100),
    playFrequency: z.enum(['casual', 'regular_1_2x_week', 'frequent_3_4x_week', 'competitive']),
  }),
  experience: z.object({
    tournamentParticipation: z.enum(['never', 'local', 'regional', 'national']),
    tournamentWins: z.number().min(0),
    achievements: z.string().max(1000),
  }),
  preferences: z.object({
    preferredCourtType: z.enum(['indoor', 'outdoor', 'either']),
    preferredMatchFormat: z.enum(['singles', 'doubles', 'both']),
    preferredTimeSlots: z.array(z.string()),
  }),
  profile: z.object({
    profilePhoto: z.string().url().optional(),
    bio: z.string().min(50, 'Bio must be at least 50 characters').max(500),
    socialLinks: z.object({
      instagram: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
    }).optional(),
  }),
  agreements: z.object({
    agreeToCodeOfConduct: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the code of conduct' }),
    }),
    agreeToRankingSystem: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to the ranking system' }),
    }),
    agreeToFairPlay: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to fair play standards' }),
    }),
  }),
});

// Coach Application Schema
export const coachApplicationSchema = z.object({
  professionalInfo: z.object({
    fullName: z.string().min(2).max(255),
    phone: z.string().regex(/^\+639\d{9}$/),
    yearsOfExperience: z.number().min(1, 'At least 1 year of experience required').max(100),
    currentSkillLevel: z.enum(['beginner', 'intermediate', 'advanced', 'professional']),
    specializations: z.array(z.string()).min(1, 'At least one specialization required'),
  }),
  credentials: z.object({
    certifications: z.array(z.object({
      name: z.string().min(1),
      issuedBy: z.string().min(1),
      issuedDate: z.string(),
      documentUrl: z.string().url(),
    })).min(1, 'At least one certification required'),
    licenses: z.array(z.object({
      name: z.string().min(1),
      licenseNumber: z.string().min(1),
      documentUrl: z.string().url(),
    })),
  }),
  // ... other fields
  agreements: z.object({
    agreeToCoachGuidelines: z.literal(true),
    acceptCommunityStandards: z.literal(true),
    acknowledgePaymentTerms: z.literal(true),
  }),
});
```

### Permission Checking

**File: `src/utils/permissions.ts`**

```typescript
import { UserRole } from '@/types/user-management';

export function hasPermission(
  userRoles: UserRole[],
  requiredRole: UserRole | UserRole[]
): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(role => userRoles.includes(role));
  }
  return userRoles.includes(requiredRole);
}

export function canManageUsers(userRoles: UserRole[]): boolean {
  return hasPermission(userRoles, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
}

export function canApproveApplications(userRoles: UserRole[]): boolean {
  return hasPermission(userRoles, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
}

export function canViewAuditLogs(userRoles: UserRole[]): boolean {
  return hasPermission(userRoles, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
}
```

**Component Example: `PermissionGuard.tsx`**

```typescript
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissions';
import { UserRole } from '@/types/user-management';

interface PermissionGuardProps {
  requiredRole: UserRole | UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ requiredRole, children, fallback }: PermissionGuardProps) {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const userRoles = user.roles.map(r => r.roleName);
  
  if (!hasPermission(userRoles, requiredRole)) {
    return fallback || null;
  }
  
  return <>{children}</>;
}

// Usage Example:
// <PermissionGuard requiredRole={UserRole.ADMIN}>
//   <AdminDashboard />
// </PermissionGuard>
```

---

## ✅ DELIVERABLES CHECKLIST

### Frontend Components

- [ ] **Role Application Forms**
  - [ ] PlayerApplicationForm.tsx (6-step wizard)
  - [ ] CoachApplicationForm.tsx (7-step wizard)
  - [ ] CourtOwnerApplicationForm.tsx (8-step wizard)
  - [ ] ApplicationList.tsx (user's applications)
  - [ ] ApplicationReview.tsx (admin review interface)

- [ ] **User Management**
  - [ ] UserList.tsx (searchable/filterable table)
  - [ ] UserDetails.tsx (profile view)
  - [ ] UserRoleManager.tsx (assign/remove roles)
  - [ ] UserSearch.tsx (search component)

- [ ] **Admin Panel**
  - [ ] AdminDashboard.tsx (overview)
  - [ ] RoleApprovalQueue.tsx (pending applications)
  - [ ] UserActionsPanel.tsx (suspend/activate/delete)
  - [ ] AuditLogViewer.tsx (activity logs)

- [ ] **Shared Components**
  - [ ] RoleBadge.tsx (role display badge)
  - [ ] PermissionGuard.tsx (conditional rendering)
  - [ ] FormWizard.tsx (multi-step form)
  - [ ] FileUpload.tsx (document upload)

### TypeScript Types

- [ ] user-management.ts (all interfaces)
- [ ] validation.ts (Zod schemas)

### API Services

- [ ] users.ts (user management API)
- [ ] roles.ts (role management API)
- [ ] applications.ts (application management API)

### React Hooks

- [ ] useUsers.ts
- [ ] useRoles.ts
- [ ] useApplications.ts
- [ ] usePermissions.ts

### Backend APIs (Laravel)

- [ ] User Management Endpoints (5 endpoints)
- [ ] Role Application Endpoints (4 endpoints)
- [ ] Role Management Endpoints (3 endpoints)
- [ ] Audit Log Endpoints (1 endpoint)

### Database

- [ ] Migration: users table
- [ ] Migration: roles table (with seed data)
- [ ] Migration: user_roles table
- [ ] Migration: role_applications table
- [ ] Migration: audit_logs table

### Additional Features

- [ ] Form validation with Zod
- [ ] File upload handling
- [ ] Permission checking utilities
- [ ] React Query integration
- [ ] Error handling
- [ ] Loading states
- [ ] Toast notifications
- [ ] Responsive design

---

## 🎨 UI/UX GUIDELINES

### Design System

**Colors:**
- Primary: Tailwind `blue-600`
- Success: Tailwind `green-600`
- Warning: Tailwind `yellow-600`
- Error: Tailwind `red-600`

**Role Color Coding:**
```typescript
const ROLE_COLORS = {
  CUSTOMER: 'bg-gray-100 text-gray-800',
  PLAYER: 'bg-blue-100 text-blue-800',
  COACH: 'bg-green-100 text-green-800',
  COURT_OWNER: 'bg-purple-100 text-purple-800',
  ADMIN: 'bg-orange-100 text-orange-800',
  SUPER_ADMIN: 'bg-red-100 text-red-800',
};
```

**Typography:**
- Headings: `font-bold`
- Body: `font-normal`
- Small text: `text-sm text-gray-600`

**Spacing:**
- Use Tailwind spacing scale (4, 8, 16, 24, 32, etc.)

### Component Patterns

**Buttons:**
```tsx
// Primary
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Submit
</button>

// Secondary
<button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
  Cancel
</button>

// Danger
<button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
  Delete
</button>
```

**Form Inputs:**
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  placeholder="Enter your name"
/>
```

**Cards:**
```tsx
<div className="bg-white rounded-lg shadow-md p-6">
  {/* Content */}
</div>
```

---

## 📝 NOTES & BEST PRACTICES

### Security

1. **Authentication**
   - Always include Bearer token in API requests
   - Implement token refresh mechanism
   - Store tokens securely (httpOnly cookies recommended)

2. **Authorization**
   - Check permissions on both frontend and backend
   - Use PermissionGuard component for UI
   - Backend must validate all role-based access

3. **Data Validation**
   - Validate on frontend (UX) and backend (security)
   - Sanitize user inputs
   - Use Zod schemas for type-safe validation

### Performance

1. **Frontend**
   - Use React Query for caching
   - Implement pagination for large lists
   - Lazy load components
   - Optimize images (use Next.js Image)

2. **Backend**
   - Index database columns used in queries
   - Use eager loading to avoid N+1 queries
   - Implement rate limiting
   - Cache frequently accessed data

### Code Quality

1. **TypeScript**
   - Use strict mode
   - Define all types/interfaces
   - Avoid `any` type
   - Use const assertions where appropriate

2. **React**
   - Use functional components
   - Implement proper error boundaries
   - Keep components small and focused
   - Use custom hooks for reusable logic

3. **Laravel**
   - Use Form Requests for validation
   - Implement API Resources for responses
   - Use Eloquent relationships
   - Write unit and feature tests

---

## 🚀 IMPLEMENTATION PRIORITY

**Phase 1: Foundation (Week 1)**
1. Database migrations
2. TypeScript types
3. API service layer
4. Basic React hooks

**Phase 2: Core Features (Week 2)**
1. Role application forms
2. Application submission API
3. User list and details
4. Application review (admin)

**Phase 3: Admin Panel (Week 3)**
1. Admin dashboard
2. User management actions
3. Role assignment
4. Audit logs

**Phase 4: Polish & Testing (Week 4)**
1. Error handling
2. Loading states
3. Validation improvements
4. End-to-end testing
5. Documentation

---

## 📞 SUPPORT & QUESTIONS

For any questions or clarifications about this implementation:

1. Review the RBAC_FLOWCHARTS.md for detailed flowcharts
2. Check API response examples for data structures
3. Refer to validation schemas for field requirements
4. Follow TypeScript types for type safety

**Remember:** This is a comprehensive guide. Break down the implementation into smaller tasks and implement incrementally. Test each component thoroughly before moving to the next.

---

**Good luck with the implementation! 🎉**
