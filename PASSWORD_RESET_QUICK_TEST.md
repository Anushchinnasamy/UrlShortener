# 🧪 Password Reset - Quick Test Guide

## ✅ Complete Flow Test (5 Minutes)

### Step 1: Register with Email (1 min)
```
URL: http://localhost:5173/register

Fill:
  Username: testuser123
  Email: test@example.com
  Password: password123
  Confirm: password123

Click: "Create account"

✅ Expected: Success toast → Redirect to /login
```

### Step 2: Login with Username (30 sec)
```
URL: http://localhost:5173/login

Fill:
  Username or Email: testuser123
  Password: password123

Click: "Sign in"

✅ Expected: Login successful → Redirect to /dashboard
```

### Step 3: Logout (10 sec)
```
Click: "Logout" button in header

✅ Expected: Redirect to /login
```

### Step 4: Login with Email (30 sec)
```
URL: http://localhost:5173/login

Fill:
  Username or Email: test@example.com
  Password: password123

Click: "Sign in"

✅ Expected: Login successful (proves email login works!)
```

### Step 5: Forgot Password (1 min)
```
Logout again

URL: http://localhost:5173/login
Click: "Forgot password?" link

Fill:
  Email: test@example.com

Click: "Send Reset Link"

✅ Expected: 
  - Success toast appears
  - Message contains reset link
  - Copy the link from the message
  
Example link:
http://localhost:5173/reset-password?token=abc123-def456-ghi789
```

### Step 6: Reset Password (1 min)
```
Paste the reset link in browser
OR
Click the link from the success message

Fill:
  New Password: newpassword456
  Confirm: newpassword456

Click: "Reset Password"

✅ Expected:
  - Success toast: "Password reset successfully"
  - Auto-redirect to /login after 1.5 seconds
```

### Step 7: Login with New Password (30 sec)
```
URL: http://localhost:5173/login

Fill:
  Username or Email: testuser123
  Password: newpassword456  ← NEW PASSWORD

Click: "Sign in"

✅ Expected: Login successful with new password!
```

### Step 8: Verify Old Password Doesn't Work (30 sec)
```
Logout

Try to login with OLD password:
  Username or Email: testuser123
  Password: password123  ← OLD PASSWORD

Click: "Sign in"

✅ Expected: Error: "Invalid credentials"
```

---

## 🎯 What to Verify

### Registration:
- [x] Email field present
- [x] Email validation works
- [x] Duplicate email rejected
- [x] Success message shown
- [x] Redirect to login

### Login:
- [x] Can login with username
- [x] Can login with email
- [x] "Forgot password?" link visible
- [x] Invalid credentials show error

### Forgot Password:
- [x] Email input field
- [x] Email validation
- [x] Success message with reset link
- [x] Invalid email shows error

### Reset Password:
- [x] Token extracted from URL
- [x] Password fields present
- [x] Password validation (min 6 chars)
- [x] Passwords must match
- [x] Success message
- [x] Auto-redirect to login

### Security:
- [x] Old password doesn't work after reset
- [x] New password works
- [x] Token expires after 1 hour
- [x] Token single-use (cleared after reset)

---

## 🚨 Common Issues & Solutions

### Issue 1: "Email already exists"
**Solution:** Use a different email or delete the user from database

### Issue 2: "Invalid or expired reset token"
**Solution:** 
- Token expired (1 hour limit)
- Request new reset link
- Check token in URL is complete

### Issue 3: Reset link doesn't work
**Solution:**
- Ensure backend is running
- Check token parameter in URL
- Token format: `?token=abc123-def456...`

### Issue 4: Can't login after reset
**Solution:**
- Verify you're using the NEW password
- Check for typos
- Try with email instead of username

---

## 📊 API Test (Optional)

### Test with cURL or Postman:

**1. Register:**
```bash
POST http://localhost:8080/auth/register
Body: {
  "username": "apitest",
  "email": "api@test.com",
  "password": "test123"
}
```

**2. Login:**
```bash
POST http://localhost:8080/auth/login
Body: {
  "usernameOrEmail": "api@test.com",
  "password": "test123"
}
```

**3. Forgot Password:**
```bash
POST http://localhost:8080/auth/forgot-password
Body: {
  "email": "api@test.com"
}
Response: {
  "message": "Password reset link sent... Link: http://..."
}
```

**4. Reset Password:**
```bash
POST http://localhost:8080/auth/reset-password
Body: {
  "token": "abc123-def456-ghi789",
  "newPassword": "newtest123"
}
```

**5. Login with New Password:**
```bash
POST http://localhost:8080/auth/login
Body: {
  "usernameOrEmail": "api@test.com",
  "password": "newtest123"
}
```

---

## ✅ Success Criteria

All these should work:
- [x] Register with email
- [x] Login with username
- [x] Login with email
- [x] Forgot password sends reset link
- [x] Reset password updates password
- [x] Login with new password works
- [x] Old password doesn't work
- [x] Auto-redirect after reset
- [x] Token expiry works
- [x] Error messages clear

---

## 🎉 Result

If all steps pass: **✅ PASSWORD RESET FLOW WORKING PERFECTLY!**

Like Gmail, Facebook, and all standard applications! 🚀

---

**Test Duration:** ~5 minutes  
**Difficulty:** Easy  
**Status:** Ready to test
