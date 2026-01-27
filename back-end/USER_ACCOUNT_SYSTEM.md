# User Account & Profile System Documentation

## Overview

This document describes the comprehensive user account and profile system implemented for PicklePlay. The system includes user authentication, extended profiles, preferences, and statistics tracking.

## Database Structure

### 1. Users Table (Extended)

The main `users` table contains core account information:

#### Account Information (Required at Registration)
- `first_name` - User's first name
- `last_name` - User's last name
- `email` - Unique email address (RFC 5322 format)
- `password` - Hashed password (min 8 chars, 1 uppercase, 1 number, 1 special char)
- `date_of_birth` - Must be 18+ years old
- `phone_number` - Optional phone number
- `location` - City/state or free-text location

#### Account Status & Verification
- `status` - Account status (active, inactive, suspended)
- `email_verified_at` - Email verification timestamp
- `phone_verified_at` - Phone verification timestamp
- `email_verification_token` - Token for email verification
- `email_verification_token_expires_at` - Token expiration (24 hours)

#### Activity Tracking
- `last_login_at` - Most recent login timestamp
- `last_password_change_at` - Last password update timestamp
- `login_count` - Total number of logins
- `last_ip_address` - Last IP address used

#### Financial Information
- `stripe_customer_id` - Stripe customer ID for payments
- `wallet_balance` - User's wallet balance for refunds/credits
- `total_spent` - Sum of all bookings/lessons
- `total_earnings` - Sum of lesson payments (for coaches)

#### Security
- `two_factor_enabled` - 2FA enabled/disabled
- `two_factor_method` - 2FA method (sms, email, authenticator)
- `two_factor_backup_codes` - Encrypted backup codes

#### System Fields
- `role` - User role (user, coach, admin, super_admin, court_owner)
- `profile_picture` - Path to profile picture
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### 2. User Profiles Table

Extended profile information stored in `user_profiles`:

#### Profile Details
- `profile_photo` - Profile photo path (JPG, PNG, WebP, max 5MB)
- `bio` - About me text (0-500 characters)
- `gender` - Gender (male, female, non_binary, prefer_not_to_say)
- `cover_photo` - Cover photo path (JPG, PNG, WebP, max 10MB)

#### Social Links
- `instagram_url` - Instagram profile URL
- `linkedin_url` - LinkedIn profile URL
- `twitter_url` - Twitter/X profile URL
- `website_url` - Custom website URL

#### Address & Location
- `street_address` - Street address
- `city` - City
- `state_province` - State/Province
- `country` - Country
- `postal_code` - Postal/ZIP code
- `latitude` - GPS latitude
- `longitude` - GPS longitude

#### Professional Information
- `title_occupation` - Job title/occupation
- `company_organization` - Company/organization name
- `years_in_sport` - Years in pickleball
- `certifications` - Array of certification documents (JSON)

#### Billing Address
- `billing_street_address` - Billing street address
- `billing_city` - Billing city
- `billing_state_province` - Billing state/province
- `billing_country` - Billing country
- `billing_postal_code` - Billing postal code

### 3. User Preferences Table

User preferences stored in `user_preferences`:

#### General Settings
- `preferred_language` - Preferred language (en, es, fr, etc.)
- `timezone` - Timezone for scheduling
- `privacy_level` - Privacy level (public, private, friends_only)

#### Email Notifications
- `email_booking_confirmations` - Booking confirmation emails
- `email_lesson_reminders` - Lesson reminder emails
- `email_marketing` - Marketing emails
- `email_frequency` - Email frequency (immediate, daily, weekly)

#### Other Notifications
- `push_notifications_enabled` - Push notifications on/off
- `sms_notifications_enabled` - SMS notifications on/off

### 4. User Statistics Table

User statistics stored in `user_statistics`:

- `total_bookings_made` - Count of completed/pending bookings
- `total_lessons_taken` - Count as student/player
- `total_lessons_given` - Count as coach
- `average_rating_received` - Average rating (out of 5.00)
- `total_review_count` - Number of reviews/ratings
- `tournament_participations` - Tournament participation count
- `tournament_wins` - Tournament wins count
- `current_ranking` - Player ranking number

