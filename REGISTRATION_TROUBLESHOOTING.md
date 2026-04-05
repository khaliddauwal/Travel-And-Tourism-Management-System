# Registration Troubleshooting Guide

## Quick Diagnosis

1. **Open the diagnostic tool:**
   - Open `diagnose-registration.html` in your browser
   - Click all the test buttons
   - Share the results

2. **Check browser console:**
   - Press F12
   - Go to Console tab
   - Try to register
   - Look for red error messages
   - Share what you see

## Common Issues & Solutions

### Issue 1: "Network Error" or "Failed to fetch"

**Cause:** Backend API is not accessible

**Solution:**

1. Check Apache is running in XAMPP (green light)
2. Test: `http://localhost/backend/api/v2/health`
3. Should see: `{"success":true,"message":"API is running"}`
4. If 404, check your project location

### Issue 2: "Database connection failed"

**Cause:** Database not set up or MySQL not running

**Solution:**

1. Check MySQL is running in XAMPP (green light)
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Check database `tms_system` exists
4. If not, import `database/schema.sql`

### Issue 3: "Email already registered"

**Cause:** Email already exists in database

**Solution:**

1. Use a different email address
2. OR delete the user from database:
   ```sql
   DELETE FROM users WHERE email = 'yourname@example.com';
   ```

### Issue 4: "Validation failed"

**Cause:** Input doesn't meet requirements

**Check:**

- Full Name: Not empty
- Email: Valid email format
- Mobile: 10-15 digits
- Password: At least 6 characters

### Issue 5: PHP Errors

**Symptoms:** Blank page or HTML error instead of JSON

**Solution:**

1. Check Apache error logs:
   - `C:\xampp\apache\logs\error.log`
2. Check PHP errors are enabled:
   - Open `backend/api/v2/index.php`
   - First lines should have:
   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

### Issue 6: CORS Error

**Symptoms:** "CORS policy" error in console

**Solution:**

1. Check `backend/api/v2/index.php` has CORS headers:
   ```php
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
   header('Access-Control-Allow-Headers: Content-Type, Authorization');
   ```

### Issue 7: 404 Not Found on API

**Cause:** mod_rewrite not enabled or .htaccess not working

**Solution:**

1. Check `.htaccess` exists in `backend/api/v2/`
2. Enable mod_rewrite:
   - Open `C:\xampp\apache\conf\httpd.conf`
   - Find: `#LoadModule rewrite_module modules/mod_rewrite.so`
   - Remove `#` to uncomment
   - Find: `AllowOverride None`
   - Change to: `AllowOverride All`
   - Restart Apache

## Step-by-Step Debugging

### Step 1: Test Backend Directly

Open `diagnose-registration.html` and click "Test Registration"

**If it works:** Frontend issue  
**If it fails:** Backend issue

### Step 2: Check Network Tab

1. Press F12
2. Go to Network tab
3. Try to register
4. Click on the `register` request
5. Check:
   - **Request URL:** Should be `http://localhost/backend/api/v2/auth/register`
   - **Request Method:** Should be POST
   - **Status Code:** What is it?
   - **Response:** What does it say?

### Step 3: Check Request Payload

In Network tab:

1. Click on `register` request
2. Go to "Payload" or "Request" tab
3. Should see:
   ```json
   {
     "full_name": "Your Name",
     "email": "your@email.com",
     "mobile": "08012345678",
     "password": "yourpassword"
   }
   ```

### Step 4: Check Response

In Network tab:

1. Click on `register` request
2. Go to "Response" tab
3. What do you see?

**Good response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "...",
    "user": {...}
  }
}
```

**Bad response examples:**

**Database error:**

```json
{
  "success": false,
  "message": "Database connection failed"
}
```

→ Check MySQL is running

**Validation error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required"
  }
}
```

→ Check form fields

**PHP error:**

```html
<br />
<b>Fatal error</b>: ...
```

→ Check Apache error logs

## Quick Fixes

### Fix 1: Clear Everything and Start Fresh

```bash
# 1. Stop Apache and MySQL in XAMPP
# 2. Delete database
# 3. Start Apache and MySQL
# 4. Import database/schema.sql
# 5. Clear browser cache (F12 > Application > Clear storage)
# 6. Try again
```

### Fix 2: Test with cURL

```bash
curl -X POST http://localhost/backend/api/v2/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"full_name\":\"Test User\",\"email\":\"test@example.com\",\"mobile\":\"08012345678\",\"password\":\"test123\"}"
```

### Fix 3: Check File Permissions

Make sure these folders are writable:

- `backend/uploads/`
- `backend/logs/`

### Fix 4: Verify Database Schema

```sql
-- Run in phpMyAdmin
USE tms_system;
SHOW TABLES;
-- Should see 10 tables

DESCRIBE users;
-- Should see columns: id, full_name, email, mobile, password, role_id, status, etc.

SELECT * FROM roles;
-- Should see 3 roles
```

## Still Not Working?

### Collect This Information:

1. **Browser Console Errors:**
   - Press F12
   - Copy all red errors

2. **Network Tab:**
   - Request URL
   - Status Code
   - Response body

3. **Backend Health Check:**
   - Visit: `http://localhost/backend/api/v2/health`
   - Copy the response

4. **Database Check:**
   - Does `tms_system` database exist?
   - Does `users` table exist?
   - How many rows in `users` table?

5. **Apache Error Log:**
   - Last 10 lines of `C:\xampp\apache\logs\error.log`

### Share This Info:

Create a file with:

```
=== Browser Console ===
[paste errors here]

=== Network Response ===
[paste response here]

=== Backend Health ===
[paste health check response]

=== Database Status ===
Database exists: Yes/No
Users table exists: Yes/No
Number of users: X

=== Apache Errors ===
[paste last errors here]
```

---

## Quick Test Script

Save this as `test-registration.php` in `backend/api/v2/`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config/Database.php';

try {
    $db = new Database();
    $conn = $db->connect();

    echo json_encode([
        'success' => true,
        'message' => 'Database connection works!',
        'pdo' => get_class($conn)
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $e->getMessage()
    ]);
}
```

Then visit: `http://localhost/backend/api/v2/test-registration.php`

---

**Need more help?** Run `diagnose-registration.html` and share all the results!
