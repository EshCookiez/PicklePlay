# Database Schema - User Account System

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              USERS TABLE                                │
│─────────────────────────────────────────────────────────────────────────│
│ PK  id                                                                  │
│     first_name                                                          │
│     last_name                                                           │
│     email (unique)                                                      │
│     password (hashed)                                                   │
│     role (user, coach, admin, super_admin, court_owner)                │
│     phone_number                                                        │
│     date_of_birth                                                       │
│     location                                                            │
│     profile_picture                                                     │
│     status (active, inactive, suspended)                               │
│     email_verified_at                                                   │
│     phone_verified_at                                                   │
│     email_verification_token                                            │
│     email_verification_token_expires_at                                 │
│     last_login_at                                                       │
│     last_password_change_at                                             │
│     login_count                                                         │
│     last_ip_address                                                     │
│     stripe_customer_id                                                  │
│     wallet_balance                                                      │
│     total_spent                                                         │
│     total_earnings                                                      │
│     two_factor_enabled                                                  │
│     two_factor_method                                                   │
│     two_factor_backup_codes                                             │
│     remember_token                                                      │
│     created_at                                                          │
│     updated_at                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ 1:1
                    ┌───────────────┼───────────────┬───────────────┐
                    │               │               │               │
                    ▼               ▼               ▼               ▼
        ┌───────────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐
        │  USER_PROFILES    │ │   USER_     │ │   USER_     │ │   PLAYER_    │
        │                   │ │ PREFERENCES │ │ STATISTICS  │ │  PROFILES    │
        │─────────────────  │ │─────────────│ │─────────────│ │──────────────│
        │ PK  id            │ │ PK  id      │ │ PK  id      │ │ PK  id       │
        │ FK  user_id       │ │ FK  user_id │ │ FK  user_id │ │ FK  user_id  │
        │     profile_photo │ │     lang    │ │     bookings│ │     skill    │
        │     bio           │ │     timezone│ │     lessons │ │     years    │
        │     gender        │ │     privacy │ │     rating  │ │     position │
        │     cover_photo   │ │     email_* │ │     reviews │ │     bio      │
        │     social_links  │ │     push_*  │ │     tourns  │ │     certs    │
        │     address       │ │     sms_*   │ │     wins    │ │     status   │
        │     city          │ │     created │ │     ranking │ │     created  │
        │     state         │ │     updated │ │     created │ │     updated  │
        │     country       │ └─────────────┘ │     updated │ └──────────────┘
        │     postal_code   │                 └─────────────┘
        │     lat/long      │
        │     title         │
        │     company       │
        │     years_sport   │
        │     certs (JSON)  │
        │     billing_addr  │
        │     created_at    │
        │     updated_at    │
        └───────────────────┘
