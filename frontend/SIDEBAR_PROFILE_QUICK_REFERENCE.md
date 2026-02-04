# Quick Reference: Sidebar & Profile Dashboard

## ✅ SIDEBAR - Current State (CLEANED)

### Main Navigation Structure
```
PicklePlay PHILIPPINES
│
├─ 📱 Social Feed              /community
│
├─ 🎮 Play
│  ├─ 👥 Player Directory      /players
│  └─ 🏆 Tournaments           /tournaments
│
├─ 🌐 Connect
│  ├─ 👥 Team Hub              /teams
│  ├─ 📊 Leaderboards          /rankings
│  └─ 🎁 Point Rewards         /rewards
│
├─ 💡 Improve
│  ├─ 👔 Coaching              /coaching
│  └─ 📚 Articles & Tips        /articles
│
├─ 💰 Account
│  ├─ 💳 Wallet                /wallet
│  └─ 📋 Billing               /billing
│
├─ ⚙️ Settings                  /settings
│
├─ [USER PROFILE CARD]         /profile
│  └─ [avatar, name, role]
│
└─ 🚪 Logout
```

### What Changed
- ✅ Removed "Player Directory" from Connect menu (was duplicate)
- ✅ Removed "Activity & Stats" from Account menu
- ✅ Removed entire Dashboard submenu (was redundant)
- ✅ Clean Account menu: Wallet, Billing only

### Navigation Counts
- **Menu Groups:** 4 (Play, Connect, Improve, Account)
- **Total Items:** 15
- **Sub-items:** 9
- **Duplicates:** 0 ✅

---

## 📊 PROFILE DASHBOARD - Recommended Structure

### Main Profile Page: `/profile`

**Tab Navigation:**
```
Profile │ Statistics │ Roles │ Billing │ Security │ Settings
```

### Tab Details

#### 1. Profile (Overview)
**Path:** `/profile` or `/profile/overview`
```
┌─────────────────────────────────┐
│ [Avatar] Edit Profile           │
├─────────────────────────────────┤
│ Name                            │
│ Location: Cebu City, Philippines│
│ Member Since: 2021              │
├─────────────────────────────────┤
│ ⭐ Pickleball Rating: 4.8 (+0.5)│
│ 🏆 Matches: 142 (+12 this month)│
│ 🏅 Courts Visited: 8            │
└─────────────────────────────────┘
```

#### 2. Statistics
**Path:** `/profile/statistics`
**Consolidates:** /activity, /traffic, /statistic
```
┌─────────────────────────────────┐
│ MATCH STATISTICS                │
│ • Total: 142                    │
│ • Wins: 89 (62.7%)              │
│ • Losses: 53 (37.3%)            │
├─────────────────────────────────┤
│ COURT TRAFFIC                   │
│ • Courts Visited: 8             │
│ • Favorite: Banilad Court       │
│ • Most Recent: Today            │
├─────────────────────────────────┤
│ PERFORMANCE TRENDS              │
│ • Rating History [📈 graph]     │
│ • Monthly Activity [📊 chart]   │
│ • Recent Matches [list]         │
└─────────────────────────────────┘
```

#### 3. My Roles
**Path:** `/profile/roles`
```
┌─────────────────────────────────┐
│ CURRENT ROLES                   │
│ ✅ Player                       │
│ ✅ Coach                        │
│ ⏳ Tournament Organizer (pending)│
├─────────────────────────────────┤
│ [Apply for New Role]            │
│ [View Role History]             │
└─────────────────────────────────┘
```

#### 4. Billing & Wallet
**Path:** `/profile/billing`
**Consolidates:** /wallet, /billing
```
┌─────────────────────────────────┐
│ WALLET                          │
│ Balance: ₱2,450.00              │
│ [Add Funds] [Withdraw]          │
├─────────────────────────────────┤
│ PAYMENT METHODS                 │
│ 💳 VISA ...1234                 │
│ 🏦 GCash ...xxxx                │
│ [Add Payment Method]            │
├─────────────────────────────────┤
│ TRANSACTIONS                    │
│ [Transaction list & filters]    │
│ [Download Statement]            │
└─────────────────────────────────┘
```

#### 5. Security & Verification
**Path:** `/profile/security`
```
┌─────────────────────────────────┐
│ SECURITY SETTINGS               │
│ 🔑 Password: ●●●●●●●●         │
│    [Change Password]            │
├─────────────────────────────────┤
│ 🔐 Two-Factor Authentication    │
│    ⭕ Disabled [Enable]         │
├─────────────────────────────────┤
│ VERIFICATION                    │
│ ✅ Email: user@email.com        │
│ ❌ Phone: +63-9XX-XXX-XXXX      │
│    [Verify Phone]               │
├─────────────────────────────────┤
│ ACTIVE SESSIONS                 │
│ • Chrome on Windows (now)       │
│ • Safari on iPhone (2 days ago) │
│ [Logout all other sessions]     │
└─────────────────────────────────┘
```

#### 6. Settings & Preferences
**Path:** `/profile/settings`
```
┌─────────────────────────────────┐
│ PRIVACY                         │
│ Profile: Public / Private       │
│ Show Stats: Yes / No            │
├─────────────────────────────────┤
│ NOTIFICATIONS                   │
│ ✅ Emails                       │
│ ✅ Push Notifications           │
│ ✅ Match Results                │
├─────────────────────────────────┤
│ DISPLAY                         │
│ Theme: Light / Dark             │
│ Language: English / Tagalog     │
├─────────────────────────────────┤
│ DATA                            │
│ [Download My Data]              │
│ [Delete Account]                │
└─────────────────────────────────┘
```

