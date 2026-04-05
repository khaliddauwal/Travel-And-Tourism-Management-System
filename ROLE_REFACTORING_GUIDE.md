# Tourism Management System - Role Refactoring Guide

## Overview

This document describes the refactoring performed to remove the Agency role and support only TWO roles: **Admin** and **Tourist**.

## Changes Made

### 1. Database Changes

#### Roles Table

- **Before**: 3 roles (administrator, agent, tourist)
- **After**: 2 roles (administrator, tourist)
- Role IDs updated:
  - `1` = administrator (unchanged)
  - `2` = tourist (changed from agent)
  - `3` = removed (was tourist)

#### Users Table

- Default `role_id` changed from `3` to `2` (tourist)
- All existing agent users converted to tourist role

#### Migration Script

Run the migration script to update existing databases:

```bash
mysql -u root -p tms_system < database/migration_remove_agent_role.sql
```

### 2. Backend PHP Changes

#### AuthController.php

- Removed agent registration logic
- All new registrations default to tourist role (role_id = 2)
- Removed pending approval status for agents
- Simplified registration flow

#### Middleware/Auth.php

- No changes needed (role-based authorization still works)
- Supports checking for 'administrator' and 'tourist' roles

### 3. Frontend React Changes

#### Type Definitions (types/roles.ts)

- Updated `UserRole` type: `'tourist' | 'admin'` (removed 'agent')
- Removed agent permissions from `ROLE_PERMISSIONS`
- Admin now has all permissions previously split between agent and admin
- Updated role labels, descriptions, colors, and icons

#### Authentication Context (context/AuthContext.tsx)

- No structural changes needed
- Works with new 2-role system

#### Dashboard Structure

**New Structure:**

- `/dashboard` → Redirects to role-specific dashboard
- `/tourist/dashboard` → Tourist Dashboard
- `/admin/dashboard` → Admin Dashboard

**Removed:**

- `/agent/*` routes (all agent-specific routes)
- `AgentDashboard` component

#### New Dashboard Pages

Created two new role-specific dashboard pages:

- `src/pages/tourist/TouristDashboard.tsx`
- `src/pages/admin/AdminDashboard.tsx`

#### Routes (App.tsx)

**Tourist Routes:**

- `/tourist/dashboard` - Tourist dashboard
- `/tourist/bookings` - Tourist's bookings
- `/visa-request` - Request visa
- `/visa-status` - Check visa status
- `/packages` - Browse packages
- `/ai-recommendations` - AI travel assistant

**Admin Routes:**

- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/packages` - Package management
- `/admin/bookings` - All bookings management
- `/admin/visa` - Visa request management
- `/admin/reports` - System reports
- `/admin/settings` - System settings

**Removed Routes:**

- `/agent/packages`
- `/agent/bookings`
- `/agent/customers`
- `/agent/visa`

#### Header Component (components/Header.tsx)

- Removed agent-specific navigation items
- Updated user menu items for tourist and admin roles
- Simplified navigation structure

#### Register Page (pages/Register.tsx)

- Removed account type selection dropdown
- All registrations create tourist accounts
- Removed agent approval message

#### Login Page (pages/Login.tsx)

- Removed agent demo account
- Only shows tourist and admin demo accounts

### 4. Role Permissions

#### Tourist Permissions

- ✅ View packages
- ✅ Book packages
- ✅ Manage own bookings
- ✅ Request visa
- ✅ View own visa status
- ❌ Manage packages
- ❌ View all bookings
- ❌ Manage users
- ❌ Access admin panel

#### Admin Permissions

- ✅ All tourist permissions
- ✅ Manage packages
- ✅ View all bookings
- ✅ Manage customers
- ✅ View analytics
- ✅ Manage visa requests
- ✅ Manage users
- ✅ Access admin panel
- ✅ View reports
- ✅ Manage settings

## Testing Checklist

### Database

- [ ] Run migration script successfully
- [ ] Verify only 2 roles exist in roles table
- [ ] Verify all users have valid role_id (1 or 2)
- [ ] Check default role_id is 2 for new users

### Authentication

- [ ] Tourist registration works
- [ ] Tourist login redirects to `/tourist/dashboard`
- [ ] Admin login redirects to `/admin/dashboard`
- [ ] Role-based route protection works

### Tourist Features

- [ ] Can view packages
- [ ] Can make bookings
- [ ] Can view own bookings
- [ ] Can request visa
- [ ] Can check visa status
- [ ] Can use AI recommendations
- [ ] Cannot access admin routes

### Admin Features

- [ ] Can access admin dashboard
- [ ] Can manage users
- [ ] Can manage packages
- [ ] Can view all bookings
- [ ] Can manage visa requests
- [ ] Can access all admin tools

### UI/UX

- [ ] Navigation shows correct items for each role
- [ ] Role badges display correctly
- [ ] Dashboard redirects work properly
- [ ] No broken links to agent routes
- [ ] Demo accounts work (tourist and admin only)

## Demo Accounts

### Tourist Account

- **Email**: tourist@tms.com
- **Password**: Tourist@123
- **Access**: Tourist dashboard and features

### Admin Account

- **Email**: admin@tms.com
- **Password**: Admin@123
- **Access**: Full system access

## Files Modified

### Database

- `database/schema.sql` - Updated roles and default values
- `database/migration_remove_agent_role.sql` - New migration script

### Backend

- `backend/api/v2/controllers/AuthController.php` - Simplified registration

### Frontend - Types

- `frontend/tourism-react/src/types/roles.ts` - Updated role definitions

### Frontend - Pages

- `frontend/tourism-react/src/pages/Dashboard.tsx` - Redirect logic
- `frontend/tourism-react/src/pages/Register.tsx` - Removed account type
- `frontend/tourism-react/src/pages/Login.tsx` - Removed agent demo
- `frontend/tourism-react/src/pages/admin/AdminDashboard.tsx` - New file
- `frontend/tourism-react/src/pages/tourist/TouristDashboard.tsx` - New file

### Frontend - Components

- `frontend/tourism-react/src/components/Header.tsx` - Updated navigation
- `frontend/tourism-react/src/App.tsx` - Restructured routes

### Frontend - Context

- `frontend/tourism-react/src/context/AuthContext.tsx` - No changes needed

## Files Removed

The following agent-specific files can be safely deleted:

- `frontend/tourism-react/src/components/dashboards/AgentDashboard.tsx`

## Deployment Steps

1. **Backup Database**

   ```bash
   mysqldump -u root -p tms_system > backup_before_migration.sql
   ```

2. **Run Migration**

   ```bash
   mysql -u root -p tms_system < database/migration_remove_agent_role.sql
   ```

3. **Update Backend**
   - Deploy updated PHP files
   - Clear any PHP caches

4. **Update Frontend**

   ```bash
   cd frontend/tourism-react
   npm run build
   ```

5. **Test Thoroughly**
   - Test both tourist and admin accounts
   - Verify all features work correctly
   - Check for any console errors

6. **Monitor**
   - Watch for any authentication issues
   - Check error logs
   - Verify user experience

## Rollback Plan

If issues occur:

1. **Restore Database**

   ```bash
   mysql -u root -p tms_system < backup_before_migration.sql
   ```

2. **Revert Code**
   ```bash
   git revert <commit-hash>
   ```

## Support

For issues or questions:

- Check error logs in `backend/logs/app.log`
- Review browser console for frontend errors
- Verify database state with SQL queries

## Conclusion

The system now cleanly supports two roles:

- **Tourist**: End users who browse and book travel packages
- **Admin**: System administrators with full access

All agent functionality has been absorbed into the admin role, providing a simpler and more maintainable system architecture.
