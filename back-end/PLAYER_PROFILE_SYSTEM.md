# 🏓 Player Profile System - Implementation Guide

## ✅ **What's Been Implemented**

### **1. Database Schema**
- ✅ `player_profiles` table created
- ✅ Comprehensive fields for all requirements
- ✅ Foreign key relationship with users table
- ✅ Proper indexes for performance

### **2. PlayerProfile Model**
- ✅ Eloquent model with all relationships
- ✅ Helper methods for profile completion
- ✅ JSON casting for complex fields
- ✅ Validation helpers

### **3. User Relationship**
- ✅ One-to-one relationship added to User model
- ✅ Helper method to create profile

---

## 📊 **Database Schema**

### **player_profiles Table**

```sql
CREATE TABLE player_profiles (
    id BIGINT PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    
    -- 1. BASIC INFORMATION
    date_of_birth DATE NULL,
    location_city VARCHAR(255) NULL,
    
    -- 2. PLAYING PROFILE
    skill_level ENUM('beginner', 'intermediate', 'advanced', 'professional') NULL,
    years_playing INTEGER NULL,
    play_frequency ENUM('casual', 'regular_1_2', 'frequent_3_4', 'competitive') NULL,
    primary_position ENUM('none_mix', 'dinking_net', 'aggressive_baseline', 'both') NULL,
    
    -- 3. EXPERIENCE & ACHIEVEMENTS
    tournament_participation ENUM('never', 'local', 'regional', 'national') NULL,
    certifications TEXT NULL,
    tournament_results TEXT NULL,
    achievements TEXT NULL,
    
    -- 4. PREFERRED PLAY STYLE
    preferred_court_type ENUM('indoor', 'outdoor', 'either') NULL,
    preferred_match_format ENUM('singles', 'doubles', 'both') NULL,
    availability_days JSON NULL,
    preferred_time_slots JSON NULL,
    
    -- 5. PROFILE DETAILS
    profile_photo VARCHAR(255) NULL,
    bio TEXT NULL,
    favorite_courts JSON NULL,
    social_links JSON NULL,
    
    -- 6. AGREEMENTS
    agree_code_of_conduct BOOLEAN DEFAULT FALSE,
    agree_community_guidelines BOOLEAN DEFAULT FALSE,
    agree_ranking_rules BOOLEAN DEFAULT FALSE,
    agree_fair_play BOOLEAN DEFAULT FALSE,
    
    -- OPTIONAL FIELDS
    team_club_affiliation VARCHAR(255) NULL,
    emergency_contact_name VARCHAR(255) NULL,
    emergency_contact_phone VARCHAR(255) NULL,
    medical_conditions TEXT NULL,
    
    -- STATUS
    profile_status ENUM('incomplete', 'complete', 'verified') DEFAULT 'incomplete',
    completed_at TIMESTAMP NULL,
    
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 📝 **Field Descriptions**

### **1. BASIC INFORMATION**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date_of_birth` | Date | Yes* | Player's date of birth |
| `location_city` | String | Yes* | City where player is located |

### **2. PLAYING PROFILE**

| Field | Type | Options | Description |
|-------|------|---------|-------------|
| `skill_level` | Enum | beginner, intermediate, advanced, professional | Current skill level |
| `years_playing` | Integer | 0-100 | Years of pickleball experience |
| `play_frequency` | Enum | casual, regular_1_2, frequent_3_4, competitive | How often they play |
| `primary_position` | Enum | none_mix, dinking_net, aggressive_baseline, both | Preferred playing position |

### **3. EXPERIENCE & ACHIEVEMENTS**

| Field | Type | Description |
|-------|------|-------------|
| `tournament_participation` | Enum | never, local, regional, national |
| `certifications` | Text | Certifications and rankings |
| `tournament_results` | Text | Previous tournament results |
| `achievements` | Text | Notable achievements |

### **4. PREFERRED PLAY STYLE**

