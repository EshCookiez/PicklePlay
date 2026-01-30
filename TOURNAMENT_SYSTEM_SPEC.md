# PicklePlay Tournament System Specification

This document contains the complete data structure, schema definitions, and mock entities for the PicklePlay Philippines Tournament System.

## 1. Database Schema (PostgreSQL/Supabase)

### Enums
- `tournament_status`: `upcoming`, `open`, `closed`, `in_progress`, `completed`, `cancelled`
- `sanctioning_body`: `PPA`, `MLP`, `USAP`, `USSP`, `None`
- `event_category`: `singles`, `doubles`, `mixed_doubles`, `coed`

### Table: `tournaments`
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key (auto-gen) |
| `name` | TEXT | Display name of the tournament |
| `slug` | TEXT | URL-friendly unique identifier |
| `description` | TEXT | Markdown supported description |
| `start_date` | DATE | Event start |
| `end_date` | DATE | Event end |
| `registration_start` | TIMESTAMPTZ | When registration opens |
| `registration_end` | TIMESTAMPTZ | When registration closes |
| `cancellation_deadline`| TIMESTAMPTZ| Last day for refunds/withdrawal |
| `location_name` | TEXT | Venue name (e.g., "Philsports Arena") |
| `address` | TEXT | Street address |
| `city` | TEXT | City |
| `state_province` | TEXT | Province/Region |
| `country` | TEXT | Default: "Philippines" |
| `status` | ENUM | Current stage of the tournament |
| `sanctioning_type` | ENUM | Governing body sanction level |
| `base_fee` | DECIMAL | Main registration fee |
| `image_url` | TEXT | Banner image |
| `website_url` | TEXT | External official link |

### Table: `tournament_events` (Brackets/Buckets)
| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary Key |
| `tournament_id` | UUID | Reference to parent tournament |
| `name` | TEXT | e.g. "Men's Doubles 3.5 (19-49)" |
| `category` | ENUM | singles/doubles/etc |
| `gender` | TEXT | 'men', 'women', 'mixed', 'any' |
| `min_skill` | DECIMAL | Skill level requirement start |
| `max_skill` | DECIMAL | Skill level requirement end |
| `min_age` | INTEGER | Age requirement start |
| `max_age` | INTEGER | Age requirement end |
| `format` | TEXT | Round Robin, Double Elim, etc. |
| `fee` | DECIMAL | Additional fee for this specific event |
| `max_teams` | INTEGER | Total capacity |
| `current_teams` | INTEGER | Current registration count |
| `starts_at` | TIMESTAMPTZ | Specific start time for this group |
| `scoring_format` | TEXT | e.g. "Best of 3 to 11" |

---

## 2. Frontend TypeScript Interfaces (`src/types/tournament.ts`)

```typescript
export interface Tournament {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  cancellation_deadline: string | null;
  location_name: string;
  address: string | null;
  city: string;
  state_province: string | null;
  country: string;
  status: 'upcoming' | 'open' | 'closed' | 'in_progress' | 'completed' | 'cancelled';
  sanctioning_type: 'PPA' | 'MLP' | 'USAP' | 'USSP' | 'None';
  base_fee: number;
  image_url: string | null;
  website_url: string | null;
}

export interface TournamentEvent {
  id: string;
  tournament_id: string;
  name: string;
  category: 'singles' | 'doubles' | 'mixed_doubles' | 'coed';
  gender: 'men' | 'women' | 'mixed' | 'any';
  min_skill: number | null;
  max_skill: number | null;
  min_age: number | null;
  max_age: number | null;
  format: string;
  fee: number;
  max_teams: number | null;
  current_teams: number;
  starts_at: string | null;
  scoring_format: string | null;
}
```

---

## 3. Mock Data Samples (Current Logic)

### Sample Tournament Object
```json
{
  "id": "1",
  "name": "Philippine Pickleball Open 2026",
  "slug": "philippine-pickleball-open-2026",
  "description": "The biggest pickleball event in the Philippines. Join hundreds of players...",
  "start_date": "2026-03-15",
  "end_date": "2026-03-17",
  "location_name": "Philsports Arena",
  "city": "Pasig",
  "status": "open",
  "sanctioning_type": "USAP",
  "base_fee": 1500,
  "image_url": "https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&q=80&w=800"
}
```

### Sample Event List
```json
[
  {
    "id": "e1",
    "name": "Men's Doubles 4.0+",
    "category": "doubles",
    "gender": "men",
    "min_skill": 4.0,
    "max_skill": 5.0,
    "format": "round_robin",
    "fee": 500,
    "max_teams": 16,
    "current_teams": 12
  },
  {
    "id": "e2",
    "name": "Mixed Doubles 3.5",
    "category": "mixed_doubles",
    "gender": "mixed",
    "min_skill": 3.5,
    "max_skill": 3.5,
    "format": "double_elimination",
    "fee": 500,
    "max_teams": 24,
    "current_teams": 20
  }
]
```

---

## 4. Current Feature Set
- [x] Tournament Discovery (Listing)
- [x] Search by name or city
- [x] Filter by status (Open, Upcoming, In Progress)
- [x] Hero Banners with Brand Guidelines
- [x] Event schedules inside detail pages
- [x] Automated team count tracking (SQL)
- [x] Sanctioning verification display
- [x] Back navigation navigation

## 5. Potential Future Fields to Add
- `skill_rating_system`: (UTPR, DUPR, or Self-Rated)
- `is_sanctioned`: Boolean
- `refund_policy`: Text
- `accommodation_info`: Text/Link
- `is_invitational`: Boolean
- `ball_type`: Text (e.g. "Franklin X-40")
- `surface_type`: (Indoor, Outdoor, Hardcourt, Acrylic)
