# Court Listing Feature - Quick Reference

## 🎯 What We Built

A complete court discovery system where users can browse, search, filter, and view pickleball courts with real-time distance calculations.

## 📁 New Files Created (6 files)

### Components
1. **CourtCard.tsx** - Beautiful court card with image, price, rating, distance
2. **CourtFiltersSidebar.tsx** - Advanced filters (location, price, type, rating, free)

### Pages  
3. **courts/page.tsx** - Main listing page with grid/list view, pagination
4. **courts/[id]/page.tsx** - Detailed court view with gallery, contact, booking

### Utilities
5. **types/court.ts** - Type definitions for filters and court with distance
6. **lib/geolocation.ts** - Distance calculation, user location, formatting

## 📄 Files Modified (1 file)

- **courts/page.tsx** - Replaced 1109 lines of mock data with real implementation
  - Backup saved as: `page-old-backup.tsx`

## ✨ Key Features

### Court Listing Page (`/courts`)
- ✅ **Real Data**: Fetches from Supabase (9 courts from database)
- ✅ **Geolocation**: "Courts Near You" section with closest 3 courts
- ✅ **Filters**: City, Type (indoor/outdoor), Price range, Rating, Free courts
- ✅ **Search**: By court name, address, description
- ✅ **Views**: Grid (3 columns) or List view toggle
- ✅ **Pagination**: 12 courts per page with page numbers
- ✅ **Loading**: Skeleton loaders instead of spinners
- ✅ **Empty State**: Clear all filters button when no results

### Court Card Component
- ✅ **Image**: Cover photo or fallback icon
- ✅ **Badges**: Featured (yellow) + Verified (green)
- ✅ **Price**: ₱XXX/hr or "Free" in green
- ✅ **Rating**: Stars + review count
- ✅ **Distance**: Shows "X km away" from user
- ✅ **Details**: Location, court count, type
- ✅ **Amenities**: Icons for lights, parking, equipment, etc.
- ✅ **Favorite**: Heart icon (toggle state)
- ✅ **Hover Effect**: Card lifts and scales on hover

### Court Details Page (`/courts/:id`)
- ✅ **Gallery**: Image carousel with thumbnails
- ✅ **Full Info**: Description, amenities, operating hours
- ✅ **Contact**: Address, phone, email, website with clickable links
- ✅ **Actions**: 
  - Book Now (placeholder)
  - Message Owner (placeholder)
  - Get Directions (opens Google Maps)
  - Favorite & Share buttons
- ✅ **Pricing**: Regular + peak hour prices
- ✅ **Distance**: From user location

### Filters Sidebar
- ✅ **Mobile Responsive**: Drawer on mobile, sidebar on desktop
- ✅ **Search Bar**: Searches name, address, description
- ✅ **Location**: Dropdown with all cities (Metro Manila, Cebu, Davao, etc.)
- ✅ **Court Type**: Indoor, Outdoor, Both
- ✅ **Price Range**: Min/Max inputs
- ✅ **Free Toggle**: Show only free courts
- ✅ **Rating**: Minimum rating filter (4.5+, 4.0+, 3.5+, 3.0+)
- ✅ **Active Count**: Badge showing number of active filters
- ✅ **Clear All**: Reset all filters button

## 🎨 UI/UX Highlights

### Design
- **Colors**: Blue primary, Green for free, Yellow for featured
- **Cards**: White background, subtle borders, rounded corners
- **Hover**: Smooth lift animation, scale transform
- **Typography**: Bold headings, clear hierarchy
- **Icons**: Lucide icons throughout
- **Badges**: Pill-shaped with contrasting colors

### Responsive
- **Mobile**: Single column, drawer filters, touch-friendly
- **Tablet**: 2 columns, collapsible sidebar
- **Desktop**: 3 columns, sticky sidebar

### Performance
- **Pagination**: Only 12 courts loaded at once
- **Lazy Images**: Images load on-demand
- **Skeleton Loaders**: Instant perceived performance
- **Distance Calc**: Memoized, recalculates only on data change

