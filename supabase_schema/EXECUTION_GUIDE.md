# PicklePlay Database Schema - Complete Execution Guide

## 📋 Overview

This guide provides step-by-step instructions for setting up the complete PicklePlay database schema in Supabase. The schema includes 50+ tables covering all features of the PicklePlay platform for the Philippine market.

## 🎯 What's Included

### Core Features
- ✅ Authentication & User Management (Role-based access: Admin, Player, Coach, Court Owner)
- ✅ Court Listings & Management (Search, filters, ratings, amenities)
- ✅ Court Booking System (Slots, availability, reminders)
- ✅ Tournament Management (Singles, Doubles, Mixed formats)
- ✅ Coaching Services Marketplace
- ✅ Player Rankings & Points System
- ✅ Rewards & Achievements
- ✅ Community Features (Groups, Teams, Posts)
- ✅ Reviews & Ratings (Courts, Coaches, Products)
- ✅ E-commerce/Shop (Products, Orders, Cart)
- ✅ Payment Integration (Xendit for Philippine market)
- ✅ Events Management
- ✅ News/Blog System
- ✅ Search & Tags
- ✅ Analytics & Admin Dashboard
- ✅ Notifications System
- ✅ Referral System
- ✅ Player Profiles

## 📁 File Structure

```
supabase_schema/
├── README.md                           # Overview and reference
├── EXECUTION_GUIDE.md                  # This file
├── 01_authentication_user_management.sql
├── 02_courts_management.sql
├── 03_court_booking_system.sql
├── 04_tournaments_system.sql
├── 05_coaching_system.sql
├── 06_rankings_points_system.sql
├── 07_community_features.sql
├── 08_reviews_ratings.sql
├── 09_shop_payments_events.sql
└── 10_analytics_admin.sql
```

## 🚀 Quick Start (5-Step Setup)

### Prerequisites
- Supabase project created
- Access to Supabase SQL Editor
- Basic understanding of SQL

### Step 1: Backup Existing Data (If Any)
If you already have data in your Supabase database:

```sql
-- Export users table
COPY (SELECT * FROM public.users) TO '/tmp/users_backup.csv' WITH CSV HEADER;

-- Or use Supabase Dashboard > Table Editor > Export as CSV
```

### Step 2: Execute SQL Files in Order

**CRITICAL: Run files in this exact order (dependencies must be respected)**

1. Open Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy entire contents of file `01_authentication_user_management.sql`
4. Click "Run" or press `Ctrl+Enter`
5. Wait for "Success. No rows returned" message
6. Repeat for files 02 through 10

**Execution Order:**
```
1. 01_authentication_user_management.sql  (5-10 seconds)
2. 02_courts_management.sql               (5-10 seconds)
3. 03_court_booking_system.sql            (5-10 seconds)
4. 04_tournaments_system.sql              (5-10 seconds)
5. 05_coaching_system.sql                 (5-10 seconds)
6. 06_rankings_points_system.sql          (5-10 seconds)
7. 07_community_features.sql              (5-10 seconds)
8. 08_reviews_ratings.sql                 (5-10 seconds)
9. 09_shop_payments_events.sql            (5-10 seconds)
10. 10_analytics_admin.sql                (5-10 seconds)

Total time: ~1-2 minutes
```

### Step 3: Verify Table Creation

```sql
-- Check all tables were created
SELECT 
    schemaname, 
    tablename, 
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected: 50+ tables
```

### Step 4: Verify RLS Policies

```sql
-- Check RLS policies
SELECT 
    schemaname, 
    tablename, 
    policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected: 100+ policies
```

### Step 5: Configure Supabase Features

See "Post-Installation Configuration" section below.

## 📊 Complete Table List (50+ Tables)

### Authentication & Users (6 tables)
1. `users` - Core user accounts (extends auth.users)
2. `user_profiles` - User profile information
3. `user_preferences` - User settings and preferences
4. `user_statistics` - User engagement statistics
5. `authentication_logs` - Login/logout tracking
6. `role_applications` - Role upgrade requests

### Courts (4 tables)
7. `courts` - Court listings
8. `court_amenities` - Available amenities (seeded)
9. `court_amenity_relations` - Court-amenity mapping
10. `court_images` - Court photos
11. `saved_courts` - User's saved courts

### Bookings (3 tables)
12. `bookings` - Court reservations
13. `availability_slots` - Court availability
14. `booking_reminders` - Automated reminders