```

## Table Relationships

### Users → User Profiles (1:1)
- One user has one profile
- Cascade delete: When user is deleted, profile is deleted

### Users → User Preferences (1:1)
- One user has one set of preferences
- Cascade delete: When user is deleted, preferences are deleted

### Users → User Statistics (1:1)
- One user has one statistics record
- Cascade delete: When user is deleted, statistics are deleted

### Users → Player Profiles (1:1)
- One user can have one player profile (optional, for player role)
- Cascade delete: When user is deleted, player profile is deleted

## Table Details

### Users Table

**Primary Purpose:** Core user account information

**Key Fields:**
- Authentication: email, password, remember_token
- Identity: first_name, last_name, date_of_birth
- Contact: phone_number, location
- Status: status, role, email_verified_at, phone_verified_at
- Activity: last_login_at, login_count, last_ip_address
- Financial: stripe_customer_id, wallet_balance, total_spent, total_earnings
- Security: two_factor_enabled, two_factor_method, two_factor_backup_codes

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (email)
- INDEX (date_of_birth)
- INDEX (location)
- INDEX (last_login_at)
- INDEX (stripe_customer_id)

### User Profiles Table

**Primary Purpose:** Extended profile information

**Key Fields:**
- Visual: profile_photo, cover_photo
- Personal: bio, gender
- Social: instagram_url, linkedin_url, twitter_url, website_url
- Location: street_address, city, state_province, country, postal_code, latitude, longitude
- Professional: title_occupation, company_organization, years_in_sport, certifications
- Billing: billing_street_address, billing_city, billing_state_province, billing_country, billing_postal_code

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (user_id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- INDEX (city)
- INDEX (state_province)
- INDEX (country)
- INDEX (latitude, longitude)

### User Preferences Table

**Primary Purpose:** User settings and notification preferences

**Key Fields:**
- Localization: preferred_language, timezone
- Privacy: privacy_level
- Email Notifications: email_booking_confirmations, email_lesson_reminders, email_marketing, email_frequency
- Other Notifications: push_notifications_enabled, sms_notifications_enabled

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (user_id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

### User Statistics Table

**Primary Purpose:** Track user activity and performance metrics

**Key Fields:**
- Bookings: total_bookings_made
- Lessons: total_lessons_taken, total_lessons_given
- Reviews: average_rating_received, total_review_count
- Tournaments: tournament_participations, tournament_wins, current_ranking

**Indexes:**
- PRIMARY KEY (id)
- UNIQUE (user_id)
- FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- INDEX (average_rating_received)
- INDEX (current_ranking)

### Player Profiles Table

**Primary Purpose:** Player-specific information (separate from general user profile)

**Key Fields:**
- Playing Info: skill_level, years_playing, play_frequency, primary_position
- Experience: tournament_participation, certifications, tournament_results, achievements
- Preferences: preferred_court_type, preferred_match_format, availability_days, preferred_time_slots
- Profile: profile_photo, bio, favorite_courts, social_links
- Agreements: agree_code_of_conduct, agree_community_guidelines, agree_ranking_rules, agree_fair_play
- Status: profile_status, completed_at

**Note:** This table is separate and used specifically for users with player role who want to participate in matches/tournaments.

## Data Flow

### Registration Flow
```
1. User submits registration form
   ↓
2. Create record in USERS table
   ↓
3. Create record in USER_PROFILES table (empty)
   ↓
4. Create record in USER_PREFERENCES table (with defaults)
   ↓
5. Create record in USER_STATISTICS table (with zeros)
   ↓
6. Return user data + token
```

### Profile Completion Flow
```
1. User logs in
   ↓
2. Update USER_PROFILES table with extended info
   ↓
3. Upload photos to storage
   ↓
4. Update USER_PREFERENCES table with settings
   ↓
5. (Optional) Create PLAYER_PROFILES record if user wants player features
```

### Login Flow
```
1. Validate credentials
   ↓
2. Update USERS table:
   - last_login_at = now()
   - login_count += 1
   - last_ip_address = request IP
   ↓
3. Create authentication log
   ↓
4. Return user data + token
```

### Statistics Update Flow
```
When booking is made:
  USER_STATISTICS.total_bookings_made += 1

When lesson is taken:
  USER_STATISTICS.total_lessons_taken += 1

When lesson is given (coach):
  USER_STATISTICS.total_lessons_given += 1

When review is received:
  Calculate new average:
    new_avg = ((old_avg * review_count) + new_rating) / (review_count + 1)
  USER_STATISTICS.average_rating_received = new_avg
  USER_STATISTICS.total_review_count += 1

When tournament is joined:
  USER_STATISTICS.tournament_participations += 1

When tournament is won:
  USER_STATISTICS.tournament_wins += 1
```

## Storage Structure

### File Storage Layout
```
storage/app/public/
├── profile-photos/
│   ├── {hash}.jpg
│   ├── {hash}.png
│   └── {hash}.webp
└── cover-photos/
    ├── {hash}.jpg
    ├── {hash}.png
    └── {hash}.webp

