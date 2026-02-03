# Sidebar & Profile Dashboard Architecture

## Current Issues & Redundancies

### 1. **Duplicate Navigation Items**
- **Player Directory** appears in BOTH "Play" and "Connect" menus
- **Tournaments** appears in Play menu (should be consolidated)
- **Activity** appears in multiple places: Account menu, Dashboard submenu, AND Mobile bottom nav
- **Activity/Stats** in Account menu vs. standalone Activity page

### 2. **Dashboard Redundancy**
- `/dashboard` page is mostly empty and links to other pages
- Dashboard submenu has: Activity, Traffic, Statistic (but Activity is also in Account menu)
- These should be consolidated into the Profile dashboard

### 3. **Profile Page Issues**
- `/profile` page is too large (223 lines) with multiple component tabs
- Navigation tabs should be cleaner
- Should host: Overview, Statistics, My Roles, Security, Settings, Verification

---

## RECOMMENDED STRUCTURE

### **Sidebar Main Navigation (Cleaned Up)**
```
PicklePlay Logo
├── Social Feed (/community)
├── Play ▼
│   ├── Player Directory (/players)
│   └── Tournaments (/tournaments)
├── Connect ▼
│   ├── Team Hub (/teams)
│   ├── Leaderboards (/rankings)
│   └── Point Rewards (/rewards)
├── Improve ▼
│   ├── Coaching (/coaching)
│   └── Articles & Tips (/articles)
├── Account ▼
│   ├── Wallet (/wallet)
│   └── Billing (/billing)
├── Settings (/settings)
├── [User Profile Card] (/profile)
└── Logout
```

**Note:** Remove "Dashboard" submenu (Activity, Traffic, Statistic) - consolidate into Profile

---

### **Profile Dashboard (/profile) - Tab-Based Navigation**

Primary tabs accessible from `/profile` page:

1. **Overview** (`/profile/overview` or default `/profile`)
   - Profile picture, name, location
   - Pickleball rating, member since
   - Quick stats cards
   - Edit profile button

2. **My Statistics** (`/profile/statistics`)
   - Matches played
   - Win/loss record
   - Court visits (traffic)
   - Performance trends
   - Rating history

3. **My Roles** (`/profile/roles`)
   - Current roles (Player, Coach, Tournament Organizer)
   - Role-specific information
   - Apply for new roles

4. **Account & Payment** (`/profile/billing`)
   - Wallet balance
   - Billing information
   - Payment methods
   - Transaction history

5. **Security & Verification** (`/profile/security`)
   - Password management
   - Two-factor authentication
   - Email verification
   - Phone verification
   - Active sessions

6. **Settings** (`/profile/settings`)
   - Privacy settings
   - Notification preferences
   - Language/Region
   - Theme preferences

---

### **Mobile Bottom Navigation (Optimized)**
```
Home
Profile
Activity (consolidated view)
Wallet
Settings
```

---

## ACTION ITEMS

### ✅ Sidebar Changes Required:
1. Remove "Player Directory" from Connect menu (keep only in Play)
2. Remove "Dashboard" submenu completely
3. Consolidate Activity/Traffic/Stats into Profile

### ✅ Profile Page Changes Required:
1. Create `/profile/overview` - main view
2. Create `/profile/statistics` - stats & traffic data
3. Create `/profile/roles` - role management
4. Create `/profile/billing` - wallet & payments
5. Create `/profile/security` - security settings
6. Create `/profile/settings` - preferences

### ✅ Remove Pages (Redirect to Profile):
- `/activity` → `/profile/statistics`
- `/traffic` → `/profile/statistics`
- `/statistic` → `/profile/statistics`

### ✅ Keep Pages (Accessible via Sidebar):
- `/wallet` → Keep as standalone OR move to `/profile/billing`
- `/billing` → Keep as standalone OR move to `/profile/billing`
- `/settings` → Keep as standalone for global settings

---

## URL Mapping Strategy

| Feature | Current URL | Recommended URL |
|---------|-------------|-----------------|
| Profile Overview | /profile | /profile |
| Activity/Stats | /activity, /traffic, /statistic | /profile/statistics |
| Wallet | /wallet | /profile/billing or /wallet |
| Billing | /billing | /profile/billing or /billing |
| Settings | /settings | /settings (global) or /profile/settings |
| My Roles | /profile (tab) | /profile/roles |
| Security | /profile (tab) | /profile/security |

---

## Component Organization

```
src/components/profile/
├── ProfileOverview.tsx       (existing, clean up)
├── Statistics.tsx            (existing, consolidate traffic here)
├── RolesManagement.tsx       (existing)
├── Security.tsx              (existing)
├── Verification.tsx          (existing)
├── Settings.tsx              (existing)
├── PaymentInfo.tsx           (existing, rename to BillingInfo)
├── ProfileCompletion.tsx     (existing, maybe remove)
└── Modals/
    └── EditProfile.tsx       (existing)
```

---

## Benefits
✅ Cleaner sidebar navigation  
✅ No duplicate menu items  
✅ Consolidated user dashboard under `/profile`  
✅ Better UX with tab-based organization  
✅ Easier to maintain and scale  
✅ Mobile and desktop experiences aligned