### Tournaments (3 tables)
15. `tournaments` - Tournament events
16. `tournament_participants` - Player registrations
17. `tournament_matches` - Match records

### Coaching (3 tables)
18. `coaches` - Coach profiles
19. `coaching_sessions` - Session bookings
20. `coaching_session_participants` - Session attendees

### Rankings & Rewards (5 tables)
21. `player_rankings` - Player rankings by format
22. `points_transactions` - Points earning/spending
23. `rewards_catalog` - Available rewards
24. `reward_redemptions` - Redemption history
25. `player_achievements` - Achievement tracking

### Community (7 tables)
26. `groups` - Community groups
27. `group_members` - Group membership
28. `teams` - Team management
29. `team_members` - Team rosters
30. `community_posts` - User posts
31. `post_comments` - Post comments
32. `post_likes` - Like tracking (polymorphic)

### Reviews (4 tables)
33. `court_reviews` - Court ratings
34. `coach_reviews` - Coach ratings
35. `product_reviews` - Product ratings
36. `review_helpful_votes` - Helpful vote tracking

### Shop & Commerce (4 tables)
37. `products` - Product catalog
38. `shopping_cart` - Shopping cart items
39. `orders` - Order records
40. `order_items` - Order line items

### Payments (2 tables)
41. `payments` - Payment records (polymorphic)
42. `transactions_log` - Financial audit log

### Events & Content (2 tables)
43. `events` - Community events
44. `event_registrations` - Event attendees
45. `news` - News articles/blog posts

### Search & Tags (3 tables)
46. `search_history` - User searches
47. `tags` - Tag definitions
48. `taggables` - Tag assignments (polymorphic)

### Analytics & Admin (8 tables)
49. `activity_logs` - Activity tracking
50. `analytics_data` - Metrics and KPIs
51. `admin_audit_logs` - Admin actions
52. `notifications` - User notifications
53. `system_settings` - App configuration
54. `saved_locations` - User locations
55. `player_profiles` - Extended player info
56. `referrals` - Referral tracking

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled with policies for:
- Public read access (where appropriate)
- Owner-only write access
- Admin override capabilities
- Role-based permissions

### Example Policies:
```sql
-- Users can view their own data
CREATE POLICY "Users can view own data"
    ON table_name FOR SELECT
    USING (auth.uid() = user_id);

-- Admins can view everything
CREATE POLICY "Admins can view all"
    ON table_name FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'super_admin')
        )
    );
```

## ⚡ Performance Features

### Indexes Created (100+)
- Single-column indexes on foreign keys
- Composite indexes on common query patterns
- Full-text search indexes (GIN)
- Geospatial indexes (GiST)
- Partial indexes for filtered queries

### Example Indexes:
```sql
-- Foreign key indexes
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_court ON bookings(court_id);

-- Composite indexes
CREATE INDEX idx_bookings_status_date 
    ON bookings(status, booking_date);

-- Full-text search
CREATE INDEX idx_courts_search 
    ON courts USING gin(to_tsvector('english', name || ' ' || description));

-- Geospatial
CREATE INDEX idx_courts_location 
    ON courts USING gist(point(longitude, latitude));
```

## 🔄 Automation Features

### Triggers & Functions
Each SQL file includes triggers for:
- `updated_at` timestamp updates
- Counter maintenance (members, likes, views)
- Rating calculations
- Statistics updates
- Automatic record creation

### Example Triggers:
```sql
-- Auto-update timestamp
CREATE TRIGGER update_table_updated_at
    BEFORE UPDATE ON table_name
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update counts
CREATE TRIGGER update_group_member_count
    AFTER INSERT OR DELETE ON group_members
    FOR EACH ROW
    EXECUTE FUNCTION update_group_member_count();
```

## 🇵🇭 Philippine Market Configuration

### Default Settings
The schema is pre-configured for the Philippine market:

```sql
-- Currency
DEFAULT 'PHP'

-- Timezone
DEFAULT 'Asia/Manila'

-- Payment Methods
'credit_card', 'debit_card', 'gcash', 'maya', 
'grabpay', 'shopeepay', 'bank_transfer', 'cash', 'wallet'

-- Payment Gateway
Xendit integration ready (polymorphic payments table)
```

### System Settings Seeded
```sql
INSERT INTO system_settings (key, value, category) VALUES
    ('default_currency', '"PHP"', 'general'),
    ('default_timezone', '"Asia/Manila"', 'general'),
    ('site_name', '"PicklePlay"', 'general');
```

