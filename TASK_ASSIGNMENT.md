# PicklePlay - Task Assignment & Priority Matrix
**Last Updated:** January 24, 2026

---

## 👥 Team Roles

| Role | Abbreviation | Responsibilities |
|------|--------------|------------------|
| **Backend** | BE | Laravel API, Database, Authentication |
| **Frontend** | FE | Next.js Web App, UI/UX |
| **Full Stack** | FS | Both Backend + Frontend |
| **Mobile Backend** | MB | React Native API integration |
| **Mobile Frontend** | MF | React Native UI, Navigation |

---

## 🚨 Priority Legend

| Priority | Meaning | Timeline |
|----------|---------|----------|
| 🔴 P0 | Critical/Blocker | Immediate |
| 🟠 P1 | High Priority | This Week |
| 🟡 P2 | Medium Priority | Next 2 Weeks |
| 🟢 P3 | Low Priority | Later |

---

## 📋 PHASE 1: MVP Core Features

### 🔐 Authentication & User Management

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| AUTH-01 | User registration API endpoint | 🔴 P0 | BE | Not Started | None | 4h |
| AUTH-02 | User login/logout API endpoints | 🔴 P0 | BE | Not Started | AUTH-01 | 4h |
| AUTH-03 | JWT/Session token management | 🔴 P0 | BE | Not Started | AUTH-02 | 3h |
| AUTH-04 | Password reset functionality | 🟠 P1 | BE | Not Started | AUTH-02 | 3h |
| AUTH-05 | Email verification system | 🟡 P2 | BE | Not Started | AUTH-01 | 4h |
| AUTH-06 | Role-based access control | 🟠 P1 | BE | Not Started | AUTH-02 | 4h |
| AUTH-07 | Login/Register UI pages | 🔴 P0 | FE | Not Started | AUTH-01 | 6h |
| AUTH-08 | Auth state management (Context) | 🔴 P0 | FE | Not Started | AUTH-07 | 3h |
| AUTH-09 | Protected routes implementation | 🔴 P0 | FE | Not Started | AUTH-08 | 2h |
| AUTH-10 | Mobile login/register screens | 🔴 P0 | MF | Not Started | AUTH-01 | 6h |
| AUTH-11 | Mobile auth token storage | 🔴 P0 | MB | Not Started | AUTH-03 | 3h |

### 👤 User Profiles

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| PROF-01 | User profile API (CRUD) | 🔴 P0 | BE | Not Started | AUTH-01 | 4h |
| PROF-02 | Profile image upload API | 🟠 P1 | BE | Not Started | PROF-01 | 3h |
| PROF-03 | Users table migration | 🔴 P0 | BE | Not Started | None | 2h |
| PROF-04 | Profile page UI | 🔴 P0 | FE | Not Started | PROF-01 | 6h |
| PROF-05 | Profile edit form | 🔴 P0 | FE | Not Started | PROF-04 | 4h |
| PROF-06 | Profile image upload UI | 🟠 P1 | FE | Not Started | PROF-02 | 3h |
| PROF-07 | Mobile profile screen | 🟠 P1 | MF | Not Started | PROF-01 | 5h |
| PROF-08 | Mobile profile edit | 🟠 P1 | MF | Not Started | PROF-07 | 4h |

### 🏀 Court Discovery & Management

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| COURT-01 | Courts table migration | 🔴 P0 | BE | Not Started | None | 2h |
| COURT-02 | Get all courts API | 🔴 P0 | BE | Not Started | COURT-01 | 2h |
| COURT-03 | Get court by ID API | 🔴 P0 | BE | Not Started | COURT-01 | 2h |
| COURT-04 | Create court API (Admin) | 🟠 P1 | BE | Not Started | COURT-01, AUTH-06 | 3h |
| COURT-05 | Update court API (Admin) | 🟠 P1 | BE | Not Started | COURT-04 | 2h |
| COURT-06 | Delete court API (Admin) | 🟡 P2 | BE | Not Started | COURT-04 | 1h |
| COURT-07 | Court search with filters API | 🔴 P0 | BE | Not Started | COURT-02 | 4h |
| COURT-08 | Geolocation/nearby courts API | 🟠 P1 | BE | Not Started | COURT-02 | 4h |
| COURT-09 | Court amenities table | 🟠 P1 | BE | Not Started | COURT-01 | 2h |
| COURT-10 | Court listing page UI | 🔴 P0 | FE | In Progress | COURT-02 | 6h |
| COURT-11 | Court details page UI | 🔴 P0 | FE | Not Started | COURT-03 | 6h |
| COURT-12 | Court search/filter UI | 🔴 P0 | FE | Not Started | COURT-07 | 5h |
| COURT-13 | Map integration (Leaflet) | 🔴 P0 | FE | Not Started | COURT-02 | 6h |
| COURT-14 | Mobile court list screen | 🟠 P1 | MF | Not Started | COURT-02 | 5h |
| COURT-15 | Mobile court details screen | 🟠 P1 | MF | Not Started | COURT-03 | 5h |
| COURT-16 | Mobile map integration | 🟠 P1 | MF | Not Started | COURT-08 | 6h |

