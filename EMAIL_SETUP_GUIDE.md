# 📧 Email Service Setup Guide

## Overview

Email service has been integrated for:
- ✅ Password reset emails (with secure reset link)
- ✅ Welcome emails (after registration)

---

## 🚀 Quick Setup

### Option 1: Gmail (Easiest for Development)

#### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification"

#### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it: "Shortly URL Shortener"
4. Click "Generate"
5. Copy the 16-character password

#### Step 3: Update application.properties

**File:** `src/main/resources/application.properties`

```properties
# Enable email service
app.email.enabled=true

# Gmail SMTP settings
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-char-app-password

# From email
app.email.from=your-email@gmail.com
```

#### Step 4: Restart Backend

```bash
./mvnw spring-boot:run
```

**Done!** Emails will now be sent automatically.

---

### Option 2: Environment Variables (Recommended for Production)

Set these environment variables:

```bash
# Windows PowerShell
$env:EMAIL_ENABLED = "true"
$env:MAIL_HOST = "smtp.gmail.com"
$env:MAIL_PORT = "587"
$env:MAIL_USERNAME = "your-email@gmail.com"
$env:MAIL_PASSWORD = "your-app-password"
$env:EMAIL_FROM = "noreply@urlshortener.com"

# Then start backend
./mvnw spring-boot:run
```

```bash
# Linux/Mac
export EMAIL_ENABLED=true
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password
export EMAIL_FROM=noreply@urlshortener.com

# Then start backend
./mvnw spring-boot:run
```

---

### Option 3: Other Email Providers

#### Outlook/Hotmail
```properties
spring.mail.host=smtp-mail.outlook.com
spring.mail.port=587
spring.mail.username=your-email@outlook.com
spring.mail.password=your-password
```

#### Yahoo
```properties
spring.mail.host=smtp.mail.yahoo.com
spring.mail.port=587
spring.mail.username=your-email@yahoo.com
spring.mail.password=your-app-password
```

#### SendGrid (Production)
```properties
spring.mail.host=smtp.sendgrid.net
spring.mail.port=587
spring.mail.username=apikey
spring.mail.password=your-sendgrid-api-key
```

#### AWS SES (Production)
```properties
spring.mail.host=email-smtp.us-east-1.amazonaws.com
spring.mail.port=587
spring.mail.username=your-aws-access-key
spring.mail.password=your-aws-secret-key
```

---

## 🧪 Testing Email Service

### Test 1: Register New User

```bash
# Register
POST http://localhost:8080/auth/register
{
  "username": "testuser",
  "email": "your-email@gmail.com",
  "password": "test123456"
}

# Check your email inbox for welcome email
```

### Test 2: Forgot Password

```bash
# Request password reset
POST http://localhost:8080/auth/forgot-password
{
  "email": "your-email@gmail.com"
}

# Check your email inbox for reset link
```

### Test 3: Check Backend Logs

Look for these log messages:
```
Welcome email sent successfully to: your-email@gmail.com
Password reset email sent successfully to: your-email@gmail.com
```

---

## 📧 Email Templates

### Password Reset Email

**Subject:** Password Reset Request - Shortly URL Shortener

**Features:**
- 🎨 Beautiful HTML design with gradient header
- 🔐 Security warnings (1-hour expiry, single-use)
- 🔘 Large "Reset Password" button
- 📋 Fallback plain text link
- ⚠️ Security notice box

**Preview:**
```
┌─────────────────────────────────────┐
│  🔐 Password Reset Request          │
│  Shortly URL Shortener              │
├─────────────────────────────────────┤
│  Hello, username!                   │
│                                     │
│  We received a request to reset     │
│  your password...                   │
│                                     │
│  [Reset Password Button]            │
│                                     │
│  ⚠️ Security Notice:                │
│  • Expires in 1 hour                │
│  • Single-use only                  │
│  • Ignore if you didn't request     │
└─────────────────────────────────────┘
```

### Welcome Email

**Subject:** Welcome to Shortly URL Shortener! 🎉

**Features:**
- 🎉 Celebratory design
- 📝 Feature highlights
- 🔗 Direct link to dashboard
- 🎨 Modern gradient styling

---

## 🔧 Configuration Options

### All Available Settings

