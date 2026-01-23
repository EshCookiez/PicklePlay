# ✅ Laravel Installation Complete!

## 🎉 Success!

Laravel 12 has been successfully installed in your `back-end/` directory.

## 📍 Installation Location

```
c:\Users\Andri\Desktop\Files\OJT\PicklePlay\back-end\
```

## ✅ What Was Done

1. ✅ Created Laravel 12 application
2. ✅ Generated `.env` file with application key
3. ✅ Installed NPM dependencies
4. ✅ Built frontend assets (Vite + CSS)
5. ✅ Database configured (SQLite - ready to use)
6. ✅ Migrations ready (run when needed)

## 🚀 Start Your Laravel Server

### Option 1: Run Everything (Recommended)
```bash
cd back-end
composer run dev
```

This starts:
- Laravel server (http://localhost:8000)
- Queue worker
- Log viewer (Pail)
- Vite dev server (for hot reload)

### Option 2: Just the Server
```bash
cd back-end
php artisan serve
```

Server will be available at: **http://localhost:8000**

## 🧪 Test Your Installation

Visit: http://localhost:8000

You should see the Laravel welcome page!

## 📋 System Info

- **Laravel**: 12.0
- **PHP**: 8.4.16
- **Composer**: 2.9.3
- **Node**: 20.17.0
- **NPM**: 11.6.2
- **Database**: SQLite (pre-configured)

## 🛠️ Next Development Steps

### 1. Create Your First API Endpoint

```bash
cd back-end

# Create a controller
php artisan make:controller Api/CourtController

# Create a model with migration
php artisan make:model Court -m
```

### 2. Set Up API Routes

Edit `back-end/routes/api.php` to add your endpoints.

### 3. Configure CORS for Frontend

Install Laravel Sanctum for API authentication:
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 4. Connect to Your Frontend

Your Next.js frontend is at: `c:\Users\Andri\Desktop\Files\OJT\PicklePlay\frontend\`

Configure API calls to: `http://localhost:8000/api`

## 📚 Useful Commands

```bash
# View all routes
php artisan route:list

# Create a migration
php artisan make:migration create_courts_table

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Create a seeder
php artisan make:seeder CourtSeeder

# Run seeders
php artisan db:seed

# Clear all caches
php artisan optimize:clear

# Run tests
php artisan test
```

## 📖 Resources

- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [Laravel API Resources](https://laravel.com/docs/12.x/eloquent-resources)
- [Laravel Sanctum (API Auth)](https://laravel.com/docs/12.x/sanctum)
- [Building APIs with Laravel](https://laravel.com/docs/12.x/routing#api-routes)

## 🐛 Troubleshooting

### Port 8000 already in use?
```bash
php artisan serve --port=8001
```

### Clear all caches:
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Database issues:
```bash
# Check database connection
php artisan db:show

# Fresh migration (WARNING: Deletes all data)
php artisan migrate:fresh
```

---

## 🎯 Your Project Structure

```
PicklePlay/
├── back-end/          ← Laravel 12 API (NEW!)
├── frontend/          ← Next.js Frontend
├── mobile/            ← React Native Mobile App
└── backend/           ← Old empty folder (can be deleted)
```

**Note**: You have an old empty `backend/` folder that can be safely deleted once your IDE releases it.

---

Happy coding! 🚀
