# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

## Travel & Tourism Management System

**Version:** 1.0  
**Date:** January 20, 2024  
**Author:** Khalid Auwal Hafiz  
**Project Type:** Final Year Project

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [System Requirements](#5-system-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Appendices](#7-appendices)

---

## 1. INTRODUCTION

### 1.1 Purpose

This Software Requirements Specification (SRS) document provides a complete description of the Travel & Tourism Management System. It details the functional and non-functional requirements for the system, which is designed to facilitate travel package booking, visa assistance, and comprehensive tourism management.

### 1.2 Scope

The Travel & Tourism Management System is a web-based application that enables:

- Tourists to browse and book travel packages
- Travel agents to manage packages and customer bookings
- Administrators to oversee the entire system
- Visa assistance request and tracking
- Payment processing and booking management

### 1.3 Definitions, Acronyms, and Abbreviations

- **TMS:** Tourism Management System
- **RBAC:** Role-Based Access Control
- **API:** Application Programming Interface
- **UI:** User Interface
- **UX:** User Experience
- **SPA:** Single Page Application

### 1.4 References

- React Documentation: https://react.dev
- TypeScript Documentation: https://www.typescriptlang.org
- Material Design Guidelines
- Web Content Accessibility Guidelines (WCAG) 2.1

### 1.5 Overview

This document is organized into sections covering system description, features, interface requirements, and constraints.

---

## 2. OVERALL DESCRIPTION

### 2.1 Product Perspective

The Travel & Tourism Management System is a standalone web application consisting of:

- **Frontend:** React-based Single Page Application (SPA)
- **Backend:** PHP REST API (to be integrated)
- **Database:** MySQL (to be integrated)
- **Architecture:** Client-Server Model

### 2.2 Product Functions

The system provides the following major functions:

1. User authentication and authorization
2. Travel package browsing and booking
3. Visa assistance request and tracking
4. Payment processing
5. Booking management
6. User management (admin)
7. Package management (agent/admin)
8. Dashboard analytics
9. Notification system
10. Review and rating system

### 2.3 User Classes and Characteristics

#### 2.3.1 Tourist (Customer)

- **Description:** End users who browse and book travel packages
- **Technical Expertise:** Basic computer literacy
- **Frequency of Use:** Occasional to frequent
- **Primary Functions:** Browse packages, make bookings, request visas

#### 2.3.2 Travel Agent

- **Description:** Service providers who manage packages and assist customers
- **Technical Expertise:** Moderate computer literacy
- **Frequency of Use:** Daily
- **Primary Functions:** Create/edit packages, manage bookings, process visa requests

#### 2.3.3 Administrator

- **Description:** System managers with full access
- **Technical Expertise:** Advanced computer literacy
- **Frequency of Use:** Daily
- **Primary Functions:** User management, system oversight, reports, settings

### 2.4 Operating Environment

- **Client Side:**
  - Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
  - Responsive design supporting devices from 375px to 4K displays
  - JavaScript enabled
  - Minimum 2GB RAM
  - Stable internet connection

- **Server Side:**
  - Apache/Nginx web server
  - PHP 7.4 or higher
  - MySQL 5.7 or higher
  - Minimum 4GB RAM
  - 20GB storage

### 2.5 Design and Implementation Constraints

- Must use React 19+ with TypeScript
- Must follow responsive design principles
- Must support dark and light themes
- Must implement role-based access control
- Must be accessible (WCAG 2.1 Level AA compliance goal)
- Must work offline for cached content
- Must support multiple currencies (NGN, USD)

### 2.6 Assumptions and Dependencies

- Users have access to modern web browsers
- Stable internet connection available
- Payment gateway integration will be implemented
- Email service for notifications will be configured
- SSL certificate for secure connections

---

## 3. SYSTEM FEATURES

### 3.1 User Authentication and Authorization

#### 3.1.1 Description

Secure user registration, login, and role-based access control system.

#### 3.1.2 Functional Requirements

**FR-AUTH-001:** User Registration

- System shall allow new users to register with email, password, full name, and mobile number
- System shall validate email format and uniqueness
- System shall enforce password strength requirements (minimum 6 characters)
- System shall assign default role (tourist) to new registrations
- System shall send confirmation email upon successful registration

**FR-AUTH-002:** User Login

- System shall authenticate users with email and password
- System shall maintain user session using JWT tokens
- System shall redirect users to role-appropriate dashboard after login
- System shall provide "Remember Me" functionality
- System shall lock account after 5 failed login attempts

**FR-AUTH-003:** Password Recovery

- System shall provide "Forgot Password" functionality
- System shall send password reset link to registered email
- System shall expire reset links after 24 hours
- System shall enforce password change on first login

**FR-AUTH-004:** Role-Based Access Control

- System shall implement three user roles: Tourist, Agent, Administrator
- System shall enforce 14 distinct permissions across roles
- System shall prevent unauthorized access to protected routes
- System shall display role-appropriate navigation and features

**FR-AUTH-005:** Session Management

- System shall maintain user session across page refreshes
- System shall auto-logout after 30 minutes of inactivity
- System shall allow users to manually logout
- System shall clear all session data on logout

### 3.2 Package Management

#### 3.2.1 Description

Comprehensive travel package creation, editing, and browsing functionality.

#### 3.2.2 Functional Requirements

**FR-PKG-001:** Browse Packages

- System shall display all available packages on packages page
- System shall show package cards with image, title, location, price, and duration
- System shall support filtering by package type
- System shall support search by name or location
- System shall display 6 packages per page with pagination

**FR-PKG-002:** View Package Details

- System shall display complete package information on details page
- System shall show package images, description, itinerary, and pricing
- System shall display included features and requirements
- System shall show customer reviews and ratings
- System shall provide booking button for available packages

**FR-PKG-003:** Create Package (Agent/Admin)

- System shall allow agents and admins to create new packages
- System shall require: name, location, type, price, features, description, image
- System shall validate all required fields
- System shall support image upload (max 5MB, JPG/PNG)
- System shall set package status to "pending" by default

**FR-PKG-004:** Edit Package (Agent/Admin)

- System shall allow package owners to edit their packages
- System shall allow admins to edit any package
- System shall maintain package edit history
- System shall notify affected bookings of changes

**FR-PKG-005:** Delete Package (Agent/Admin)

- System shall allow package deletion with confirmation
- System shall prevent deletion of packages with active bookings
- System shall archive deleted packages for records
- System shall notify affected users

**FR-PKG-006:** Package Types

- System shall support 6 package types: City Tour, Adventure, Festival, Cultural, Nature, Wildlife
- System shall allow filtering by package type
- System shall display type badge on package cards

### 3.3 Booking Management

#### 3.3.1 Description

Complete booking lifecycle management from creation to completion.

#### 3.3.2 Functional Requirements

**FR-BKG-001:** Create Booking

- System shall allow authenticated users to book packages
- System shall require: travel date, number of participants, emergency contact
- System shall validate travel date (minimum 7 days in advance)
- System shall calculate total amount based on participants
- System shall generate unique booking reference (TMS-XXXXX format)
- System shall set initial status to "pending"

**FR-BKG-002:** View Bookings

- System shall display user's bookings in dashboard
- System shall show booking details: package, date, participants, amount, status
- System shall allow filtering by status (pending, confirmed, cancelled, completed)
- System shall allow filtering by date range
- System shall support search by booking reference or package name

**FR-BKG-003:** Update Booking Status (Agent/Admin)

- System shall allow agents to update booking status
- System shall support status transitions: pending → confirmed/cancelled
- System shall send notification on status change
- System shall maintain status change history

**FR-BKG-004:** Cancel Booking

- System shall allow users to cancel pending bookings
- System shall require cancellation reason
- System shall process refund based on cancellation policy
- System shall send cancellation confirmation

**FR-BKG-005:** Booking Confirmation

- System shall display booking confirmation page after successful booking
- System shall show booking reference, package details, and payment instructions
- System shall send confirmation email with booking details
- System shall provide option to download booking receipt

**FR-BKG-006:** Booking History

- System shall maintain complete booking history
- System shall show completed, cancelled, and active bookings
- System shall allow users to review past bookings
- System shall enable re-booking of past packages

### 3.4 Visa Assistance

#### 3.4.1 Description

Visa application request and tracking system for international travel.

#### 3.4.2 Functional Requirements

**FR-VISA-001:** Submit Visa Request

- System shall allow users to submit visa assistance requests
- System shall require: destination country, travel purpose, intended date, passport number
- System shall support document upload (PDF, JPG, PNG, max 5MB)
- System shall validate passport number format
- System shall validate travel date (must be future date)
- System shall generate unique request ID

**FR-VISA-002:** View Visa Status

- System shall display user's visa requests with current status
- System shall show status: submitted, under_review, approved, rejected
- System shall display admin comments if available
- System shall show submission and update timestamps
- System shall allow filtering by status

**FR-VISA-003:** Update Visa Status (Agent/Admin)

- System shall allow agents/admins to update visa request status
- System shall require admin comments for status changes
- System shall send notification to user on status update
- System shall maintain status change history

**FR-VISA-004:** Visa Request Management (Admin)

- System shall display all visa requests in admin panel
- System shall allow filtering by status and date
- System shall show user information with each request
- System shall provide bulk status update functionality
- System shall generate visa request reports

**FR-VISA-005:** Travel Purposes

- System shall support 6 travel purposes: Tourism, Business, Education, Medical, Family Visit, Other
- System shall display purpose in dropdown selection
- System shall use purpose for processing priority

### 3.5 Payment Processing

#### 3.5.1 Description

Secure payment processing for bookings and services.

#### 3.5.2 Functional Requirements

**FR-PAY-001:** Payment Methods

- System shall support multiple payment methods: Card, Bank Transfer, Mobile Money
- System shall validate payment information before processing
- System shall encrypt sensitive payment data
- System shall integrate with payment gateway

**FR-PAY-002:** Process Payment

- System shall calculate total amount including taxes and fees
- System shall display payment breakdown before processing
- System shall process payment through secure gateway
- System shall update booking status on successful payment
- System shall generate payment receipt

**FR-PAY-003:** Payment Confirmation

- System shall display payment confirmation page
- System shall send payment receipt via email
- System shall update booking payment status
- System shall provide transaction reference number

**FR-PAY-004:** Refund Processing

- System shall process refunds for cancelled bookings
- System shall calculate refund amount based on cancellation policy
- System shall process refund to original payment method
- System shall send refund confirmation

**FR-PAY-005:** Payment History

- System shall maintain complete payment history
- System shall display all transactions in user dashboard
- System shall allow filtering by date and status
- System shall provide downloadable payment receipts

### 3.6 User Management (Admin)

#### 3.6.1 Description

Administrative functions for managing system users.

#### 3.6.2 Functional Requirements

**FR-USER-001:** View Users

- System shall display all registered users in admin panel
- System shall show user details: name, email, role, status, registration date
- System shall support pagination (10 users per page)
- System shall allow filtering by role and status
- System shall support search by name or email

**FR-USER-002:** Create User

- System shall allow admins to create new users
- System shall require: full name, email, password, mobile number, role
- System shall validate email uniqueness
- System shall send welcome email to new users
- System shall set default status to "active"

**FR-USER-003:** Edit User

- System shall allow admins to edit user information
- System shall allow updating: name, email, mobile, role, status
- System shall prevent admins from demoting themselves
- System shall log all user modifications
- System shall notify users of profile changes

**FR-USER-004:** Delete User

- System shall allow admins to delete users with confirmation
- System shall prevent deletion of users with active bookings
- System shall archive deleted user data
- System shall transfer user bookings to admin

**FR-USER-005:** User Status Management

- System shall support three user statuses: active, inactive, suspended
- System shall allow admins to change user status
- System shall prevent login for inactive/suspended users
- System shall send notification on status change

**FR-USER-006:** Role Assignment

- System shall allow admins to assign/change user roles
- System shall support three roles: tourist, agent, admin
- System shall update user permissions immediately
- System shall log all role changes

### 3.7 Dashboard and Analytics

#### 3.7.1 Description

Role-specific dashboards with relevant information and analytics.

#### 3.7.2 Functional Requirements

**FR-DASH-001:** Tourist Dashboard

- System shall display user profile information
- System shall show booking summary (active, completed)
- System shall display visa application status
- System shall show quick action buttons
- System shall display travel tips and recommendations

**FR-DASH-002:** Agent Dashboard

- System shall display performance metrics (customers, bookings, revenue)
- System shall show recent bookings with status
- System shall display visa request summary
- System shall show customer insights
- System shall provide quick access to management tools

**FR-DASH-003:** Admin Dashboard

- System shall display system overview (users, agents, revenue)
- System shall show recent activity feed
- System shall display system health metrics
- System shall show financial overview
- System shall provide quick stats (bookings, visa requests, ratings)

**FR-DASH-004:** Analytics

- System shall generate booking analytics (daily, weekly, monthly)
- System shall show revenue trends and forecasts
- System shall display popular packages and destinations
- System shall show user growth metrics
- System shall provide exportable reports

### 3.8 Notification System

#### 3.8.1 Description

Real-time notification system for important events and updates.

#### 3.8.2 Functional Requirements

**FR-NOTIF-001:** Notification Types

- System shall support 5 notification types: booking, visa, payment, system, promotion
- System shall display notifications in notification center
- System shall show unread count badge
- System shall support notification filtering by type

**FR-NOTIF-002:** Notification Delivery

- System shall send in-app notifications for important events
- System shall send email notifications for critical updates
- System shall allow users to configure notification preferences
- System shall support push notifications (future enhancement)

**FR-NOTIF-003:** Notification Management

- System shall allow users to mark notifications as read
- System shall allow users to delete notifications
- System shall auto-archive notifications after 30 days
- System shall provide notification history

**FR-NOTIF-004:** Notification Events

- System shall notify on: booking confirmation, payment success, visa status update
- System shall notify on: booking cancellation, refund processing
- System shall notify on: system maintenance, promotional offers
- System shall notify agents on: new bookings, customer inquiries

### 3.9 Review and Rating System

#### 3.9.1 Description

Customer review and rating system for packages and services.

#### 3.9.2 Functional Requirements

**FR-REV-001:** Submit Review

- System shall allow users to review completed bookings
- System shall require rating (1-5 stars) and optional comment
- System shall validate review content (max 500 characters)
- System shall set review status to "pending" for moderation
- System shall prevent multiple reviews for same booking

**FR-REV-002:** View Reviews

- System shall display approved reviews on package details page
- System shall show reviewer name, rating, comment, and date
- System shall calculate and display average rating
- System shall sort reviews by date (newest first)
- System shall support pagination for reviews

**FR-REV-003:** Moderate Reviews (Admin)

- System shall allow admins to approve/reject reviews
- System shall allow admins to edit inappropriate content
- System shall allow admins to delete spam reviews
- System shall notify users of review status

**FR-REV-004:** Rating Analytics

- System shall calculate average rating per package
- System shall display rating distribution (5-star breakdown)
- System shall show total review count
- System shall highlight top-rated packages

### 3.10 AI Recommendations

#### 3.10.1 Description

AI-powered personalized travel package recommendations.

#### 3.10.2 Functional Requirements

**FR-AI-001:** Preference Collection

- System shall collect user travel preferences (budget, duration, interests)
- System shall allow users to update preferences anytime
- System shall store preference history
- System shall use preferences for recommendations

**FR-AI-002:** Generate Recommendations

- System shall generate personalized package recommendations
- System shall consider user preferences, booking history, and ratings
- System shall display top 4-6 recommended packages
- System shall update recommendations based on user interactions

**FR-AI-003:** Recommendation Display

- System shall display recommendations on home page and dashboard
- System shall show recommendation reason/match score
- System shall allow users to save recommendations
- System shall track recommendation click-through rate

---

## 4. EXTERNAL INTERFACE REQUIREMENTS

### 4.1 User Interfaces

#### 4.1.1 General UI Requirements

- System shall provide responsive design for all screen sizes (375px - 4K)
- System shall support dark and light themes
- System shall follow Material Design principles
- System shall provide consistent navigation across all pages
- System shall display loading states for async operations
- System shall show error messages clearly
- System shall provide breadcrumb navigation
- System shall support keyboard navigation

#### 4.1.2 Public Pages

**Home Page:**

- Hero section with search bar
- Featured packages grid (4 cards)
- Popular destinations section
- Why choose us section
- Vacation highlights
- AI recommendations (for logged-in users)

**Packages Page:**

- Package grid with filters
- Search functionality
- Type filter dropdown
- Pagination controls
- Package cards with image, title, location, price, duration

**Package Details Page:**

- Large hero image
- Package information (title, location, type, price)
- Description and itinerary
- Features list
- Booking form (sticky sidebar)
- Reviews section
- Related packages

**About Page:**

- Company information
- Mission and vision
- Team members
- Contact information

**Contact Page:**

- Contact form
- Office locations
- Social media links
- Map integration

#### 4.1.3 Authentication Pages

**Login Page:**

- Email and password fields
- Remember me checkbox
- Forgot password link
- Register link
- Demo accounts panel (toggleable)

**Register Page:**

- Full name, email, password, mobile number fields
- Role selection (optional)
- Terms and conditions checkbox
- Submit button
- Login link

**Forgot Password Page:**

- Email input field
- Submit button
- Back to login link

#### 4.1.4 Dashboard Pages

**Tourist Dashboard:**

- Profile card
- Quick actions (Browse, Request Visa, Check Status)
- Bookings summary
- Visa applications summary
- Travel tips
- Recommended packages

**Agent Dashboard:**

- Performance overview (4 metrics)
- Agent tools (4 action buttons)
- Recent bookings list
- Visa management summary
- Customer insights
- Tasks and reminders

**Admin Dashboard:**

- System overview (3 key metrics)
- Admin tools (4 management links)
- Recent activity feed
- System health indicators
- Financial overview
- Quick stats

#### 4.1.5 Management Pages

**Booking Management:**

- Data table with 8 columns
- Filter controls (search, status, date)
- Bulk actions
- Booking details modal
- Status update controls

**User Management:**

- User data table
- Filter controls (search, role, status)
- Create user button
- Edit/delete actions
- User details modal

**Visa Management:**

- Visa requests table
- Status filter tabs
- Update status modal
- Admin comments field
- Document preview

**Package Management:**

- Package list/grid view
- Create package button
- Edit/delete actions
- Package form modal
- Image upload

### 4.2 Hardware Interfaces

- No direct hardware interfaces required
- System shall support standard input devices (keyboard, mouse, touchscreen)
- System shall support standard output devices (monitor, printer)

### 4.3 Software Interfaces

#### 4.3.1 Frontend Framework

- **React 19.2.3:** UI component library
- **React Router 7.12.0:** Client-side routing
- **TypeScript 4.9.5:** Type-safe JavaScript
- **Axios 1.13.2:** HTTP client for API calls

#### 4.3.2 Backend API (To be integrated)

- **PHP 7.4+:** Server-side language
- **RESTful API:** Communication protocol
- **JSON:** Data exchange format
- **JWT:** Authentication tokens

#### 4.3.3 Database (To be integrated)

- **MySQL 5.7+:** Relational database
- **InnoDB:** Storage engine
- **UTF-8:** Character encoding

#### 4.3.4 Third-Party Services

- **Payment Gateway:** Stripe/Paystack integration
- **Email Service:** SMTP/SendGrid for notifications
- **Cloud Storage:** AWS S3/Cloudinary for images
- **Maps API:** Google Maps for location display

### 4.4 Communication Interfaces

#### 4.4.1 HTTP/HTTPS

- System shall use HTTPS for all communications
- System shall use RESTful API architecture
- System shall support JSON data format
- System shall implement CORS for cross-origin requests

#### 4.4.2 API Endpoints Structure

```
Base URL: /api/v1

Authentication:
- POST /auth/login
- POST /auth/register
- POST /auth/logout
- GET /auth/me

Packages:
- GET /packages
- GET /packages/:id
- POST /packages (agent/admin)
- PUT /packages/:id (agent/admin)
- DELETE /packages/:id (agent/admin)

Bookings:
- GET /bookings
- GET /bookings/:id
- POST /bookings
- PUT /bookings/:id
- DELETE /bookings/:id

Visa:
- POST /visa/submit
- GET /visa/my-requests
- GET /visa/:id
- GET /visa/admin/all (admin)
- PUT /visa/:id/status (admin)

Users:
- GET /users (admin)
- GET /users/:id (admin)
- POST /users (admin)
- PUT /users/:id (admin)
- DELETE /users/:id (admin)
```

---

## 5. SYSTEM REQUIREMENTS

### 5.1 Functional Requirements Summary

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-AUTH-001 | User Registration | High | ✅ Implemented |
| FR-AUTH-002 | User Login | High | ✅ Implemented |
| FR-AUTH-003 | Password Recovery | Medium | ✅ Implemented |
| FR-AUTH-004 | Role-Based Access Control | High | ✅ Implemented |
| FR-AUTH-005 | Session Management | High | ✅ Implemented |
| FR-PKG-001 | Browse Packages | High | ✅ Implemented |
| FR-PKG-002 | View Package Details | High | ✅ Implemented |
| FR-PKG-003 | Create Package | High | 🔄 Pending Backend |
| FR-PKG-004 | Edit Package | High | 🔄 Pending Backend |
| FR-PKG-005 | Delete Package | Medium | 🔄 Pending Backend |
| FR-PKG-006 | Package Types | High | ✅ Implemented |
| FR-BKG-001 | Create Booking | High | ✅ Implemented |
| FR-BKG-002 | View Bookings | High | ✅ Implemented |
| FR-BKG-003 | Update Booking Status | High | ✅ Implemented |
| FR-BKG-004 | Cancel Booking | Medium | ✅ Implemented |
| FR-BKG-005 | Booking Confirmation | High | ✅ Implemented |
| FR-BKG-006 | Booking History | Medium | ✅ Implemented |
| FR-VISA-001 | Submit Visa Request | High | ✅ Implemented |
| FR-VISA-002 | View Visa Status | High | ✅ Implemented |
| FR-VISA-003 | Update Visa Status | High | ✅ Implemented |
| FR-VISA-004 | Visa Request Management | High | ✅ Implemented |
|