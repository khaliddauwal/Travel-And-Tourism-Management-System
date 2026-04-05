# 🚀 START HERE - Fix Login Issue

## What Was Wrong?

Your frontend was using fake/mock data instead of connecting to the real backend API.

## What I Fixed:

✅ Connected frontend to backend API  
✅ Updated login to use real authentication  
✅ Updated registration to use real API  
✅ Fixed demo account passwords

---

## 🎯 Quick Setup (5 Steps)

### Step 1: Import Database

1. Open: `http://localhost/phpmyadmin`
2. Click "Import" tab
3. Choose file: `database/schema.sql`
4. Click "Go"
5. ✅ Done! You should see `tms_system` database

### Step 2: Test Backend

1. Open in browser: `http://localhost/backend/api/v2/health`
2. Should see: `{"success":true,"message":"API is running"}`
3. ✅ If you see this, backend is working!

### Step 3: Start Frontend

```bash
cd frontend/tourism-react
npm start
```

### Step 4: Test Login

1. Go to: `http://localhost:3000/login`
2. Click "SHOW DEMO ACCOUNTS"
3. Click "Login as Tourist"
4. ✅ Should redirect to dashboard!

### Step 5: Test Registration

1. Logout
2. Go to: `http://localhost:3000/register`
3. Fill form with your details
4. Click "Register"
5. ✅ Should auto-login and go to dashboard!

---

## 🔑 Demo Accounts

| Email           | Password    |
| --------------- | ----------- |
| tourist@tms.com | Tourist@123 |
| agent@tms.com   | Agent@123   |
| admin@tms.com   | Admin@123   |

---

## ❌ If Something Doesn't Work

### Backend not accessible?

1. Check Apache is running (green in XAMPP)
2. Check MySQL is running (green in XAMPP)
3. Restart both if needed

### Database error?

1. Make sure you imported `database/schema.sql`
2. Check database `tms_system` exists in phpMyAdmin
3. Check `users` table has 3 rows

### Still getting "Invalid email or password"?

1. Open browser console (F12)
2. Look for red errors
3. Clear browser data:
   - Press F12
   - Go to Application tab
   - Click "Clear storage"
   - Click "Clear site data"
4. Try again

---

## 📝 What Changed in Your Code

### File: `frontend/tourism-react/src/services/api.ts`

- Changed API URL to: `http://localhost/backend/api/v2`
- Updated login/register to handle JWT tokens

### File: `frontend/tourism-react/src/context/AuthContext.tsx`

- Removed mock authentication
- Now uses real API calls

### File: `frontend/tourism-react/src/pages/Login.tsx`

- Updated demo passwords to match backend

### File: `frontend/tourism-react/src/pages/Register.tsx`

- Now auto-logs in after registration

---

## ✅ Success Checklist

- [ ] Database imported
- [ ] Backend health check works
- [ ] Can login with demo account
- [ ] Can register new account
- [ ] Can login with new account

---

## 🎉 You're Done!

If all checkboxes are checked, your system is fully working!

**Need help?** Check `FRONTEND_BACKEND_CONNECTION_FIX.md` for detailed troubleshooting.
