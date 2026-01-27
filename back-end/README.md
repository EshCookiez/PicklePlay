# 🎾 PicklePlay Backend API

A comprehensive Laravel-based REST API for the PicklePlay pickleball platform.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development](#development)

## ✨ Features

### 🔐 Authentication System
- User registration with email verification
- Secure login/logout with Sanctum tokens
- Password reset functionality
- Two-factor authentication support (prepared)
- Activity tracking and authentication logs

### 👤 User Management
- **Basic Profile:** Name, email, phone, date of birth, location
- **Extended Profile:** Bio, gender, social links, address, GPS coordinates
- **Professional Info:** Occupation, company, certifications
- **Preferences:** Language, timezone, privacy, notifications
- **Statistics:** Bookings, lessons, ratings, tournaments
- **Photo Uploads:** Profile and cover photos

### 🏓 Player Profiles
- Skill level and experience tracking
- Playing style preferences
- Tournament participation and results
- Certifications and achievements
- Availability scheduling
- Court preferences

### 💰 Financial (Prepared)
- Stripe integration support
- Wallet balance tracking
- Earnings and spending history
- Billing address management

## 🚀 Quick Start

### Prerequisites

- PHP 8.1+
- Composer
- MySQL/PostgreSQL
- Node.js & NPM (for assets)

### Installation

```bash
# Clone the repository
cd back-end

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pickleplay
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Create storage link
php artisan storage:link

# Start development server
php artisan serve
```

The API will be available at `http://localhost:8000`

### Test the API

```bash
# Health check
curl http://localhost:8000/api/health

# Register a user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!",
    "date_of_birth": "1990-01-01"
  }'
```

## 📚 Documentation

Comprehensive documentation is available in the following files:

| File | Description |
|------|-------------|
| **[USER_ACCOUNT_SYSTEM.md](USER_ACCOUNT_SYSTEM.md)** | Complete user account API documentation |
| **[PLAYER_PROFILE_SYSTEM.md](PLAYER_PROFILE_SYSTEM.md)** | Player profile system documentation |
| **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** | Database structure and relationships |
| **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)** | Step-by-step migration instructions |
| **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** | Feature implementation summary |
| **[README_USER_SYSTEM.md](README_USER_SYSTEM.md)** | User system quick reference |
| **[TEAM_SETUP_GUIDE.md](TEAM_SETUP_GUIDE.md)** | Team development setup guide |

## 🔌 API Endpoints

### Public Endpoints

```
GET    /api/health                           - Health check
POST   /api/auth/register                    - Register new user
POST   /api/auth/login                       - Login user
POST   /api/auth/forgot-password             - Request password reset
POST   /api/auth/reset-password              - Reset password
GET    /api/auth/email/verify/{id}/{hash}    - Verify email
```

### Protected Endpoints (Require Authentication)

#### User Account
```
POST   /api/auth/logout                      - Logout user
GET    /api/auth/profile                     - Get complete profile
PUT    /api/auth/profile                     - Update basic profile
PUT    /api/auth/profile/extended            - Update extended profile
PUT    /api/auth/preferences                 - Update preferences
POST   /api/auth/profile/photo               - Upload profile photo
POST   /api/auth/profile/cover               - Upload cover photo
PUT    /api/auth/password                    - Update password
DELETE /api/auth/profile                     - Delete account
POST   /api/auth/email/resend                - Resend verification email
GET    /api/auth/logs                        - Get user's auth logs
GET    /api/auth/logs/all                    - Get all auth logs (Admin)
```

#### Player Profile
```
GET    /api/player/profile                   - Get player profile
PUT    /api/player/profile                   - Update player profile
POST   /api/player/profile/photo             - Upload player photo
GET    /api/player/profile/completion        - Get profile completion status
DELETE /api/player/profile                   - Delete player profile
```

## 🗄️ Database Schema

### Core Tables

1. **users** - Main user accounts
   - Authentication credentials
   - Basic personal information
   - Activity tracking
   - Financial information
   - Security settings

2. **user_profiles** - Extended profile information
   - Profile and cover photos
   - Bio and social links
   - Address and location
   - Professional information

