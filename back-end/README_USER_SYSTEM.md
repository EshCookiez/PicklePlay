# 🎾 PicklePlay - User Account & Profile System

## 📋 Overview

A comprehensive user account and profile management system for the PicklePlay application. This system provides complete user registration, authentication, profile management, preferences, and statistics tracking.

## ✨ Features

### 🔐 Authentication
- User registration with email verification
- Secure login with activity tracking
- Password reset functionality
- Two-factor authentication support (prepared)
- Session management with Sanctum tokens

### 👤 User Profiles
- Basic profile information (name, email, phone, DOB, location)
- Extended profile (bio, gender, social links, address)
- Profile and cover photo uploads
- Professional information (occupation, company, certifications)
- Billing address management

### ⚙️ Preferences
- Language and timezone settings
- Privacy level control (public, private, friends only)
- Email notification preferences
- Push and SMS notification settings
- Customizable notification frequency

### 📊 Statistics
- Booking and lesson tracking
- Rating and review management
- Tournament participation and wins
- Player ranking system
- Automatic statistics updates

## 🗂️ Documentation Files

| File | Description |
|------|-------------|
| `USER_ACCOUNT_SYSTEM.md` | Complete API documentation and usage guide |
| `IMPLEMENTATION_SUMMARY.md` | Summary of implemented features |
| `MIGRATION_GUIDE.md` | Step-by-step migration instructions |
| `DATABASE_SCHEMA.md` | Database structure and relationships |
| `README_USER_SYSTEM.md` | This file - Quick reference guide |

## 🚀 Quick Start

### 1. Run Migrations

```bash
cd back-end
php artisan migrate
```

### 2. Create Storage Link

```bash
php artisan storage:link
```

### 3. Test Registration

```bash
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

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |
| GET | `/api/auth/email/verify/{id}/{hash}` | Verify email |

### Protected Endpoints (Require Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/profile` | Get complete profile |
| PUT | `/api/auth/profile` | Update basic profile |
| PUT | `/api/auth/profile/extended` | Update extended profile |
| PUT | `/api/auth/preferences` | Update preferences |
| POST | `/api/auth/profile/photo` | Upload profile photo |
| POST | `/api/auth/profile/cover` | Upload cover photo |
| PUT | `/api/auth/password` | Update password |
| DELETE | `/api/auth/profile` | Delete account |
| POST | `/api/auth/email/resend` | Resend verification email |
| GET | `/api/auth/logs` | Get user's auth logs |
| GET | `/api/auth/logs/all` | Get all auth logs (Admin) |

## 🗄️ Database Tables

### Core Tables

1. **users** - Main user account table
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
   - Billing address

3. **user_preferences** - User settings
   - Language and timezone
   - Privacy settings
   - Notification preferences

4. **user_statistics** - Activity metrics
   - Booking and lesson counts
   - Ratings and reviews
   - Tournament statistics
   - Player rankings

## 🔑 Key Features

### Registration Requirements

**Required Fields:**
- First name and last name
- Valid email address (unique)
- Strong password (min 8 chars, uppercase, number, special char)
- Date of birth (must be 18+)

**Optional Fields:**
- Phone number
- Location

**Automatic Actions:**
- Creates user profile record
- Creates user preferences with defaults
- Creates user statistics with zeros
- Generates email verification token
- Tracks first login

### Profile Management

**Basic Profile:**
- Update name, phone, location
- Upload profile photo (max 5MB)
- Upload cover photo (max 10MB)

**Extended Profile:**
- Add bio (max 500 characters)
- Set gender
- Add social media links
- Add address information
- Add professional information

**Preferences:**
- Set language and timezone
- Configure privacy level
- Manage notification settings

### Security Features

- **Password Hashing:** bcrypt algorithm
- **Email Verification:** 24-hour token expiration
- **Password Reset:** 60-minute token expiration
- **Activity Tracking:** Login history, IP addresses
- **Two-Factor Auth:** Support for SMS, email, authenticator
- **Authentication Logs:** Complete audit trail

## 📝 Example Usage

### Register a New User

```javascript
const response = await fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'Password123!',
    password_confirmation: 'Password123!',
    date_of_birth: '1990-01-01',
    phone_number: '+1234567890',
    location: 'New York, NY'
  })
});

const data = await response.json();
console.log(data.data.token); // Save this token
```

### Login

```javascript
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'Password123!'
  })
});

const data = await response.json();
const token = data.data.token;
```

### Get Profile

```javascript
const response = await fetch('http://localhost:8000/api/auth/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
});

const data = await response.json();
console.log(data.data.user);
console.log(data.data.profile);
console.log(data.data.preferences);
console.log(data.data.statistics);
```

### Update Extended Profile

```javascript
const response = await fetch('http://localhost:8000/api/auth/profile/extended', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    bio: 'Passionate pickleball player and coach',
    gender: 'male',
    instagram_url: 'https://instagram.com/johndoe',
    city: 'New York',
    state_province: 'NY',
    country: 'USA'
  })
});

const data = await response.json();
```

### Upload Profile Photo

```javascript
const formData = new FormData();
formData.append('photo', fileInput.files[0]);

const response = await fetch('http://localhost:8000/api/auth/profile/photo', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData
});

const data = await response.json();
console.log(data.data.url); // Public URL to the photo
```

## 🛠️ Model Usage

### User Model

```php
// Get user with all relationships
$user = User::with(['profile', 'preferences', 'statistics'])->find($id);

// Check user role
if ($user->isAdmin()) {
    // Admin actions
}

// Check if user is adult
if ($user->isAdult()) {
    // Allow age-restricted features
}

// Update last login
$user->updateLastLogin($request->ip());

// Get or create profile
$profile = $user->getOrCreateProfile();
```

### UserStatistic Model

```php
// Increment bookings
$user->statistics->incrementBookings();

// Increment lessons taken
$user->statistics->incrementLessonsTaken();

// Update rating
$user->statistics->updateAverageRating(4.5);
```

## ⚠️ Important Notes

1. **Age Requirement:** Users must be 18+ years old to register
2. **Email Verification:** Verification tokens expire in 24 hours
3. **Password Reset:** Reset tokens expire in 60 minutes
4. **Photo Limits:** Profile photos max 5MB, cover photos max 10MB
5. **Storage Link:** Must run `php artisan storage:link` for photo uploads
6. **Migrations:** Run migrations in order (they are timestamped)

## 🔧 Configuration

### Environment Variables

```env
# App
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=pickleplay
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Filesystem
FILESYSTEM_DISK=public

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_FROM_ADDRESS="noreply@pickleplay.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## 📚 Additional Resources

- **API Documentation:** See `USER_ACCOUNT_SYSTEM.md`
- **Migration Guide:** See `MIGRATION_GUIDE.md`
- **Database Schema:** See `DATABASE_SCHEMA.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`

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
```

## 🎯 Next Steps

1. ✅ Run migrations
2. ✅ Create storage link
3. ✅ Test API endpoints
4. ⬜ Implement email templates
5. ⬜ Add phone verification (SMS)
6. ⬜ Implement 2FA logic
7. ⬜ Add payment integration
8. ⬜ Build frontend forms

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review Laravel logs: `storage/logs/laravel.log`
3. Check database error logs
4. Verify all dependencies are installed

## 📄 License

Part of the PicklePlay application.

---

**Last Updated:** January 27, 2026

**Version:** 1.0.0

**Author:** PicklePlay Development Team
