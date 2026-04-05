# Role-Based Access Control Testing Guide

## Overview

This document outlines how to test the role-based access control system implemented in the Tourism Management System.

## Demo Accounts

The system includes three demo accounts for testing different roles:

### 1. Tourist Account

- **Name:** Amina Abdullahi
- **Email:** tourist@demo.com
- **Password:** demo123
- **Role:** Tourist 🧳
- **Permissions:** View packages, book packages, manage own bookings, request visa, view own visa status

### 2. Agent Account

- **Name:** Ibrahim Musa
- **Email:** agent@demo.com
- **Password:** demo123
- **Role:** Travel Agent 🎯
- **Permissions:** All tourist permissions + manage packages, view all bookings, manage customers, view analytics, manage visa requests, view reports

### 3. Admin Account

- **Name:** Khalid Auwal Hafiz (Project Lead)
- **Email:** admin@demo.com
- **Password:** demo123
- **Role:** Administrator 👑
- **Permissions:** Full system access including user management, settings, and all other features

## Testing Steps

### 1. Start the Application

```bash
cd frontend/tourism-react
npm start
```

The app will be available at http://localhost:3000

### 2. Test Login System

1. Navigate to http://localhost:3000/login
2. Click "Show Demo Accounts" to see all available demo accounts
3. Try logging in with each demo account
4. Verify successful login redirects to dashboard

### 3. Test Role-Based Navigation

After logging in with each role, verify the navigation menu shows appropriate items:

#### Tourist Navigation

- Home, Packages, Visa Assistance, About, Contact
- User dropdown: Dashboard, Visa Status

#### Agent Navigation

- Home, Packages, Visa Assistance, Manage Packages, All Bookings, About, Contact
- User dropdown: Dashboard, Visa Status, Visa Management

#### Admin Navigation

- Home, Packages, Visa Assistance, Manage Packages, All Bookings, Admin Panel, About, Contact
- User dropdown: Dashboard, Visa Status, Admin Visa, User Management

### 4. Test Role-Specific Dashboards

1. Login with each role
2. Navigate to /dashboard
3. Verify each role sees a different dashboard with role-appropriate content

### 5. Test Protected Routes

Try accessing these URLs directly while logged in as different roles:

#### Tourist Access (should work)

- /dashboard
- /visa-request
- /visa-status

#### Tourist Restricted (should show "Access Denied")

- /agent/packages
- /agent/bookings
- /admin/dashboard
- /admin/users

#### Agent Access (should work)

- All tourist routes
- /agent/packages
- /agent/bookings
- /agent/visa

#### Agent Restricted (should show "Access Denied")

- /admin/users
- /admin/settings

#### Admin Access (should work)

- All routes in the system

### 6. Test Unauthorized Access

1. Logout and try accessing protected routes
2. Should redirect to login page
3. Login with lower privilege role and try accessing higher privilege routes
4. Should show "Access Denied" page with role information

### 7. Test Role Indicators

Verify role indicators appear correctly:

- Top header shows role badge
- User dropdown shows role icon and name
- Demo accounts page shows role colors and descriptions

## Expected Behavior

### ✅ Working Features

- [x] Role-based login with demo accounts
- [x] Role-specific navigation menus
- [x] Role-specific dashboards
- [x] Protected route access control
- [x] Unauthorized access handling
- [x] Role indicators and badges
- [x] Mobile responsive design
- [x] Proper TypeScript typing

### 🔄 Future Enhancements

- [ ] Backend integration for real authentication
- [ ] Database-driven role management
- [ ] Dynamic permission assignment
- [ ] Audit logging for role-based actions

## Troubleshooting

### Common Issues

1. **TypeScript Errors:** Run `npm run build` to check for compilation errors
2. **Navigation Not Updating:** Clear browser cache and localStorage
3. **Demo Login Fails:** Ensure exact email/password match (case sensitive)

### Reset Demo Data

To reset demo authentication data:

```javascript
localStorage.removeItem("demoUser");
```

## Security Notes

- This is a frontend-only implementation for demonstration
- Real applications should implement backend authorization
- Never rely solely on frontend access control for security
- Always validate permissions on the server side
