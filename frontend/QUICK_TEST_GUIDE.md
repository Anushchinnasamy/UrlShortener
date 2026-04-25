# 🚀 Quick Manual Test Guide

## Prerequisites
- ✅ Backend running on `http://localhost:8080`
- ✅ Frontend running on `http://localhost:5173`

## 5-Minute Smoke Test

### 1. Open Application
```
http://localhost:5173
```
**Expected**: Landing page loads with gradient background, no console errors

---

### 2. Test Registration (2 minutes)
1. Click **"Create account"** in header
2. Fill form:
   - Username: `testuser123`
   - Password: `password123`
   - Confirm: `password123`
3. Click **"Create account"**

**Expected**:
- ✅ Green success toast appears
- ✅ Redirects to login page
- ✅ No errors in console (F12)

---

### 3. Test Login (1 minute)
1. On login page, enter:
   - Username: `testuser123`
   - Password: `password123`
2. Click **"Sign in"**

**Expected**:
- ✅ Redirects to dashboard
- ✅ Header shows "Logout" button
- ✅ Backend status shows "Connected" (green)

---

### 4. Test URL Shortening (1 minute)
1. Click **"Home"** in navigation
2. Enter URL: `https://github.com/example/test`
3. Click **"Shorten"**

**Expected**:
- ✅ Short URL appears below form
- ✅ "Copy" button works
- ✅ No errors

---

### 5. Test Dashboard (1 minute)
1. Click **"Dashboard"** in navigation
2. Click **"Refresh analytics"**

**Expected**:
- ✅ Your shortened link appears
- ✅ Shows click count (0)
- ✅ "Copy", "Open", "Remove" buttons work
- ✅ No errors

---

## ✅ If All Tests Pass

**Your frontend is PRODUCTION READY! 🎉**

---

## 🧪 Advanced Testing (Optional)

### Test Error Handling
1. **Invalid Login**: Try wrong password → Should show error
2. **Invalid URL**: Enter `not-a-url` → Should show validation error
3. **Duplicate User**: Register same username twice → Should show error

### Test Protected Routes
1. Click **"Logout"**
2. Try to access `http://localhost:5173/dashboard`
3. **Expected**: Redirects to login

---

## 🔍 Console Check

Open DevTools (F12) → Console tab

**Should see**:
```
[api] baseURL: (vite proxy)
```

**Should NOT see**:
- ❌ Any red errors
- ❌ Failed network requests
- ❌ React warnings

---

## 📊 Quick Backend Test

Open in browser or use curl:
```
http://localhost:8080/actuator/health
```

**Expected**: `{"status":"UP",...}`

---

## 🎯 Test Checklist

- [ ] Landing page loads
- [ ] Registration works
- [ ] Login works
- [ ] URL shortening works
- [ ] Dashboard shows links
- [ ] Analytics refresh works
- [ ] Navigation works
- [ ] Logout works
- [ ] No console errors
- [ ] Backend status shows "Connected"

**If all checked**: ✅ **READY FOR PRODUCTION**

---

## 🆘 Troubleshooting

### Backend shows "Down"
- Check backend is running: `http://localhost:8080/actuator/health`
- Restart backend if needed

### "Network Error" messages
- Verify backend is on port 8080
- Check CORS configuration
- Check browser console for details

### Token issues
- Clear localStorage: `localStorage.clear()` in console
- Re-login

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

✅ Registration: PASS / FAIL
✅ Login: PASS / FAIL
✅ URL Shortening: PASS / FAIL
✅ Dashboard: PASS / FAIL
✅ Navigation: PASS / FAIL

Overall: READY / NOT READY
```