| Field | Type | Options | Description |
|-------|------|---------|-------------|
| `preferred_court_type` | Enum | indoor, outdoor, either | Court type preference |
| `preferred_match_format` | Enum | singles, doubles, both | Match format preference |
| `availability_days` | JSON Array | ['weekdays', 'weekends', 'flexible'] | When available to play |
| `preferred_time_slots` | JSON Array | ['morning', 'afternoon', 'evening'] | Preferred playing times |

### **5. PROFILE DETAILS**

| Field | Type | Description |
|-------|------|-------------|
| `profile_photo` | String | URL to profile photo |
| `bio` | Text | About me / bio |
| `favorite_courts` | JSON Array | List of favorite court IDs/names |
| `social_links` | JSON Object | {instagram, facebook, twitter, etc} |

### **6. AGREEMENTS** (All Required)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `agree_code_of_conduct` | Boolean | Yes | Player Code of Conduct |
| `agree_community_guidelines` | Boolean | Yes | Community Guidelines |
| `agree_ranking_rules` | Boolean | Yes | Ranking System Rules |
| `agree_fair_play` | Boolean | Yes | Fair Play Standards |

### **OPTIONAL FIELDS**

| Field | Type | Description |
|-------|------|-------------|
| `team_club_affiliation` | String | Team or club name |
| `emergency_contact_name` | String | Emergency contact person |
| `emergency_contact_phone` | String | Emergency contact phone |
| `medical_conditions` | Text | Medical conditions/limitations |

### **STATUS FIELDS**

| Field | Type | Description |
|-------|------|-------------|
| `profile_status` | Enum | incomplete, complete, verified |
| `completed_at` | Timestamp | When profile was marked complete |

---

## 🔧 **Model Methods**

### **PlayerProfile Model**

```php
// Check if profile is complete
$profile->isComplete(): bool

// Check if all agreements accepted
$profile->hasAcceptedAllAgreements(): bool

// Mark profile as complete
$profile->markAsComplete(): void

// Check required fields
$profile->hasRequiredFields(): bool

// Get completion percentage (0-100)
$profile->getCompletionPercentage(): int
```

### **User Model**

```php
// Get player profile
$user->playerProfile

// Get or create profile
$user->getOrCreatePlayerProfile()
```

---

## 📡 **API Endpoints** (To Be Implemented)

### **1. Get Player Profile**
```
GET /api/player/profile
Authorization: Bearer {token}
```

### **2. Create/Update Player Profile**
```
PUT /api/player/profile
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body Example:**
```json
{
  "date_of_birth": "1990-05-15",
  "location_city": "New York",
  "skill_level": "intermediate",
  "years_playing": 3,
  "play_frequency": "regular_1_2",
  "primary_position": "both",
  "tournament_participation": "local",
  "certifications": "USAPA Level 2",
  "preferred_court_type": "outdoor",
  "preferred_match_format": "doubles",
  "availability_days": ["weekdays", "weekends"],
  "preferred_time_slots": ["morning", "evening"],
  "bio": "Passionate pickleball player looking to improve...",
  "social_links": {
    "instagram": "@player123",
    "facebook": "facebook.com/player"
  },
  "agree_code_of_conduct": true,
  "agree_community_guidelines": true,
  "agree_ranking_rules": true,
  "agree_fair_play": true,
  "team_club_affiliation": "NYC Pickleball Club",
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "+1234567890"
}
```

### **3. Upload Profile Photo**
```
POST /api/player/profile/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

### **4. Get Profile Completion Status**
```
GET /api/player/profile/completion
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "completion_percentage": 85,
    "profile_status": "complete",
    "missing_required_fields": [],
    "missing_optional_fields": ["medical_conditions"]
  }
}
```

---

## 🎯 **Profile Completion Requirements**

### **Required for "Complete" Status:**

1. **Basic Information**
   - ✅ Date of Birth
   - ✅ Location/City

2. **Playing Profile**
   - ✅ Skill Level
   - ✅ Play Frequency

3. **All Agreements**
   - ✅ Code of Conduct
   - ✅ Community Guidelines
   - ✅ Ranking Rules
   - ✅ Fair Play Standards

