# 🚀 Docker Quick Start - PicklePlay Backend

**Get up and running in 5 minutes!**

---

## ✅ Prerequisites

1. **Docker Desktop installed** and running
2. **Git** installed
3. You're in the `back-end/` folder

---

## 🎯 Quick Setup (First Time)

### Step 1: Start Docker Containers

```bash
docker-compose up -d
```

**Wait 3-5 minutes for first build...** ☕

### Step 2: Install Dependencies

```bash
docker-compose exec app composer install
```

### Step 3: Generate App Key (if needed)

```bash
docker-compose exec app php artisan key:generate
```

### Step 4: Run Migrations

```bash
docker-compose exec app php artisan migrate
```

### Step 5: Test It!

Visit: **http://localhost:8000**

You should see the Laravel welcome page! 🎉

---

## 📝 Daily Commands

### Start Development

```bash
docker-compose up -d
```

### Stop Development

```bash
docker-compose down
```

### Run Artisan Commands

```bash
docker-compose exec app php artisan [command]
```

**Examples:**
```bash
# Create model
docker-compose exec app php artisan make:model Court -mcr

# Run migrations
docker-compose exec app php artisan migrate

# Clear cache
docker-compose exec app php artisan cache:clear

# View routes
docker-compose exec app php artisan route:list
```

---

## 🔗 Access Points

| Service | URL |
|---------|-----|
| **Backend** | http://localhost:8000 |
| **API Health** | http://localhost:8000/api/health |
| **Supabase Dashboard** | https://supabase.com/dashboard |

---

## 🐛 Quick Fixes

### Containers won't start?
```bash
# Make sure Docker Desktop is running
# Then restart:
docker-compose down
docker-compose up -d
```

### Permission errors?
```bash
docker-compose exec app chmod -R 775 storage bootstrap/cache
```

### Database connection failed?
```bash
# Check connection:
docker-compose exec app php artisan db:show
```

---

## 📚 Full Documentation

See **DOCKER_SETUP.md** for complete guide!

---

**That's it! You're ready to develop! 🚀**
