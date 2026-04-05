# API Documentation

## Travel & Tourism Management System API v2

**Base URL:** `http://localhost/backend/api/v2`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Packages](#packages)
3. [Bookings](#bookings)
4. [Visa Applications](#visa-applications)
5. [Payments](#payments)
6. [Users](#users)
7. [Reviews](#reviews)
8. [Error Handling](#error-handling)

---

## Authentication

### Register

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "mobile": "08012345678",
  "password": "password123"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "mobile": "08012345678",
      "role_name": "tourist",
      "status": "active"
    }
  }
}
```

---

### Login

Authenticate user and get JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "admin@tms.com",
  "password": "Admin@123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "id": 1,
      "full_name": "System Administrator",
      "email": "admin@tms.com",
      "role_name": "administrator"
    }
  }
}
```

---

### Get Current User

Get authenticated user profile.

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "User profile retrieved",
  "data": {
    "id": 1,
    "full_name": "System Administrator",
    "email": "admin@tms.com",
    "role_name": "administrator",
    "status": "active"
  }
}
```

---

### Forgot Password

Request password reset token.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password reset link sent to email",
  "data": {
    "reset_token": "abc123..."
  }
}
```

---

### Reset Password

Reset password using token.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**

```json
{
  "token": "abc123...",
  "password": "newpassword123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Packages

### Get All Packages

Get list of travel packages with pagination and filters.

**Endpoint:** `GET /packages`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `type` (optional): Package type filter
- `search` (optional): Search by name or destination
- `status` (optional): Package status (default: published)

**Example:** `GET /packages?page=1&limit=10&type=adventure`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "packages": [
      {
        "id": 1,
        "name": "Northern Nigeria Heritage Tour",
        "slug": "northern-nigeria-heritage-tour",
        "destination": "Kano, Kaduna, Zaria",
        "type": "cultural",
        "duration": 5,
        "price": "150000.00",
        "description": "Explore the rich cultural heritage...",
        "image": "uploads/packages/abc123.jpg",
        "status": "published",
        "avg_rating": "4.5",
        "review_count": "12",
        "created_by_name": "Travel Agent",
        "created_at": "2024-01-15 10:30:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 10,
      "total": 25,
      "total_pages": 3
    }
  }
}
```

---

### Get Single Package

Get detailed information about a specific package.

**Endpoint:** `GET /packages/{id}`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": 1,
    "name": "Northern Nigeria Heritage Tour",
    "destination": "Kano, Kaduna, Zaria",
    "type": "cultural",
    "duration": 5,
    "price": "150000.00",
    "description": "Explore the rich cultural heritage...",
    "itinerary": "Day 1: Arrival in Kano...",
    "inclusions": "Accommodation, Meals, Transport",
    "requirements": "Valid ID, Comfortable shoes",
    "image": "uploads/packages/abc123.jpg",
    "avg_rating": "4.5",
    "review_count": "12",
    "reviews": [
      {
        "id": 1,
        "user_name": "John Doe",
        "rating": 5,
        "comment": "Amazing experience!",
        "created_at": "2024-01-20 14:30:00"
      }
    ]
  }
}
```

---

### Create Package

Create a new travel package (Agent/Admin only).

**Endpoint:** `POST /packages`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**

- `name` (required): Package name
- `destination` (required): Destination
- `type` (required): Package type (city_tour, adventure, festival, cultural, nature, wildlife)
- `duration` (required): Duration in days
- `price` (required): Price
- `description` (required): Description
- `itinerary` (optional): Itinerary details
- `inclusions` (optional): What's included
- `requirements` (optional): Requirements
- `image` (optional): Package image file
- `status` (optional): draft/published (default: draft)

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Package created successfully",
  "data": {
    "id": 1,
    "name": "Northern Nigeria Heritage Tour",
    "slug": "northern-nigeria-heritage-tour",
    ...
  }
}
```

---

### Update Package

Update existing package (Agent/Admin only).

**Endpoint:** `PUT /packages/{id}`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:** (all optional, send only fields to update)

- `name`
- `destination`
- `type`
- `duration`
- `price`
- `description`
- `itinerary`
- `inclusions`
- `requirements`
- `image`
- `status`

**Response:** `200 OK`

---

### Delete Package

Delete a package (Admin only).

**Endpoint:** `DELETE /packages/{id}`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Package deleted successfully"
}
```

---

## Bookings

### Get All Bookings

Get list of bookings (filtered by role).

**Endpoint:** `GET /bookings`

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `status` (optional): Filter by status
- `search` (optional): Search by reference or package name

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "bookings": [
      {
        "id": 1,
        "booking_reference": "TMS-ABC12345",
        "package_name": "Northern Nigeria Heritage Tour",
        "destination": "Kano, Kaduna",
        "user_name": "John Doe",
        "travel_date": "2024-02-15",
        "participants": 2,
        "total_amount": "300000.00",
        "status": "confirmed",
        "created_at": "2024-01-15 10:30:00"
      }
    ],
    "pagination": {...}
  }
}
```

---

### Get Single Booking

Get detailed booking information.

**Endpoint:** `GET /bookings/{id}`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Create Booking

Create a new booking.

**Endpoint:** `POST /bookings`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "package_id": 1,
  "travel_date": "2024-03-15",
  "participants": 2,
  "emergency_contact": "08098765432",
  "special_requests": "Vegetarian meals"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "booking_reference": "TMS-ABC12345",
    "package_name": "Northern Nigeria Heritage Tour",
    "travel_date": "2024-03-15",
    "participants": 2,
    "total_amount": "300000.00",
    "status": "pending"
  }
}
```

---

### Update Booking Status

Update booking status (Agent/Admin only).

**Endpoint:** `PUT /bookings/{id}/status`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "confirmed"
}
```

