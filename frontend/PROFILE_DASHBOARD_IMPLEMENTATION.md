# Profile Dashboard Implementation Guide

## Summary of Changes Made

### ✅ Sidebar Cleanup (COMPLETED)
1. **Removed "Player Directory" from Connect menu** - Now appears only in Play menu
2. **Removed "Activity & Stats" from Account menu** - Will be consolidated in Profile
3. **Removed Dashboard submenu entirely** - Activity, Traffic, Statistic pages will redirect to profile
4. **Updated Account menu** - Now only contains: Wallet, Billing

### Current Sidebar Structure:
```
PicklePlay
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
├── [User Profile Card] → /profile
└── Logout
```

---

## Next Steps: Profile Dashboard Implementation

### Phase 1: Create Profile Tab Structure (PENDING)

Create the following file structure under `/src/app/profile/`:

```
src/app/profile/
├── page.tsx                    (main profile page with tabs)
├── layout.tsx                  (profile layout wrapper)
├── overview/
│   └── page.tsx               (profile overview tab)
├── statistics/
│   └── page.tsx               (stats, traffic, trends)
├── roles/
│   └── page.tsx               (roles management)
├── billing/
│   └── page.tsx               (wallet, payments, transactions)
├── security/
│   └── page.tsx               (password, 2FA, verification)
└── settings/
    └── page.tsx               (preferences, privacy)
```

### Phase 2: Update Profile Page (/profile)

Main profile page should display a **tab navigation** with these sections:

```tsx
// /src/app/profile/page.tsx
- Overview (default view)
- Statistics  
- My Roles
- Billing & Wallet
- Security & Verification
- Settings
```

### Phase 3: Consolidate Activity Pages

Create redirects or consolidate content:

| Old URL | New URL | Status |
|---------|---------|--------|
| `/activity` | `/profile/statistics` | Redirect |
| `/traffic` | `/profile/statistics` | Redirect |
| `/statistic` | `/profile/statistics` | Redirect |
| `/wallet` | `/profile/billing` | Move/Redirect |
| `/billing` | `/profile/billing` | Move/Redirect |

### Phase 4: Update Mobile Bottom Navigation

The mobile bottom nav should remain simple:

```tsx
// 5 main tabs
Home → /
Profile → /profile
Activity → /profile/statistics  (or keep /activity with redirect)
Wallet → /profile/billing       (or keep /wallet with redirect)
Settings → /settings
```

---

## Component Reuse Strategy

Existing components in `/src/components/profile/` can be reused:

- **ProfileOverview.tsx** → Use in `/profile` or `/profile/overview`
- **Statistics.tsx** → Use in `/profile/statistics`
- **RolesManagement.tsx** → Use in `/profile/roles`
- **Security.tsx** → Use in `/profile/security`
- **Verification.tsx** → Merge into `/profile/security` or standalone tab
- **Settings.tsx** → Use in `/profile/settings`
- **PaymentInfo.tsx** → Rename to **BillingInfo.tsx** and use in `/profile/billing`
- **EditProfileModal.tsx** → Keep as modal component

---

## Tab Navigation Component (To Create)

Create a reusable tab component at `/src/components/profile/ProfileTabs.tsx`:

```tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileTabs() {
  const pathname = usePathname();

  const tabs = [
    { label: 'Overview', href: '/profile', icon: '👤' },
    { label: 'Statistics', href: '/profile/statistics', icon: '📊' },
    { label: 'My Roles', href: '/profile/roles', icon: '⭐' },
    { label: 'Billing', href: '/profile/billing', icon: '💳' },
    { label: 'Security', href: '/profile/security', icon: '🔒' },
    { label: 'Settings', href: '/profile/settings', icon: '⚙️' },
  ];

  return (
    <nav className="flex gap-2 border-b overflow-x-auto">
      {tabs.map(tab => (
        <Link key={tab.href} href={tab.href} className={`
          px-4 py-2 whitespace-nowrap font-medium transition-colors
          ${pathname === tab.href ? 'border-b-2 border-lime-500 text-slate-900' : 'text-slate-600'}
        `}>
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
```