---

## 🔀 URL Mapping Quick Reference

### New Endpoints (/profile)
| Tab | URL | Purpose |
|-----|-----|---------|
| Overview | `/profile` | Main profile view |
| Statistics | `/profile/statistics` | Activity, traffic, stats |
| Roles | `/profile/roles` | Role management |
| Billing | `/profile/billing` | Wallet & payments |
| Security | `/profile/security` | 2FA, verification |
| Settings | `/profile/settings` | User preferences |

### Redirects (Old → New)
| Old URL | New URL | Type |
|---------|---------|------|
| `/activity` | `/profile/statistics` | Redirect |
| `/traffic` | `/profile/statistics` | Redirect |
| `/statistic` | `/profile/statistics` | Redirect |
| `/dashboard` | `/profile` | Redirect |
| `/wallet` | `/profile/billing` | Optional |
| `/billing` | `/profile/billing` | Optional |

---

## 📱 Mobile Experience

### Bottom Navigation Bar (5 Items)
```
Home        │ Profile    │ Activity   │ Wallet     │ Settings
📍          │ 👤         │ 📊         │ 💳         │ ⚙️
/           │ /profile   │ /profile   │ /profile   │ /settings
            │            │ /statistics│ /billing   │
```

### Profile on Mobile
- Tabs display horizontally with scroll/overflow
- Touch-friendly tab switching
- Responsive content that adapts to screen size

---

## 🎯 Implementation Checklist

### Phase 1: Setup
- [ ] Create `src/components/profile/ProfileTabs.tsx`
- [ ] Create `src/app/profile/layout.tsx`
- [ ] Create `src/app/profile/page.tsx` (with tabs)

### Phase 2: Tab Pages
- [ ] `/profile/statistics` (consolidate activity, traffic, stats)
- [ ] `/profile/roles` (role management)
- [ ] `/profile/billing` (wallet + payments)
- [ ] `/profile/security` (2FA + verification)
- [ ] `/profile/settings` (preferences)

### Phase 3: Cleanup
- [ ] Create redirects for old routes
- [ ] Test all navigation flows
- [ ] Verify mobile responsiveness

### Phase 4: Polish
- [ ] Add animations/transitions
- [ ] Optimize performance
- [ ] User testing & feedback

---

## 💾 Files Status

### ✅ Modified
```
src/components/Sidebar.tsx
  ✓ Removed Player Directory duplicate
  ✓ Removed Dashboard submenu
  ✓ Removed Activity & Stats from Account
```

### ✅ Created (Documentation)
```
SIDEBAR_PROFILE_ARCHITECTURE.md
PROFILE_DASHBOARD_IMPLEMENTATION.md
SIDEBAR_PROFILE_BEFORE_AFTER.md
SIDEBAR_PROFILE_SUMMARY.md
SIDEBAR_PROFILE_QUICK_REFERENCE.md (this file)
```

### ⏳ TODO
```
src/components/profile/ProfileTabs.tsx
src/app/profile/page.tsx
src/app/profile/layout.tsx
src/app/profile/overview/page.tsx (optional)
src/app/profile/statistics/page.tsx
src/app/profile/roles/page.tsx
src/app/profile/billing/page.tsx
src/app/profile/security/page.tsx
src/app/profile/settings/page.tsx

Redirects:
src/app/activity/page.tsx
src/app/traffic/page.tsx
src/app/statistic/page.tsx
src/app/dashboard/page.tsx
```

---

## 🎨 Component Reuse Plan

### Existing Components → New Locations
| Component | Old Location | New Location |
|-----------|--------------|--------------|
| ProfileOverview.tsx | /profile | /profile/overview |
| Statistics.tsx | /statistic | /profile/statistics |
| RolesManagement.tsx | /profile | /profile/roles |
| Security.tsx | /profile | /profile/security |
| Verification.tsx | /profile | /profile/security |
| PaymentInfo.tsx | /billing | /profile/billing |
| Settings.tsx | /profile | /profile/settings |

### New Components to Create
| Component | Location | Purpose |
|-----------|----------|---------|
| ProfileTabs.tsx | /components/profile | Tab navigation |

---

## 📋 Key Statistics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Sidebar Items | 19 | 15 | -4 items |
| Duplicate Menu Items | 1 | 0 | -1 |
| Activity-Related Pages | 3 | 1 tab | -2 pages |
| Dashboard Menu | Yes | No | Removed |
| Main Menu Groups | 5 | 4 | -1 group |
| Profile Tabs | N/A | 6 | New feature |
| URL Routes | 8+ | 6+ | Consolidated |

---

## 🚀 Quick Start

Want to implement? Follow these docs in order:

1. **Read:** [SIDEBAR_PROFILE_BEFORE_AFTER.md](SIDEBAR_PROFILE_BEFORE_AFTER.md)
   - Understand what's changing and why
   
2. **Plan:** [SIDEBAR_PROFILE_ARCHITECTURE.md](SIDEBAR_PROFILE_ARCHITECTURE.md)
   - See the full architecture
   
3. **Implement:** [PROFILE_DASHBOARD_IMPLEMENTATION.md](PROFILE_DASHBOARD_IMPLEMENTATION.md)
   - Step-by-step implementation guide
   
4. **Reference:** This file
   - Quick lookup while coding

---

## 🎯 Goal

Transform PicklePlay from a **fragmented navigation experience** with duplicate menu items and scattered pages into a **unified, professional dashboard** where all user account features are logically organized and easily accessible.

**Status:** Sidebar ✅ | Profile Dashboard ⏳

Let's go! 🚀
