# 🎾 Player Profile Testing Guide

## Quick Start - Test in Browser

### 1. **Open Test Page**
```
http://localhost:8000/test-dev.html
```

### 2. **Login or Register**
- If you already have an account, login
- If not, register a new account first

### 3. **Access Player Profile**
Once logged in, you'll see a new button:
- Click **"🎾 Player Profile"** button

---

## 🧪 **What You Can Test**

### ✅ **Profile Creation**
1. Click "Edit Player Profile" button
2. Fill in the form with test data:

**Basic Information:**
- Date of Birth: `1995-08-20`
- Location: `Manila`

**Playing Profile:**
- Skill Level: `Intermediate`
- Years Playing: `2`
- Play Frequency: `Regular (1-2x/week)`
- Primary Position: `Both`

**Experience:**
- Tournament Participation: `Local`
- Certifications: `USAPA Level 2`

**Preferences:**
- Court Type: `Outdoor`
- Match Format: `Doubles`

**Profile Details:**
- Bio: `I love playing pickleball! Looking to improve my game and meet new players.`

**Agreements (ALL REQUIRED):**
- ✓ Check all 4 agreement boxes

**Optional:**
- Team/Club: `Manila Pickleball Club`
- Emergency Contact: `Juan Dela Cruz` / `+639123456789`

3. Click "Save Player Profile"
4. You should see completion percentage increase!

---

### ✅ **Profile Viewing**
After saving, you can:
- See all your profile information organized by sections
- View completion percentage at the top
- See which required fields are missing (if any)

---

### ✅ **Profile Editing**
1. Click "Edit Player Profile" again
2. Modify any fields
3. Click "Save Player Profile"
4. Changes should reflect immediately

---

### ✅ **Completion Tracking**

The system tracks completion based on:

**Required Fields (Must Complete):**
- ✓ Date of Birth
- ✓ Location/City
- ✓ Skill Level
- ✓ Play Frequency

**Required Agreements (All Must Be Checked):**
- ✓ Code of Conduct
- ✓ Community Guidelines
- ✓ Ranking Rules
- ✓ Fair Play

**Profile Status:**
- **0-99%** = Incomplete (missing required fields/agreements)
- **100%** = Complete ✅

---

## 🎯 **Test Scenarios**

### **Scenario 1: New Profile (0%)**
1. Login
2. Click "🎾 Player Profile"
3. Should show "No player profile yet"
4. Completion: **0%**

### **Scenario 2: Minimal Profile (~40%)**
Fill in only required fields:
- Date of Birth
- Location
- Skill Level
- Play Frequency
- All 4 agreements ✓

Expected: Profile should be marked as **Complete** but percentage may be around **40-50%**

### **Scenario 3: Full Profile (100%)**
Fill in ALL fields including:
- All required fields
- All optional fields (bio, certifications, etc.)
- All agreements

Expected: **100% Complete** ✅

---

## 📊 **Visual Feedback**

### **Completion Bar:**
- Black bar shows completion percentage
- Updates in real-time after saving

### **Missing Fields Alert:**
- Shows which required fields are missing
- Example: "⚠️ Missing required: Date of Birth, Location, All Agreements"

### **Profile Display:**
- Organized sections with icons
- "Not set" for empty fields
- Checkmarks (✓/✗) for agreements

---

## 🔄 **Workflow Test**

Complete workflow to test:

1. **Register** → New account
2. **Login** → Get token
3. **View Account** → See user details
4. **Click Player Profile** → Opens profile section
5. **Edit Profile** → Fill form
6. **Save** → Updates profile
7. **View Profile** → See formatted data
8. **Edit Again** → Modify fields
9. **Back to Account** → Return to user details
10. **Logout** → Clear session

---

## 🐛 **Common Issues & Solutions**

### **Issue: "No authentication token found"**
**Solution:** You need to login first before accessing player profile

### **Issue: Profile not updating**
**Solution:** 
- Check browser console for errors
- Make sure Docker containers are running
- Verify token is still valid (not expired)

### **Issue: Completion percentage stuck at 0%**
**Solution:**
- You need to fill required fields: date_of_birth, location_city, skill_level, play_frequency
- You must check all 4 agreement checkboxes

---

## 💡 **Quick Test Commands (PowerShell)**

### **Get Profile Completion:**
```powershell
$token = "your_token_here"

Invoke-RestMethod -Uri "http://localhost:8000/api/player/profile/completion" `
  -Method GET `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
  }
```

### **Create/Update Profile:**
```powershell
$token = "your_token_here"

$profile = @{
    date_of_birth = "1995-08-20"
    location_city = "Manila"
    skill_level = "intermediate"
    play_frequency = "regular_1_2"
    years_playing = 2
    bio = "Love playing pickleball!"
    agree_code_of_conduct = $true
    agree_community_guidelines = $true
    agree_ranking_rules = $true
    agree_fair_play = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/player/profile" `
  -Method PUT `
  -Body $profile `
  -Headers @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
  }
```

---

## ✅ **Expected Results**

### **After Creating Minimal Profile:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "profile": { /* profile data */ },
    "completion_percentage": 45,
    "is_complete": true
  }
}
```

### **After Completing All Fields:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "completion_percentage": 100,
    "is_complete": true
  }
}
```

---

## 🎨 **UI Features to Notice**

1. **Black & White Theme** - Consistent with test-dev.html design
2. **Progress Bar** - Visual completion indicator
3. **Organized Sections** - Info grouped logically
4. **Required Field Indicators** - Shows what's missing
5. **Form Validation** - Frontend + Backend validation
6. **Smooth Transitions** - Between view/edit modes
7. **Back Navigation** - Easy return to account page

---

## 🚀 **Next Steps After Testing**

Once player profiles are working:

1. ✅ Test all CRUD operations
2. ✅ Verify completion tracking
3. ✅ Test form validation
4. Move to implementing:
   - Role Application System (COACH, COURT_OWNER)
   - Profile photo upload
   - Court Management features

---

**🎉 Happy Testing! Your player profile system is ready!**
