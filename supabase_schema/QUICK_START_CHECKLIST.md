# PicklePlay Database Setup - Quick Start Checklist

## ✅ Pre-Execution Checklist

- [ ] Supabase project created
- [ ] Access to Supabase SQL Editor confirmed
- [ ] Backup of existing data (if any) completed
- [ ] Read through README.md for overview
- [ ] Team members notified of deployment

## 🚀 SQL Files Execution (Execute in Order)

### Phase 1: Core Infrastructure
- [ ] **01_authentication_user_management.sql** (Users, profiles, auth)
  - Expected: 6 tables created
  - Verification: `SELECT * FROM users LIMIT 1;`

- [ ] **02_courts_management.sql** (Courts, amenities)
  - Expected: 5 tables, 15 amenities seeded
  - Verification: `SELECT COUNT(*) FROM court_amenities;` (should be 15)

- [ ] **03_court_booking_system.sql** (Bookings, slots)
  - Expected: 3 tables created
  - Verification: `SELECT * FROM bookings LIMIT 1;`

### Phase 2: Features & Community
- [ ] **04_tournaments_system.sql** (Tournaments, matches)
  - Expected: 3 tables created
  - Verification: `SELECT * FROM tournaments LIMIT 1;`

- [ ] **05_coaching_system.sql** (Coaches, sessions)
  - Expected: 3 tables created
  - Verification: `SELECT * FROM coaches LIMIT 1;`

- [ ] **06_rankings_points_system.sql** (Rankings, rewards)
  - Expected: 5 tables created
  - Verification: `SELECT * FROM player_rankings LIMIT 1;`

- [ ] **07_community_features.sql** (Groups, teams, posts)
  - Expected: 7 tables created
  - Verification: `SELECT * FROM community_posts LIMIT 1;`

### Phase 3: Commerce & Analytics
- [ ] **08_reviews_ratings.sql** (Reviews, ratings)
  - Expected: 4 tables created
  - Verification: `SELECT * FROM court_reviews LIMIT 1;`

- [ ] **09_shop_payments_events.sql** (Products, orders, payments)
  - Expected: 12 tables created
  - Verification: `SELECT * FROM products LIMIT 1;`

- [ ] **10_analytics_admin.sql** (Analytics, notifications)
  - Expected: 8 tables created
  - Verification: `SELECT * FROM system_settings WHERE key = 'site_name';`

## 🔍 Post-Execution Verification

### Tables Verification
- [ ] Run: `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';`
- [ ] Expected: **56+ tables**
- [ ] Actual: __________ tables

### RLS Policies Verification
- [ ] Run: `SELECT COUNT(*) FROM pg_policies WHERE schemaname = 'public';`
- [ ] Expected: **100+ policies**
- [ ] Actual: __________ policies

### Indexes Verification
- [ ] Run: `SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';`
- [ ] Expected: **100+ indexes**
- [ ] Actual: __________ indexes

### Functions Verification
- [ ] Run: `SELECT COUNT(*) FROM pg_proc WHERE pronamespace = 'public'::regnamespace;`
- [ ] Expected: **30+ functions**
- [ ] Actual: __________ functions

### System Settings Verification
- [ ] Run: `SELECT key, value FROM system_settings ORDER BY key;`
- [ ] Verify default currency is PHP: `SELECT value FROM system_settings WHERE key = 'default_currency';`
- [ ] Verify default timezone is Asia/Manila: `SELECT value FROM system_settings WHERE key = 'default_timezone';`

## 🔧 Post-Installation Configuration

### 1. Supabase Storage
- [ ] Create bucket: `court-images` (public)
- [ ] Create bucket: `avatars` (public)
- [ ] Create bucket: `product-images` (public)
- [ ] Create bucket: `event-banners` (public)
- [ ] Create bucket: `team-photos` (public)
- [ ] Create bucket: `news-images` (public)
- [ ] Set up storage policies for each bucket

