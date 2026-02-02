# PicklePlay Supabase Database Schema

This directory contains SQL migration files to set up the complete PicklePlay database schema in Supabase.

## 📋 Overview

The database schema is organized into modular SQL files that should be executed in order. Each file creates tables, indexes, Row Level Security (RLS) policies, triggers, and functions for a specific feature area.

## 🗂️ File Structure

| File | Description | Dependencies |
|------|-------------|--------------|
| `01_authentication_user_management.sql` | Users, profiles, preferences, statistics, auth logs, role applications | None (run first) |
| `02_courts_management.sql` | Courts, amenities, images, saved courts | 01 |
| `03_court_booking_system.sql` | Bookings, availability slots, reminders | 01, 02 |
| `04_tournaments_system.sql` | Tournaments, participants, matches | 01, 02, 03 |
| `05_coaching_system.sql` | Coaches, coaching sessions, session participants | 01, 02, 04 |
| `06_rankings_points_system.sql` | Player rankings, points transactions, rewards, achievements | 01, 05 |
| `07_community_features.sql` | Groups, teams, posts, comments, likes | 01, 06 |
| `08_reviews_ratings.sql` | Court, coach, and product reviews | 01, 02, 05 |
| `09_shop_payments_events.sql` | Products, orders, payments, events, news, search, tags | 01, 02, 05 |
| `10_analytics_admin.sql` | Analytics, activity logs, notifications, admin features | 01, 02, 05 |

## 🚀 Quick Start

### Step 1: Access Supabase SQL Editor

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Execute SQL Files in Order

Run each SQL file **in the exact order listed above**. For each file:

1. Open the file in a text editor
2. Copy the entire contents
3. Paste into the Supabase SQL Editor
4. Click **RUN** button
5. Wait for confirmation (you should see "Success" message)
6. Proceed to the next file

**⚠️ IMPORTANT:** Do not skip files or run them out of order as they have dependencies on previous tables.

### Step 3: Verify Installation

After running all files, verify your tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see all the tables created.

## 📊 Database Schema Overview

### Core Tables

#### Authentication & Users (8 tables)
- `users` - Extended user information
- `user_profiles` - Detailed user profiles
- `user_preferences` - User preferences and notifications
- `user_statistics` - User activity statistics
- `authentication_logs` - Authentication audit logs
- `role_applications` - Applications for elevated roles

#### Court System (5 tables)
- `courts` - Court listings
- `court_amenities` - Available amenities
- `court_amenity_relations` - Court-amenity mappings
- `court_images` - Court photos
- `saved_courts` - User favorites

#### Booking System (3 tables)
- `bookings` - Court reservations
- `availability_slots` - Court availability
- `booking_reminders` - Scheduled reminders

#### Tournaments (3 tables)
- `tournaments` - Tournament events
- `tournament_participants` - Registered players/teams
- `tournament_matches` - Individual matches

#### Coaching (3 tables)
- `coaches` - Coach profiles
- `coaching_sessions` - Scheduled sessions
- `coaching_session_participants` - Group session attendees

#### Rankings & Points (5 tables)
- `player_rankings` - Player rankings and stats
- `points_transactions` - Points history
- `rewards_catalog` - Available rewards
- `reward_redemptions` - Redeemed rewards
- `player_achievements` - Player badges/achievements

#### Community (6 tables)
- `groups` - User groups
- `group_members` - Group memberships
- `teams` - Pickleball teams
- `team_members` - Team memberships
- `community_posts` - Community posts
- `post_comments` - Post comments
- `post_likes` - Likes on posts/comments

#### Reviews (4 tables)
- `court_reviews` - Court reviews and ratings
- `coach_reviews` - Coach reviews and ratings
- `product_reviews` - Product reviews and ratings
- `review_helpful_votes` - Helpful votes on reviews

## 🔐 Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Public access**: Anyone can view approved/published content
- **User access**: Users can manage their own data
- **Owner access**: Owners can manage their resources (courts, teams, groups)
- **Admin access**: Admins have elevated permissions

### Example Policies

```sql
-- Users can view their own data
CREATE POLICY "Users can view their own data"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

-- Anyone can view approved courts
CREATE POLICY "Anyone can view approved active courts"
    ON public.courts FOR SELECT
    USING (status = 'approved' AND is_active = TRUE);
```

## 🔧 Key Features

### Auto-Generated Fields

Many tables include auto-generated fields:
- Confirmation codes (bookings, sessions)
- Timestamps (`created_at`, `updated_at`)
- Related records (profiles, preferences, statistics)

### Triggers

Automatic triggers update:
- `updated_at` timestamps
- Aggregate counts (members, bookings, reviews)
- Ratings and statistics
- Related records on user creation

