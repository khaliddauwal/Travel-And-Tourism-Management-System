# Tourism Management System - Deployment Checklist

## 🚀 PRE-DEPLOYMENT CHECKLIST

### ✅ Code Quality (COMPLETE)

- [x] All mock data removed
- [x] All console.log statements removed (except error logging)
- [x] All unused files deleted
- [x] All components connected to real APIs
- [x] All error handling implemented
- [x] All loading states implemented
- [x] All empty states implemented
- [x] Code is clean and production-ready

### ✅ API Integration (COMPLETE)

- [x] Authentication APIs working
- [x] Package APIs working
- [x] User APIs working
- [x] Booking APIs working
- [x] Visa APIs working
- [x] Statistics APIs working
- [x] All endpoints tested
- [x] Error responses handled

### ✅ Security (COMPLETE)

- [x] SQL injection protection (PDO)
- [x] XSS protection (React)
- [x] CSRF protection
- [x] Password hashing (Bcrypt)
- [x] JWT authentication
- [x] Role-based access control
- [x] Input validation
- [x] Foreign key constraints

### ✅ Database (READY)

- [x] Schema complete
- [x] Migrations ready
- [x] Indexes optimized
- [x] Foreign keys set
- [x] Default data ready

---

## 📋 DEPLOYMENT STEPS

### Step 1: Prepare Server

```bash
# 1. Ensure MySQL is installed and running
sudo systemctl status mysql

# 2. Ensure PHP 8.0+ is installed
php -v

# 3. Ensure Node.js 16+ is installed
node -v

# 4. Ensure web server is configured (Apache/Nginx)
```

### Step 2: Database Setup

```bash
# 1. Create database
mysql -u root -p
CREATE DATABASE tms_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'tms_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON tms_system.* TO 'tms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 2. Import schema
mysql -u tms_user -p tms_system < database/schema.sql

# 3. Verify tables
mysql -u tms_user -p tms_system -e "SHOW TABLES;"
```

### Step 3: Backend Configuration

```bash
# 1. Copy environment file
cd backend
cp .env.example .env

# 2. Edit .env with production values
nano .env
```

**Production .env**:

```env
# Database Configuration
DB_HOST=localhost
DB_NAME=tms_system
DB_USER=tms_user
DB_PASS=secure_password

# JWT Configuration
JWT_SECRET=your-very-long-random-secret-key-change-this

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
SMTP_FROM_NAME=Tourism Management System

# Payment Gateway (Paystack)
PAYSTACK_SECRET_KEY=your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=your-paystack-public-key

# Application Settings
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

```bash
# 3. Set permissions
chmod 755 backend/
chmod 777 backend/uploads/
chmod 777 backend/uploads/visa_documents/
chmod 777 backend/logs/