### ⭐ Court Ratings & Reviews

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| REV-01 | Reviews table migration | 🟠 P1 | BE | Not Started | COURT-01, PROF-03 | 2h |
| REV-02 | Create review API | 🟠 P1 | BE | Not Started | REV-01 | 3h |
| REV-03 | Get reviews by court API | 🟠 P1 | BE | Not Started | REV-01 | 2h |
| REV-04 | Review form UI | 🟠 P1 | FE | Not Started | REV-02 | 4h |
| REV-05 | Reviews display component | 🟠 P1 | FE | Done | REV-03 | 3h |

---

## 📋 PHASE 2: Community & Engagement

### 💬 Community Feed

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| FEED-01 | Posts table migration | 🟠 P1 | BE | Not Started | PROF-03 | 2h |
| FEED-02 | Create post API | 🟠 P1 | BE | Not Started | FEED-01 | 3h |
| FEED-03 | Get feed posts API (paginated) | 🟠 P1 | BE | Not Started | FEED-01 | 3h |
| FEED-04 | Like/Unlike post API | 🟠 P1 | BE | Not Started | FEED-01 | 2h |
| FEED-05 | Comments table migration | 🟠 P1 | BE | Not Started | FEED-01 | 2h |
| FEED-06 | Add comment API | 🟠 P1 | BE | Not Started | FEED-05 | 2h |
| FEED-07 | Get comments API | 🟠 P1 | BE | Not Started | FEED-05 | 2h |
| FEED-08 | Community feed page UI | 🟠 P1 | FE | Not Started | FEED-03 | 8h |
| FEED-09 | Create post modal/form | 🟠 P1 | FE | Not Started | FEED-02 | 4h |
| FEED-10 | Post card component | 🟠 P1 | FE | Not Started | FEED-08 | 4h |
| FEED-11 | Comments section component | 🟠 P1 | FE | Not Started | FEED-07 | 4h |
| FEED-12 | Like button with animation | 🟡 P2 | FE | Not Started | FEED-04 | 2h |
| FEED-13 | Mobile feed screen | 🟡 P2 | MF | Not Started | FEED-03 | 6h |
| FEED-14 | Mobile create post | 🟡 P2 | MF | Not Started | FEED-02 | 4h |

### 👥 Groups/Teams

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| GRP-01 | Groups table migration | 🟠 P1 | BE | Not Started | PROF-03 | 2h |
| GRP-02 | Group members table | 🟠 P1 | BE | Not Started | GRP-01 | 2h |
| GRP-03 | Create group API | 🟠 P1 | BE | Not Started | GRP-01 | 3h |
| GRP-04 | Join/Leave group API | 🟠 P1 | BE | Not Started | GRP-02 | 3h |
| GRP-05 | Get group members API | 🟠 P1 | BE | Not Started | GRP-02 | 2h |
| GRP-06 | Invite member API | 🟡 P2 | BE | Not Started | GRP-02 | 3h |
| GRP-07 | Group stats API | 🟡 P2 | BE | Not Started | GRP-02 | 3h |
| GRP-08 | Groups listing page | 🟠 P1 | FE | Not Started | GRP-03 | 5h |
| GRP-09 | Group details page | 🟠 P1 | FE | Not Started | GRP-05 | 6h |
| GRP-10 | Create group form | 🟠 P1 | FE | Not Started | GRP-03 | 4h |
| GRP-11 | Member management UI | 🟡 P2 | FE | Not Started | GRP-06 | 4h |

### 👨‍🏫 Coaching System

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| COACH-01 | Coaches table migration | 🟡 P2 | BE | Not Started | PROF-03 | 2h |
| COACH-02 | Coach profile API | 🟡 P2 | BE | Not Started | COACH-01 | 3h |
| COACH-03 | Coach availability API | 🟡 P2 | BE | Not Started | COACH-01 | 4h |
| COACH-04 | Book lesson API | 🟡 P2 | BE | Not Started | COACH-03 | 4h |
| COACH-05 | Coach directory page | 🟡 P2 | FE | Not Started | COACH-02 | 5h |
| COACH-06 | Coach profile page | 🟡 P2 | FE | Not Started | COACH-02 | 5h |
| COACH-07 | Booking calendar UI | 🟡 P2 | FE | Not Started | COACH-03 | 6h |
| COACH-08 | Lesson booking form | 🟡 P2 | FE | Not Started | COACH-04 | 4h |

