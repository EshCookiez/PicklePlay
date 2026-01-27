# Migration Guide - User Account System

## Quick Start

Follow these steps to apply the new user account and profile system to your database.

## Prerequisites

- PHP 8.1 or higher
- Laravel 11.x
- MySQL/PostgreSQL database
- Composer installed

## Step 1: Backup Your Database (Important!)

Before running any migrations, backup your existing database:

```bash
# For MySQL
mysqldump -u username -p database_name > backup_$(date +%Y%m%d_%H%M%S).sql

# For PostgreSQL
pg_dump -U username database_name > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Step 2: Review Migration Files

The following migration files will be executed:

1. `2026_01_27_013901_add_extended_fields_to_users_table.php` - Adds new fields to users table
2. `2026_01_27_013916_create_user_profiles_table.php` - Creates user_profiles table
3. `2026_01_27_013917_create_user_preferences_table.php` - Creates user_preferences table
4. `2026_01_27_013917_create_user_statistics_table.php` - Creates user_statistics table

## Step 3: Run Migrations

Navigate to your backend directory and run migrations:

```bash
cd back-end

# Check migration status
php artisan migrate:status

# Run pending migrations
php artisan migrate

# If you see any errors, check the error message and fix accordingly
```

### If You Need to Start Fresh (Development Only)

⚠️ **WARNING: This will delete ALL data in your database!**

```bash
# Drop all tables and re-run all migrations
php artisan migrate:fresh

# Or with seeding (if you have seeders)
php artisan migrate:fresh --seed
```

## Step 4: Create Storage Link

For photo uploads to work, create a symbolic link:

```bash
php artisan storage:link
```

This creates a link from `public/storage` to `storage/app/public`.

## Step 5: Verify Migrations

Check that all tables were created successfully:

```bash
php artisan migrate:status
```

You should see all migrations marked as "Ran".

### Verify Database Tables

Connect to your database and verify the tables exist:

```sql
-- Show all tables
SHOW TABLES;

-- Verify users table structure
DESCRIBE users;

-- Verify user_profiles table
DESCRIBE user_profiles;

-- Verify user_preferences table
DESCRIBE user_preferences;

-- Verify user_statistics table
DESCRIBE user_statistics;
```

## Step 6: Test the System

### Test Registration

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!",
    "date_of_birth": "1990-01-01",
    "phone_number": "+1234567890",
    "location": "New York, NY"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'
```

### Test Get Profile

```bash
# Replace {token} with the token from login response
curl -X GET http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer {token}"
```

## Step 7: Update Environment Variables

Make sure your `.env` file has the correct settings:

```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pickleplay
DB_USERNAME=your_username
DB_PASSWORD=your_password

# App
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Filesystem
FILESYSTEM_DISK=public

# Mail (for email verification)
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@pickleplay.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Troubleshooting

### Migration Errors

#### Error: "Table 'users' already exists"

If the users table already exists, you may need to modify the migration or manually add the new columns:

```sql
-- Add new columns manually (example)
ALTER TABLE users ADD COLUMN date_of_birth DATE NULL AFTER phone_number;
ALTER TABLE users ADD COLUMN location VARCHAR(255) NULL AFTER date_of_birth;
-- ... add other columns as needed
```

#### Error: "SQLSTATE[42S01]: Base table or view already exists"

This means a table already exists. You can either:
1. Drop the existing table (if it's empty/test data)
2. Skip that specific migration
3. Modify the migration to use `Schema::dropIfExists()` first

#### Error: "Class 'UserProfile' not found"

Make sure all model files are in place:
- `app/Models/User.php`
- `app/Models/UserProfile.php`
- `app/Models/UserPreference.php`
- `app/Models/UserStatistic.php`

Run composer autoload:
```bash
composer dump-autoload
```

### Storage Link Errors

#### Error: "The [public/storage] link already exists"

The link already exists. You can:
1. Delete it and recreate: `rm public/storage && php artisan storage:link`
2. Or just leave it as is

### Permission Errors

If you get permission errors when uploading files:

```bash
# Make storage directories writable
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Make sure the web server user owns the files
chown -R www-data:www-data storage
chown -R www-data:www-data bootstrap/cache
```

## Rollback (If Needed)

If something goes wrong, you can rollback the migrations:

```bash
# Rollback the last batch of migrations
php artisan migrate:rollback

# Rollback specific number of migrations
php artisan migrate:rollback --step=4

# Rollback all migrations
php artisan migrate:reset
```

## Verification Checklist

After migration, verify:

- ✅ All migration files ran successfully
- ✅ Users table has new columns (date_of_birth, location, etc.)
- ✅ user_profiles table exists with all columns
- ✅ user_preferences table exists with all columns
- ✅ user_statistics table exists with all columns
- ✅ Storage link created (`public/storage` exists)
- ✅ Storage directories writable
- ✅ Registration endpoint works
- ✅ Login endpoint works
- ✅ Profile endpoint returns complete data
- ✅ Photo upload works

## Next Steps

Once migrations are complete:

1. Test all API endpoints
2. Update your frontend to use the new fields
3. Implement email verification flow
4. Add profile completion prompts
5. Test photo uploads
6. Configure mail settings for production

## Support

If you encounter any issues:

1. Check Laravel logs: `storage/logs/laravel.log`
2. Check database error logs
3. Review migration files for syntax errors
4. Ensure all dependencies are installed: `composer install`
5. Clear cache: `php artisan cache:clear`

## Production Deployment

When deploying to production:

1. ✅ Backup production database first
2. ✅ Test migrations on staging environment
3. ✅ Run migrations during maintenance window
4. ✅ Monitor error logs during and after migration
5. ✅ Have rollback plan ready
6. ✅ Test critical user flows after migration

```bash
# Production migration commands
php artisan down  # Put app in maintenance mode
php artisan migrate --force  # Run migrations
php artisan storage:link  # Create storage link
php artisan cache:clear  # Clear cache
php artisan config:clear  # Clear config cache
php artisan route:clear  # Clear route cache
php artisan up  # Bring app back online
```

## Summary

The migration process adds comprehensive user account and profile functionality to your application. Follow the steps carefully, test thoroughly, and always maintain backups.

For detailed API documentation, see `USER_ACCOUNT_SYSTEM.md`.
