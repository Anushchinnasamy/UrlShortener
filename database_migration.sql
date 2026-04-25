-- Database Migration: Add Email and Password Reset Support
-- Run this SQL script on your PostgreSQL database

-- Step 1: Add email column (allow NULL temporarily for existing users)
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Step 2: Add reset token columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry BIGINT;

-- Step 3: Update existing users with dummy emails (if any exist)
-- Replace 'dummy' with actual emails if you have existing users
UPDATE users SET email = CONCAT(username, '@example.com') WHERE email IS NULL;

-- Step 4: Make email NOT NULL and UNIQUE
ALTER TABLE users ALTER COLUMN email SET NOT NULL;
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Step 5: Make username NOT NULL (if not already)
ALTER TABLE users ALTER COLUMN username SET NOT NULL;

-- Step 6: Make password NOT NULL (if not already)
ALTER TABLE users ALTER COLUMN password SET NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Expected columns:
-- id, username, email, password, reset_token, reset_token_expiry