### 💬 Messaging/Chat

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| MSG-01 | Conversations table | 🟡 P2 | BE | Not Started | PROF-03 | 2h |
| MSG-02 | Messages table | 🟡 P2 | BE | Not Started | MSG-01 | 2h |
| MSG-03 | Send message API | 🟡 P2 | BE | Not Started | MSG-02 | 3h |
| MSG-04 | Get conversations API | 🟡 P2 | BE | Not Started | MSG-01 | 2h |
| MSG-05 | Get messages API | 🟡 P2 | BE | Not Started | MSG-02 | 2h |
| MSG-06 | Real-time WebSocket setup | 🟡 P2 | BE | Not Started | MSG-03 | 6h |
| MSG-07 | Inbox page UI | 🟡 P2 | FE | Not Started | MSG-04 | 6h |
| MSG-08 | Chat conversation UI | 🟡 P2 | FE | Not Started | MSG-05 | 6h |
| MSG-09 | Real-time message updates | 🟡 P2 | FS | Not Started | MSG-06 | 4h |

---

## 📋 PHASE 3: Competitive Features

### 🏆 Ranking System

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| RANK-01 | Points system design | 🟠 P1 | BE | Not Started | PROF-03 | 3h |
| RANK-02 | Points table migration | 🟠 P1 | BE | Not Started | RANK-01 | 2h |
| RANK-03 | Award points API | 🟠 P1 | BE | Not Started | RANK-02 | 3h |
| RANK-04 | Leaderboard API | 🟠 P1 | BE | Not Started | RANK-02 | 4h |
| RANK-05 | Personal ranking API | 🟠 P1 | BE | Not Started | RANK-02 | 2h |
| RANK-06 | Ranking algorithm | 🟠 P1 | BE | Not Started | RANK-02 | 6h |
| RANK-07 | Leaderboard page UI | 🟠 P1 | FE | Not Started | RANK-04 | 6h |
| RANK-08 | Personal rank card component | 🟠 P1 | FE | Not Started | RANK-05 | 3h |
| RANK-09 | Points history UI | 🟡 P2 | FE | Not Started | RANK-03 | 4h |

### 🎯 Contests & Tournaments

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| TOUR-01 | Tournaments table | 🟡 P2 | BE | Not Started | PROF-03 | 3h |
| TOUR-02 | Tournament participants table | 🟡 P2 | BE | Not Started | TOUR-01 | 2h |
| TOUR-03 | Create tournament API | 🟡 P2 | BE | Not Started | TOUR-01 | 4h |
| TOUR-04 | Register for tournament API | 🟡 P2 | BE | Not Started | TOUR-02 | 3h |
| TOUR-05 | Tournament brackets API | 🟡 P2 | BE | Not Started | TOUR-02 | 6h |
| TOUR-06 | Record match results API | 🟡 P2 | BE | Not Started | TOUR-05 | 4h |
| TOUR-07 | Tournaments listing page | 🟡 P2 | FE | Not Started | TOUR-03 | 5h |
| TOUR-08 | Tournament details page | 🟡 P2 | FE | Not Started | TOUR-03 | 6h |
| TOUR-09 | Bracket visualization | 🟡 P2 | FE | Not Started | TOUR-05 | 8h |
| TOUR-10 | Registration form | 🟡 P2 | FE | Not Started | TOUR-04 | 3h |

### 💰 Rewards System

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| RWD-01 | Rewards catalog table | 🟢 P3 | BE | Not Started | None | 2h |
| RWD-02 | User points balance API | 🟢 P3 | BE | Not Started | RANK-02 | 2h |
| RWD-03 | Redeem reward API | 🟢 P3 | BE | Not Started | RWD-01 | 4h |
| RWD-04 | Rewards catalog page | 🟢 P3 | FE | Not Started | RWD-01 | 5h |
| RWD-05 | Points balance widget | 🟢 P3 | FE | Not Started | RWD-02 | 2h |
| RWD-06 | Redemption flow UI | 🟢 P3 | FE | Not Started | RWD-03 | 4h |

---

## 📋 PHASE 4: Premium & Advanced

### 💎 Premium Features

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| PREM-01 | Subscription tiers table | 🟢 P3 | BE | Not Started | PROF-03 | 2h |
| PREM-02 | Payment gateway integration | 🟢 P3 | BE | Not Started | None | 8h |
| PREM-03 | Subscription management API | 🟢 P3 | BE | Not Started | PREM-01 | 4h |
| PREM-04 | Premium features middleware | 🟢 P3 | BE | Not Started | PREM-01 | 3h |
| PREM-05 | Subscription page UI | 🟢 P3 | FE | Not Started | PREM-03 | 6h |
| PREM-06 | Payment checkout flow | 🟢 P3 | FE | Not Started | PREM-02 | 6h |

