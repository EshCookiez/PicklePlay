# PicklePlay - Your New Pickleball Playground 🎾

A comprehensive pickleball court booking platform with web, mobile, and backend API.

---

## 🏗️ Project Structure

```
PicklePlay/
├── back-end/          # Laravel 12 API Backend ✅
├── frontend/          # Next.js Web Application
└── mobile/            # React Native Mobile App
```

---

## 📦 Technology Stack

### Backend (Laravel 12)
- **Framework**: Laravel 12.48.1
- **Language**: PHP 8.4.16
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Laravel Sanctum
- **API**: RESTful API with CORS enabled

### Frontend (Next.js)
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Library**: React 19
- **Maps**: Leaflet with React-Leaflet

### Mobile (React Native)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Context

---

## 🚀 Getting Started

### 1. Backend Setup (Laravel)

```bash
# Navigate to backend
cd back-end

# Start Laravel server
php artisan serve
```

Server runs at: **http://localhost:8000**

✅ **Backend is fully configured with:**
- Supabase (PostgreSQL) connection
- API routes at `/api/*`
- CORS enabled for frontend
- Laravel Sanctum authentication

📖 **Backend Documentation**: See `back-end/SETUP_COMPLETE.md`

### 2. Frontend Setup (Next.js)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

App runs at: **http://localhost:3000**

### 3. Mobile Setup (React Native)

```bash
# Navigate to mobile
cd mobile/pickleplay

# Install dependencies
npm install

# Start Expo
npm start
```

---

## 🔗 API Integration

The Next.js frontend is configured to connect to the Laravel backend.

**API Base URL**: `http://localhost:8000`

### Example API Call:

```typescript
// Health check
const response = await fetch('http://localhost:8000/api/health');
const data = await response.json();

// Response:
// {
//   "status": "ok",
//   "message": "PicklePlay API is running",
//   "timestamp": "..."
// }
```

---

## 📋 Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health check |
| GET | `/api/user` | Get authenticated user |
| GET | `/sanctum/csrf-cookie` | Get CSRF token |

---

## 🗄️ Database

**Provider**: Supabase
**Type**: PostgreSQL
**Status**: ✅ Configured

### Run Migrations

```bash
cd back-end
php artisan migrate
```

---

## 🔐 Authentication

Using **Laravel Sanctum** for API authentication:
- Token-based auth for mobile apps
- Cookie-based auth for Next.js SPA

---

## 🛠️ Development

### Backend Commands

```bash
cd back-end

# View routes
php artisan route:list

# Create controller
php artisan make:controller Api/CourtController

# Create model with migration
php artisan make:model Court -m

# Run migrations
php artisan migrate
```

### Frontend Commands

```bash
cd frontend

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Mobile Commands

```bash
cd mobile/pickleplay

# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## 📚 Documentation

- **Backend Setup**: `back-end/SETUP_COMPLETE.md`
- **Quick Start**: `back-end/QUICK_START.md`
- **Frontend**: `frontend/README.md`
- **Mobile**: `mobile/pickleplay/README.md`

---

## 🌐 Ports

- **Backend API**: http://localhost:8000
- **Frontend Web**: http://localhost:3000
- **Mobile**: Expo Dev Server

---

## ✅ Setup Checklist

- [x] Laravel 12 backend installed
- [x] Supabase database configured
- [x] API routes created
- [x] CORS configured
- [x] Sanctum authentication installed
- [x] Next.js frontend ready
- [x] React Native mobile app ready

---

## 🎯 Next Steps

1. **Define your database schema** in `back-end/database/migrations/`
2. **Create API controllers** for courts, bookings, users
3. **Build frontend pages** to consume the API
4. **Implement authentication** flow
5. **Deploy** to production

---

## 📖 Resources

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Supabase Documentation](https://supabase.com/docs)

---

**Happy Coding!** 🚀