## API Endpoints

### Authentication Endpoints

#### Register
```
POST /api/auth/register
```

**Required Fields:**
- `first_name` (string, max 255)
- `last_name` (string, max 255)
- `email` (valid email, unique)
- `password` (min 8 chars, 1 uppercase, 1 number, 1 special char)
- `password_confirmation` (must match password)
- `date_of_birth` (date, must be 18+)

**Optional Fields:**
- `phone_number` (string, max 20)
- `location` (string, max 255)

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "...",
    "token_type": "Bearer"
  }
}
```

#### Login
```
POST /api/auth/login
```

**Required Fields:**
- `email` (valid email)
- `password` (string)

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "...",
    "token_type": "Bearer"
  }
}
```

### Protected Endpoints (Require Authentication)

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "profile": { ... },
    "preferences": { ... },
    "statistics": { ... }
  }
}
```

#### Update Basic Profile
```
PUT /api/auth/profile
Authorization: Bearer {token}
```

**Optional Fields:**
- `first_name` (string, max 255)
- `last_name` (string, max 255)
- `phone_number` (string, max 20)
- `date_of_birth` (date, must be 18+)
- `location` (string, max 255)

#### Update Extended Profile
```
PUT /api/auth/profile/extended
Authorization: Bearer {token}
```

**Optional Fields:**
- `bio` (string, max 500)
- `gender` (male, female, non_binary, prefer_not_to_say)
- `instagram_url` (valid URL)
- `linkedin_url` (valid URL)
- `twitter_url` (valid URL)
- `website_url` (valid URL)
- `street_address` (string, max 255)
- `city` (string, max 255)
- `state_province` (string, max 255)
- `country` (string, max 255)
- `postal_code` (string, max 20)
- `latitude` (numeric, -90 to 90)
- `longitude` (numeric, -180 to 180)
- `title_occupation` (string, max 255)
- `company_organization` (string, max 255)
- `years_in_sport` (integer, min 0)

#### Update Preferences
```
PUT /api/auth/preferences
Authorization: Bearer {token}
```

**Optional Fields:**
- `preferred_language` (string, max 10)
- `timezone` (string, max 50)
- `privacy_level` (public, private, friends_only)
- `email_booking_confirmations` (boolean)
- `email_lesson_reminders` (boolean)
- `email_marketing` (boolean)
- `email_frequency` (immediate, daily, weekly)
- `push_notifications_enabled` (boolean)
- `sms_notifications_enabled` (boolean)

#### Upload Profile Photo
```
POST /api/auth/profile/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Required Fields:**
- `photo` (image file: jpg, jpeg, png, webp, max 5MB)

**Response:**
```json
{
  "success": true,
  "message": "Profile photo uploaded successfully",
  "data": {
    "profile_picture": "profile-photos/xyz.jpg",
    "url": "http://domain.com/storage/profile-photos/xyz.jpg"
  }
}
```