## 📝 Post-Installation Configuration

### 1. Configure Supabase Auth

**Email/Password:**
Already enabled by default.

**OAuth Providers:**
1. Go to Authentication → Providers
2. Enable Google, Facebook (optional)
3. Add OAuth credentials
4. Configure redirect URLs

### 2. Set Up Supabase Storage

Create storage buckets:

```sql
-- Court images
INSERT INTO storage.buckets (id, name, public)
VALUES ('court-images', 'court-images', true);

-- User avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- Product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Event banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-banners', 'event-banners', true);

-- Team photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('team-photos', 'team-photos', true);

-- News images
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true);
```

**Storage Policies:**
```sql
-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- Allow public read
CREATE POLICY "Public can view court images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'court-images');
```

### 3. Create First Admin User

```sql
-- Update existing user to admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';

-- Or create new admin via Supabase Auth, then update
```

### 4. Configure Xendit Payment Gateway

1. Sign up at https://dashboard.xendit.co/register
2. Get API keys (test mode first)
3. Store in your environment variables:
   ```
   XENDIT_SECRET_KEY=your_secret_key
   XENDIT_PUBLIC_KEY=your_public_key
   ```
4. Configure webhooks in Xendit dashboard:
   ```
   https://your-app.com/api/webhooks/xendit
   ```

### 5. Set Up Edge Functions (Optional)

Create Supabase Edge Functions for:
- Payment processing
- Email notifications (via Resend)
- SMS notifications (via Twilio/Semaphore)
- Scheduled tasks (reminders, point expiry)

Example:
```bash
# Initialize Supabase CLI
supabase functions new process-payment

# Deploy function
supabase functions deploy process-payment
```

### 6. Configure Email Service (Resend)

1. Sign up at https://resend.com
2. Add your domain
3. Get API key
4. Create email templates:
   - Welcome email
   - Booking confirmation
   - Tournament registration
   - Payment receipt
   - Password reset

### 7. Set Up Real-time Subscriptions (Optional)

Enable real-time for specific tables:

```sql
-- Enable real-time for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Enable real-time for messages
ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
```

## 🧪 Testing Your Setup

### 1. Test Authentication

```sql
-- Check auth.users
SELECT * FROM auth.users LIMIT 5;

-- Check extended users table
SELECT id, email, role, full_name FROM public.users LIMIT 5;

-- Verify RLS
SET request.jwt.claim.sub = 'user-uuid-here';
SELECT * FROM bookings; -- Should only see user's bookings
```

### 2. Test Court Creation

```sql
-- Create test court
INSERT INTO courts (
    owner_id, name, address, city, latitude, longitude,
    court_type, surface_type, hourly_rate
) VALUES (
    'your-user-id',
    'Test Court',
    '123 Test Street',
    'Manila',
    14.5995,
    120.9842,
    'outdoor',
    'concrete',
    500
);

-- Verify
SELECT * FROM courts WHERE name = 'Test Court';
```

### 3. Test Booking Flow

```sql
-- Create availability slot
INSERT INTO availability_slots (
    court_id, day_of_week, start_time, end_time
) VALUES (
    1, -- court_id from previous test
    'monday',
    '09:00:00',
    '18:00:00'
);

-- Create booking
INSERT INTO bookings (
    user_id, court_id, booking_date, start_time, end_time
) VALUES (
    auth.uid(),
    1,
    CURRENT_DATE + INTERVAL '1 day',
    '10:00:00',
    '11:00:00'
);

-- Check for confirmation code (auto-generated)
SELECT confirmation_code, status FROM bookings ORDER BY created_at DESC LIMIT 1;
```

### 4. Test Points System

```sql
-- Award points
SELECT add_user_points(
    auth.uid(),
    100,
    'tournament_win',
    'Won Summer Tournament 2024',
    'tournament',
    1
);

-- Check balance
SELECT total_points FROM user_statistics WHERE user_id = auth.uid();
```

### 5. Test Notifications

```sql
-- Create notification
SELECT create_notification(
    auth.uid(),
    'booking_confirmed',
    'Booking Confirmed!',
    'Your court booking for tomorrow at 10 AM has been confirmed.',
    '/bookings/1',
    'Booking',
    1,
    'high'
);

-- Check notifications
SELECT * FROM notifications WHERE user_id = auth.uid() ORDER BY created_at DESC;
```

## 🐛 Troubleshooting

### Issue: Tables already exist

**Error:** `relation "table_name" already exists`

