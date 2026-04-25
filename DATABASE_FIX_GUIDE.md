# 🔧 Database Fix Guide

## Problem

The database still has the old schema (without email column), but the backend code expects the new schema with email.

**Error:** "User not found" when trying to login or use forgot password, even after successful registration.

**Root Cause:** Database schema mismatch - email column doesn't exist in the database.

---

## Solution Options

### Option 1: Recreate Database (Easiest - Recommended for Development)

This will **delete all existing data** and create a fresh database with the correct schema.

#### Step 1: Stop the Backend

Find and kill the Java process:
```powershell
# Find Java processes
Get-Process -Name java

# Kill the backend process (replace PID with actual process ID)
Stop-Process -Id 12272 -Force
```

#### Step 2: Update application.properties

**File:** `src/main/resources/application.properties`

Change this line:
```properties
# FROM:
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}

# TO:
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:create}
```

#### Step 3: Restart Backend

```bash
./mvnw spring-boot:run
```

#### Step 4: Change Back to 'update' (After First Run)

After the backend starts successfully once, change back:
```properties
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:update}
```

Then restart the backend again.

---

### Option 2: Manual SQL Migration (Preserves Existing Data)

If you have existing users and want to keep them:

#### Step 1: Connect to PostgreSQL

```bash
psql -U postgres -d urlshortener
```

#### Step 2: Run Migration Script

```sql
-- Add email column
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add reset token columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry BIGINT;

-- Update existing users with dummy emails
UPDATE users SET email = CONCAT(username, '@example.com') WHERE email IS NULL;

-- Make email NOT NULL and UNIQUE
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Verify
SELECT * FROM users;
```

#### Step 3: Restart Backend

```bash
./mvnw spring-boot:run
```

---

### Option 3: Drop and Recreate Database (Clean Slate)

#### Step 1: Connect to PostgreSQL

```bash
psql -U postgres
```

#### Step 2: Drop and Recreate Database

```sql
-- Drop existing database
DROP DATABASE IF EXISTS urlshortener;

-- Create fresh database
CREATE DATABASE urlshortener;

-- Exit psql
\q
```

#### Step 3: Restart Backend

The backend will automatically create all tables with the correct schema.

```bash
./mvnw spring-boot:run
```

---

## Quick Fix (Recommended)

**For development, the fastest solution:**

1. **Stop backend** (kill Java process)
2. **Drop database:**
   ```sql
   psql -U postgres -c "DROP DATABASE IF EXISTS urlshortener;"
   psql -U postgres -c "CREATE DATABASE urlshortener;"
   ```
3. **Start backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
4. **Test registration** with email

---

## Verification

After applying the fix, verify the schema:

```sql
psql -U postgres -d urlshortener

-- Check table structure
\d users

-- Expected columns:
-- id, username, email, password, reset_token, reset_token_expiry
```

Expected output:
```
                                     Table "public.users"
      Column       |          Type          | Collation | Nullable |              Default
-------------------+------------------------+-----------+----------+-----------------------------------
 id                | bigint                 |           | not null | nextval('users_id_seq'::regclass)
 username          | character varying(255) |           | not null |
 email             | character varying(255) |           | not null |
 password          | character varying(255) |           | not null |
 reset_token       | character varying(255) |           |          |
 reset_token_expiry| bigint                 |           |          |
```

---

## Test After Fix

### 1. Register New User

```
URL: http://localhost:5173/register

Username: testuser
Email: test@example.com
Password: password123
Confirm: password123

✅ Should succeed
```

### 2. Login with Email

```
URL: http://localhost:5173/login

Username or Email: test@example.com
Password: password123

✅ Should login successfully
```

### 3. Login with Username

```
URL: http://localhost:5173/login

Username or Email: testuser
Password: password123

✅ Should login successfully
```

### 4. Forgot Password

```
URL: http://localhost:5173/forgot-password

Email: test@example.com

✅ Should show success with reset link
```

---

## Common Issues

### Issue 1: "relation 'users' does not exist"

**Solution:** Database not created. Run:
```sql
CREATE DATABASE urlshortener;
```

### Issue 2: "column 'email' does not exist"

**Solution:** Schema not updated. Use Option 1 (recreate) or Option 2 (manual migration).

### Issue 3: Backend won't start

**Solution:** Check logs:
```bash
./mvnw spring-boot:run
```

Look for errors related to database connection or schema.

### Issue 4: "duplicate key value violates unique constraint"

**Solution:** Email already exists. Use a different email or clear the database.

---

## PowerShell Commands (Windows)

### Stop Backend:
```powershell
Get-Process -Name java | Stop-Process -Force
```

### Check if Backend Running:
```powershell
Get-Process -Name java -ErrorAction SilentlyContinue
```

### Start Backend:
```powershell
./mvnw spring-boot:run
```

---

## Status Check

After applying the fix, all these should work:

- [ ] Register with email
- [ ] Login with username
- [ ] Login with email
- [ ] Forgot password with email
- [ ] Reset password with token

If all checked: ✅ **Database fixed!**

---

**Recommended Action:** Use Option 1 (Recreate Database) for fastest fix in development.
