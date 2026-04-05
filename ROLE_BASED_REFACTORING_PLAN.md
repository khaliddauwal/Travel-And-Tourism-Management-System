# Role-Based Dashboard Refactoring Plan

## Current Status Analysis

### ✅ Already Implemented

1. **Routing Structure**: Separate routes for admin (`/admin/*`) and tourist (`/tourist/*`)
2. **Protected Routes**: Role-based authentication with `ProtectedRoute` component
3. **Separate Dashboard Pages**: `AdminDashboard.tsx` and `TouristDashboard.tsx`
4. **Backend API**: Role-based authorization in middleware
5. **Auth Context**: Role checking with `isRole()` and `hasPermission()`

### ⚠️ Issues to Fix

1. **Shared Components**: Visa components in `/components` should be separated by role
2. **Component Organization**: Move tourist-specific components to `/pages/tourist/components`
3. **Admin Components**: Move admin-specific components to `/pages/admin/components`
4. **API Service**: Add role-specific methods clearly separated
5. **Dashboard Redirect**: Already working correctly via `/pages/Dashboard.tsx`

## Refactoring Steps

### Step 1: Create Role-Specific Component Folders

- `frontend/tourism-react/src/pages/admin/components/` - Admin-only components
- `frontend/tourism-react/src/pages/tourist/components/` - Tourist-only components

### Step 2: Move Visa Components

- Move `VisaRequestForm.tsx` → `pages/tourist/components/VisaRequestForm.tsx`
- Move `VisaStatusDashboard.tsx` → `pages/tourist/components/VisaStatusDashboard.tsx`
- Move `AdminVisaManagement.tsx` → `pages/admin/components/AdminVisaManagement.tsx`

### Step 3: Update Imports

- Update all imports in `App.tsx`
- Update any other files referencing moved components

### Step 4: Verify Backend API

- Ensure admin endpoints require `administrator` role
- Ensure tourist endpoints require `tourist` role
- Test role-based access control

### Step 5: Clean Up

- Remove unused shared components
- Update documentation
- Test all functionality

## Expected Outcome

- Admin sees only admin features
- Tourist sees only tourist features
- No shared components causing role confusion
- Clear separation of concerns
- Production-ready role-based system
