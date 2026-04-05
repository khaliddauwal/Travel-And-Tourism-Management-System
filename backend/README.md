# Travel & Tourism Management System - Backend

## 🚀 Simple, Clean PHP 8 + MySQL Backend

A complete RESTful API backend for the Travel & Tourism Management System, built specifically for final year project requirements.

---

## ✨ Features

### Core Functionality

- ✅ **User Authentication** - JWT-based secure authentication
- ✅ **Role-Based Access Control** - 3 roles (Administrator, Agent, Tourist)
- ✅ **Travel Package Management** - CRUD operations with image upload
- ✅ **Booking System** - Complete booking lifecycle management
- ✅ **Visa Application** - Document upload and status tracking
- ✅ **Payment Processing** - Payment gateway integration ready
- ✅ **Review & Rating System** - Customer feedback management
- ✅ **Notification System** - In-app notifications
- ✅ **Activity Logging** - User action tracking

### Security Features

- 🔒 Password hashing with bcrypt
- 🔒 JWT token authentication
- 🔒 PDO prepared statements (SQL injection prevention)
- 🔒 Input validation and sanitization
- 🔒 Secure file upload handling
- 🔒 Role-based middleware protection

### Technical Features

- 📦 Clean MVC-like structure
- 📦 RESTful API design
- 📦 JSON responses
- 📦 Pagination support
- 📦 File upload handling
- 📦 Error logging
- 📦 CORS enabled

---

## 📋 Requirements

- **PHP:** 8.0 or higher
- **MySQL:** 5.7 or higher (InnoDB)
- **Apache:** 2.4+ with mod_rewrite
- **XAMPP:** Recommended for local development

---

## 🛠️ Installation

### Quick Start (5 minutes)

1. **Clone/Copy Project**

```bash
# Place in XAMPP htdocs folder
C:\xampp\htdocs\tms-project\
```

2. **Import Database**

```bash
# Open phpMyAdmin: http://localhost/phpmyadmin
# Import: database/schema.sql
```

3. **Configure Environment**

```bash
cd backend
copy .env.example .env
# Edit .env with your database credentials
```

4. **Test API**

```bash
# Open browser: http://localhost/backend/api/v2/health
# Should see: {"success":true,"message":"API is running"}
```

**Done! 🎉**

For detailed setup instructions, see [BACKEND_SETUP_GUIDE.md](../docs/BACKEND_SETUP_GUIDE.md)

---

## 📁 Project Structure

```
backend/
├── api/
│   └── v2/                          # API Version 2
│       ├── config/
│       │   ├── Database.php         # PDO database connection
│       │   └── JWT.php              # JWT token handling
│       ├── controllers/
│       │   ├── AuthController.php   # Authentication endpoints
│       │   ├── PackageController.php # Package management
│       │   ├── BookingController.php # Booking management
│       │   ├── VisaController.php   # Visa applications
│       │   ├── PaymentController.php # Payment processing
│       │   ├── UserController.php   # User management (Admin)
│       │   └── ReviewController.php # Reviews & ratings
│       ├── middleware/
│       │   └── Auth.php             # JWT authentication middleware
│       ├── utils/
│       │   ├── Response.php         # Standardized API responses
│       │   ├── Validator.php        # Input validation
│       │   └── FileUpload.php       # Secure file uploads
│       ├── .htaccess                # URL rewriting rules
│       └── index.php                # Main API router
├── uploads/                         # File uploads directory
│   ├── packages/                    # Package images
│   └── visa_documents/              # Visa documents
├── logs/                            # Application logs
├── .env.example                     # Environment template
└── README.md                        # This file
```

---

## 🔑 Default Users

| Role              | Email           | Password    | Access Level               |
| ----------------- | --------------- | ----------- | -------------------------- |
| **Administrator** | admin@tms.com   | Admin@123   | Full system access         |
| **Agent**         | agent@tms.com   | Agent@123   | Manage packages & bookings |
| **Tourist**       | tourist@tms.com | Tourist@123 | Browse & book packages     |

⚠️ **Change these passwords immediately in production!**

---

## 🌐 API Endpoints

**Base URL:** `http://localhost/backend/api/v2`

### Authentication

```
POST   /auth/register          # Register new user
POST   /auth/login             # Login user
GET    /auth/me                # Get current user
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password
```

### Packages

```
GET    /packages               # List all packages
GET    /packages/{id}          # Get single package
POST   /packages               # Create package (Agent/Admin)
PUT    /packages/{id}          # Update package (Agent/Admin)
DELETE /packages/{id}          # Delete package (Admin)
```

### Bookings

```
GET    /bookings               # List bookings
GET    /bookings/{id}          # Get single booking
POST   /bookings               # Create booking
PUT    /bookings/{id}/status   # Update status (Agent/Admin)
PUT    /bookings/{id}/cancel   # Cancel booking
GET    /bookings/statistics    # Get statistics (Agent/Admin)
```

### Visa Applications

```
GET    /visa                   # List applications
GET    /visa/{id}              # Get single application
POST   /visa                   # Submit application
PUT    /visa/{id}/status       # Update status (Agent/Admin)
GET    /visa/statistics        # Get statistics (Agent/Admin)
```

### Payments

```
GET    /payments               # List payments
POST   /payments               # Process payment
PUT    /payments/{id}/confirm  # Confirm payment (Agent/Admin)
GET    /payments/statistics    # Get statistics (Admin)
```

