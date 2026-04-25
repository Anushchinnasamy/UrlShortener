# 🚨 QUICK FIX - Database Schema Issue

## Problem
Registration succeeds but login/forgot password fails with "User not found"

**Cause:** Database doesn't have the email column yet.

---

## ⚡ Quick Fix (2 Minutes)

### Option A: Automated Script (Easiest)

Run this PowerShell script:
```powershell
./fix-database.ps1
```

This will:
1. Stop backend
2. Drop and recreate database
3. Start backend
4. Verify it's working

---

### Option B: Manual Steps

#### 1. Stop Backend
```powershell
Get-Process -Name java | Stop-Process -Force
```

#### 2. Recreate Database
```powershell
# Set password
$env:PGPASSWORD = "password"

# Drop and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS urlshortener;"
psql -U postgres -c "CREATE DATABASE urlshortener;"
```

#### 3. Start Backend
```powershell
./mvnw spring-boot:run
```

Wait 15 seconds for backend to start.

#### 4. Test
- Register: http://localhost:5173/register (with email)
- Login: http://localhost:5173/login (with email or username)

---

## ✅ Verification

After the fix, test these:

### Test 1: Register
```
URL: http://localhost:5173/register

Username: testuser
Email: test@example.com
Password: password123

✅ Should succeed
```

### Test 2: Login with Email
```
URL: http://localhost:5173/login

Username or Email: test@example.com
Password: password123

✅ Should login successfully (NOT "User not found")
```

### Test 3: Login with Username
```
URL: http://localhost:5173/login

Username or Email: testuser
Password: password123

✅ Should login successfully
```

### Test 4: Forgot Password
```
URL: http://localhost:5173/forgot-password

Email: test@example.com

✅ Should show success with reset link (NOT "User not found")
```

---

## 🔍 Why This Happened

1. We added email field to the backend code
2. But the database still had the old schema (no email column)
3. Registration appeared to succeed but email wasn't saved
4. Login/forgot password couldn't find users by email

**Solution:** Recreate database so Hibernate creates the correct schema.

---

## 📊 Database Schema (After Fix)

```sql
-- Check schema
psql -U postgres -d urlshortener -c "\d users"

-- Expected columns:
-- id, username, email, password, reset_token, reset_token_expiry
```

---

## 🆘 If Still Not Working

### Check 1: Backend Running?
```powershell
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing
```
Should return: `{"status":"UP"}`

### Check 2: Database Exists?
```powershell
psql -U postgres -c "\l" | Select-String "urlshortener"
```
Should show: `urlshortener`

### Check 3: Table Schema?
```powershell
psql -U postgres -d urlshortener -c "\d users"
```
Should show: `email` column

### Check 4: Backend Logs?
Look for errors in the backend console. Common issues:
- Database connection failed
- Schema creation failed
- Port 8080 already in use

---

## 💡 Alternative: Use H2 Database (In-Memory)

If PostgreSQL is causing issues, switch to H2 for development:

**File:** `src/main/resources/application.properties`

```properties
# Comment out PostgreSQL
#spring.datasource.url=jdbc:postgresql://localhost:5432/urlshortener
#spring.datasource.username=postgres
#spring.datasource.password=password

# Add H2
spring.datasource.url=jdbc:h2:mem:urlshortener
spring.datasource.driverClassName=org.h2.Driver
spring.h2.console.enabled=true
```

Then restart backend. Database will be recreated automatically.

---

## ✅ Success Criteria

After fix, all these should work WITHOUT errors:

- [x] Register with email
- [x] Login with username
- [x] Login with email
- [x] Forgot password with email
- [x] Reset password
- [x] No "User not found" errors

---

**Recommended:** Run `./fix-database.ps1` for automatic fix!