## 📊 Real Data Integration

### Database Schema Used
```typescript
Court {
  id, name, description, type, surface
  address, city, state_province, country
  latitude, longitude
  number_of_courts
  amenities[] // ["lights", "parking", "equipment", "restrooms"]
  hours_of_operation {} // { monday: "6am-10pm", ... }
  is_free, price_per_hour, peak_hour_price
  phone_number, email, website
  images[], cover_image
  status // 'approved' | 'pending' | 'rejected'
  rating, total_reviews
  is_featured, is_active
}
```

### Current Data (from CSV)
- **9 courts total**:
  - 5 approved (SM Aura ₱650/hr, BGC Free, Makati ₱550/hr, QC Free, Davao ₱450/hr, Subic ₱850/hr)
  - 2 pending (Cebu ₱750/hr, Iloilo ₱400/hr)
  - 1 rejected (test court)

### Filters Applied
- Default: `status: 'approved'` (only show verified courts)
- Users can filter by: city, type, price range, rating, free

## 🔄 Data Flow

### Listing Page
```
1. Component mounts
2. Request user location (browser API)
3. Fetch courts: courtService.getCourts({ status: 'approved', page: 1, limit: 12, ...filters })
4. Calculate distance for each court (if location available)
5. Display "Nearby Courts" (top 3 by distance)
6. Display paginated grid with filters
7. User interacts → Update filters → Re-fetch → Update display
```

### Details Page
```
1. Navigate to /courts/:id
2. Request user location
3. Fetch court: courtService.getCourt(id)
4. Calculate distance from user
5. Display full court information
6. User clicks actions (book, message, directions)
```

## 🛠️ Technical Stack

- **Frontend**: Next.js 14 App Router, TypeScript, React
- **UI Library**: Shadcn UI (button, input, select, skeleton)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Maps**: Haversine formula (Mapbox planned for Phase 2)
- **State**: React hooks (useState, useEffect, useMemo)
- **Icons**: Lucide React

## 🚀 How to Use

### As a Developer
1. Data is fetched automatically from Supabase
2. Filters work client-side and server-side
3. Geolocation is requested on page load (optional)
4. Distance is calculated using Haversine formula
5. All components are fully typed with TypeScript

### As a User
1. Visit `/courts` to browse all courts
2. Allow location access to see nearby courts
3. Use filters to narrow down options
4. Click a court card to view details
5. Book, message, or get directions

## 📝 Next Steps

### Phase 2: Map Integration
- [ ] Install Mapbox GL JS
- [ ] Add map view toggle
- [ ] Display court markers
- [ ] Sync map with filters

### Phase 3: Booking System
- [ ] Design booking flow
- [ ] Calendar with availability
- [ ] Payment integration (Xendit)
- [ ] Confirmation emails

### Phase 4: Reviews & Ratings
- [ ] Review submission form
- [ ] Rating system (1-5 stars)
- [ ] Display reviews on details page

## 🐛 Known TODOs

1. **Favorite API**: Button works but doesn't save to database yet
2. **Book Now**: Placeholder - needs booking modal/flow
3. **Message Owner**: Placeholder - needs chat system
4. **Map View**: Not implemented yet (Mapbox)
5. **Reviews**: Not implemented yet

## 📦 Dependencies Used

Existing (no new installs needed):
- `@supabase/supabase-js` - Database queries
- `lucide-react` - Icons
- `next/image` - Optimized images
- `next/navigation` - Routing
- Shadcn UI components

## ✅ Quality Checks

- [x] TypeScript - No errors
- [x] Responsive - Mobile, tablet, desktop
- [x] Performance - Pagination, lazy loading
- [x] Accessibility - Semantic HTML, focus states
- [x] Error Handling - Empty states, loading states
- [x] Code Quality - Clean, documented, typed

---

**Status**: ✅ Core Listing COMPLETE
**Lines of Code**: ~1,500 lines (6 new files)
**Time to Implement**: ~2 hours
**Ready for Testing**: Yes
