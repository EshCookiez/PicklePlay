# Quick Reference: Skeleton Loaders

## 🎯 What Changed
All loading spinners → Skeleton loaders throughout the app

---

## 📦 Skeleton Component Library

Located in: `src/components/ui/skeleton.tsx`

### Components Available

```tsx
// Base skeleton element
import Skeleton from "@/components/ui/skeleton";
<Skeleton className="h-4 w-3/4" />

// Pre-built skeletons
import {
  SkeletonCard,      // Card layout with 3 lines
  SkeletonText,      // Multi-line text (customizable)
  SkeletonAvatar,    // Circular avatar
  SkeletonTable,     // Table rows & columns
  SkeletonButton,    // Button-sized skeleton
  SkeletonInput,     // Input field skeleton
  SkeletonProfile    // Full profile section
} from "@/components/ui/skeleton";
```

---

## 🔄 Updated Components

| Component | Before | After | File |
|-----------|--------|-------|------|
| ProtectedRoute | Spinning SVG | SkeletonProfile | `src/components/ProtectedRoute.tsx` |
| UserManagement | Spinner icon + text | SkeletonTable (5 rows) | `src/components/admin/UserManagement.tsx` |
| CourtManagement | Spinning circle | SkeletonTable (4 rows) | `src/components/admin/CourtManagement.tsx` |
| AllPhilippinesCourtsView | Custom loader | Skeleton (full size) | `src/components/AllPhilippinesCourtsView.tsx` |
| Philippines Courts | Custom loader | Skeleton (full size) | `src/pages/philippines-courts.tsx` |
| AuthModal | (Prepared for future) | Ready | `src/components/AuthModal.tsx` |

---

## 💻 Usage Examples

### Basic Loading Table
```tsx
import { SkeletonTable } from "@/components/ui/skeleton";

{loading && <SkeletonTable rows={5} cols={6} />}
```

### Basic Loading Profile
```tsx
import { SkeletonProfile } from "@/components/ui/skeleton";

{loading && <SkeletonProfile />}
```

### Custom Skeleton
```tsx
import Skeleton from "@/components/ui/skeleton";

{loading && (
  <div className="space-y-3">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-8 w-5/6" />
    <Skeleton className="h-4 w-3/4" />
  </div>
)}
```

### Multiple Text Lines
```tsx
import { SkeletonText } from "@/components/ui/skeleton";

{loading && <SkeletonText lines={4} />}
```

---

## 🎨 Styling

### Default Colors
- **Background:** `bg-slate-200` (light gray)
- **Animation:** `animate-pulse` (Tailwind)

### Custom Sizing
```tsx
// Wide and tall
<Skeleton className="h-64 w-full" />

// Small and square
<Skeleton className="h-8 w-8" />

// Circular (avatar)
<Skeleton className="h-12 w-12 rounded-full" />
```

### With Spacing
```tsx
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-5/6" />
  <Skeleton className="h-4 w-4/5" />
</div>
```

---

## 📋 Pre-Built Sizes

### SkeletonTable
```tsx
<SkeletonTable rows={5} cols={4} />
// Creates 5 rows with 4 columns each
```

### SkeletonText
```tsx
<SkeletonText lines={3} />
// Creates 3 lines of text skeletons
```

### SkeletonProfile
```tsx
<SkeletonProfile />
// Shows: Avatar + Name + Description
```

---

## 🚀 Benefits

✅ **Better UX** - Shows content structure before loading
✅ **Professional** - Modern loading pattern
✅ **Smooth** - Gentle pulse animation
✅ **Reusable** - Pre-built components for common layouts
✅ **Easy** - Simple imports and props
✅ **Consistent** - Same look and feel everywhere

---

## 🔧 How to Add to Your Component

### Step 1: Import
```tsx
import { SkeletonTable } from "@/components/ui/skeleton";
```

### Step 2: Check Loading State
```tsx
const [loading, setLoading] = useState(true);
```

### Step 3: Replace Spinner
```tsx
// Before
{loading && <Spinner />}

// After
{loading && <SkeletonTable rows={5} cols={4} />}
```

---

## 📁 File Structure

```
src/components/ui/
├── skeleton.tsx          ← Main skeleton component
├── button.tsx
├── input.tsx
├── dialog.tsx
└── ... (other UI components)
```

---

## 🎬 Animation

All skeletons use Tailwind's `animate-pulse`:
```
50% opacity → 100% opacity → 50% opacity (repeats)
```

Creates a smooth, gentle pulsing effect.

---

## 🧪 Testing

To test the skeleton loaders:

1. Open browser DevTools Network tab
2. Set network speed to "Slow 3G" or "Throttle"
3. Load page and observe skeleton animations
4. Verify smooth pulse effect
5. Check skeleton matches content shape

---

## 🎯 Common Use Cases

### Admin Dashboard Loading
```tsx
{loading && <SkeletonTable rows={5} cols={6} />}
```

### Profile Page Loading
```tsx
{loading && <SkeletonProfile />}
```

### Card Content Loading
```tsx
{loading && <SkeletonCard />}
```

### Map Loading
```tsx
{loading && <Skeleton className="h-[600px] w-full" />}
```

### Text Content Loading
```tsx
{loading && <SkeletonText lines={3} />}
```

---

## 📚 Documentation

For complete documentation, see:
- `SKELETON_LOADERS_SUMMARY.md` - Detailed guide

---

## ✨ Summary

**All loading states have been upgraded to skeleton loaders!**

The new system is:
- ✅ More professional
- ✅ Better UX
- ✅ Easier to use
- ✅ Fully typed
- ✅ Customizable

Start using it in your components today! 🚀
