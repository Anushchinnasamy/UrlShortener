# Quick Email Test Guide

## ✅ Email Service is NOW WORKING!

Both issues have been fixed:
1. ✅ Emails are now sending successfully
2. ✅ Backend is stable (no more "down" messages in UI)

## Test Right Now!

### Option 1: Use Frontend (Easiest)

1. **Open**: http://localhost:5173

2. **Test Welcome Email**:
   - Click "Register" or "Get Started"
   - Fill in any username, email: `anushchinnasamy@gmail.com`, password
   - Click Register
   - **Check your Gmail inbox within 10 seconds!**

3. **Test Reset Email**:
   - Go to Login page
   - Click "Forgot Password?"
   - Enter: `anushchinnasamy@gmail.com`
   - Click Submit
   - **Check your Gmail inbox within 10 seconds!**

### Option 2: Use PowerShell

```powershell
# Test Welcome Email
$random = Get-Random -Maximum 999999
$body = "{`"username`":`"user$random`",`"email`":`"anushchinnasamy+test$random@gmail.com`",`"password`":`"Test@1234`"}"
Invoke-WebRequest -Uri "http://localhost:8080/auth/register" -Method Post -Body $body -ContentType "application/json"

# Wait 10 seconds and check Gmail!
```

```powershell
# Test Reset Email
$body = '{"email":"anushchinnasamy@gmail.com"}'
Invoke-WebRequest -Uri "http://localhost:8080/auth/forgot-password" -Method Post -Body $body -ContentType "application/json"

# Wait 10 seconds and check Gmail!
```

## What to Expect

### Welcome Email
- **Arrives in**: 5-10 seconds
- **Subject**: "Welcome to Shortly URL Shortener! 🎉"
- **Look**: Beautiful purple gradient design
- **Content**: Welcome message + features overview

### Password Reset Email
- **Arrives in**: 5-10 seconds
- **Subject**: "Password Reset Request - Shortly URL Shortener"
- **Look**: Beautiful purple gradient design
- **Content**: Reset link + security notice
- **Link**: Click to reset password

## If Emails Don't Show Up

1. **Check Spam Folder** (most common)
2. **Wait 30 seconds** (sometimes Gmail delays)
3. **Check Backend Logs**:
   - Look for "✅ Email sent successfully"
   - If you see this, email was sent!

## Backend Status

- ✅ Running: http://localhost:8080
- ✅ Health: UP (fast response)
- ✅ Email: Enabled and working
- ✅ Logs: Showing successful sends

## Confirmed Working

Recent test results:
```
✅ Welcome email sent to: anushchinnasamy+test669704@gmail.com
✅ Password reset email sent to: anushchinnasamy@gmail.com
```

**Go ahead and test it now!** 🚀

---

**Note**: Gmail+ addressing (anushchinnasamy+test@gmail.com) delivers to your main inbox (anushchinnasamy@gmail.com)
