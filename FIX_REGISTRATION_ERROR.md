# Registration Server Error - Fix Guide

## Problem Identified

The "Server error. Please try again later." message on the registration page is caused by **MySQL not running**.

### Error Details:

- **Error**: `SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it`
- **Root Cause**: MySQL database server is not started
- **Impact**: All API endpoints requiring database access will fail

## Solution

### Step 1: Start MySQL Server

Choose one of these methods:

#### Method 1: Using XAMPP Control Panel (Recommended)

1. Open **XAMPP Control Panel**
2. Find the **MySQL** row
3. Click the **Start** button next to MySQL
4. Wait for the status to show "Running" (green background)

#### Method 2: Using Command Line

```bash
# Run as Administrator
net start MySQL
```

Or if using XAMPP's MySQL:

```bash
C:\xampp\mysql\bin\mysqld.exe
```

### Step 2: Verify MySQL is Running

Run this command:

```bash
C:\xampp\php\php.exe backend/api/v2/test-connection.php
```

You should see:

```json
{
  "database_connection": "SUCCESS"
}
```

### Step 3: Verify Database Exists

1. Open **phpMyAdmin**: http://localhost/phpmyadmin
2. Check if database `tms_system` exists
3. If not, import the database:
   ```bash
   C:\xampp\php\php.exe database/setup-database.php
   ```

### Step 4: Test Registration Again

1. Go to: http://localhost:3000/register
2. Fill in the registration form
3. Click "Register"
4. You should be redirected to the tourist dashboard

## Database Configuration

Current settings (from `backend/.env`):

```
DB_HOST=localhost
DB_NAME=tms_system
DB_USER=root
DB_PASS=
```

## Common Issues

### Issue 1: Port 3306 Already in Use

If MySQL won't start because port 3306 is in use:

1. Open XAMPP Control Panel
2. Click "Config" next to MySQL
3. Select "my.ini"
4. Change port from 3306 to 3307
5. Update `backend/.env`: `DB_HOST=localhost:3307`

### Issue 2: MySQL Service Not Installed

If MySQL is not installed as a service:

1. Open Command Prompt as Administrator
2. Navigate to: `cd C:\xampp\mysql\bin`
3. Run: `mysqld --install MySQL --defaults-file="C:\xampp\mysql\bin\my.ini"`
4. Start service: `net start MySQL`

### Issue 3: Database Doesn't Exist

If the database `tms_system` doesn't exist:

```bash
# Create database and import schema
C:\xampp\php\php.exe database/setup-database.php
```

## Quick Diagnostic Script

Run this to check everything:

```bash
check-mysql.bat
```

## API Endpoint Details

The registration endpoint:

- **URL**: `http://localhost/Tourism-Management-System-main/backend/api/v2/auth/register`
- **Method**: POST
- **Payload**:
  ```json
  {
    "full_name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "mobile": "+234-800-123-4567"
  }
  ```

## Next Steps After Fix

1. Start MySQL server
2. Verify database connection
3. Test registration
4. Check that user is created in `users` table
5. Verify automatic login after registration

## Prevention

To avoid this issue in the future:

1. Always start MySQL before testing the application
2. Add MySQL to Windows startup services
3. Use XAMPP Control Panel to manage services
4. Monitor the application logs: `backend/logs/app.log`
