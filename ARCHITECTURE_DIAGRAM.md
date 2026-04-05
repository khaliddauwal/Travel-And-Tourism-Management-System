# 🏗️ Tourism Management System - Architecture Diagram

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                      (React + TypeScript)                       │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
         ┌──────────▼──────────┐   ┌─────────▼──────────┐
         │   ADMIN PORTAL      │   │   TOURIST PORTAL   │
         │  /admin/dashboard   │   │ /tourist/dashboard │
         └──────────┬──────────┘   └─────────┬──────────┘
                    │                         │
         ┌──────────▼──────────┐   ┌─────────▼──────────┐
         │  Admin Components   │   │ Tourist Components │
         │  ┌───────────────┐  │   │  ┌──────────────┐  │
         │  │ User Mgmt     │  │   │  │ Packages     │  │
         │  │ Package CRUD  │  │   │  │ Bookings     │  │
         │  │ Booking Mgmt  │  │   │  │ Visa Request │  │
         │  │ Visa Mgmt     │  │   │  │ AI Assistant │  │
         │  └───────────────┘  │   │  └──────────────┘  │
         └──────────┬──────────┘   └─────────┬──────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   PROTECTED ROUTES      │
                    │   Role-Based Access     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    AUTH CONTEXT         │
                    │  JWT + Role Checking    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      API SERVICE        │
                    │   (Axios + Interceptors)│
                    └────────────┬────────────┘
                                 │
                                 │ HTTP/HTTPS
                                 │
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                             │
│                      (PHP + MySQL)                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │    API ROUTER           │
                    │   /api/v2/index.php     │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   AUTH MIDDLEWARE       │
                    │  JWT Validation + RBAC  │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼────┐           ┌─────▼─────┐         ┌──────▼──────┐
    │  Admin  │           │  Tourist  │         │   Shared    │
    │  APIs   │           │   APIs    │         │    APIs     │
    └────┬────┘           └─────┬─────┘         └──────┬──────┘
         │                      │                       │
         │                      │                       │
    ┌────▼────────────────┐    │    ┌─────────────────▼────┐
    │ • User Management   │    │    │ • Authentication     │
    │ • Package CRUD      │    │    │ • Package Listing    │
    │ • All Bookings      │    │    │ • Health Check       │
    │ • Visa Processing   │    │    └──────────────────────┘
    │ • Reports           │    │
    └─────────────────────┘    │
                               │
                    ┌──────────▼──────────┐
                    │ • My Bookings       │
                    │ • Create Booking    │
                    │ • My Visa Requests  │
                    │ • Submit Visa       │
                    │ • My Payments       │
                    └──────────┬──────────┘
                               │
┌─────────────────────────────────────────────────────────────────┐
│                          DATABASE                               │
│                         (MySQL)                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ├── users (with role_id)
         ├── roles (admin, tourist)
         ├── packages
         ├── bookings
         ├── visa_applications
         ├── payments
         └── reviews
```

---

## 🔐 Authentication Flow

```
┌─────────┐
│  Login  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ POST /auth/login│
└────┬────────────┘
     │
     ▼
┌──────────────────┐
│ Verify Password  │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Generate JWT     │
│ (with role info) │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Return Token +   │
│ User Data        │
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ Store in         │
│ localStorage     │
└────┬─────────────┘
     │
     ├─── role === 'admin' ──────► /admin/dashboard
     │
     └─── role === 'tourist' ────► /tourist/dashboard
```

---

## 🛡️ Route Protection Flow

```
User navigates to /admin/dashboard
         │
         ▼
┌─────────────────────┐
│  ProtectedRoute     │
│  Component          │
└────┬────────────────┘
     │
     ▼
┌─────────────────────┐
│  Check if user      │
│  is logged in       │
└────┬────────────────┘
     │
     ├─── NO ──────────────────► Redirect to /login
     │
     ▼ YES
┌─────────────────────┐
│  Check if user has  │
│  required role      │
└────┬────────────────┘
     │
     ├─── NO ──────────────────► Show "Access Denied"
     │
     ▼ YES