---

## Data Flow Consolidation

### Activity/Stats Data Structure
```tsx
// Consolidate from /activity, /traffic, /statistic into one view:
{
  matches: {
    total: number,
    wins: number,
    losses: number,
    winRate: number,
  },
  courts: {
    visited: number,
    favorites: string[],
    recentVisits: {
      court: string,
      date: date,
      matches: number,
    }[],
  },
  trends: {
    ratingHistory: { date: date, rating: number }[],
    monthlyMatches: { month: string, count: number }[],
  }
}
```

---

## Implementation Checklist

### Desktop Profile Dashboard (/profile)
- [ ] Create main profile layout with tab navigation
- [ ] Create ProfileTabs.tsx component
- [ ] Implement Overview tab (/profile/overview)
- [ ] Implement Statistics tab (/profile/statistics)
- [ ] Implement Roles tab (/profile/roles)
- [ ] Implement Billing tab (/profile/billing)
- [ ] Implement Security tab (/profile/security)
- [ ] Implement Settings tab (/profile/settings)

### Redirects & Consolidation
- [ ] Set up redirects: /activity → /profile/statistics
- [ ] Set up redirects: /traffic → /profile/statistics
- [ ] Set up redirects: /statistic → /profile/statistics
- [ ] Optional: Set up redirects: /wallet → /profile/billing
- [ ] Optional: Set up redirects: /billing → /profile/billing

### Mobile Experience
- [ ] Update mobile bottom nav links
- [ ] Test tab navigation on mobile
- [ ] Ensure responsive tab layout

### Testing
- [ ] Test all tab navigation
- [ ] Test redirect paths
- [ ] Verify data loads in each tab
- [ ] Check responsive design
- [ ] Verify mobile experience

---

## Additional Notes

### Wallet & Billing Decision
You have two options:

**Option A: Keep separate pages**
- Keep `/wallet` and `/billing` as standalone pages
- Sidebar links to separate pages
- Users can access from sidebar or profile

**Option B: Consolidate under profile**
- Move `/wallet` and `/billing` functionality to `/profile/billing`
- Remove or redirect old pages
- Cleaner structure, more cohesive user experience

### Recommendation
**Option B** (consolidate) is recommended for:
- Better user experience
- Centralized account/payment management
- Cleaner sidebar
- Easier to maintain

---

## File Locations Summary

```
CREATED:
- SIDEBAR_PROFILE_ARCHITECTURE.md (this guide)
- PROFILE_DASHBOARD_IMPLEMENTATION.md (this document)

MODIFIED:
- src/components/Sidebar.tsx (✅ Cleaned up dropdownContent)

TO CREATE:
- src/components/profile/ProfileTabs.tsx
- src/app/profile/page.tsx (updated with tabs)
- src/app/profile/layout.tsx
- src/app/profile/overview/page.tsx
- src/app/profile/statistics/page.tsx
- src/app/profile/roles/page.tsx
- src/app/profile/billing/page.tsx
- src/app/profile/security/page.tsx
- src/app/profile/settings/page.tsx

TO UPDATE:
- src/app/activity/page.tsx (redirect to /profile/statistics)
- src/app/traffic/page.tsx (redirect to /profile/statistics)
- src/app/statistic/page.tsx (redirect to /profile/statistics)
```

---

## Benefits of This Architecture

✅ **Cleaner Sidebar** - No duplicate menu items  
✅ **Unified Dashboard** - All profile/account features under `/profile`  
✅ **Better UX** - Tab-based navigation is intuitive  
✅ **Scalable** - Easy to add more profile sections  
✅ **Maintainable** - Centralized profile logic  
✅ **Mobile Friendly** - Works on all screen sizes  
✅ **Consistent** - Same experience desktop & mobile  