3. **user_preferences** - User settings
   - Language and timezone
   - Privacy settings
   - Notification preferences

4. **user_statistics** - Activity metrics
   - Booking and lesson counts
   - Ratings and reviews
   - Tournament statistics

5. **player_profiles** - Player-specific data
   - Skill level and experience
   - Playing style preferences
   - Tournament participation
   - Availability and preferences

6. **authentication_logs** - Security audit trail
   - Login/logout events
   - Failed login attempts
   - Profile changes
   - Password resets

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for complete schema details.

## 🛠️ Development

### Project Structure

```
back-end/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── AuthController.php
│   │           └── PlayerProfileController.php
│   ├── Mail/
│   │   ├── VerifyEmail.php
│   │   └── ResetPassword.php
│   └── Models/
│       ├── User.php
│       ├── UserProfile.php
│       ├── UserPreference.php
│       ├── UserStatistic.php
│       ├── PlayerProfile.php
│       └── AuthenticationLog.php
├── database/
│   └── migrations/
├── routes/
│   └── api.php
└── storage/
    └── app/
        └── public/
            ├── profile-photos/
            └── cover-photos/
```

### Available Migrations

```
0001_01_01_000000_create_users_table.php
0001_01_01_000001_create_cache_table.php
0001_01_01_000002_create_jobs_table.php
2026_01_23_030847_create_personal_access_tokens_table.php
2026_01_26_070034_create_authentication_logs_table.php
2026_01_26_071253_add_player_profile_actions_to_authentication_logs.php
2026_01_26_071451_create_player_profiles_table.php
2026_01_27_013901_add_extended_fields_to_users_table.php
2026_01_27_013916_create_user_profiles_table.php
2026_01_27_013917_create_user_preferences_table.php
2026_01_27_013917_create_user_statistics_table.php
```

### Running Migrations

```bash
# Run all pending migrations
php artisan migrate

# Rollback last batch
php artisan migrate:rollback

# Fresh migration (WARNING: Deletes all data)
php artisan migrate:fresh

# Check migration status
php artisan migrate:status
```

### Common Commands

```bash
# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Generate autoload files
composer dump-autoload

# Run tests
php artisan test

# Check code style
./vendor/bin/phpcs

# Fix code style
./vendor/bin/phpcbf
```

## 🔒 Security

- **Password Hashing:** bcrypt algorithm
- **API Authentication:** Laravel Sanctum tokens
- **Email Verification:** Signed URLs with expiration
- **Password Reset:** Secure token-based flow
- **Activity Logging:** Complete audit trail
- **Input Validation:** Comprehensive request validation
- **CORS:** Configured for frontend integration

## 📝 Environment Variables

Key environment variables to configure:

```env
# Application
APP_NAME=PicklePlay
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000

# Frontend
FRONTEND_URL=http://localhost:3000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pickleplay
DB_USERNAME=root
DB_PASSWORD=

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@pickleplay.com"
MAIL_FROM_NAME="${APP_NAME}"

# Filesystem
FILESYSTEM_DISK=public

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1
```

## 🧪 Testing

Test the API using the included test HTML file:

```bash
# Serve the test file
php artisan serve

# Open in browser
open http://localhost:8000/test-dev.html
```

Or use tools like:
- Postman
- Insomnia
- cURL
- HTTPie

## 🐛 Troubleshooting

### Common Issues

**Migration Errors:**
```bash
composer dump-autoload
php artisan migrate:fresh
```

**Storage Link Issues:**
```bash
rm public/storage
php artisan storage:link
```

**Permission Issues:**
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

**Cache Issues:**
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

## 📦 Dependencies

### Core Dependencies
- Laravel 11.x
- Laravel Sanctum (API authentication)
- PHP 8.1+

### Development Dependencies
- PHPUnit (testing)
- Laravel Pint (code style)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

Proprietary - PicklePlay Platform

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review Laravel logs: `storage/logs/laravel.log`
3. Check database error logs
4. Verify environment configuration

---

**Version:** 1.0.0  
**Last Updated:** January 27, 2026  
**Maintained by:** PicklePlay Development Team