### Users (Admin Only)

```
GET    /users                  # List all users
GET    /users/{id}             # Get single user
POST   /users                  # Create user
PUT    /users/{id}             # Update user
DELETE /users/{id}             # Delete user
```

### Reviews

```
GET    /reviews?package_id={id} # Get package reviews
POST   /reviews                 # Submit review
PUT    /reviews/{id}/status     # Moderate review (Admin)
DELETE /reviews/{id}            # Delete review (Admin)
```

For detailed API documentation with request/response examples, see [API_DOCUMENTATION.md](../docs/API_DOCUMENTATION.md)

---

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

**Getting a Token:**

1. Login via `/auth/login`
2. Copy token from response
3. Include in subsequent requests

**Token Expiry:** 24 hours

---

## 📊 Database Schema

### Core Tables

- `users` - User accounts
- `roles` - User roles (Administrator, Agent, Tourist)
- `travel_packages` - Travel packages
- `bookings` - Package bookings
- `visa_applications` - Visa requests
- `payments` - Payment transactions
- `reviews` - Package reviews
- `notifications` - User notifications
- `password_resets` - Password reset tokens
- `activity_logs` - User activity tracking

### Relationships

- Users → Roles (Many-to-One)
- Bookings → Users, Packages (Many-to-One)
- Visa Applications → Users (Many-to-One)
- Payments → Bookings, Visa Applications (Many-to-One)
- Reviews → Packages, Users, Bookings (Many-to-One)

---

## 🧪 Testing

### Using Postman

1. **Import Collection**
   - Create new collection
   - Set variable: `base_url` = `http://localhost/backend/api/v2`

2. **Test Authentication**

```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@tms.com",
  "password": "Admin@123"
}
```

3. **Use Token**

```
Authorization: Bearer {token_from_login}
```

### Using cURL

```bash
# Login
curl -X POST http://localhost/backend/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tms.com","password":"Admin@123"}'

# Get packages (with token)
curl -X GET http://localhost/backend/api/v2/packages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**

```
Solution: Check MySQL is running, verify .env credentials
```

**2. 404 Not Found**

```
Solution: Enable mod_rewrite in Apache, check .htaccess exists
```

**3. JWT Token Invalid**

```
Solution: Check JWT_SECRET in .env, ensure token in Authorization header
```

**4. File Upload Failed**

```
Solution: Check uploads/ directory is writable
```

**5. CORS Error**

```
Solution: Headers already set in index.php, check Apache config
```

For more troubleshooting, see [BACKEND_SETUP_GUIDE.md](../docs/BACKEND_SETUP_GUIDE.md)

---

## 📝 Development Notes

### Adding New Endpoint

1. **Create Controller Method**

```php
// controllers/YourController.php
public function yourMethod() {
    $auth = new Auth();
    if (!$auth->authorize(['role'])) return;

    // Your logic here
    Response::success($data);
}
```

2. **Add Route**

```php
// index.php
case 'your-resource':
    require_once __DIR__ . '/controllers/YourController.php';
    $controller = new YourController();
    if ($method === 'GET') $controller->yourMethod();
    break;
```

### Input Validation

```php
$validator = new Validator();
$validator->required('field', $data['field'] ?? '');
$validator->email('email', $data['email'] ?? '');

if ($validator->fails()) {
    Response::validationError($validator->getErrors());
}
```

### File Upload

```php
$uploader = new FileUpload(__DIR__ . '/../../uploads/');
$path = $uploader->upload($_FILES['file'], 'subfolder');
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Set `APP_ENV=production` in .env
- [ ] Set `APP_DEBUG=false` in .env
- [ ] Disable error display: `ini_set('display_errors', 0)`
- [ ] Enable HTTPS
- [ ] Configure proper SMTP settings
- [ ] Setup database backups
- [ ] Set proper file permissions
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Setup monitoring/logging

### Recommended Hosting

- Shared hosting with PHP 8+ support
- VPS (DigitalOcean, Linode, AWS EC2)
- Managed hosting (Cloudways, Kinsta)

---

## 📚 Documentation

- [Backend Setup Guide](../docs/BACKEND_SETUP_GUIDE.md) - Detailed installation instructions
- [API Documentation](../docs/API_DOCUMENTATION.md) - Complete API reference
- [SRS Document](../docs/SOFTWARE_REQUIREMENTS_SPECIFICATION.md) - System requirements

---

## 🤝 Support

For issues or questions:

1. Check documentation
2. Review error logs in `backend/logs/`
3. Verify database schema
4. Test with Postman

---

## 📄 License

This project is created for educational purposes (Final Year Project).

---

## 👨‍💻 Author

**Khalid Auwal Hafiz**  
Final Year Project - Travel & Tourism Management System

---

## 🎯 Project Status

✅ **Complete and Ready for Use**

All SRS requirements implemented:

- ✅ Authentication & Authorization
- ✅ Role-Based Access Control (3 roles)
- ✅ Travel Package Management
- ✅ Booking Management
- ✅ Visa Application Management
- ✅ Payment Processing
- ✅ Review & Rating System
- ✅ User Management
- ✅ Notification System
- ✅ Security Features
- ✅ API Documentation

---

**Last Updated:** 2024  
**Version:** 2.0  
**Status:** Production Ready
