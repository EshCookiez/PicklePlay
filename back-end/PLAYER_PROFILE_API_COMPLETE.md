# ✅ Player Profile API - Complete Implementation

## 🎉 **What's Been Implemented**

### **1. Database & Models** ✅
- `player_profiles` table with all required fields
- PlayerProfile Eloquent model with helper methods
- One-to-one relationship with User model

### **2. API Endpoints** ✅
- Get player profile
- Create/Update player profile
- Upload profile photo
- Get completion status
- Delete player profile

### **3. Validation** ✅
- Comprehensive validation rules
- Required vs optional field enforcement
- Data type validation
- Agreement validation

---

## 📡 **API Endpoints**

### **1. Get Player Profile**

```
GET /api/player/profile
Authorization: Bearer {token}
```

**Description:** Get the authenticated user's player profile.

**Response (200 - Profile Exists):**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": 1,
      "user_id": 3,
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
      "bio": "Passionate pickleball player...",
      "agree_code_of_conduct": true,
      "agree_community_guidelines": true,
      "agree_ranking_rules": true,
      "agree_fair_play": true,
      "profile_status": "complete",
      "completed_at": "2026-01-26T15:00:00.000000Z",
      "created_at": "2026-01-26T14:00:00.000000Z",
      "updated_at": "2026-01-26T15:00:00.000000Z"
    },
    "completion_percentage": 85,
    "is_complete": true
  }
}
```

**Response (404 - No Profile):**
```json
{
  "success": false,
  "message": "Profile not found",
  "data": null
}
```

---

### **2. Create/Update Player Profile**

```
PUT /api/player/profile
Authorization: Bearer {token}
Content-Type: application/json
```

**Description:** Create or update the player profile. Auto-creates profile if it doesn't exist.

**Request Body (All Fields Optional):**
```json
{
  "date_of_birth": "1990-05-15",
  "location_city": "New York",
  "skill_level": "intermediate",
  "years_playing": 3,
  "play_frequency": "regular_1_2",
  "primary_position": "both",
  "tournament_participation": "local",
  "certifications": "USAPA Level 2 Certified",
  "tournament_results": "Won local tournament 2025",
  "achievements": "MVP of NYC League",
  "preferred_court_type": "outdoor",
  "preferred_match_format": "doubles",
  "availability_days": ["weekdays", "weekends"],
  "preferred_time_slots": ["morning", "evening"],
  "bio": "Passionate pickleball player looking to improve and compete",
  "favorite_courts": [1, 5, 10],
  "social_links": {
    "instagram": "@player123",
    "facebook": "facebook.com/player",
    "twitter": "@player"
  },
  "agree_code_of_conduct": true,
  "agree_community_guidelines": true,
  "agree_ranking_rules": true,
  "agree_fair_play": true,
  "team_club_affiliation": "NYC Pickleball Club",
  "emergency_contact_name": "John Doe",
  "emergency_contact_phone": "+1234567890",
  "medical_conditions": "None"
}
```

**Field Values:**

**skill_level:**
- `beginner`
- `intermediate`
- `advanced`
- `professional`

**play_frequency:**
- `casual`
- `regular_1_2` (1-2x/week)
- `frequent_3_4` (3-4x/week)
- `competitive`

**primary_position:**
- `none_mix`
- `dinking_net`
- `aggressive_baseline`
- `both`

**tournament_participation:**
- `never`
- `local`
- `regional`
- `national`

**preferred_court_type:**
- `indoor`
- `outdoor`
- `either`

**preferred_match_format:**
- `singles`
- `doubles`
- `both`

**availability_days (array):**
- `weekdays`
- `weekends`
- `flexible`

**preferred_time_slots (array):**
- `morning`
- `afternoon`
- `evening`
- `night`

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": { /* updated profile */ },
    "completion_percentage": 85,
    "is_complete": true
  }
}
```

---

### **3. Upload Profile Photo**

```
POST /api/player/profile/photo
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Description:** Upload a profile photo for the player.

**Form Data:**
```
photo: [image file]
```

**Validation:**
- File must be an image (jpeg, png, jpg, gif)
- Maximum size: 2MB

**Response (200):**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "photo_url": "http://localhost:8000/storage/profile-photos/abc123.jpg",
    "photo_path": "profile-photos/abc123.jpg"
  }
}
```

---

### **4. Get Profile Completion Status**

```
GET /api/player/profile/completion
Authorization: Bearer {token}
```

**Description:** Get the profile completion percentage and missing fields.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "completion_percentage": 85,
    "profile_status": "complete",
    "has_profile": true,
    "is_complete": true,
    "missing_required_fields": [],
    "missing_optional_fields": ["medical_conditions"]
  }
}
```

**Response (200 - No Profile Yet):**
```json
{
  "success": true,
  "data": {
    "completion_percentage": 0,
    "profile_status": "incomplete",
    "has_profile": false,
    "missing_required_fields": [
      "date_of_birth",
      "location_city",
      "skill_level",
      "play_frequency",
      "all_agreements"
    ]
  }
}
```

---

### **5. Delete Player Profile**

```
DELETE /api/player/profile
Authorization: Bearer {token}
```

**Description:** Delete the player profile (including photo).

**Response (200):**
```json
{
  "success": true,
  "message": "Profile deleted successfully"
}
```

---

## 📋 **Profile Completion Requirements**

### **Required Fields (Must Complete):**

1. **date_of_birth** - Player's date of birth
2. **location_city** - City location
3. **skill_level** - One of: beginner, intermediate, advanced, professional
4. **play_frequency** - One of: casual, regular_1_2, frequent_3_4, competitive

### **Required Agreements (All Must Be True):**

1. **agree_code_of_conduct** - Code of Conduct
2. **agree_community_guidelines** - Community Guidelines
3. **agree_ranking_rules** - Ranking Rules
4. **agree_fair_play** - Fair Play Standards

### **Profile Status:**

- **incomplete** - Missing required fields or agreements
- **complete** - All requirements met, profile fully filled
- **verified** - Admin verified (future feature)

---

## 🧪 **Testing with PowerShell**

### **1. Get Your Profile**

```powershell
$token = "your_token_here"