### **Recommended Fields:**
- Years Playing
- Primary Position
- Tournament Participation
- Preferred Court Type
- Preferred Match Format
- Bio

---

## 💡 **Usage Examples**

### **Create Player Profile**

```php
// In controller
$user = auth()->user();
$profile = $user->getOrCreatePlayerProfile();

$profile->update([
    'date_of_birth' => '1990-05-15',
    'location_city' => 'New York',
    'skill_level' => 'intermediate',
    'play_frequency' => 'regular_1_2',
    'bio' => 'Love playing pickleball!',
    'agree_code_of_conduct' => true,
    'agree_community_guidelines' => true,
    'agree_ranking_rules' => true,
    'agree_fair_play' => true,
]);

// Mark as complete if requirements met
$profile->markAsComplete();
```

### **Check Profile Completion**

```php
$profile = $user->playerProfile;

// Get completion percentage
$percentage = $profile->getCompletionPercentage(); // 85

// Check if complete
if ($profile->isComplete()) {
    // Allow access to features
}

// Check required fields
if (!$profile->hasRequiredFields()) {
    return 'Please complete required fields';
}
```

### **Query Profiles**

```php
// Get all complete profiles
$completeProfiles = PlayerProfile::where('profile_status', 'complete')->get();

// Get profiles by skill level
$intermediates = PlayerProfile::where('skill_level', 'intermediate')->get();

// Get profiles by location
$nycPlayers = PlayerProfile::where('location_city', 'New York')->get();

// Get players available on weekends
$weekendPlayers = PlayerProfile::whereJsonContains('availability_days', 'weekends')->get();
```

---

## 🔐 **Role Application System**

### **How It Works:**

1. **User Registers** → Creates basic account
2. **Complete Player Profile** → Fills out all information
3. **Apply for Role** → Can apply for COACH or COURT_OWNER
4. **Admin Reviews** → Admin approves/rejects application
5. **Role Granted** → User role updated

### **Requirements for Role Applications:**

**COACH Application:**
- ✅ Complete player profile
- ✅ Skill level: Advanced or Professional
- ✅ Years playing: 2+
- ✅ Tournament participation: Local or higher
- ✅ Certifications provided

**COURT_OWNER Application:**
- ✅ Complete player profile
- ✅ Business information
- ✅ Court details
- ✅ Verification documents

---

## 📋 **Next Steps**

### **To Complete Implementation:**

1. **Create PlayerProfileController**
   - `GET /api/player/profile`
   - `PUT /api/player/profile`
   - `POST /api/player/profile/photo`
   - `GET /api/player/profile/completion`

2. **Create Role Application System**
   - `POST /api/apply/coach`
   - `POST /api/apply/court-owner`
   - `GET /api/admin/applications` (Admin)
   - `PUT /api/admin/applications/{id}/approve` (Admin)

3. **Add Validation**
   - Form Request classes
   - Business logic validation
   - File upload validation

4. **Add to test-dev.html**
   - Player profile form
   - Progress indicator
   - Agreement checkboxes

5. **Create Admin Dashboard**
   - View all profiles
   - View applications
   - Approve/reject applications

---

## 🎨 **Frontend Integration**

### **Profile Form Structure:**

```html
<form id="playerProfileForm">
  <!-- Basic Information -->
  <section>
    <h3>Basic Information</h3>
    <input type="date" name="date_of_birth" required>
    <input type="text" name="location_city" required>
  </section>

  <!-- Playing Profile -->
  <section>
    <h3>Playing Profile</h3>
    <select name="skill_level" required>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
      <option value="professional">Professional</option>
    </select>
    <!-- More fields... -->
  </section>

  <!-- Agreements -->
  <section>
    <h3>Agreements & Terms</h3>
    <label>
      <input type="checkbox" name="agree_code_of_conduct" required>
      I agree to the Player Code of Conduct
    </label>
    <!-- More checkboxes... -->
  </section>

  <button type="submit">Complete Profile</button>
</form>
```

---

**🎉 Player profile database structure is complete and ready for API implementation!**
