# shadcn/ui Setup Guide for PicklePlay

## ✅ Initialization Complete!

Your project has been successfully initialized with shadcn/ui. Here's what was set up:

### Files Created:
- `components.json` - Configuration file
- `src/lib/utils.ts` - Utility functions
- `src/components/ui/` - Component directory (will be populated as we add components)

### Configuration:
- **Style**: New York
- **Icon Library**: lucide (already using this!)
- **Tailwind CSS**: Configured with Tailwind v4
- **Base Color**: Customized to PicklePlay brand colors
  - Primary: `#0a56a7` (Deep Blue)
  - Accent: `#a3ff01` (Lime Green)

---

## 📦 How to Add Components

Run this command to add any component:

```bash
npx shadcn add <component-name>
```

Example:
```bash
npx shadcn add button
npx shadcn add input
npx shadcn add dialog
```

---

## 🚀 Next Steps - Recommended Installation Order

### Phase 1 - IMMEDIATE (This Week)
Add these core components that you'll use everywhere:

```bash
# Form & Input Components
npx shadcn add button
npx shadcn add input
npx shadcn add select
npx shadcn add label

# Modals & Overlays
npx shadcn add dialog
npx shadcn add popover

# Notifications
npx shadcn add toast
npx shadcn add sonner
```

### Phase 2 - SOON (Next Week)
```bash
# Layout & Organization
npx shadcn add card
npx shadcn add tabs
npx shadcn add badge

# Dropdowns & Menus
npx shadcn add dropdown-menu
npx shadcn add command
```

### Phase 3 - COURTS PAGE FEATURES
```bash
# Filtering & Selection
npx shadcn add checkbox
npx shadcn add radio-group
npx shadcn add slider

# Calendar & Date
npx shadcn add calendar
npx shadcn add date-picker
```

### Phase 4 - POLISH & UX
```bash
# Navigation & Breadcrumbs
npx shadcn add breadcrumb
npx shadcn add pagination

# Utilities
npx shadcn add separator
npx shadcn add accordion
npx shadcn add alert
```

---

## 📝 QUICK EXAMPLES

### Using shadcn Button (after installing)

```tsx
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <Button 
      variant="default"
      size="lg"
      className="bg-[#0a56a7]"
    >
      Find Courts
    </Button>
  )
}
```

### Using shadcn Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CourtModal() {
  return (
    <Dialog>
      <DialogTrigger>View Details</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Court Details</DialogTitle>
        </DialogHeader>
        {/* Content */}
      </DialogContent>
    </Dialog>
  )
}
```

### Using shadcn Input with Form

```tsx
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SearchCourt() {
  return (
    <div className="space-y-2">
      <Label htmlFor="search">Search Courts</Label>
      <Input 
        id="search"
        placeholder="Enter court name..."
      />
    </div>
  )
}
```

---

## 🎨 YOUR CUSTOM COLORS ARE READY

All shadcn components automatically use your PicklePlay brand colors:
- **Primary (Blue)**: `#0a56a7` - Used for primary buttons, links, focus states
- **Accent (Lime)**: `#a3ff01` - Used for highlights, CTAs, emphasis

You don't need to manually set colors - they're applied globally!

---

## 🔧 Project Structure

```
frontend/
├── components/
│   ├── ui/                 ← All shadcn components go here
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── src/
│   ├── app/
│   │   ├── globals.css     ← Brand colors defined here
│   │   └── ...
│   └── lib/
│       └── utils.ts        ← Utility functions
├── components.json         ← shadcn config
└── ...
```

---

## 🎯 WHAT TO DO NEXT

1. **Install Phase 1 components** (button, input, select, dialog, popover, toast)
2. **Replace** your custom buttons/inputs with shadcn versions
3. **Update** the courts page to use shadcn components
4. **Test** everything looks good with your brand colors

---

## 📚 Resources

- **shadcn/ui Docs**: https://ui.shadcn.com
- **Component Gallery**: https://ui.shadcn.com/docs/components
- **Customization Guide**: https://ui.shadcn.com/docs/theming
- **Dark Mode Setup**: https://ui.shadcn.com/docs/dark-mode

---

## ❓ Questions or Issues?

Run these to verify setup:
```bash
# Check components.json
cat components.json

# Check globals.css colors
grep "primary\|accent" src/app/globals.css

# List available components
npx shadcn ls
```

---

**Ready to start adding components? Let me know which ones you want first!** 🚀