#### Upload Cover Photo
```
POST /api/auth/profile/cover
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Required Fields:**
- `photo` (image file: jpg, jpeg, png, webp, max 10MB)

**Response:**
```json
{
  "success": true,
  "message": "Cover photo uploaded successfully",
  "data": {
    "cover_photo": "cover-photos/xyz.jpg",
    "url": "http://domain.com/storage/cover-photos/xyz.jpg"
  }
}
```

#### Update Password
```
PUT /api/auth/password
Authorization: Bearer {token}
```

**Required Fields:**
- `current_password` (string)
- `new_password` (min 8 chars, 1 uppercase, 1 number, 1 special char)
- `new_password_confirmation` (must match new_password)

## Models

### User Model

**Relationships:**
- `hasOne(UserProfile::class)` - User profile
- `hasOne(UserPreference::class)` - User preferences
- `hasOne(UserStatistic::class)` - User statistics
- `hasOne(PlayerProfile::class)` - Player profile (for player role)

**Helper Methods:**
- `getOrCreateProfile()` - Get or create user profile
- `getOrCreatePreferences()` - Get or create user preferences
- `getOrCreateStatistics()` - Get or create user statistics
- `isAdult()` - Check if user is 18+ years old
- `updateLastLogin($ipAddress)` - Update last login information
- `hasRole($role)` - Check if user has specific role
- `isUser()`, `isCoach()`, `isAdmin()`, `isSuperAdmin()`, `isCourtOwner()` - Role checks
- `hasAdminPrivileges()` - Check if user has admin privileges

### UserProfile Model

**Relationships:**
- `belongsTo(User::class)` - User

**Attributes:**
- `full_address` - Computed full address string
- `full_billing_address` - Computed full billing address string

### UserPreference Model

**Relationships:**
- `belongsTo(User::class)` - User

### UserStatistic Model

**Relationships:**
- `belongsTo(User::class)` - User

**Helper Methods:**
- `incrementBookings()` - Increment bookings count
- `incrementLessonsTaken()` - Increment lessons taken count
- `incrementLessonsGiven()` - Increment lessons given count
- `updateAverageRating($newRating)` - Update average rating with new rating

## Registration Flow

1. **User submits registration form** with required fields
2. **System validates** all fields including:
   - Email format (RFC 5322)
   - Password strength (min 8 chars, uppercase, number, special char)
   - Age verification (must be 18+)
3. **User account is created** with CUSTOMER role by default
4. **Related records are created**:
   - UserProfile (empty)
   - UserPreference (with defaults)
   - UserStatistic (with zeros)
5. **Email verification token** is generated (expires in 24 hours)
6. **API token** is generated for authentication
7. **Authentication log** is recorded
8. **Response** includes user data and token

## Profile Completion Flow

After registration, users can complete their profile:

1. **Basic Profile** - Update name, phone, location (via `/api/auth/profile`)
2. **Extended Profile** - Add bio, social links, address (via `/api/auth/profile/extended`)
3. **Profile Photos** - Upload profile and cover photos
4. **Preferences** - Set notification and privacy preferences
5. **Player Profile** - Complete player-specific profile (if applicable)

## Security Features

1. **Password Requirements:**
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 number
   - At least 1 special character

2. **Email Verification:**
   - Verification token expires in 24 hours
   - Signed URLs for verification links

3. **Activity Tracking:**
   - Last login timestamp
   - Login count
   - Last IP address
   - Authentication logs

4. **Two-Factor Authentication:**
   - Support for SMS, email, and authenticator app
   - Backup codes for recovery

5. **Password Reset:**
   - Secure token-based reset flow
   - Token expires in 60 minutes
   - All tokens revoked after password reset

## Migration Instructions

To apply the new database structure:

```bash
# Run migrations
php artisan migrate

# If you need to refresh the database (WARNING: This will delete all data)
php artisan migrate:fresh
```

## Storage Setup

For photo uploads to work, you need to create the storage link:

```bash
php artisan storage:link
```

This creates a symbolic link from `public/storage` to `storage/app/public`.

## Environment Variables

Make sure these are set in your `.env` file:

```env
# App
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Filesystem
FILESYSTEM_DISK=public

# Mail (for verification emails)
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@pickleplay.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## Testing

You can test the API endpoints using tools like:
- Postman
- Insomnia
- cURL
- The provided `test-dev.html` file

Example registration request:

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!",
    "date_of_birth": "1990-01-01",
    "phone_number": "+1234567890",
    "location": "New York, NY"
  }'
```

## Notes

- All timestamps are stored in UTC
- Profile and cover photos are stored in `storage/app/public/profile-photos` and `storage/app/public/cover-photos`
- User role defaults to `user` (CUSTOMER) at registration
- Related records (profile, preferences, statistics) are automatically created on registration
- Statistics are updated automatically through helper methods
- All sensitive data (passwords, tokens) are properly hashed/encrypted
