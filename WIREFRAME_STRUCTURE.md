# PicklePlay - Wireframe & Page Structure

## 📱 Application Architecture

```
PicklePlay (Root)
├── Frontend (Next.js)
│   ├── Public Pages (No Auth Required)
│   ├── Protected Pages (Auth Required)
│   └── Components (Reusable UI)
└── Backend (API)
    ├── Authentication
    ├── User Management
    ├── Courts
    ├── Community
    ├── Rankings
    └── Tournaments
```

---

## 🗺️ Page Structure & Routing

### **Public Pages** (Accessible without login)

```
/
├── Home (Landing Page)
│   ├── Hero section with CTA
│   ├── Featured courts
│   ├── How it works
│   ├── Call-to-action (Sign up / Login)
│   └── Footer

/auth
├── /login
│   ├── Email/Password login
│   ├── Social login (optional)
│   └── Sign up link
│
└── /signup
    ├── User registration form
    ├── Profile creation
    └── Email verification

/courts (Public View)
├── Browse all courts
├── Search & filter
├── Court card (name, location, rating)
├── Court details page
│   ├── Location map
│   ├── Hours & amenities
│   ├── Reviews & ratings
│   ├── Player reviews
│   └── Book court CTA

/learn
├── How to play pickleball
│   ├── Video tutorial (static)
│   ├── Rules guide
│   └── Techniques & tips

/coaches (Public Directory)
├── Coach listing
├── Coach cards
├── Coach details page
│   ├── Bio & experience
│   ├── Rates
│   ├── Availability calendar
│   └── Book lesson CTA

/about
├── About PicklePlay
├── Mission & values
├── Contact info
└── FAQ
```

---

### **Protected Pages** (Requires Authentication)

#### **User Dashboard**

```
/dashboard
├── Overview/Home
│   ├── Quick stats
│   ├── Recent activity
│   ├── Upcoming matches
│   ├── Suggested players to follow
│   └── Community feed preview
│
├── /profile
│   ├── My Profile View
│   │   ├── Profile picture
│   │   ├── Name, email, position
│   │   ├── Ranking & points
│   │   ├── Play frequency
│   │   ├── Work/profession
│   │   ├── Stats summary
│   │   └── Edit button
│   │
│   └── Edit Profile
│       ├── Update picture
│       ├── Update bio
│       ├── Update position & role
│       └── Update availability

├── /players
│   ├── Player Directory
│   │   ├── Search & filter
│   │   ├── Filter by: location, position, ranking
│   │   ├── Player cards (name, position, ranking, pfp)
│   │   └── View player profile
│   │
│   └── /players/:id (Player Detail)
│       ├── Full profile
│       ├── Stats & rankings
│       ├── Recent matches
│       ├── Match history
│       ├── Add as friend
│       ├── Message button
│       └── Invite to play

├── /courts (Protected)
│   ├── My Courts (if owner)
│   │   ├── Court management
│   │   ├── Edit court details
│   │   ├── View bookings
│   │   └── Analytics
│   │
│   └── Saved Courts
│       └── Bookmarked courts

├── /community
│   ├── Feed
│   │   ├── Player posts
│   │   ├── Team announcements
│   │   ├── Like & comment
│   │   ├── Create post button
│   │   └── Infinite scroll
│   │
│   ├── /groups
│   │   ├── My Groups
│   │   ├── Browse groups
│   │   ├── Create group
│   │   ├── Group details
│   │   │   ├── Group info
│   │   │   ├── Members list
│   │   │   ├── Group feed
│   │   │   ├── Join/Leave button
│   │   │   └── Message group
│   │   └── Group roster/settings
│   │
│   └── /team (Team Features)
│       ├── Create team
│       ├── Team management
│       ├── Invite members
│       ├── Team page
│       ├── Team statistics
│       └── Team leaderboard

├── /coaching
│   ├── Find Coaches
│   │   ├── Filter by position
│   │   ├── Filter by location
│   │   ├── Coach cards with rates
│   │   └── Book coach button
│   │
│   ├── /book/:coachId
│   │   ├── Coach details
│   │   ├── Availability calendar
│   │   ├── Select date/time
│   │   ├── Confirm booking
│   │   └── Payment (if applicable)
│   │
│   └── My Lessons (if student)
│       ├── Booked lessons
│       ├── Lesson history
│       └── Coach contact

├── /rankings
│   ├── Global Leaderboard
│   │   ├── Top players
│   │   ├── Filter by location/region
│   │   ├── Filter by position
│   │   ├── Player rank & points
│   │   └── Trending players
│   │
│   └── /my-ranking
│       ├── My current rank
│       ├── Points breakdown
│       ├── Points history
│       └── Next milestone progress

├── /contests
│   ├── Browse Contests
│   │   ├── Ongoing contests
│   │   ├── Upcoming contests
│   │   ├── Completed contests
│   │   ├── Contest card (name, prize, participants)
│   │   └── Join button
│   │
│   ├── /contests/:id (Contest Detail)
│   │   ├── Rules & details
│   │   ├── Prize/points
│   │   ├── Participants list
│   │   ├── Standings/brackets
│   │   ├── Match results
│   │   └── Join button (if open)
│   │
│   ├── /my-contests
│   │   ├── Joined contests
│   │   ├── Contest results
│   │   ├── Points earned
│   │   └── History
│   │
│   └── /create-contest (Admin)
│       ├── Contest details form
│       ├── Prize setup
│       ├── Bracket configuration
│       └── Publish

├── /tournaments
│   ├── Browse Tournaments
│   │   ├── Upcoming tournaments
│   │   ├── Ongoing tournaments
│   │   ├── Past tournaments
│   │   ├── Tournament cards
│   │   └── Register button
│   │
│   ├── /tournaments/:id (Tournament Detail)
│   │   ├── Tournament info
│   │   ├── Bracket/Schedule
│   │   ├── Participants
│   │   ├── Standings
│   │   ├── Match results
│   │   ├── Register button
│   │   └── Prize distribution
│   │
│   └── /my-tournaments
│       ├── Registered tournaments
│       ├── Tournament results
│       └── Achievements

├── /rewards
│   ├── Points Balance
│   │   ├── Current points
│   │   ├── Points history
│   │   └── Leaderboard
│   │
│   ├── Rewards Catalog
│   │   ├── Available rewards
│   │   ├── Point costs
│   │   ├── Redeem button
│   │   └── Achievement badges
│   │
│   └── /redeem/:rewardId
│       ├── Confirm redemption
│       ├── Points deduction
│       └── Success confirmation

├── /messages
│   ├── Inbox
│   │   ├── Message list
│   │   ├── Unread badge
│   │   ├── Search messages
│   │   └── Delete options
│   │
│   └── /messages/:userId (Chat)
│       ├── Conversation history
│       ├── Type message input
│       ├── Send button
│       └── User info card

├── /settings
│   ├── Account Settings
│   │   ├── Email & password
│   │   ├── Privacy settings
│   │   ├── Notification preferences
│   │   └── Two-factor auth
│   │
│   ├── Preferences
│   │   ├── Play style
│   │   ├── Preferred locations
│   │   ├── Availability
│   │   └── Skill level
│   │
│   └── /logout
│       └── Confirm logout

└── /premium
    ├── Premium features
    ├── Subscription plans
    ├── Upgrade button
    ├── Billing & invoices
    └── Cancel subscription
```

