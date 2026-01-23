# 🚀 Quick Start Guide - PicklePlay Backend

## Start Your Server

```bash
cd back-end
php artisan serve
```

Server runs at: **http://localhost:8000**

---

## Test Your API

### Health Check
```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "PicklePlay API is running",
  "timestamp": "..."
}
```

---

## Your API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/health` | Health check | No |
| GET | `/api/user` | Get authenticated user | Yes (Sanctum) |
| GET | `/sanctum/csrf-cookie` | Get CSRF token for SPA | No |

---

## Database Connection

**Provider**: Supabase (PostgreSQL)
**Status**: ✅ Configured

To test connection:
```bash
php artisan tinker
DB::connection()->getPdo();
```

To run migrations:
```bash
php artisan migrate
```

---

## Frontend Integration

**Next.js Frontend Location**: `../frontend/`
**Frontend URL**: `http://localhost:3000`
**CORS**: ✅ Configured

### Example API Call from Next.js:

```typescript
// Fetch from your Laravel API
const response = await fetch('http://localhost:8000/api/health');
const data = await response.json();
console.log(data);
```

---

## Quick Commands

```bash
# View all routes
php artisan route:list

# Create a controller
php artisan make:controller Api/CourtController --api

# Create a model
php artisan make:model Court -m

# Run migrations
php artisan migrate

# Clear caches
php artisan optimize:clear
```

---

## Environment

- **Laravel**: 12.48.1
- **PHP**: 8.4.16
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Laravel Sanctum ✅
- **CORS**: Enabled for Next.js ✅

---

## 📖 Full Documentation

See `SETUP_COMPLETE.md` for detailed documentation.
