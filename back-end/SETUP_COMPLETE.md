# ✅ Laravel Backend Setup Complete!

## 🎉 Configuration Summary

Your Laravel 12 backend has been fully configured for **PicklePlay** with Supabase and Next.js integration!

---

## ✅ What's Been Configured

### 1. **Database - Supabase (PostgreSQL)** ✅
- Connection: PostgreSQL
- Host: `db.bbhowjpozordxxnfloif.supabase.co`
- Database: `postgres`
- SSL Mode: `require`

### 2. **API Routes** ✅
- API routes file created: `routes/api.php`
- Available endpoints:
  - `GET /api/health` - Health check endpoint
  - `GET /api/user` - Get authenticated user (requires Sanctum auth)
  - `GET /sanctum/csrf-cookie` - CSRF token for SPA authentication

### 3. **CORS Configuration** ✅
- Configured to allow requests from Next.js frontend
- Frontend URL: `http://localhost:3000`
- Supports credentials and proper headers

### 4. **Laravel Sanctum** ✅
- Installed and configured for API authentication
- Supports token-based authentication
- Configured for SPA (Single Page Application) authentication
- Stateful domains configured for localhost

---

## 🚀 How to Start Your Backend

### Start the Laravel Server

```bash
cd back-end
php artisan serve
```

Your API will be available at: **http://localhost:8000**

### Test Your API

1. **Health Check**
   ```bash
   curl http://localhost:8000/api/health
   ```
   
   Response:
   ```json
   {
     "status": "ok",
     "message": "PicklePlay API is running",
     "timestamp": "2026-01-23T..."
   }
   ```

2. **Test from Next.js Frontend**
   
   In your Next.js app (`frontend/`), you can now make API calls:
   
   ```typescript
   // Example API call from Next.js
   const response = await fetch('http://localhost:8000/api/health');
   const data = await response.json();
   console.log(data);
   ```

---

## 📁 Project Structure

```
back-end/
├── app/
│   ├── Http/
│   │   ├── Controllers/          # Your API controllers
│   │   └── Middleware/
│   │       └── HandleCors.php    # CORS middleware
│   └── Models/                   # Database models
│       └── User.php
├── config/
│   ├── database.php              # Database config
│   └── sanctum.php               # Sanctum config
├── database/
│   ├── migrations/               # Database migrations
│   └── seeders/                  # Database seeders
├── routes/
│   ├── api.php                   # API routes ✅
│   └── web.php                   # Web routes
└── .env                          # Environment config (Supabase credentials)
```

---

## 🔑 Environment Variables

Your `.env` file has been configured with:

```env
APP_NAME=PicklePlay
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

# Supabase Database
DB_CONNECTION=pgsql
DB_HOST=db.bbhowjpozordxxnfloif.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=PicklePlay@123_
DB_SSLMODE=require

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
```

---

## 🛠️ Next Steps - Building Your API

### 1. Create Your First Controller

```bash
# Create a Courts controller
php artisan make:controller Api/CourtController --api
```

### 2. Create Database Models

```bash
# Create Court model with migration
php artisan make:model Court -m

# Create Booking model with migration
php artisan make:model Booking -m
```

### 3. Run Migrations

When you're ready to create tables in Supabase:

```bash
php artisan migrate
```

### 4. Define API Routes

Edit `routes/api.php`:

```php
use App\Http\Controllers\Api\CourtController;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('/courts', [CourtController::class, 'index']);
    Route::get('/courts/{id}', [CourtController::class, 'show']);
    
    // Protected routes (requires authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/courts', [CourtController::class, 'store']);
        Route::put('/courts/{id}', [CourtController::class, 'update']);
        Route::delete('/courts/{id}', [CourtController::class, 'destroy']);
    });
});
```

---

## 🔐 Authentication Setup

### For Token-Based Authentication (Mobile/API)

1. **Create Auth Controller**
   ```bash
   php artisan make:controller Api/AuthController
   ```

2. **Add Login/Register Routes**
   ```php
   // In routes/api.php
   Route::post('/register', [AuthController::class, 'register']);
   Route::post('/login', [AuthController::class, 'login']);
   Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
   ```

### For SPA Authentication (Next.js)

Your Next.js frontend can use Sanctum's cookie-based authentication:

1. **Get CSRF Token**
   ```typescript
   await fetch('http://localhost:8000/sanctum/csrf-cookie', {
     credentials: 'include'
   });
   ```

2. **Login**
   ```typescript
   await fetch('http://localhost:8000/api/login', {
     method: 'POST',
     credentials: 'include',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ email, password })
   });
   ```

---

## 📊 Working with Supabase

Your Laravel app is now connected to Supabase (PostgreSQL). You can:

1. **Run Migrations** to create tables in Supabase
   ```bash
   php artisan migrate
   ```

2. **Use Eloquent ORM** to interact with your database
   ```php
   $courts = Court::all();
   $court = Court::find($id);
   Court::create($data);
   ```

3. **View Your Data** in Supabase Dashboard
   - Go to: https://supabase.com/dashboard
   - Navigate to: Table Editor
   - See tables created by Laravel migrations

---

## 🧪 Testing Your API

### Using PHP Artisan Tinker

```bash
php artisan tinker

# Test database connection
DB::connection()->getPdo();

# Create a test user
User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => bcrypt('password')
]);
```

### Using cURL

```bash
# Health check
curl http://localhost:8000/api/health

# Get all courts (example, after creating the endpoint)
curl http://localhost:8000/api/v1/courts
```

### Using Postman or Thunder Client

1. Import your API base URL: `http://localhost:8000`
2. Test endpoints with proper headers
3. Use Bearer token for authenticated routes

---

## 📝 Common Commands

```bash
# Start server
php artisan serve

# Create controller
php artisan make:controller Api/YourController

# Create model with migration
php artisan make:model YourModel -m

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Create seeder
php artisan make:seeder YourSeeder

# Run seeders
php artisan db:seed

# Clear all caches
php artisan optimize:clear

# View routes
php artisan route:list

# Run tests
php artisan test
```

---

## 🔗 Connect Frontend to Backend

In your Next.js frontend (`frontend/`), create an API client:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchCourts() {
  const response = await fetch(`${API_BASE_URL}/api/v1/courts`);
  return response.json();
}

export async function createBooking(data: any) {
  const response = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // if using token auth
    },
    credentials: 'include', // if using SPA auth
    body: JSON.stringify(data)
  });
  return response.json();
}
```

Add to `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📚 Resources

- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel Sanctum Documentation](https://laravel.com/docs/12.x/sanctum)
- [Laravel API Resources](https://laravel.com/docs/12.x/eloquent-resources)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 🎯 Your Setup

- ✅ **Backend**: Laravel 12 (PHP 8.4.16)
- ✅ **Database**: Supabase (PostgreSQL)
- ✅ **Frontend**: Next.js 16 (React)
- ✅ **Authentication**: Laravel Sanctum
- ✅ **CORS**: Configured for Next.js

**Everything is ready to start building your PicklePlay API!** 🚀