┌─────────────────────┐
│  Render Protected   │
│  Component          │
└─────────────────────┘
```

---

## 📦 Component Hierarchy

```
App.tsx
├── ThemeProvider
├── ToastProvider
├── AuthProvider
│   └── Router
│       ├── Header (role-aware navigation)
│       ├── Routes
│       │   ├── Public Routes
│       │   │   ├── Home
│       │   │   ├── About
│       │   │   ├── Contact
│       │   │   ├── Login
│       │   │   └── Register
│       │   │
│       │   ├── Admin Routes (Protected)
│       │   │   ├── AdminDashboard
│       │   │   ├── UserManagement
│       │   │   ├── PackageManagement
│       │   │   ├── BookingManagement
│       │   │   └── AdminVisaManagement
│       │   │
│       │   └── Tourist Routes (Protected)
│       │       ├── TouristDashboard
│       │       ├── Packages
│       │       ├── PackageDetails
│       │       ├── TouristBookings
│       │       ├── BookingConfirmation
│       │       ├── Payment
│       │       ├── AIRecommendationsPage
│       │       ├── VisaRequestForm
│       │       └── VisaStatusDashboard
│       │
│       └── Footer
│
└── ErrorBoundary
```

---

## 🗂️ Folder Structure

```
frontend/tourism-react/src/
│
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── PackageManagement.tsx
│   │   ├── BookingManagement.tsx
│   │   └── components/
│   │       └── AdminVisaManagement.tsx
│   │
│   ├── tourist/
│   │   ├── TouristDashboard.tsx
│   │   ├── TouristBookings.tsx
│   │   ├── Packages.tsx
│   │   ├── PackageDetails.tsx
│   │   ├── BookingConfirmation.tsx
│   │   ├── Payment.tsx
│   │   ├── AIRecommendationsPage.tsx
│   │   └── components/
│   │       ├── VisaRequestForm.tsx
│   │       ├── VisaStatusDashboard.tsx
│   │       ├── AIRecommendations.tsx
│   │       ├── BookingForm.tsx
│   │       ├── PaymentForm.tsx
│   │       └── ReviewSystem.tsx
│   │
│   ├── Dashboard.tsx (role redirect)
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Home.tsx
│   ├── About.tsx
│   └── Contact.tsx
│
├── components/ (shared)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── ProtectedRoute.tsx
│   ├── Toast.tsx
│   └── NotificationCenter.tsx
│
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── services/
│   └── api.ts
│
└── types/
    ├── roles.ts
    ├── visa.ts
    └── management.ts
```

---

## 🔄 Data Flow Example: Tourist Makes Booking

```
1. Tourist browses packages
   └─► GET /api/v2/packages
       └─► Returns all packages

2. Tourist selects package
   └─► Navigate to /packages/:id
       └─► GET /api/v2/packages/:id
           └─► Returns package details

3. Tourist fills booking form
   └─► BookingForm component
       └─► Validates input
           └─► Calculates total

4. Tourist submits booking
   └─► POST /api/v2/bookings
       ├─► Auth middleware checks JWT
       ├─► Validates tourist role
       ├─► Creates booking record
       └─► Returns booking ID

5. Redirect to payment
   └─► Navigate to /payment/:bookingId
       └─► PaymentForm component
           └─► POST /api/v2/payments
               ├─► Auth middleware checks JWT
               ├─► Processes payment
               ├─► Updates booking status
               └─► Returns payment confirmation

6. Show confirmation
   └─► Navigate to /tourist/booking/:bookingId
       └─► Display booking details
```

---

## 🔄 Data Flow Example: Admin Manages Visa Request

```
1. Admin views visa requests
   └─► GET /api/v2/visa
       ├─► Auth middleware checks JWT
       ├─► Validates admin role
       └─► Returns ALL visa requests

2. Admin selects request
   └─► GET /api/v2/visa/:id
       └─► Returns full request details

3. Admin updates status
   └─► PUT /api/v2/visa/:id/status
       ├─► Auth middleware checks JWT
       ├─► Validates admin role
       ├─► Updates status
       ├─► Adds admin comments
       ├─► Creates notification for tourist
       └─► Returns updated request

4. Tourist receives notification
   └─► Notification appears in tourist dashboard
       └─► Tourist can view updated status
```

---

## 🎯 Key Design Decisions

### 1. Component Separation

- **Decision:** Separate components by role into dedicated folders
- **Reason:** Prevents confusion, improves maintainability
- **Result:** Clear ownership and responsibility

### 2. Route Protection

- **Decision:** Use HOC (ProtectedRoute) for route guards
- **Reason:** Reusable, declarative, easy to understand
- **Result:** Consistent protection across all routes

### 3. Backend Authorization

- **Decision:** Middleware-based authorization
- **Reason:** Centralized security, DRY principle
- **Result:** Every endpoint is protected

### 4. Role-Based Rendering

- **Decision:** Components check user role before rendering
- **Reason:** Fine-grained control, better UX
- **Result:** Users only see relevant features

### 5. JWT Authentication

- **Decision:** Token-based auth with role in payload
- **Reason:** Stateless, scalable, includes role info
- **Result:** Fast authorization checks

---

## 📈 Scalability Considerations

### Current Architecture Supports:

✅ Adding new roles (e.g., "agent", "manager")
✅ Adding new admin features
✅ Adding new tourist features
✅ Horizontal scaling (stateless JWT)
✅ Microservices migration (clear boundaries)

### Future Enhancements:

- Role hierarchy (super admin > admin > agent)
- Permission-based access (granular than roles)
- Multi-tenant support
- API versioning (v3, v4)
- GraphQL layer

---

## 🎉 Summary

This architecture provides:

- ✅ **Clear Separation** - Admin and Tourist completely separated
- ✅ **Security** - Multiple layers of protection
- ✅ **Maintainability** - Easy to understand and modify
- ✅ **Scalability** - Ready for growth
- ✅ **Best Practices** - Industry-standard patterns

**Your system is production-ready!** 🚀