Invoke-RestMethod -Uri "http://localhost:8000/api/player/profile" `
  -Method GET `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
  }
```

### **2. Create/Update Profile**

```powershell
$token = "your_token_here"

$body = @{
    date_of_birth = "1990-05-15"
    location_city = "New York"
    skill_level = "intermediate"
    years_playing = 3
    play_frequency = "regular_1_2"
    primary_position = "both"
    bio = "Love playing pickleball!"
    agree_code_of_conduct = $true
    agree_community_guidelines = $true
    agree_ranking_rules = $true
    agree_fair_play = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/player/profile" `
  -Method PUT `
  -Body $body `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
  }
```

### **3. Get Completion Status**

```powershell
$token = "your_token_here"

Invoke-RestMethod -Uri "http://localhost:8000/api/player/profile/completion" `
  -Method GET `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
  }
```

### **4. Upload Profile Photo**

```powershell
$token = "your_token_here"
$photoPath = "C:\path\to\photo.jpg"

$headers = @{
    "Authorization" = "Bearer $token"
}

$form = @{
    photo = Get-Item -Path $photoPath
}

Invoke-RestMethod -Uri "http://localhost:8000/api/player/profile/photo" `
  -Method POST `
  -Headers $headers `
  -Form $form
```

---

## 💡 **Usage Examples**

### **Create Minimal Profile**

```json
PUT /api/player/profile

{
  "date_of_birth": "1990-05-15",
  "location_city": "New York",
  "skill_level": "intermediate",
  "play_frequency": "regular_1_2",
  "agree_code_of_conduct": true,
  "agree_community_guidelines": true,
  "agree_ranking_rules": true,
  "agree_fair_play": true
}
```

This creates a complete profile with minimum required fields.

---

### **Add Playing Details**

```json
PUT /api/player/profile

{
  "years_playing": 3,
  "primary_position": "both",
  "tournament_participation": "local",
  "certifications": "USAPA Level 2",
  "preferred_court_type": "outdoor",
  "preferred_match_format": "doubles"
}
```

---

### **Set Availability**

```json
PUT /api/player/profile

{
  "availability_days": ["weekdays", "weekends"],
  "preferred_time_slots": ["morning", "evening"]
}
```

---

### **Add Social Links**

```json
PUT /api/player/profile

{
  "bio": "Passionate pickleball player from NYC",
  "social_links": {
    "instagram": "@pickleballpro",
    "facebook": "facebook.com/pickleballplayer",
    "youtube": "youtube.com/channel/abc123"
  }
}
```

---

## 🔐 **Role Application Requirements**

### **COACH Application Requirements:**

To apply for COACH role, profile must have:
- ✅ Profile status: `complete`
- ✅ Skill level: `advanced` or `professional`
- ✅ Years playing: `2` or more
- ✅ Tournament participation: `local`, `regional`, or `national`
- ✅ Certifications: Must have some certifications

### **COURT_OWNER Application Requirements:**

To apply for COURT_OWNER role, profile must have:
- ✅ Profile status: `complete`
- ✅ Business verification (future feature)
- ✅ Court ownership proof (future feature)

---

## 📝 **Next Steps for Full Implementation**

### **1. Role Application System**

Create endpoints for users to apply for roles:

```php
POST /api/apply/coach
POST /api/apply/court-owner
GET /api/admin/applications        // Admin only
PUT /api/admin/applications/{id}/approve  // Admin only
PUT /api/admin/applications/{id}/reject   // Admin only
```

### **2. Profile Verification**

Allow admins to verify profiles:

```php
PUT /api/admin/profiles/{id}/verify
```

### **3. Profile Search**

Allow searching/filtering profiles:

```php
GET /api/player/profiles?skill_level=advanced&location=NYC
```

---

## 🎨 **Frontend Integration**

### **Create Player Profile Form**

You can create a multi-step form in your frontend:

**Step 1: Basic Information**
- Date of Birth
- Location/City

**Step 2: Playing Profile**
- Skill Level
- Years Playing
- Play Frequency
- Primary Position

**Step 3: Experience**
- Tournament Participation
- Certifications
- Achievements

**Step 4: Preferences**
- Court Type
- Match Format
- Availability
- Time Slots

**Step 5: Profile Details**
- Bio
- Profile Photo
- Social Links

**Step 6: Agreements**
- All 4 required agreements

---

## ✅ **Summary**

**Player Profile System: 100% Complete!**

You now have:
- ✅ Database table with all fields
- ✅ PlayerProfile model with helper methods
- ✅ Complete API endpoints for CRUD operations
- ✅ Photo upload functionality
- ✅ Completion tracking
- ✅ Validation and security
- ✅ Ready for frontend integration

---

**🎉 The player profile API is ready to use! You can now build the frontend form to collect player information!**