# 4. Create admin user
mysql -u tms_user -p tms_system
INSERT INTO users (full_name, email, mobile, password, role_id, status, email_verified)
VALUES ('Admin User', 'admin@yourdomain.com', '+1234567890',
'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 1, 'active', 1);
EXIT;
```

### Step 4: Frontend Build

```bash
# 1. Navigate to frontend
cd frontend/tourism-react

# 2. Install dependencies
npm install

# 3. Create production environment file
nano .env.production
```

**Production .env.production**:

```env
REACT_APP_API_URL=https://yourdomain.com/api/v2
```

```bash
# 4. Build for production
npm run build

# 5. Verify build
ls -la build/
```

### Step 5: Web Server Configuration

#### Apache (.htaccess)

```apache
# Backend API
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /api/v2/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php [QSA,L]
</IfModule>

# Frontend
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx

```nginx
# Backend API
location /api/v2 {
    try_files $uri $uri/ /api/v2/index.php?$query_string;
}

# Frontend
location / {
    try_files $uri $uri/ /index.html;
}
```

### Step 6: SSL Certificate

```bash
# Using Let's Encrypt
sudo certbot --apache -d yourdomain.com -d www.yourdomain.com

# Or for Nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 7: Upload Files

```bash
# 1. Upload backend
scp -r backend/ user@server:/var/www/html/

# 2. Upload frontend build
scp -r frontend/tourism-react/build/* user@server:/var/www/html/

# 3. Verify upload
ssh user@server
ls -la /var/www/html/
```

---

## 🧪 POST-DEPLOYMENT TESTING

### Test 1: Database Connection

```bash
# Test backend database connection
curl https://yourdomain.com/api/v2/health
# Expected: {"status":"OK","timestamp":...}
```

### Test 2: Frontend Loading

```bash
# Test frontend loads
curl https://yourdomain.com/
# Expected: HTML with React app
```

### Test 3: API Endpoints

```bash
# Test package listing
curl https://yourdomain.com/api/v2/packages
# Expected: {"success":true,"data":{"packages":[],...}}

# Test authentication
curl -X POST https://yourdomain.com/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yourdomain.com","password":"Admin@123"}'
# Expected: {"success":true,"data":{"token":"...","user":{...}}}
```

### Test 4: User Registration

1. Go to https://yourdomain.com/register
2. Fill in registration form
3. Submit
4. Verify user created in database
5. Verify can login

### Test 5: Admin Functions

1. Login as admin
2. Go to /admin/dashboard
3. Verify statistics load
4. Create a test package
5. Verify package appears in list
6. Edit the package
7. Delete the package

### Test 6: Tourist Functions

1. Login as tourist
2. Go to /tourist/dashboard
3. Browse packages
4. Create a booking
5. View bookings
6. Cancel a booking

---

## 📊 MONITORING SETUP

### Error Logging

```bash
# Monitor error logs
tail -f backend/logs/app.log

# Monitor Apache/Nginx logs
tail -f /var/log/apache2/error.log
tail -f /var/log/nginx/error.log
```

### Database Monitoring

```sql
-- Check database size
SELECT
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'tms_system'
GROUP BY table_schema;

-- Check table row counts
SELECT
    table_name,
    table_rows
FROM information_schema.tables
WHERE table_schema = 'tms_system'
ORDER BY table_rows DESC;
```

### Performance Monitoring

```bash
# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/api/v2/packages

# curl-format.txt:
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_appconnect:  %{time_appconnect}\n
time_pretransfer:  %{time_pretransfer}\n
time_redirect:  %{time_redirect}\n
time_starttransfer:  %{time_starttransfer}\n
----------\n
time_total:  %{time_total}\n
```

---

## 🔄 BACKUP STRATEGY

### Daily Backups

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/tms"

# Database backup
mysqldump -u tms_user -p'secure_password' tms_system > $BACKUP_DIR/db_$DATE.sql

# Files backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/html/backend/uploads/

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "files_*.tar.gz" -mtime +7 -delete
```

```bash
# Add to crontab
crontab -e
0 2 * * * /path/to/backup.sh
```

---

## 🚨 TROUBLESHOOTING

### Issue: Database Connection Failed

**Solution**:

```bash
# Check MySQL is running
sudo systemctl status mysql

# Check credentials in .env
cat backend/.env | grep DB_

# Test connection
mysql -u tms_user -p tms_system -e "SELECT 1;"
```

### Issue: API Returns 500 Error

**Solution**:

```bash
# Check error logs
tail -n 50 backend/logs/app.log

# Check PHP errors
tail -n 50 /var/log/apache2/error.log

# Enable debug mode temporarily
nano backend/.env
# Set APP_DEBUG=true
```

### Issue: Frontend Shows Blank Page

**Solution**:

```bash
# Check browser console for errors
# Verify API URL in .env.production
cat frontend/tourism-react/.env.production

# Rebuild frontend
cd frontend/tourism-react
npm run build
```

### Issue: CORS Errors

**Solution**:

```php
// In backend/api/v2/index.php
header('Access-Control-Allow-Origin: https://yourdomain.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Database Optimization

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_packages_status_type ON travel_packages(status, type);
CREATE INDEX idx_users_email ON users(email);

-- Analyze tables
ANALYZE TABLE users, travel_packages, bookings;
```

### PHP Optimization

```ini
; php.ini
memory_limit = 256M
max_execution_time = 60
upload_max_filesize = 10M
post_max_size = 10M
```

### Frontend Optimization

```bash
# Enable gzip compression in Apache
sudo a2enmod deflate

# Or in Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

## ✅ FINAL VERIFICATION

### Checklist:

- [ ] Database is accessible
- [ ] Backend API responds
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Admin dashboard shows real data
- [ ] Tourist dashboard shows real data
- [ ] Package management works
- [ ] Booking creation works
- [ ] Visa submission works
- [ ] Error logging works
- [ ] Backups are configured
- [ ] SSL certificate is active
- [ ] Monitoring is set up

---

## 🎉 DEPLOYMENT COMPLETE

Once all items are checked, your Tourism Management System is live and ready to serve real customers!

**Next Steps**:

1. Monitor error logs daily
2. Collect user feedback
3. Plan feature enhancements
4. Regular security updates
5. Performance optimization

---

**Document Version**: 1.0
**Last Updated**: March 8, 2026
**Status**: Ready for Deployment