```properties
# Email Service Toggle
app.email.enabled=true                    # Enable/disable email service

# SMTP Server
spring.mail.host=smtp.gmail.com           # SMTP server hostname
spring.mail.port=587                      # SMTP port (587 for TLS)

# Authentication
spring.mail.username=your-email@gmail.com # SMTP username
spring.mail.password=your-app-password    # SMTP password

# SMTP Properties
spring.mail.properties.mail.smtp.auth=true                    # Enable authentication
spring.mail.properties.mail.smtp.starttls.enable=true         # Enable TLS
spring.mail.properties.mail.smtp.starttls.required=true       # Require TLS
spring.mail.properties.mail.smtp.connectiontimeout=5000       # Connection timeout (ms)
spring.mail.properties.mail.smtp.timeout=5000                 # Read timeout (ms)
spring.mail.properties.mail.smtp.writetimeout=5000            # Write timeout (ms)

# Email Settings
app.email.from=noreply@urlshortener.com   # From email address
app.base-url=http://localhost:5173        # Frontend URL for reset links
```

---

## 🐛 Troubleshooting

### Issue 1: "Authentication failed"

**Cause:** Wrong username/password or app password not generated

**Solution:**
1. Verify email and password are correct
2. For Gmail, use App Password (not regular password)
3. Enable 2FA first, then generate App Password

---

### Issue 2: "Connection timeout"

**Cause:** Firewall blocking SMTP port or wrong host

**Solution:**
1. Check firewall allows port 587
2. Verify SMTP host is correct
3. Try port 465 (SSL) instead of 587 (TLS)

---

### Issue 3: Emails not received

**Cause:** Email in spam folder or wrong "from" address

**Solution:**
1. Check spam/junk folder
2. Add sender to contacts
3. Use your actual email as "from" address
4. Check backend logs for errors

---

### Issue 4: "Email service disabled"

**Cause:** `app.email.enabled=false` in configuration

**Solution:**
Set `app.email.enabled=true` in application.properties or:
```bash
$env:EMAIL_ENABLED = "true"
```

---

## 📊 Email Service Status

### Check if Email is Enabled

Look for this in backend logs on startup:
```
Email service enabled: true
Email from: your-email@gmail.com
```

### Test Email Configuration

```bash
# Check SMTP connection
telnet smtp.gmail.com 587

# Should connect successfully
```

---

## 🔒 Security Best Practices

### For Development:
- ✅ Use App Passwords (not regular passwords)
- ✅ Don't commit credentials to Git
- ✅ Use environment variables

### For Production:
- ✅ Use dedicated email service (SendGrid, AWS SES)
- ✅ Use environment variables for all credentials
- ✅ Enable email verification
- ✅ Implement rate limiting
- ✅ Use custom domain for "from" address
- ✅ Set up SPF, DKIM, DMARC records

---

## 📝 Email Service Features

### Current Features:
- ✅ Password reset emails
- ✅ Welcome emails
- ✅ HTML email templates
- ✅ Responsive design
- ✅ Security warnings
- ✅ Fallback plain text
- ✅ Error handling
- ✅ Logging

### Future Enhancements:
- ⏳ Email verification on registration
- ⏳ Email change confirmation
- ⏳ Account activity notifications
- ⏳ Weekly analytics summary
- ⏳ Custom email templates
- ⏳ Multi-language support

---

## 🎯 Quick Start Checklist

For Gmail setup:

- [ ] Enable 2-Factor Authentication
- [ ] Generate App Password
- [ ] Update `spring.mail.username`
- [ ] Update `spring.mail.password`
- [ ] Set `app.email.enabled=true`
- [ ] Restart backend
- [ ] Test registration (check for welcome email)
- [ ] Test forgot password (check for reset email)

---

## 📧 Example Emails

### Password Reset Email (Full HTML)

The email includes:
- Gradient header with logo
- Personalized greeting
- Clear call-to-action button
- Security warnings in highlighted box
- Fallback plain text link
- Professional footer

### Welcome Email (Full HTML)

The email includes:
- Celebratory header
- Welcome message
- Feature highlights (3 cards)
- Dashboard link button
- Professional footer

---

## ✅ Verification

After setup, verify:

1. **Backend logs show:**
   ```
   Email service enabled: true
   Welcome email sent successfully to: user@example.com
   ```

2. **User receives emails:**
   - Welcome email after registration
   - Reset email after forgot password

3. **Reset link works:**
   - Click link in email
   - Opens reset password page
   - Can reset password successfully

---

## 🚀 Status

**Email Service:** ✅ Integrated and Ready

**Setup Required:** Configure SMTP credentials

**Time to Setup:** 5 minutes (Gmail)

**Production Ready:** Yes (with proper SMTP service)

---

**Next Step:** Follow "Option 1: Gmail" above to enable email service!