### Functions

Utility functions available:
- `add_user_points()` - Add points to user
- `redeem_reward()` - Redeem rewards with points
- `recalculate_rankings()` - Update player rankings
- `update_court_rating()` - Recalculate court ratings
- `check_booking_conflict()` - Check scheduling conflicts

## 📝 Data Types & Conventions

### Naming Conventions

- **Tables**: `snake_case`, plural (e.g., `users`, `court_reviews`)
- **Columns**: `snake_case` (e.g., `first_name`, `created_at`)
- **Foreign keys**: `{table}_id` (e.g., `user_id`, `court_id`)
- **Booleans**: `is_`, `has_`, `can_`, `should_` prefix
- **Timestamps**: `_at` suffix (e.g., `created_at`, `verified_at`)
- **Counts**: `_count` suffix (e.g., `view_count`, `like_count`)

### Common Field Types

```sql
-- IDs
UUID (for users - matches auth.users)
BIGSERIAL (for other tables)

-- Strings
VARCHAR(n) - fixed max length
TEXT - unlimited length

-- Numbers
INTEGER - whole numbers
DECIMAL(10, 2) - money/prices
DECIMAL(3, 2) - ratings (0.00-5.00)

-- Dates
DATE - date only
TIME - time only
TIMESTAMPTZ - date + time with timezone

-- JSON
JSONB - structured data (arrays, objects)

-- Status/Enums
VARCHAR with CHECK constraint
```

### Timestamps

All tables include:
```sql
created_at TIMESTAMPTZ DEFAULT NOW()
updated_at TIMESTAMPTZ DEFAULT NOW()
deleted_at TIMESTAMPTZ -- For soft deletes
```

## 🔍 Indexes

Comprehensive indexes for performance:
- Primary keys (automatic)
- Foreign keys
- Status fields
- Date/time fields
- Location coordinates (GiST index)
- Full-text search (GIN index)
- Composite indexes for common queries

### Example Indexes

```sql
-- Single column
CREATE INDEX idx_users_role ON public.users(role);

-- Composite
CREATE INDEX idx_bookings_court_date ON public.bookings(court_id, booking_date);

-- Full-text search
CREATE INDEX idx_courts_search ON public.courts USING gin(
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- Geospatial
CREATE INDEX idx_courts_location ON public.courts USING gist (
    point(longitude, latitude)
);
```

## 🌍 Currency & Localization

Default currency is **PHP** (Philippine Peso) but all monetary fields include a `currency` column (VARCHAR(3)) to support multiple currencies.

Timestamps use `TIMESTAMPTZ` for timezone awareness.

## 🎯 Next Steps

After setting up the database:

1. **Add sample data** - Insert test courts, users, etc.
2. **Set up Supabase Auth** - Configure email, OAuth providers
3. **Configure Storage** - Set up buckets for images/files
4. **Test RLS policies** - Verify security works as expected
5. **Create API routes** - Build your frontend API layer
6. **Set up Supabase Edge Functions** - For complex server-side logic

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostGIS for Location Data](https://postgis.net/documentation/)

## ⚠️ Important Notes

1. **Supabase Auth Integration**: The `public.users` table extends `auth.users`. When a user signs up through Supabase Auth, you need to insert a corresponding record in `public.users`.

2. **Storage Integration**: File paths in JSON fields (images, documents) should reference Supabase Storage URLs.

3. **Edge Functions**: Consider using Supabase Edge Functions for:
   - Email notifications (bookings, tournaments)
   - Payment processing webhooks
   - Complex calculations (rankings, points)

4. **Real-time Subscriptions**: Enable real-time for tables where you need live updates:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
   ```

5. **Backup Strategy**: Set up regular backups through Supabase dashboard or pg_dump.

## 🆘 Troubleshooting

### Common Issues

**Error: relation already exists**
- You're trying to run a file twice
- Drop the tables or use `DROP TABLE IF EXISTS` before running again

**Error: foreign key constraint**
- Files run out of order
- Missing dependency table
- Check the order in the table above

**Error: permission denied**
- RLS policies blocking your action
- Use service role key for admin operations
- Check policy conditions

**Slow queries**
- Missing indexes - add appropriate indexes
- Use EXPLAIN ANALYZE to diagnose
- Consider materialized views for complex queries

## 📧 Support

For issues or questions:
- Check the `BACKEND_FEATURE_FIELDS_GUIDE.md` for field specifications
- Review Supabase documentation
- Test RLS policies in SQL Editor

---

**Version**: 1.0.0  
**Last Updated**: February 2, 2026  
**Database**: PostgreSQL 15+ (Supabase)
