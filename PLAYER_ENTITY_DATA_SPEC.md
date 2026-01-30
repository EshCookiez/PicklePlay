# Player Entity Data Specification

This document outlines all the data fields currently implemented for the **PicklePlay Player Directory**. Use this as a reference to decide which fields to expose, which to make mandatory, and what additional data points we should track.

## 1. Core Interface Definition
Implemented in: `frontend/src/services/playerService.ts`

```typescript
export interface PlayerStats {
  // Identification & Identity
  id: string;               // Unique UUID
  name: string;             // Full display name
  avatar_url?: string;      // URL to profile image/avatar
  gender?: string;          // MALE / FEMALE / OTHER
  age: number;              // Current age
  
  // Location & Identity
  location: string;         // City, Province (e.g., "Makati, PH")
  resides?: string;         // Current residence (often same as location)
  
  // Competitive Metadata
  rank: number;             // Internal or Global rank
  title?: string;           // Display title (e.g., "TOUR PRO", "RISING STAR")
  level: string;            // Skill tier (Pro, Advanced, Intermediate, Beginner)
  
  // Official Ratings (DUPR)
  dupr_id?: string;         // Official DUPR ID (e.g., "V8DYL8")
  dupr_rating?: number;     // Official DUPR Rating (decimals like 7.22)
  rating: number;           // General rating (fallback for non-DUPR users)
  
  // Physical & Technical Profile
  dominant_hand?: string;   // Right-Handed / Left-Handed
  height?: string;          // e.g., "6'1\" / 185 cm"
  weight?: string;          // e.g., "185 lbs"
  specialty?: string;       // Key playing strength (e.g., "Aggressive baseline play")
  
  // Career Statistics
  games_played: number;     // Total career matches
  wins: number;             // Total wins
  losses: number;           // Total losses
  win_rate: number;         // Percentage calculated (Wins / Total)
  recent_performance?: string; // Summary string (e.g., "8-2 in last 10")
  
  // External Connections
  social_links?: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
  };
  
  // Match History (Relational)
  recent_games?: Array<{
    date: string;
    opponent: string;
    result: 'W' | 'L';
    score: string;
    points?: number;        // Ranking points gained/lost
  }>;
}
```

## 2. Example Data Entry (High Fidelity)
This demonstrates how a "Pro" player is currently structured in the mock data.

```json
{
  "id": "1",
  "name": "Ben Johns",
  "age": 26,
  "location": "Florida, USA",
  "rank": 1,
  "level": "Pro",
  "title": "TOUR PRO",
  "dupr_id": "V8DYL8",
  "dupr_rating": 7.22,
  "dominant_hand": "Right-Handed",
  "height": "6'1\" / 185 cm",
  "turned_pro": "2016",
  "resides": "FLORIDA",
  "social_links": {
    "instagram": "https://instagram.com/benjohns",
    "youtube": "https://youtube.com/@benjohns"
  },
  "recent_games": [
    { "date": "Jan 28", "opponent": "Sofia Cruz", "result": "W", "score": "11-8, 11-9", "points": 15 }
  ]
}
```

## 3. Implementation Recommendations

### Data Sourcing (Supabase)
Since you are using **Supabase Direct Connect**, ensure your tables are structured to support these:
1.  **`profiles` table**: Store `name`, `avatar_url`, `gender`, `location`.
2.  **`player_profiles` table**: Store `dupr_id`, `turned_pro`, `dominant_hand`, `height`, `specialty`.
3.  **`user_statistics` table**: Store `wins`, `losses`, `games_played`, `win_rate` (can be a view or calculated).

### Proposed Additional Fields
Based on your MLP and Pickleball.com research, we could add:
- **`paddle`**: Brand/Model of paddle used (MLP often displays this).
- **`medals`**: Array of objects for Gold/Silver/Bronze counts.
- **`sponsors`**: Array of strings for corporate sponsors.
- **`pro_tour`**: Which tour they primarily play on (PPA, APP, MLP).
- **`verified`**: Boolean flag to show a checkmark for official pro players.

---
**Next Step**: Let me know which of these you want to keep as "required" in the form when a player builds their profile!
