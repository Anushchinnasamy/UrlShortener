# Manual Email Testing Guide

## Backend is UP and Running! ✅

Your backend is successfully running with email service enabled.

## Quick Test Using Frontend

### Option 1: Test via Frontend (Recommended)

1. **Open Frontend**: http://localhost:5173

2. **Test Registration (Welcome Email)**:
   - Click "Register" or "Get Started"
   - Fill in:
     - Username: `testuser$(random)`
     - Email: `anushchinnasamy@gmail.com`
     - Password: `Test@1234`
   - Click Register
   - **Check your Gmail inbox for welcome email**

3. **Test Forgot Password (Reset Email)**:
   - Go to Login page
   - Click "Forgot Password?"
   - Enter email: `anushchinnasamy@gmail.com`
   - Click Submit
   - **Check your Gmail inbox for password reset email**

### Option 2: Test via PowerShell

#### Test 1: Registration (Welcome Email)
```powershell
$random = Get-Random -Maximum 99999
$body = "{`"username`":`"user$random`",`"email`":`"anushchinnasamy@gmail.com`",`"password`":`"Test@1234`"}"
Invoke-WebRequest -Uri "http://localhost:8080/auth/register" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
```

#### Test 2: Forgot Password (Reset Email)
```powershell
$body = '{"email":"anushchinnasamy@gmail.com"}'
Invoke-WebRequest -Uri "http://localhost:8080/auth/forgot-password" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
```

## What to Expect

### Welcome Email
- **Subject**: "Welcome to Shortly URL Shortener!"
- **Content**: Beautiful HTML email with welcome message
- **From**: anushchinnasamy@gmail.com

### Password Reset Email
- **Subject**: "Password Reset Request - Shortly URL Shortener"
- **Content**: HTML email with reset link
- **Link Format**: `http://localhost:5173/reset-password?token=<uuid>`
- **Expiry**: 1 hour
- **From**: anushchinnasamy@gmail.com

## Troubleshooting

### If Emails Don't Arrive

1. **Check Spam Folder**: Gmail might filter them initially

2. **Verify App Password**:
   - Go to Google Account → Security
   - Check if 2-Step Verification is enabled
   - Verify app password: `bowvqdxhtdrmzzrp`

3. **Check Backend Logs**:
   ```powershell
   # Look for email-related logs
   Get-Content logs/spring.log | Select-String "email"
   ```

4. **Test SMTP Connection**:
   - The backend should log email sending attempts
   - Look for "Email sent successfully" or error messages

### Common Issues

1. **"Email already exists"**: Use a different email or username
2. **"User not found"**: Register first before using forgot password
3. **No email received**: Check spam, verify app password

## Email Service Configuration

Current settings in `application.properties`:
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=anushchinnasamy@gmail.com
spring.mail.password=bowvqdxhtdrmzzrp
app.email.enabled=true
app.email.from=anushchinnasamy@gmail.com
```

## Backend Status

- ✅ Backend Running: http://localhost:8080
- ✅ Database Connected: PostgreSQL
- ✅ Email Service: Enabled
- ✅ SMTP: Gmail (smtp.gmail.com:587)

---

**Ready to test!** Use the frontend or PowerShell commands above.