public/storage/ → symlink to storage/app/public/
```

### Photo Upload Process
```
1. Validate file (type, size)
   ↓
2. Delete old photo if exists
   ↓
3. Store new photo with unique hash name
   ↓
4. Update database with file path
   ↓
5. Return file path and public URL
```

## Data Types & Constraints

### String Fields
- `VARCHAR(255)` - Most text fields (names, emails, URLs)
- `VARCHAR(20)` - Phone numbers, postal codes
- `VARCHAR(10)` - Language codes
- `VARCHAR(50)` - Timezone strings
- `VARCHAR(45)` - IP addresses
- `TEXT` - Bio, descriptions, notes
- `LONGTEXT` - Large text content

### Numeric Fields
- `BIGINT UNSIGNED` - IDs (auto-increment)
- `INT` - Counts (login_count, years_in_sport)
- `DECIMAL(10,2)` - Money amounts (wallet_balance, total_spent)
- `DECIMAL(3,2)` - Ratings (0.00 to 5.00)
- `DECIMAL(10,8)` - Latitude (-90.00000000 to 90.00000000)
- `DECIMAL(11,8)` - Longitude (-180.00000000 to 180.00000000)

### Date/Time Fields
- `DATE` - date_of_birth
- `TIMESTAMP` - All *_at fields (created_at, updated_at, verified_at, etc.)

### Boolean Fields
- `BOOLEAN` - All *_enabled, agree_* fields

### Enum Fields
- `role` - user, coach, admin, super_admin, court_owner
- `status` - active, inactive, suspended
- `gender` - male, female, non_binary, prefer_not_to_say
- `privacy_level` - public, private, friends_only
- `email_frequency` - immediate, daily, weekly
- `two_factor_method` - sms, email, authenticator

### JSON Fields
- `certifications` - Array of certification objects
- `two_factor_backup_codes` - Encrypted array of backup codes

## Performance Considerations

### Indexed Fields
All foreign keys and frequently queried fields are indexed:
- users.email (unique)
- users.date_of_birth
- users.location
- users.last_login_at
- users.stripe_customer_id
- user_profiles.user_id (unique, foreign key)
- user_profiles.city
- user_profiles.state_province
- user_profiles.country
- user_profiles.latitude, longitude (composite)
- user_preferences.user_id (unique, foreign key)
- user_statistics.user_id (unique, foreign key)
- user_statistics.average_rating_received
- user_statistics.current_ranking

### Query Optimization
- Use eager loading for relationships: `User::with(['profile', 'preferences', 'statistics'])`
- Index frequently searched fields
- Use pagination for large result sets
- Cache frequently accessed data

## Security Considerations

### Sensitive Data
- Passwords: bcrypt hashed (never stored plain text)
- Two-factor backup codes: encrypted
- Email verification tokens: random 64-character strings
- Password reset tokens: random 64-character strings, hashed

### Hidden Fields
These fields are never returned in API responses:
- password
- remember_token
- email_verification_token
- two_factor_backup_codes

### Validation
- Email: RFC 5322 format, DNS validation
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
- Date of birth: Must be 18+ years old
- URLs: Valid URL format
- Files: Type and size validation

### Access Control
- Users can only access/modify their own data
- Admin endpoints require admin role
- All protected endpoints require authentication token

## Migration Order

Migrations must run in this order:

1. `0001_01_01_000000_create_users_table.php` (base users table)
2. `2026_01_27_013901_add_extended_fields_to_users_table.php` (extend users)
3. `2026_01_27_013916_create_user_profiles_table.php` (user profiles)
4. `2026_01_27_013917_create_user_preferences_table.php` (user preferences)
5. `2026_01_27_013917_create_user_statistics_table.php` (user statistics)
6. `2026_01_26_071451_create_player_profiles_table.php` (player profiles)

The migration files are timestamped to ensure correct execution order.
