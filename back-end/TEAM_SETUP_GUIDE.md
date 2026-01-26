# PicklePlay Backend - Team Setup Guide

Quick guide for team members to set up the PicklePlay backend on their local machine.

---

## 📋 Prerequisites

Before you start, install these on your computer:

1. **Docker Desktop** - https://www.docker.com/products/docker-desktop/
   - Download and install for your OS (Windows/Mac/Linux)
   - Restart your computer after installation
   - Make sure Docker Desktop is running (check system tray)

2. **Git** - https://git-scm.com/downloads
   - For cloning the repository

---

## 🚀 First Time Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-team/PicklePlay.git
cd PicklePlay/back-end
```

### Step 2: Create Your Environment File

```bash
# Copy the example file
cp .env.example .env
```

### Step 3: Get Credentials from Team Lead

Ask your team lead for the **Supabase database credentials** and update these values in your `.env` file:

```env
DB_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres
```

**Example format:**
```env
DB_URL=postgresql://postgres.bbhowjpozordxxnfloif:YourPassword@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
```

### Step 4: Start Docker Containers

```bash
# Make sure Docker Desktop is running first!
docker-compose up -d
```

⏱️ **First build takes 3-5 minutes** - Docker is downloading and building images.

### Step 5: Install PHP Dependencies

```bash
docker-compose exec app composer install
```

### Step 6: Generate Application Key

```bash
docker-compose exec app php artisan key:generate
```

This will automatically update your `.env` file with a secure `APP_KEY`.

### Step 7: Run Database Migrations

```bash
docker-compose exec app php artisan migrate
```

This creates all necessary database tables in Supabase.

### Step 8: Verify Everything Works

1. **Open your browser**: http://localhost:8000
   - You should see the Laravel welcome page

2. **Test the API**: http://localhost:8000/api/health
   - You should see a JSON response:
   ```json
   {
     "status": "ok",
     "message": "PicklePlay API is running",
     "timestamp": "2026-01-26T..."
   }
   ```

3. **Check containers are running**:
   ```bash
   docker-compose ps
   ```
   - You should see 3 containers: `app`, `nginx`, `redis`

---

## ✅ Setup Complete!

If all steps worked, you're ready to start developing! 🎉

---

## 📅 Daily Development Workflow

### Starting Your Day

```bash
# 1. Open Docker Desktop (make sure it's running)

# 2. Navigate to project
cd PicklePlay/back-end

# 3. Start containers
docker-compose up -d

# 4. Start coding!
```

### During Development

```bash
# Run artisan commands
docker-compose exec app php artisan [command]

# Examples:
docker-compose exec app php artisan migrate
docker-compose exec app php artisan make:model Court -mcr
docker-compose exec app php artisan route:list
docker-compose exec app php artisan cache:clear

# View logs
docker-compose logs -f

# Access container shell
docker-compose exec app bash
```

### Ending Your Day

```bash
# Stop containers (optional - saves resources)
docker-compose down

# Or just leave them running - they don't use much when idle
```

---

## 🔄 Pulling Latest Changes

When team members push updates:

```bash
# Pull latest code
git pull origin main

# Rebuild containers (if Dockerfile changed)
docker-compose up -d --build

# Install new dependencies (if composer.json changed)
docker-compose exec app composer install

# Run new migrations (if new migration files added)
docker-compose exec app php artisan migrate
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Docker daemon"
**Solution**: Make sure Docker Desktop is running

### Issue: "Port 8000 already in use"
**Solution**: 
```bash
# Check what's using port 8000
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux

# Stop other services or change port in docker-compose.yml
```

### Issue: "Database connection failed"
**Solution**: 
- Check your `.env` file has the correct `DB_URL`
- Verify credentials with team lead
- Make sure Supabase project is active

### Issue: "composer install fails"
**Solution**:
```bash
# Rebuild containers
docker-compose down
docker-compose up -d --build
docker-compose exec app composer install
```

### Issue: Containers won't start
**Solution**:
```bash
# View logs to see error
docker-compose logs -f

# Full restart
docker-compose down
docker-compose up -d
```

### Issue: "intl extension not found" or similar
**Solution**: Rebuild the Docker image
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📚 Useful Commands Reference

### Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# Restart containers
docker-compose restart

# View logs (all services)
docker-compose logs -f

# View logs (specific service)
docker-compose logs -f app
docker-compose logs -f nginx

# Check container status
docker-compose ps

# Rebuild containers
docker-compose up -d --build

# Access container shell
docker-compose exec app bash
```

### Laravel Artisan Commands

```bash
# Run migrations
docker-compose exec app php artisan migrate

# Rollback migrations
docker-compose exec app php artisan migrate:rollback

# Create model with migration, factory, controller
docker-compose exec app php artisan make:model ModelName -mcr

# Create controller
docker-compose exec app php artisan make:controller ControllerName

# Create migration
docker-compose exec app php artisan make:migration create_table_name

# List routes
docker-compose exec app php artisan route:list

# Clear cache
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear

# Check database connection
docker-compose exec app php artisan db:show

# Run tests
docker-compose exec app php artisan test
```

### Composer Commands

```bash
# Install dependencies
docker-compose exec app composer install

# Update dependencies
docker-compose exec app composer update

# Add new package
docker-compose exec app composer require package/name

# Remove package
docker-compose exec app composer remove package/name
```

---

## 🔒 Security Reminders

- ✅ **NEVER commit `.env` to Git** - It contains sensitive credentials
- ✅ **Keep your `.env` file private** - Don't share it publicly
- ✅ **Use different credentials for production** - Don't use dev credentials in production
- ✅ **Keep Docker Desktop updated** - For security patches

---

## 🆘 Need Help?

1. **Check documentation**:
   - `DOCKER_SETUP.md` - Detailed Docker setup guide
   - `DOCKER_QUICKSTART.md` - Quick reference
   - `BACKEND_CHECKLIST.md` - Feature development checklist

2. **Ask your team**:
   - Team lead for credentials
   - Other developers for technical issues

3. **Check logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Laravel documentation**: https://laravel.com/docs

---

## 🎯 What's Next?

Once your setup is complete, check out:

- **`BACKEND_CHECKLIST.md`** - List of features to implement
- **`routes/api.php`** - API endpoints
- **`app/Models/`** - Database models
- **`app/Http/Controllers/`** - Controllers

Start building features according to the project requirements!

---

## 📊 Your Development Stack

- **Framework**: Laravel 12.48.1
- **PHP**: 8.4.17
- **Database**: PostgreSQL (Supabase)
- **Cache/Queue**: Redis
- **Web Server**: Nginx
- **Frontend**: Next.js (separate project)
- **Containerization**: Docker + Docker Compose

---

**Happy Coding! 🚀**

_Last updated: January 26, 2026_
