# 🚀 Quick Start Guide - Role-Based Tourism System

## ⚡ Quick Setup (5 Minutes)

### 1. Start Backend

```bash
# Make sure XAMPP is running (Apache + MySQL)
# Backend is at: http://localhost/Tourism-Management-System-main/backend/api/v2
```

### 2. Start Frontend

```bash
cd frontend/tourism-react
npm install
npm start
```

Frontend opens at: http://localhost:3000

### 3. Test Login

**Admin Login:**

- Email: `admin@example.com`
- Password: `admin123`
- Redirects to: `/admin/dashboard`

**Tourist Login:**

- Email: `tourist@example.com`
- Password: `tourist123`
- Redirects to: `/tourist/dashboard`

---

## 🎯 What Each Role Can Do

### 👑 Admin Dashboard (`/admin/dashboard`)

- View system statistics
- Manage users → `/admin/users`
- Manage packages → `/admin/packages`
- Manage bookings → `/admin/bookings`
- Manage visa requests → `/admin/visa`

### 🧳 Tourist Dashboard (`/tourist/dashboard`)

- Browse packages → `/packages`
- Make bookings → `/tourist/bookings`
- Request visa → `/visa-request`
- Track visa status → `/visa-status`
- AI recommendations → `/ai-recommendations`

---

## 🔒 Security Features

✅ Role-based route protection
✅ Backend API authorization
✅ JWT authentication
✅ Access denied for unauthorized routes

---

## 📁 Component Locations

```
Admin Components:    pages/admin/components/
Tourist Components:  pages/tourist/components/
Shared Components:   components/
```

---

## 🧪 Quick Test

Run the test script:

```bash
# Windows
.\test-role-separation.bat

# Linux/Mac
chmod +x test-role-separation.sh
./test-role-separation.sh
```

---

## 📚 Full Documentation

See `ROLE_SEPARATION_COMPLETE.md` for complete details.

---

**That's it! Your role-based system is ready to use.** 🎉