---

## 🎨 Component Structure

### **Shared Components** (`src/components/`)

```
components/
├── Layout/
│   ├── Header.tsx (with navigation)
│   ├── Sidebar.tsx (dashboard nav)
│   ├── Footer.tsx
│   └── Navbar.tsx
│
├── Common/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Tabs.tsx
│   ├── Avatar.tsx
│   ├── Badge.tsx
│   ├── Spinner.tsx
│   └── EmptyState.tsx
│
├── Auth/
│   ├── LoginForm.tsx
│   ├── SignupForm.tsx
│   └── ProtectedRoute.tsx
│
├── Player/
│   ├── PlayerCard.tsx
│   ├── PlayerProfile.tsx
│   ├── PlayerList.tsx
│   ├── PlayerSearch.tsx
│   └── PlayerStats.tsx
│
├── Court/
│   ├── CourtCard.tsx
│   ├── CourtDetails.tsx
│   ├── CourtList.tsx
│   ├── CourtSearch.tsx
│   ├── CourtMap.tsx
│   └── CourtReviews.tsx
│
├── Community/
│   ├── Feed.tsx
│   ├── Post.tsx
│   ├── CreatePost.tsx
│   ├── Comment.tsx
│   ├── GroupCard.tsx
│   ├── GroupList.tsx
│   └── GroupDetails.tsx
│
├── Ranking/
│   ├── Leaderboard.tsx
│   ├── RankingCard.tsx
│   ├── MyRanking.tsx
│   └── RankingStats.tsx
│
├── Contest/
│   ├── ContestCard.tsx
│   ├── ContestList.tsx
│   ├── ContestDetails.tsx
│   ├── ContestBracket.tsx
│   └── CreateContest.tsx
│
├── Coaching/
│   ├── CoachCard.tsx
│   ├── CoachProfile.tsx
│   ├── BookingCalendar.tsx
│   └── BookingForm.tsx
│
└── Rewards/
    ├── RewardCard.tsx
    ├── RewardCatalog.tsx
    ├── PointsDisplay.tsx
    └── RedeemModal.tsx
```

---

## 🗄️ Data Models (Database Schema)

```typescript
// User
{
  id: string
  email: string
  password: string (hashed)
  firstName: string
  lastName: string
  position: string
  work: string
  profilePicture: URL
  playFrequency: enum (weekly, 2-3x/week, daily, etc.)
  ranking: number
  points: number
  createdAt: timestamp
  updatedAt: timestamp
}

// Court
{
  id: string
  name: string
  location: string
  latitude: float
  longitude: float
  amenities: string[]
  hours: object
  rating: number
  reviews: Review[]
  owner: User
  createdAt: timestamp
}

// Community Post
{
  id: string
  userId: string
  content: string
  type: enum (team, achievement, announcement)
  likes: number
  comments: Comment[]
  createdAt: timestamp
}

// Group/Team
{
  id: string
  name: string
  description: string
  members: User[]
  owner: User
  createdAt: timestamp
}

// Ranking
{
  id: string
  userId: string
  points: number
  rank: number
  wins: number
  losses: number
  updatedAt: timestamp
}

// Contest
{
  id: string
  name: string
  description: string
  status: enum (open, ongoing, completed)
  participants: User[]
  points: number
  bracket: object
  createdAt: timestamp
}

// Tournament
{
  id: string
  name: string
  bracket: object
  participants: User[]
  schedule: object
  results: object
  createdAt: timestamp
}
```

---

## 📊 Priority Implementation Order

1. **Auth & User Profiles** (Week 1)
2. **Court Discovery** (Week 1-2)
3. **Player Directory** (Week 2)
4. **Community Feed** (Week 3)
5. **Ranking & Points System** (Week 4)
6. **Contests** (Week 5)
7. **Coaching System** (Week 6)
8. **Tournaments** (Week 7)
9. **Rewards** (Week 8)
10. **Premium Features** (Week 9+)

