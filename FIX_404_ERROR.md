# 🔧 Fix 404 Error - Backend Not Found

## The Problem

You're getting "404 Not Found" when accessing:

```
http://localhost/backend/api/v2/health
```

This means Apache can't find the backend files OR `.htaccess` URL rewriting is not working.

## Quick Test

**Test 1:** Open this URL in your browser:

```
http://localhost/backend/api/v2/test.php
```

**If you see JSON response:**

- ✅ Apache is working
- ✅ PHP is working
- ❌ `.htaccess` URL rewriting is NOT working
- **Solution:** Enable mod_rewrite (see below)

**If you see 404:**

- ❌ Backend files are not accessible
- **Solution:** Check project location (see below)

## Solution 1: Enable mod_rewrite (Most Common)

### Step 1: Enable mod_rewrite Module

1. Open XAMPP Control Panel
2. Click "Config" next to Apache
3. Select "httpd.conf"
4. Find this line (around line 145):
   ```
   #LoadModule rewrite_module modules/mod_rewrite.so
   ```
5. Remove the `#` to uncomment it:
   ```
   LoadModule rewrite_module modules/mod_rewrite.so
   ```
6. Save the file

### Step 2: Allow .htaccess Override

In the same `httpd.conf` file:

1. Find this section (around line 230):

   ```apache
   <Directory "C:/xampp/htdocs">
       Options Indexes FollowSymLinks Includes ExecCGI
       AllowOverride None
       Require all granted
   </Directory>
   ```

2. Change `AllowOverride None` to `AllowOverride All`:

   ```apache
   <Directory "C:/xampp/htdocs">
       Options Indexes FollowSymLinks Includes ExecCGI
       AllowOverride All
       Require all granted
   </Directory>
   ```

3. Save the file

### Step 3: Restart Apache

1. In XAMPP Control Panel
2. Click "Stop" next to Apache
3. Wait 2 seconds
4. Click "Start" next to Apache
5. Wait for green indicator

### Step 4: Test Again

Open in browser:

```
http://localhost/backend/api/v2/health
```

Should now see:

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

## Solution 2: Alternative - Direct Access (Temporary)

If mod_rewrite doesn't work, you can access the API directly:

**Change API URL in frontend:**

1. Open: `frontend/tourism-react/src/services/api.ts`
2. Line 8, change from:

   ```typescript
   const API_BASE_URL =
     process.env.REACT_APP_API_URL || "http://localhost/backend/api/v2";
   ```

   To:

   ```typescript
   const API_BASE_URL =
     process.env.REACT_APP_API_URL ||
     "http://localhost/backend/api/v2/index.php";
   ```

3. Save and restart React app

**Note:** This is a temporary workaround. Proper solution is to enable mod_rewrite.

## Solution 3: Check Project Location

Your project should be at:

```
C:\xampp\htdocs\Tourism-Management-System-main\
```

If it's in a different location, the URL will be different.

**Example:**

- Project at: `C:\xampp\htdocs\my-project\`
- URL should be: `http://localhost/my-project/backend/api/v2/health`

## Verification Steps

After applying the fix:

### 1. Test Health Endpoint

```
http://localhost/backend/api/v2/health
```

Should return JSON (not 404)

### 2. Test Direct PHP File

```
http://localhost/backend/api/v2/test.php
```

Should return JSON

### 3. Test Registration

1. Go to: `http://localhost:3000/register`
2. Fill in form
3. Click Register
4. Should work! ✅

## Common Mistakes

### Mistake 1: Forgot to Restart Apache

After editing `httpd.conf`, you MUST restart Apache.

### Mistake 2: Edited Wrong httpd.conf

Make sure you're editing the main `httpd.conf`, not `httpd-ssl.conf` or others.

### Mistake 3: Wrong Directory Path

The `<Directory>` path should match your htdocs location:

```apache
<Directory "C:/xampp/htdocs">
```

### Mistake 4: Syntax Error in httpd.conf

If Apache won't start after editing, you may have a syntax error.

- Check XAMPP error log
- Undo your changes
- Try again carefully

## Still Not Working?

### Check Apache Error Log

1. Open: `C:\xampp\apache\logs\error.log`
2. Look for recent errors
3. Share the last 10 lines

### Check .htaccess File

Open: `backend/api/v2/.htaccess`

Should contain:

```apache
RewriteEngine On

# Handle Authorization Header
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

# Redirect all requests to index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [QSA,L]
```

### Test mod_rewrite

Create `backend/api/v2/test-rewrite.php`:

```php
<?php
if (in_array('mod_rewrite', apache_get_modules())) {
    echo "mod_rewrite is enabled";
} else {
    echo "mod_rewrite is NOT enabled";
}
```

Visit: `http://localhost/backend/api/v2/test-rewrite.php`

## Summary

**Most Common Solution:**

1. Edit `C:\xampp\apache\conf\httpd.conf`
2. Uncomment: `LoadModule rewrite_module modules/mod_rewrite.so`
3. Change: `AllowOverride None` to `AllowOverride All`
4. Restart Apache
5. Test: `http://localhost/backend/api/v2/health`

**This should fix the 404 error!** 🎉
