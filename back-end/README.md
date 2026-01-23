# PicklePlay Backend - Laravel 12

Backend API for PicklePlay - Your New Pickleball Playground.

## ✅ Installation Complete

Laravel 12 has been successfully installed and configured!

## 🚀 Quick Start

### Start Development Server

Run all services (server, queue, logs, and vite):
```bash
composer run dev
```

Or start services individually:
```bash
# Start Laravel development server
php artisan serve

# In another terminal - Start Vite dev server for hot reload
npm run dev
```

Your application will be available at: **http://localhost:8000**

## 📋 What's Installed

- **Laravel Framework**: 12.48.1 (Latest)
- **PHP**: 8.4.16 (via Laravel Herd)
- **Database**: SQLite (working) / Supabase PostgreSQL (configured, IPv6 issue)
- **Frontend**: Vite + Tailwind CSS
- **Testing**: PHPUnit
- **Authentication**: Laravel Sanctum
- **CORS**: Configured for Next.js

## ⚠️ Database Note

**Supabase Connection Issue**: Due to IPv6 connectivity limitations, the app is currently using SQLite for local development. Supabase credentials are configured and ready for production deployment. See `SUPABASE_CONNECTION_ISSUE.md` for details.

## 🛠️ Common Commands

```bash
# Run migrations
php artisan migrate

# Create a new controller
php artisan make:controller YourController

# Create a new model
php artisan make:model YourModel -m

# Run tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## 📁 Project Structure

```
back-end/
├── app/              # Application code (Models, Controllers, etc.)
├── config/           # Configuration files
├── database/         # Migrations, seeders, factories
├── public/           # Public assets (entry point)
├── resources/        # Views, CSS, JS
├── routes/           # Route definitions
├── storage/          # File storage, logs
└── tests/            # Test files
```

## 🔧 Configuration

Environment variables are stored in `.env` file. Key settings:

- `APP_URL`: Your application URL
- `DB_CONNECTION`: Database type (currently SQLite)
- `APP_DEBUG`: Debug mode (true for development)

## 📚 Next Steps

1. **Configure Database** (if not using SQLite):
   - Update `.env` with your database credentials
   - Run `php artisan migrate`

2. **Build Your API**:
   - Create controllers in `app/Http/Controllers/`
   - Define routes in `routes/api.php` or `routes/web.php`
   - Create models in `app/Models/`

3. **API Development**:
   - Install Laravel Sanctum for API authentication
   - Set up CORS for frontend integration

## 📖 Resources

- [Laravel Documentation](https://laravel.com/docs/12.x)
- [Laravel API Documentation](https://laravel.com/api/12.x/)
- [Laracasts](https://laracasts.com/) - Video tutorials

---

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects.

For more information, visit [laravel.com](https://laravel.com).