### 2. Supabase Auth
- [ ] Email/Password auth confirmed (default)
- [ ] Google OAuth provider enabled
- [ ] Facebook OAuth provider enabled (optional)
- [ ] Configure redirect URLs
- [ ] Test registration flow

### 3. Create First Admin User
- [ ] Register new user via Supabase Auth
- [ ] Note the user UUID: __________
- [ ] Run: `UPDATE users SET role = 'admin' WHERE id = 'your-user-uuid';`
- [ ] Verify: `SELECT email, role FROM users WHERE role = 'admin';`

### 4. External Services Setup

#### Xendit (Payment Gateway)
- [ ] Sign up at https://dashboard.xendit.co/register
- [ ] Get test API keys
- [ ] Get production API keys
- [ ] Configure webhook URL: `https://your-app.com/api/webhooks/xendit`
- [ ] Test in sandbox mode
- [ ] Enable payment methods: GCash, Maya, Cards

#### Resend (Email Service)
- [ ] Sign up at https://resend.com
- [ ] Add and verify your domain
- [ ] Get API key: __________
- [ ] Create email templates:
  - [ ] Welcome email
  - [ ] Booking confirmation
  - [ ] Payment receipt
  - [ ] Password reset
  - [ ] Tournament registration

#### SMS Service (Twilio or Semaphore)
- [ ] Sign up for service
- [ ] Get API credentials
- [ ] Configure sender ID/number
- [ ] Test SMS sending

#### Mapbox (Maps)
- [ ] Sign up at https://www.mapbox.com
- [ ] Get access token: __________
- [ ] Configure for court location display

