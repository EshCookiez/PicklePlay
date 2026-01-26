# 🐳 Docker Setup for PicklePlay Backend

Complete guide for setting up the PicklePlay Laravel backend using Docker.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Docker Desktop** installed (https://www.docker.com/products/docker-desktop/)
- ✅ **Git** installed
- ✅ **Docker Desktop is running** (check system tray)

---

## 🚀 First Time Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-team/PicklePlay.git
cd PicklePlay/back-end
```

### 2. Copy Environment File

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

### 3. Update `.env` File

Make sure your `.env` has the Supabase connection:

```env
APP_NAME=PicklePlay
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Supabase Database
DB_CONNECTION=pgsql
DB_URL=postgresql://postgres.bbhowjpozordxxnfloif:PicklePlay@123_@aws-1-ap-south-1.pooler.supabase.com:5432/postgres

# Redis (Docker container)
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

# Cache/Queue
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Frontend URL
FRONTEND_URL=http://localhost:3000
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost
```

### 4. Build and Start Docker Containers

```bash
docker-compose up -d
```

This will:
- Build the PHP/Laravel container
- Start Nginx web server
- Start Redis for caching
- Set up networking between containers

**First build takes 3-5 minutes!** ☕

### 5. Install PHP Dependencies

```bash
docker-compose exec app composer install
```

### 6. Generate Application Key

```bash
docker-compose exec app php artisan key:generate
```

### 7. Run Database Migrations

```bash
docker-compose exec app php artisan migrate
```

### 8. Verify Setup

Visit: **http://localhost:8000**

You should see the Laravel welcome page! 🎉

Test API: **http://localhost:8000/api/health**

---

## 📝 Daily Development Commands

### Start Containers

```bash
docker-compose up -d
```

### Stop Containers

```bash
docker-compose down
```

### View Logs

```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f app
docker-compose logs -f nginx
```

### Run Artisan Commands

```bash
# General format
docker-compose exec app php artisan [command]

# Examples
docker-compose exec app php artisan migrate
docker-compose exec app php artisan make:model Court -mcr
docker-compose exec app php artisan db:seed
docker-compose exec app php artisan route:list
docker-compose exec app php artisan cache:clear
```

### Access Container Shell

```bash
docker-compose exec app bash
```

### Run Composer Commands

```bash
docker-compose exec app composer install
docker-compose exec app composer update
docker-compose exec app composer require package-name
```

### Run Tests

```bash
docker-compose exec app php artisan test
```

---

## 🔧 Common Tasks

### Create a New Model with Migration

```bash
docker-compose exec app php artisan make:model Court -mcr
```

### Run Fresh Migrations (WARNING: Deletes data!)

```bash
docker-compose exec app php artisan migrate:fresh
```

### Clear All Caches

```bash
docker-compose exec app php artisan optimize:clear
```

### Check Database Connection

```bash
docker-compose exec app php artisan db:show
```

---

## 🐛 Troubleshooting

### Port 8000 Already in Use

**Problem:** Another application is using port 8000

**Solution:** Edit `docker-compose.yml` and change:
```yaml
ports:
  - "8001:80"  # Change 8000 to 8001
```

Then access at: http://localhost:8001

### Docker Containers Won't Start

**Check if Docker Desktop is running:**
- Look for Docker icon in system tray
- Open Docker Desktop application

**Restart Docker:**
```bash
docker-compose down
docker-compose up -d
```

### Permission Errors

**Fix storage permissions:**
```bash
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### Database Connection Failed

**Check Supabase credentials in `.env`:**
- Verify `DB_URL` is correct
- Test connection: `docker-compose exec app php artisan db:show`

### Rebuild Containers (Fresh Start)

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
```

---

## 📊 Container Information

### Running Containers

| Container | Purpose | Port |
|-----------|---------|------|
| `pickleplay-backend` | PHP 8.4 + Laravel | Internal |
| `pickleplay-nginx` | Web server | 8000 |
| `pickleplay-redis` | Cache/Queue | 6379 |

### Check Container Status

```bash
docker-compose ps
```

### View Resource Usage

```bash
docker stats
```

---

## 🔄 Updating Your Setup

### Pull Latest Code

```bash
git pull origin main
docker-compose exec app composer install
docker-compose exec app php artisan migrate
docker-compose exec app php artisan optimize:clear
```

### Update Dependencies

```bash
docker-compose exec app composer update
```

---

## 🌐 Accessing Services

| Service | URL |
|---------|-----|
| **Backend** | http://localhost:8000 |
| **API** | http://localhost:8000/api |
| **Health Check** | http://localhost:8000/api/health |
| **Redis** | localhost:6379 |

---

## 💾 Database Access

### Using Tinker

```bash
docker-compose exec app php artisan tinker
```

Then:
```php
// Test connection
DB::connection()->getPdo();

// Query users
User::all();

// Create test user
User::create([
    'name' => 'Test User',
    'email' => 'test@example.com',
    'password' => bcrypt('password')
]);
```

### View Tables in Supabase

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Table Editor → Schema: `laravel`
4. See all your tables!

---

## 🧹 Cleanup

### Remove All Containers and Volumes

```bash
docker-compose down -v
```

### Remove Docker Images

```bash
docker-compose down --rmi all
```

---

## 📚 Useful Docker Commands

```bash
# List all containers
docker ps -a

# List all images
docker images

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything (careful!)
docker system prune -a
```

---

## 🎯 Quick Reference

### Start Development
```bash
docker-compose up -d
# Visit: http://localhost:8000
```

### Run Artisan Command
```bash
docker-compose exec app php artisan [command]
```

### Stop Development
```bash
docker-compose down
```

---

## 🆘 Getting Help

**Common Issues:**
1. Docker Desktop not running → Start Docker Desktop
2. Port conflicts → Change port in `docker-compose.yml`
3. Permission errors → Run permission fix commands above
4. Database errors → Check `.env` credentials

**Need more help?**
- Check Docker logs: `docker-compose logs -f`
- Restart containers: `docker-compose restart`
- Rebuild: `docker-compose build --no-cache`

---

## ✅ Success Checklist

After setup, verify:
- [ ] `docker-compose ps` shows 3 running containers
- [ ] http://localhost:8000 shows Laravel welcome page
- [ ] http://localhost:8000/api/health returns JSON
- [ ] `docker-compose exec app php artisan db:show` connects to Supabase
- [ ] No errors in logs: `docker-compose logs`

---

**Your Docker setup is complete! Happy coding! 🚀**

_Last updated: January 26, 2026_
