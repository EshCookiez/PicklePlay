# Database Cleanup - Orphaned Tables Removal

## Overview

This document explains the database cleanup performed to remove orphaned tables that were not part of the current migration structure.

## 🗑️ Tables Removed

### Role-Based Access Control Tables (5 tables)
These tables were from an old RBAC (Role-Based Access Control) system that is no longer used:

1. **permissions** - Permission definitions
2. **roles** - Role definitions  
3. **role_permissions** - Role-permission mappings
4. **role_applications** - User role applications
5. **user_roles** - User-role assignments

**Why removed:** The current system uses a simple `role` enum field in the `users` table instead of a complex RBAC system.

### Security Tables (1 table)
6. **security_questions** - Security questions for account recovery

**Why removed:** Not implemented in current authentication system. Password reset uses email tokens instead.

### Payment Tables (2 tables)
7. **user_payment_info** - User payment information
8. **user_payment_methods** - Saved payment methods

**Why removed:** Payment functionality is prepared but not yet implemented. When needed, Stripe integration will use the `stripe_customer_id` field in the `users` table.

## ✅ Current Database Structure (After Cleanup)

### Total Tables: 17 (down from 25)

#### User & Authentication (5 tables)
1. **users** - Main user accounts
2. **password_reset_tokens** - Password reset tokens
3. **sessions** - User sessions
4. **personal_access_tokens** - Sanctum API tokens
5. **authentication_logs** - Login/logout activity logs

#### User Extended Data (3 tables)
6. **user_profiles** - Extended profile information
7. **user_preferences** - User settings and preferences
8. **user_statistics** - Activity metrics

#### Player System (1 table)
9. **player_profiles** - Player-specific data

#### Laravel Queue System (3 tables)
10. **jobs** - Queue jobs
11. **job_batches** - Batch job tracking
12. **failed_jobs** - Failed queue jobs

#### Laravel Cache System (2 tables)
13. **cache** - Cache storage
14. **cache_locks** - Cache locking

#### System Tables (3 tables)
15. **migrations** - Laravel migration tracking
16. **cache** - Laravel cache
17. **cache_locks** - Cache locks

## 📋 Migration Details

**Migration File:** `2026_01_27_022204_drop_orphaned_tables.php`

**Created:** January 27, 2026

**Purpose:** Remove 8 orphaned tables that were not part of the current application structure

## 🔄 How to Apply

### Run the Migration

```bash
cd back-end
php artisan migrate
```

This will drop all 8 orphaned tables from your Supabase database.

### Rollback (If Needed)

If you need to restore the tables:

```bash
php artisan migrate:rollback
```

Note: The rollback will recreate the table structures, but data will be lost.

## ⚠️ Important Notes

### Data Loss Warning
Running this migration will **permanently delete** these tables and all their data:
- All role and permission data
- All security questions
- All payment information

**Make sure you don't need this data before running the migration!**

### Backup Recommendation

Before running the migration, backup your database:

```bash
# For PostgreSQL (Supabase)
pg_dump -h your-supabase-host -U postgres -d postgres > backup_before_cleanup.sql
```

Or use Supabase Dashboard to create a backup.

## 🔮 Future Implementation

If you need these features in the future:

### Role-Based Access Control (RBAC)
- Create new migrations for roles/permissions tables
- Implement proper RBAC system with policies
- Consider using Laravel's built-in authorization features

### Security Questions
- Create migration for security_questions table
- Implement security question logic in AuthController
- Add UI for setting/answering security questions

### Payment System
- Use existing `stripe_customer_id` field in users table
- Create new migrations for payment_methods if needed
- Implement Stripe integration
- Add payment method management endpoints

## 📊 Before vs After

### Before Cleanup
- **Total Tables:** 25
- **Application Tables:** 9
- **Orphaned Tables:** 8
- **System Tables:** 8

### After Cleanup
- **Total Tables:** 17
- **Application Tables:** 9
- **Orphaned Tables:** 0
- **System Tables:** 8

**Result:** Cleaner database structure with only tables that are actually used.

## ✅ Verification

After running the migration, verify the cleanup:

```sql
-- Check remaining tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see exactly 17 tables, with no role/permission/payment tables.

## 🐛 Troubleshooting

### Migration Fails

If the migration fails because tables don't exist:

```bash
# Check which tables exist
php artisan tinker
>>> Schema::hasTable('permissions')
```

### Need to Keep Some Tables

If you realize you need some of these tables:

1. Don't run the migration yet
2. Edit the migration file to comment out tables you want to keep
3. Then run the migration

### Already Ran Migration, Need Tables Back

```bash
# Rollback the migration
php artisan migrate:rollback

# Edit the migration to keep certain tables
# Then run again
php artisan migrate
```

## 📝 Summary

This cleanup removes 8 orphaned tables that were:
- Not referenced in any models
- Not used by any controllers
- Not part of current migrations
- Likely created by old/deleted migrations or manual database operations

The result is a cleaner, more maintainable database structure that only contains tables actively used by the application.

---

**Cleanup Date:** January 27, 2026  
**Status:** Ready to apply  
**Impact:** Removes 8 unused tables, no impact on current functionality