### ⚙️ Settings

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| SET-01 | User settings API | 🟢 P3 | BE | Not Started | PROF-01 | 3h |
| SET-02 | Notification preferences API | 🟢 P3 | BE | Not Started | SET-01 | 2h |
| SET-03 | Privacy settings API | 🟢 P3 | BE | Not Started | SET-01 | 2h |
| SET-04 | Settings page UI | 🟢 P3 | FE | Not Started | SET-01 | 5h |
| SET-05 | Notification settings UI | 🟢 P3 | FE | Not Started | SET-02 | 3h |
| SET-06 | Privacy settings UI | 🟢 P3 | FE | Not Started | SET-03 | 3h |

### 📚 Learn/Tutorials

| ID | Task | Priority | Role | Status | Dependencies | Est. Hours |
|----|------|----------|------|--------|--------------|------------|
| LEARN-01 | Tutorials content table | 🟢 P3 | BE | Not Started | None | 2h |
| LEARN-02 | Get tutorials API | 🟢 P3 | BE | Not Started | LEARN-01 | 2h |
| LEARN-03 | Tutorials listing page | 🟢 P3 | FE | Not Started | LEARN-02 | 4h |
| LEARN-04 | Tutorial video player | 🟢 P3 | FE | Not Started | LEARN-03 | 4h |
| LEARN-05 | Rules & tips page | 🟢 P3 | FE | Not Started | None | 4h |

---

## 📊 Summary by Role

### Backend (BE) Tasks
| Priority | Count | Total Hours |
|----------|-------|-------------|
| 🔴 P0 | 12 | ~36h |
| 🟠 P1 | 24 | ~70h |
| 🟡 P2 | 20 | ~60h |
| 🟢 P3 | 12 | ~35h |

### Frontend (FE) Tasks
| Priority | Count | Total Hours |
|----------|-------|-------------|
| 🔴 P0 | 10 | ~50h |
| 🟠 P1 | 18 | ~80h |
| 🟡 P2 | 16 | ~65h |
| 🟢 P3 | 12 | ~45h |

### Mobile Frontend (MF) Tasks
| Priority | Count | Total Hours |
|----------|-------|-------------|
| 🔴 P0 | 1 | 6h |
| 🟠 P1 | 5 | ~25h |
| 🟡 P2 | 3 | ~14h |

### Mobile Backend (MB) Tasks
| Priority | Count | Total Hours |
|----------|-------|-------------|
| 🔴 P0 | 1 | 3h |

---

## 🎯 Recommended Sprint Assignments

### Sprint 1 (Week 1) - Authentication Focus
| Team Member | Role | Tasks |
|-------------|------|-------|
| Dev 1 | BE | AUTH-01, AUTH-02, AUTH-03, PROF-01, PROF-03 |
| Dev 2 | FE | AUTH-07, AUTH-08, AUTH-09, PROF-04 |
| Dev 3 | FS | COURT-01, COURT-02, COURT-03 |
| Dev 4 | MF | AUTH-10, Mobile app structure |
| Dev 5 | MB | AUTH-11, API service setup |

### Sprint 2 (Week 2) - Courts & Profiles
| Team Member | Role | Tasks |
|-------------|------|-------|
| Dev 1 | BE | COURT-04, COURT-07, COURT-08, REV-01, REV-02 |
| Dev 2 | FE | COURT-10, COURT-11, COURT-12 |
| Dev 3 | FS | PROF-02, PROF-05, COURT-13 |
| Dev 4 | MF | COURT-14, COURT-15, PROF-07 |
| Dev 5 | MB | Mobile API integration |

### Sprint 3 (Week 3) - Community Features
| Team Member | Role | Tasks |
|-------------|------|-------|
| Dev 1 | BE | FEED-01 to FEED-07 |
| Dev 2 | FE | FEED-08, FEED-09, FEED-10, FEED-11 |
| Dev 3 | FS | GRP-01 to GRP-05 |
| Dev 4 | MF | FEED-13, FEED-14 |
| Dev 5 | BE | GRP-03, GRP-04, GRP-05 |

---

## 📝 Notes

1. **Dependencies are critical** - Always complete dependent tasks first
2. **Authentication is the blocker** - Most features depend on user auth
3. **Backend should lead** - APIs should be ready before frontend implementation
4. **Mobile can lag by 1 sprint** - Focus on web MVP first
5. **Estimate buffer** - Add 20% to all estimates for testing/debugging
