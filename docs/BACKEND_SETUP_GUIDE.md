# Backend Setup Guide

## Travel & Tourism Management System

### Prerequisites

- XAMPP (PHP 8.0+, MySQL 5.7+, Apache)
- Composer (optional, for future dependencies)
- Postman or similar API testing tool

---

## Installation Steps

### 1. Install XAMPP

1. Download XAMPP from [https://www.apachefriends.org](https://www.apachefriends.org)
2. Install XAMPP with PHP 8.0 or higher
3. Start Apache and MySQL services from XAMPP Control Panel

### 2. Setup Database

#### Option A: Using phpMyAdmin

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "Import" tab
3. Choose file: `database/schema.sql`
4. Click "Go" to execute

#### Option B: Using MySQL Command Line

```bash
mysql -u root -p < database/schema.sql
```

### 3. Configure Environment

1. Copy environment file:

```bash
cd backend
copy .env.example .env
```

2. Edit `.env` file with your settings:

```env
DB_HOST=localhost
DB_NAME=tms_system
DB_USER=root
DB_PASS=

JWT_SECRET=change-this-to-a-long-random-string-for-production
```

### 4. Configure Apache

#### Enable mod_rewrite

1. Open `xampp/apache/conf/httpd.conf`
2. Find and uncomment: `LoadModule rewrite_module modules/mod_rewrite.so`
3. Find `AllowOverride None` and change to `AllowOverride All`
4. Restart Apache

#### Setup Virtual Host (Optional)

Add to `xampp/apache/conf/extra/httpd-vhosts.conf`:

```apache
<VirtualHost *:80>
    ServerName tms.local
    DocumentRoot "C:/xampp/htdocs/your-project-path"
    <Directory "C:/xampp/htdocs/your-project-path">
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Add to `C:\Windows\System32\drivers\etc\hosts`:

```
127.0.0.1 tms.local
```

### 5. Set Permissions

Ensure the following directories are writable:

- `backend/uploads/`
- `backend/uploads/packages/`
- `backend/uploads/visa_documents/`
- `backend/logs/`

On Windows (XAMPP), these should work by default.

### 6. Test API

1. Open browser: `http://localhost/backend/api/v2/health`
2. You should see:

```json
{
  "success": true,
  "message": "API is running",
  "data": {
    "status": "OK",
    "timestamp": 1234567890
  }
}
```

---

## Default Users

The system comes with 3 default users:

### Administrator

- Email: `admin@tms.com`
- Password: `Admin@123`
- Role: Administrator

### Travel Agent

- Email: `agent@tms.com`
- Password: `Agent@123`
- Role: Agent

### Tourist

- Email: `tourist@tms.com`
- Password: `Tourist@123`
- Role: Tourist

**⚠️ IMPORTANT: Change these passwords immediately in production!**

---

## API Base URL

Development: `http://localhost/backend/api/v2`

All endpoints are relative to this base URL.

---

## Testing the API

### Using Postman

1. Import the API collection (see API_DOCUMENTATION.md)
2. Set base URL variable: `http://localhost/backend/api/v2`
3. Test authentication:

**Login Request:**

```
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "admin@tms.com",
  "password": "Admin@123"
}
```

**Response:**

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

4. Copy the token and use it in subsequent requests:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

---

## Troubleshooting

### Database Connection Error

- Check MySQL is running in XAMPP
- Verify database credentials in `.env`
- Ensure database `tms_system` exists

### 404 Not Found

- Check `.htaccess` file exists in `backend/api/v2/`
- Verify `mod_rewrite` is enabled in Apache
- Check `AllowOverride All` is set

### Permission Denied

- Ensure upload directories are writable
- On Windows, right-click folder → Properties → Security → Edit

### JWT Token Invalid

- Check `JWT_SECRET` is set in `.env`
- Ensure token is sent in Authorization header
- Token expires after 24 hours

### CORS Errors

- Headers are already set in `index.php`
- If still having issues, check Apache configuration

---

## File Structure

```
backend/
├── api/
│   └── v2/
│       ├── config/
│       │   ├── Database.php      # Database connection
│       │   └── JWT.php           # JWT token handling
│       ├── controllers/
│       │   ├── AuthController.php
│       │   ├── PackageController.php
│       │   ├── BookingController.php
│       │   ├── VisaController.php
│       │   ├── PaymentController.php
│       │   ├── UserController.php
│       │   └── ReviewController.php
│       ├── middleware/
│       │   └── Auth.php          # Authentication middleware
│       ├── utils/
│       │   ├── Response.php      # API response helper
│       │   ├── Validator.php     # Input validation
│       │   └── FileUpload.php    # File upload handler
│       ├── .htaccess             # URL rewriting
│       └── index.php             # Main router
├── uploads/                      # File uploads
│   ├── packages/
│   └── visa_documents/
├── logs/                         # Application logs
└── .env                          # Environment configuration
```

---

## Next Steps

1. ✅ Database setup complete
2. ✅ API running
3. 📝 Read API_DOCUMENTATION.md for endpoint details
4. 🔧 Configure frontend to use API
5. 🧪 Test all endpoints
6. 🚀 Deploy to production server

---

## Production Deployment

Before deploying to production:

1. **Security:**
   - Change all default passwords
   - Generate strong JWT_SECRET
   - Disable error display: `ini_set('display_errors', 0)`
   - Enable HTTPS
   - Set proper file permissions

2. **Database:**
   - Use strong database password
   - Restrict database user permissions
   - Enable MySQL slow query log

3. **Environment:**
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`
   - Configure proper SMTP settings

4. **Backup:**
   - Setup automated database backups
   - Backup uploaded files regularly

---

## Support

For issues or questions:

1. Check troubleshooting section
2. Review API documentation
3. Check error logs in `backend/logs/`
4. Verify database schema is correct

---

**Last Updated:** 2024
**Version:** 2.0
