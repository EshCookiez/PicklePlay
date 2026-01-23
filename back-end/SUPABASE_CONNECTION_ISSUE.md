# Supabase Connection Issue - Troubleshooting

## ❌ Problem

Your system **cannot connect to Supabase** due to network connectivity issues.

### Error Details

```
SQLSTATE[08006] [7] could not translate host name "db.bbhowjpozordxxnfloif.supabase.co" to address
```

### Root Cause

1. **Supabase only provides IPv6 addresses** for `db.bbhowjpozordxxnfloif.supabase.co`
2. **Your system doesn't have IPv6 connectivity** (Network unreachable error)
3. **PHP's PostgreSQL driver cannot reach the Supabase server**

---

## ✅ Temporary Solution (Current)

**Switched to SQLite** for local development:

```env
DB_CONNECTION=sqlite
```

Your Laravel app now works with SQLite locally. This allows you to:
- ✅ Develop your application
- ✅ Test features locally
- ✅ Run migrations
- ✅ Use the database

---

## 🔧 Permanent Solutions

### Option 1: Enable IPv6 on Your System (Recommended)

1. **Check if your ISP supports IPv6**
   - Contact your internet service provider
   - Most modern ISPs support IPv6

2. **Enable IPv6 in Windows**
   ```powershell
   # Run as Administrator
   netsh interface ipv6 set global randomizeidentifiers=disabled
   netsh interface ipv6 set privacy state=disabled
   ```

3. **Test IPv6 connectivity**
   ```powershell
   ping -6 ipv6.google.com
   ```

### Option 2: Use Supabase Connection Pooler (If Available)

Some Supabase projects offer a connection pooler that might have IPv4:

```env
DB_CONNECTION=pgsql
DB_HOST=db.bbhowjpozordxxnfloif.supabase.co
DB_PORT=6543  # Pooler port
DB_DATABASE=postgres
DB_USERNAME=postgres.bbhowjpozordxxnfloif  # Note the format
DB_PASSWORD=PicklePlay@123_
DB_SSLMODE=require
```

### Option 3: Use a VPN or Proxy

Use a VPN service that supports IPv6 connectivity.

### Option 4: Deploy to Production

When you deploy to a production server (like Laravel Cloud, AWS, DigitalOcean), those servers typically have IPv6 connectivity and will be able to connect to Supabase.

### Option 5: Use Supabase REST API

Instead of direct PostgreSQL connection, use Supabase's REST API:

```bash
composer require supabase/supabase-php
```

---

## 🧪 Testing Supabase Connection

### Test DNS Resolution

```powershell
nslookup db.bbhowjpozordxxnfloif.supabase.co
```

### Test IPv6 Connectivity

```powershell
ping -6 db.bbhowjpozordxxnfloif.supabase.co
```

### Test from Laravel

```bash
php artisan db:show
```

---

## 📋 Current Configuration

### Working (SQLite)

```env
DB_CONNECTION=sqlite
SESSION_DRIVER=file
```

### Supabase Credentials (Commented Out)

```env
# DB_CONNECTION=pgsql
# DB_HOST=db.bbhowjpozordxxnfloif.supabase.co
# DB_PORT=5432
# DB_DATABASE=postgres
# DB_USERNAME=postgres
# DB_PASSWORD=PicklePlay@123_
# DB_SSLMODE=require
```

---

## ✅ What Works Now

- ✅ Laravel backend running at `http://back-end.test`
- ✅ API endpoints working
- ✅ Database (SQLite) working
- ✅ Migrations can be run
- ✅ Development can continue

---

## 🎯 Recommendation

**For Local Development:**
- Use SQLite (current setup)
- Develop and test your application
- Run migrations and seeders

**For Production:**
- Deploy to a server with IPv6 support
- Connect to Supabase PostgreSQL
- Your Supabase credentials are saved and ready to use

---

## 📖 Resources

- [Supabase Connection Issues](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Laravel Database Configuration](https://laravel.com/docs/12.x/database)
- [IPv6 Connectivity Testing](https://test-ipv6.com/)

---

_Last updated: January 23, 2026_