### 5. Real-time Features (Optional)
- [ ] Enable real-time for notifications:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  ```
- [ ] Enable real-time for post_comments:
  ```sql
  ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
  ```
- [ ] Test real-time subscriptions

### 6. Edge Functions (Optional)
- [ ] Install Supabase CLI
- [ ] Create function: process-payment
- [ ] Create function: send-booking-reminder
- [ ] Create function: calculate-rankings
- [ ] Deploy all functions

## 🧪 Testing Checklist

### Basic Functionality Tests

#### Test 1: User Registration & Login
- [ ] Register new user
- [ ] Verify user_profiles created automatically
- [ ] Verify user_preferences created automatically
- [ ] Verify user_statistics created automatically
- [ ] Login with credentials
- [ ] Check authentication_logs table

#### Test 2: Court Creation
- [ ] Create test court with court owner account
- [ ] Add court images
- [ ] Assign amenities
- [ ] Verify court appears in listings
- [ ] Test court search
- [ ] Test geospatial search

#### Test 3: Booking Flow
- [ ] Create availability slots for court
- [ ] Make booking as regular user
- [ ] Verify confirmation code generated
- [ ] Check booking status
- [ ] Test cancellation
- [ ] Verify booking reminders created

#### Test 4: Tournament Creation
- [ ] Create tournament as admin
- [ ] Register participants
- [ ] Create matches
- [ ] Record match results
- [ ] Verify rankings updated
- [ ] Verify points awarded

#### Test 5: Points & Rewards
- [ ] Award points to user (tournament win)
- [ ] Check user_statistics updated
- [ ] View rewards catalog
- [ ] Redeem reward
- [ ] Verify points deducted
- [ ] Check reward_redemptions table

#### Test 6: Community Features
- [ ] Create group
- [ ] Invite members
- [ ] Create post
- [ ] Add comments
- [ ] Like post
- [ ] Verify counters updated

#### Test 7: Reviews & Ratings
- [ ] Submit court review
- [ ] Verify court rating recalculated
- [ ] Vote review as helpful
- [ ] Submit coach review
- [ ] Owner responds to review

#### Test 8: E-commerce Flow
- [ ] Create product
- [ ] Add to shopping cart
- [ ] Place order
- [ ] Process payment (test mode)
- [ ] Verify order status
- [ ] Check transactions_log

#### Test 9: Notifications
- [ ] Trigger notification (booking confirmed)
- [ ] Check notifications table
- [ ] Mark as read
- [ ] Test notification delivery

#### Test 10: Admin Features
- [ ] Access analytics_data
- [ ] View activity_logs
- [ ] Check admin_audit_logs
- [ ] Update system_settings
- [ ] Review role_applications

## 📊 Performance Testing

- [ ] Test court search with 1000+ courts
- [ ] Test booking conflict detection
- [ ] Test rankings calculation with 10,000+ users
- [ ] Monitor query performance (< 100ms target)
- [ ] Check index usage: `SELECT * FROM pg_stat_user_indexes;`

## 🔒 Security Testing

### RLS Policy Tests
- [ ] Test user can only see own bookings
- [ ] Test user can only edit own profile
- [ ] Test admin can access all tables
- [ ] Test court owner can manage own courts
- [ ] Test anonymous users see only public data

### Permission Tests
- [ ] Test unauthorized API access
- [ ] Test SQL injection prevention (Supabase handles this)
- [ ] Test file upload permissions
- [ ] Test payment security

## 📈 Monitoring Setup

- [ ] Enable Supabase database monitoring
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure performance monitoring
- [ ] Set up uptime monitoring
- [ ] Create alerts for critical errors

## 🎯 Go-Live Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Performance acceptable (< 2s page load)
- [ ] Security audit completed
- [ ] Backup strategy configured
- [ ] Monitoring and alerts active
- [ ] Team trained on admin dashboard
- [ ] Documentation complete
- [ ] Support channels ready

### Launch
- [ ] Switch to production API keys (Xendit, Resend, etc.)
- [ ] Deploy frontend application
- [ ] Verify production database connection
- [ ] Test end-to-end in production
- [ ] Monitor for errors
- [ ] Have rollback plan ready

### Post-Launch
- [ ] Monitor performance metrics
- [ ] Review error logs daily (first week)
- [ ] Gather user feedback
- [ ] Plan iterative improvements
- [ ] Schedule regular backups

## 📝 Seed Data (Optional)

After deployment, consider adding seed data:

### Sample Courts
- [ ] Add 10-20 popular courts in Metro Manila
- [ ] Upload court images
- [ ] Assign amenities
- [ ] Set availability

### Sample Products
- [ ] Add pickleball equipment (paddles, balls)
- [ ] Add apparel
- [ ] Upload product images
- [ ] Set inventory

### Sample Content
- [ ] Create welcome news article
- [ ] Create "How to Play" guide
- [ ] Create community guidelines post

## 🐛 Known Issues & Workarounds

Document any issues encountered:

1. Issue: __________________________________________
   Workaround: _____________________________________
   
2. Issue: __________________________________________
   Workaround: _____________________________________

## 📞 Support Contacts

- Supabase Support: https://supabase.com/support
- Xendit Support: https://help.xendit.co/
- Resend Support: https://resend.com/support
- Team Lead: __________________________________________
- Database Admin: __________________________________________
- DevOps: __________________________________________

## 📅 Timeline

| Milestone | Target Date | Actual Date | Status |
|-----------|-------------|-------------|--------|
| SQL files execution | __________ | __________ | ⬜ |
| Storage configuration | __________ | __________ | ⬜ |
| Auth setup | __________ | __________ | ⬜ |
| External services | __________ | __________ | ⬜ |
| Testing complete | __________ | __________ | ⬜ |
| Go-live | __________ | __________ | ⬜ |

## ✅ Final Sign-Off

- [ ] Database deployment complete
- [ ] All tables verified
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] Team trained
- [ ] Ready for production

**Deployed by:** __________________________________________

**Date:** __________________________________________

**Notes:** __________________________________________

---

**🎉 Congratulations! Your PicklePlay database is ready!**

For detailed instructions, refer to:
- `EXECUTION_GUIDE.md` - Complete setup guide
- `README.md` - Quick reference
- `SCHEMA_SUMMARY.md` - Implementation details
- `SCHEMA_DIAGRAM.md` - Visual overview
