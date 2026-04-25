# 🔧 Fix Summary - Database Schema Issue

## 🚨 Issue Identified

**Problem:** 
- Registration appears successful
- But login fails with "User not found"
- Forgot password fails with "User not found"

**Root Cause:**
The database still has the **old schema** (without email column), but the backend code expects the **new schema** (with email).

When you register:
- Backend tries to save: `username`, `email`, `password`
- Database only has columns: `username`, `password`
- Email is silently ignored or causes an error
- User is saved without email
- Login/forgot password can't find user by email

---

## ✅ Solution

**Recreate the database** so Hibernate creates the correct schema with all columns.

---

## 🚀 Quick Fix (Choose One)

### Option 1: Automated Script (Recommended)

```powershell
./fix-database.ps1
```

This script will:
1. ✅ Stop backend
2. ✅ Drop database
3. ✅ Create fresh database
4. ✅ Start backend
5. ✅ Verify it's working

**Time:** 30 seconds

---

### Option 2: Manual Commands

```powershell
# 1. Stop backend
Get-Process -Name java | Stop-Process -Force

# 2. Recreate database
$env:PGPASSWORD = "password"
psql -U postgres -c "DROP DATABASE IF EXISTS urlshortener;"
psql -U postgres -c "CREATE DATABASE urlshortener;"

# 3. Start backend
./mvnw spring-boot:run

# 4. Wait 15 seconds, then test
```

**Time:** 2 minutes

---

### Option 3: SQL Migration (Preserves Data)

If you have existing users you want to keep:

```sql
-- Connect to database
psql -U postgres -d urlshortener

-- Add columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry BIGINT;

-- Update existing users
UPDATE users SET email = CONCAT(username, '@example.com') WHERE email IS NULL;

-- Make email required
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
```

Then restart backend.

**Time:** 3 minutes

---

## 🧪 Test After Fix

### 1. Register New User

```
http://localhost:5173/register

Username: testuser
Email: test@example.com
Password: password123
Confirm: password123

Click: "Create account"

✅ Expected: Success → Redirect to login
```

### 2. Login with Email

```
http://localhost:5173/login

Username or Email: test@example.com
Password: password123

Click: "Sign in"

✅ Expected: Login successful → Redirect to dashboard
❌ Before fix: "User not found"
```

### 3. Login with Username

```
http://localhost:5173/login

Username or Email: testuser
Password: password123

Click: "Sign in"

✅ Expected: Login successful
❌ Before fix: "User not found"
```

### 4. Forgot Password

```
http://localhost:5173/forgot-password

Email: test@example.com

Click: "Send Reset Link"

✅ Expected: Success toast with reset link
❌ Before fix: "No account found with this email"
```

---

## 📊 Database Schema

### Before Fix (Old Schema):
```
users table:
- id
- username
- password
❌ Missing: email, reset_token, reset_token_expiry
```

### After Fix (New Schema):
```
users table:
- id
- username
- email              ✅ NEW
- password
- reset_token        ✅ NEW
- reset_token_expiry ✅ NEW
```

---

## 🔍 Verification Commands

### Check Backend Status:
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing
```
Should return: `{"status":"UP"}`

### Check Database Schema:
```powershell
psql -U postgres -d urlshortener -c "\d users"
```
Should show all 6 columns including `email`

### Check if Users Exist:
```sql
psql -U postgres -d urlshortener -c "SELECT username, email FROM users;"
```
Should show users with emails

---

## 🆘 Troubleshooting

### Issue 1: "psql: command not found"

**Solution:** PostgreSQL not in PATH. Use full path:
```powershell
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres ...
```

Or add to PATH.

---

### Issue 2: Backend won't start

**Check logs for errors:**
```powershell
./mvnw spring-boot:run
```

Common errors:
- **Port 8080 in use:** Kill other Java processes
- **Database connection failed:** Check PostgreSQL is running
- **Schema error:** Drop database and try again

---

### Issue 3: "password authentication failed"

**Solution:** Update password in `application.properties`:
```properties
spring.datasource.password=YOUR_ACTUAL_PASSWORD
```

Or set environment variable:
```powershell
$env:SPRING_DATASOURCE_PASSWORD = "your_password"
./mvnw spring-boot:run
```

---

### Issue 4: Still getting "User not found"

**Possible causes:**

1. **Backend not restarted:** Kill all Java processes and restart
2. **Database not recreated:** Verify schema with `\d users`
3. **Old data:** Clear browser cache and localStorage
4. **Wrong database:** Check `application.properties` URL

**Debug steps:**
```sql
-- Check if email column exists
psql -U postgres -d urlshortener -c "\d users"

-- Check if users have emails
psql -U postgres -d urlshortener -c "SELECT * FROM users;"

-- If email is NULL, database wasn't recreated properly
```

---

## 📝 Files Created

1. **`fix-database.ps1`** - Automated fix script
2. **`database_migration.sql`** - Manual SQL migration
3. **`DATABASE_FIX_GUIDE.md`** - Detailed guide
4. **`QUICK_FIX.md`** - Quick reference
5. **`FIX_SUMMARY.md`** - This file

---

## ✅ Success Checklist

After applying the fix:

- [ ] Backend starts without errors
- [ ] Database has `email` column
- [ ] Can register with email
- [ ] Can login with username
- [ ] Can login with email
- [ ] Can use forgot password
- [ ] Can reset password
- [ ] No "User not found" errors

If all checked: **✅ Fix successful!**

---

## 🎯 Recommended Action

**For fastest fix:**

1. Run: `./fix-database.ps1`
2. Wait 30 seconds
3. Test registration and login
4. Done! ✅

---

## 📞 Still Having Issues?

If the fix doesn't work:

1. **Check backend logs** for specific errors
2. **Verify PostgreSQL is running:** `Get-Service -Name postgresql*`
3. **Check database exists:** `psql -U postgres -l`
4. **Verify schema:** `psql -U postgres -d urlshortener -c "\d users"`
5. **Try H2 database** instead (in-memory, no setup needed)

---

**Status:** Ready to fix! Run `./fix-database.ps1` now. 🚀
