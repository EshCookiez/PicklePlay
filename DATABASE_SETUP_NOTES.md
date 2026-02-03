# Database Setup Required - Phase 1

## 📋 Missing Tables (User Action Required)

### 1. **user_favorites** Table
**File to run:** `frontend/supabase_favorites_schema.sql`

**What it does:**
- Stores user's favorited courts
- One favorite per user per court
- Auto-deletes when user or court is deleted

**Features that need this:**
- ❤️ Favorite heart icon persistence
- `/profile/favorites` page
- Favorite counts on court cards

---

### 2. **court_reviews** Table
**File to run:** `frontend/supabase_reviews_schema.sql`

**What it does:**
- Stores court ratings (1-5 stars) and comments
- One review per user per court
- Auto-updates court average_rating via trigger
- Adds `average_rating` and `review_count` columns to courts table

**Features that need this:**
- ⭐ Star ratings on courts
- Write/edit/delete reviews
- Review lists on court details page
- Rating distribution chart

---

### 3. **bookings** Table (Phase 1 - Not Yet Created)
**Status:** ⏳ To be implemented

**Will need:**
- User bookings history
- Court availability checking
- Payment integration
- Booking confirmations

---

### 4. **court_owner_features** (Phase 1 - Not Yet Created)
**Status:** ⏳ To be implemented

**Will need:**
- Owner dashboard views
- Manage court details
- View received bookings
- Message system

---

## 🚀 Quick Setup Steps (When Ready)

```bash
# 1. Open Supabase SQL Editor
# 2. Copy/paste and run in order:

1. frontend/supabase_favorites_schema.sql
2. frontend/supabase_reviews_schema.sql
3. (Later) frontend/supabase_bookings_schema.sql  # Not created yet
4. (Later) frontend/supabase_owner_schema.sql     # Not created yet
```

---

## ✅ What Works WITHOUT Database Right Now

- Court listing page with 12 mock courts
- Filters (city, type, price, rating, free toggle)
- Search functionality
- Distance calculation from user location
- "Courts Near You" section
- Demo Mode toggle (mock vs live data)
- All UI/UX features
- Navigation (sidebar + header)

## ⚠️ What Needs Database to Work

- Favorites persistence (heart icon saves but won't persist)
- Reviews submission (form works but won't save)
- User's favorites page (will be empty)
- Average ratings (will show mock data)

---

## 📊 Phase 1 Status

| Feature | Code Complete | Database Ready | Status |
|---------|--------------|----------------|--------|
| Court Listing | ✅ | N/A | **Ready** |
| Geolocation | ✅ | N/A | **Ready** |
| Favorites | ✅ | ❌ Needs SQL | **Pending DB** |
| Reviews | ✅ | ❌ Needs SQL | **Pending DB** |
| Bookings | ❌ | ❌ | **Not Started** |
| Owner Dashboard | ❌ | ❌ | **Not Started** |

**Phase 1 Code: 67% Complete**
**Phase 1 Database: 50% Complete** (2 of 4 schemas created)

---

## 🔔 Reminder for Later

When you're ready to set up the database:
1. Go to Supabase project
2. Navigate to SQL Editor
3. Run `supabase_favorites_schema.sql` first
4. Then run `supabase_reviews_schema.sql`
5. Verify tables appear in Table Editor
6. Check RLS policies are enabled (shield icons)
7. Test favorites and reviews in the app

Let me know when database is ready and I'll continue with:
- Bookings System (Est. 4-5 hours)
- Owner Dashboard (Est. 3-4 hours)