**Solution:**
```sql
-- Drop specific table
DROP TABLE IF EXISTS table_name CASCADE;

-- Or drop all tables (CAUTION: deletes all data)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

### Issue: Permission denied

**Error:** `permission denied for table table_name`

**Cause:** RLS policy blocking access

**Solution:**
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'your_table';

-- Disable RLS temporarily (for testing only)
ALTER TABLE your_table DISABLE ROW LEVEL SECURITY;

-- Or add bypass policy for testing
CREATE POLICY "Bypass for testing"
    ON your_table FOR ALL
    USING (true)
    WITH CHECK (true);
```

### Issue: Function does not exist

**Error:** `function update_updated_at_column() does not exist`

**Cause:** Functions must be created before triggers that use them

**Solution:**
Re-run the file containing the function definition (usually file 01).

### Issue: Foreign key constraint fails

**Error:** `violates foreign key constraint`

**Cause:** Referenced record doesn't exist

**Solution:**
```sql
-- Check if referenced record exists
SELECT * FROM users WHERE id = 'user-uuid';

-- Create missing record first
-- Or temporarily disable constraint (not recommended for production)
ALTER TABLE your_table DROP CONSTRAINT constraint_name;
```

### Issue: Slow queries

**Problem:** Queries taking too long

**Solution:**
```sql
-- Check if indexes exist
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'your_table';

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM your_table WHERE condition;

-- Refresh table statistics
ANALYZE your_table;
```

### Issue: RLS policies not working

**Problem:** Users can see data they shouldn't

**Solution:**
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'your_table';

-- Test policy with specific user
SET request.jwt.claim.sub = 'user-uuid';
SET role authenticated;
SELECT * FROM your_table;
RESET role;
```

## 📚 Additional Resources

### Supabase Documentation
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Edge Functions](https://supabase.com/docs/guides/functions)
- [Realtime](https://supabase.com/docs/guides/realtime)

### PostgreSQL Documentation
- [Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Triggers](https://www.postgresql.org/docs/current/triggers.html)
- [Functions](https://www.postgresql.org/docs/current/functions.html)

### Payment Gateway
- [Xendit Documentation](https://developers.xendit.co/)
- [Xendit Philippine Payment Methods](https://developers.xendit.co/api-reference/payment-method/)

### Email/SMS Services
- [Resend Documentation](https://resend.com/docs)
- [Twilio Documentation](https://www.twilio.com/docs)
- [Semaphore Documentation](https://semaphore.co/docs)

## 🎓 Next Steps

1. ✅ Execute all SQL files in order
2. ✅ Verify table and policy creation
3. ✅ Configure Supabase Storage
4. ✅ Set up OAuth providers
5. ✅ Create first admin user
6. ✅ Test basic operations
7. 🔄 Add seed data (courts, amenities, products)
8. 🔄 Set up payment gateway (Xendit)
9. 🔄 Configure email service (Resend)
10. 🔄 Create Edge Functions
11. 🔄 Set up monitoring and logging
12. 🔄 Deploy frontend application
13. 🔄 Conduct user acceptance testing

## 💡 Tips for Success

1. **Always backup before major changes**
2. **Test RLS policies thoroughly** - security is critical
3. **Use transactions for related operations** - ensure data consistency
4. **Monitor database performance** - optimize slow queries
5. **Keep API keys secure** - use environment variables
6. **Document custom modifications** - maintain this guide
7. **Set up staging environment** - test before production
8. **Enable database backups** - Supabase has daily backups

## 📞 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review Supabase logs: Dashboard → Logs
3. Check PostgreSQL logs: Dashboard → Database → Logs
4. Consult Supabase documentation
5. Ask in Supabase Discord community

## 🎉 Completion Checklist

- [ ] All 10 SQL files executed successfully
- [ ] 50+ tables created and verified
- [ ] 100+ RLS policies active
- [ ] Supabase Storage configured
- [ ] OAuth providers enabled
- [ ] First admin user created
- [ ] Test user registered
- [ ] Test court created
- [ ] Test booking completed
- [ ] Points system tested
- [ ] Notifications working
- [ ] Payment gateway configured (Xendit)
- [ ] Email service configured (Resend)
- [ ] Real-time features enabled
- [ ] Edge Functions deployed
- [ ] Frontend application connected
- [ ] User acceptance testing completed

---

**Congratulations!** 🎊 Your PicklePlay database is now fully set up and ready for development!

For questions or issues, refer to the README.md file or check the inline comments in each SQL file.