**Valid statuses:** pending, confirmed, cancelled, completed

**Response:** `200 OK`

---

### Cancel Booking

Cancel a booking.

**Endpoint:** `PUT /bookings/{id}/cancel`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "reason": "Change of plans"
}
```

**Response:** `200 OK`

---

### Get Booking Statistics

Get booking statistics (Agent/Admin only).

**Endpoint:** `GET /bookings/statistics`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "status_counts": {
      "pending": 5,
      "confirmed": 12,
      "cancelled": 2,
      "completed": 8
    },
    "total_revenue": 2500000.00,
    "recent_bookings": [...]
  }
}
```

---

## Visa Applications

### Get All Visa Applications

Get list of visa applications (filtered by role).

**Endpoint:** `GET /visa`

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `page`, `limit`, `status`

**Response:** `200 OK`

---

### Get Single Visa Application

Get detailed visa application.

**Endpoint:** `GET /visa/{id}`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Submit Visa Application

Submit new visa application.

**Endpoint:** `POST /visa`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Form Data:**

- `destination_country` (required)
- `travel_purpose` (required): tourism, business, education, medical, family_visit, other
- `intended_travel_date` (required): YYYY-MM-DD
- `passport_number` (required)
- `passport_expiry` (optional): YYYY-MM-DD
- `documents[]` (optional): Multiple file uploads

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Visa application submitted successfully",
  "data": {
    "id": 1,
    "application_number": "VISA-2024-ABC123",
    "destination_country": "United Kingdom",
    "travel_purpose": "tourism",
    "status": "submitted",
    "created_at": "2024-01-15 10:30:00"
  }
}
```

---

### Update Visa Status

Update visa application status (Agent/Admin only).

**Endpoint:** `PUT /visa/{id}/status`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "approved",
  "admin_comments": "Application approved. Visa ready for collection."
}
```

**Valid statuses:** submitted, under_review, approved, rejected

**Response:** `200 OK`

---

### Get Visa Statistics

Get visa statistics (Agent/Admin only).

**Endpoint:** `GET /visa/statistics`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Payments

### Get All Payments

Get list of payments (filtered by role).

**Endpoint:** `GET /payments`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Process Payment

Process a new payment.

**Endpoint:** `POST /payments`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "booking_id": 1,
  "amount": 300000.0,
  "currency": "NGN",
  "payment_method": "card",
  "payment_gateway": "paystack",
  "gateway_reference": "ref_abc123"
}
```

**Payment methods:** card, bank_transfer, mobile_money, cash

**Response:** `201 Created`

---

### Confirm Payment

Confirm payment (Agent/Admin only).

**Endpoint:** `PUT /payments/{id}/confirm`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Get Payment Statistics

Get payment statistics (Admin only).

**Endpoint:** `GET /payments/statistics`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Users

### Get All Users

Get list of users (Admin only).

**Endpoint:** `GET /users`

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `page`, `limit`, `role`, `status`, `search`

**Response:** `200 OK`

---

### Get Single User

Get user details (Admin only).

**Endpoint:** `GET /users/{id}`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

### Create User

Create new user (Admin only).

**Endpoint:** `POST /users`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "full_name": "Jane Doe",
  "email": "jane@example.com",
  "mobile": "08012345678",
  "password": "password123",
  "role_id": 2,
  "status": "active"
}
```

**Role IDs:** 1=Administrator, 2=Agent, 3=Tourist

**Response:** `201 Created`

---

### Update User

Update user (Admin only).

**Endpoint:** `PUT /users/{id}`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:** (all optional)

```json
{
  "full_name": "Jane Smith",
  "email": "jane.smith@example.com",
  "mobile": "08098765432",
  "role_id": 2,
  "status": "active",
  "password": "newpassword123"
}
```

**Response:** `200 OK`

---

### Delete User

Delete user (Admin only).

**Endpoint:** `DELETE /users/{id}`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Reviews

### Get Package Reviews

Get reviews for a package.

**Endpoint:** `GET /reviews?package_id={id}`

**Query Parameters:**

- `package_id` (required)
- `status` (optional): pending, approved, rejected (default: approved)

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "reviews": [
      {
        "id": 1,
        "user_name": "John Doe",
        "rating": 5,
        "comment": "Amazing experience!",
        "created_at": "2024-01-20 14:30:00"
      }
    ],
    "average_rating": 4.5,
    "total_reviews": 12
  }
}
```

---

### Submit Review

Submit a review for completed booking.

**Endpoint:** `POST /reviews`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "package_id": 1,
  "booking_id": 1,
  "rating": 5,
  "comment": "Amazing experience! Highly recommended."
}
```

**Response:** `201 Created`

---

### Update Review Status

Moderate review (Admin only).

**Endpoint:** `PUT /reviews/{id}/status`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**

```json
{
  "status": "approved"
}
```

**Valid statuses:** pending, approved, rejected

**Response:** `200 OK`

---

### Delete Review

Delete review (Admin only).

**Endpoint:** `DELETE /reviews/{id}`

**Headers:**

```
Authorization: Bearer {token}
```

**Response:** `200 OK`

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": "Validation error message"
  }
}
```

### HTTP Status Codes

- `200 OK`: Success
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation failed
- `500 Internal Server Error`: Server error

### Common Errors

**Authentication Required:**

```json
{
  "success": false,
  "message": "Authentication required"
}
```

**Insufficient Permissions:**

```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

**Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting in production.

---

## Postman Collection

Import this collection to Postman for easy testing:

1. Create new collection: "TMS API v2"
2. Set collection variable: `base_url` = `http://localhost/backend/api/v2`
3. Add requests from this documentation
4. Use `{{base_url}}` in request URLs
5. Store token in collection variable after login

---

**Last Updated:** 2024
**API Version:** 2.0
