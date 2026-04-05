# 🔍 Debugging Network Error

## The Error

"Network error. Please check your connection."

This means the frontend cannot connect to the backend API.

## Quick Checks

### 1. Is Apache Running?

- Open XAMPP Control Panel
- Check if Apache has a GREEN indicator
- If not, click "Start" next to Apache

### 2. Is MySQL Running?

- Check if MySQL has a GREEN indicator
- If not, click "Start" next to MySQL

### 3. Test Backend Directly

Open these URLs in your browser:

**Test 1: Apache**

```
http://localhost/
```

Should show XAMPP dashboard

**Test 2: Backend Health**

```
http://localhost/backend/api/v2/health
```

Should show: `{"success":true,"message":"API is running"}`

**Test 3: phpMyAdmin**

```
http://localhost/phpmyadmin
```

Should open phpMyAdmin

## Common Issues

### Issue 1: Apache Not Running

**Symptoms:** Can't access `http://localhost/`

**Solution:**

1. Open XAMPP
2. Click "Start" next to Apache
3. Wait for green indicator
4. Try again

### Issue 2: Port 80 Already in Use

**Symptoms:** Apache won't start, error about port 80

**Solution:**

1. Stop Skype or other programs using port 80
2. OR change Apache port:
   - XAMPP → Config → Apache (httpd.conf)
   - Find: `Listen 80`
   - Change to: `Listen 8080`
   - Restart Apache
   - Use: `http://localhost:8080/backend/api/v2/health`

### Issue 3: Wrong Project Location

**Symptoms:** 404 Not Found on backend URL

**Check your project location:**

```
Should be: C:\xampp\htdocs\Tourism-Management-System-main\
Backend at: C:\xampp\htdocs\Tourism-Management-System-main\backend\
```

**If in different location, update API URL:**

1. Open: `frontend/tourism-react/src/services/api.ts`
2. Line 8: Update to your actual path
3. Example: `http://localhost/your-folder-name/backend/api/v2`

### Issue 4: Database Not Imported

**Symptoms:** Backend returns database error

**Solution:**

1. Open: `http://localhost/phpmyadmin`
2. Check if database `tms_system` exists
3. If not, import `database/schema.sql`

### Issue 5: CORS Error

**Symptoms:** Console shows CORS policy error

**Solution:**

1. Check `backend/api/v2/index.php` has CORS headers
2. Restart Apache
3. Clear browser cache

## Step-by-Step Diagnosis

### Step 1: Open Browser Console

1. Press F12
2. Go to Console tab
3. Try to register
4. Look for red errors
5. **Take a screenshot and share it**

### Step 2: Check Network Tab

1. Press F12
2. Go to Network tab
3. Try to register
4. Look for the `register` request
5. What is the status? (Failed, 404, 500?)
6. **Take a screenshot and share it**

### Step 3: Test Backend Manually

Open `test-backend.html` in your browser:

```
file:///C:/xampp/htdocs/Tourism-Management-System-main/test-backend.html
```

Click all test buttons and share results.

### Step 4: Check Apache Error Log

Open: `C:\xampp\apache\logs\error.log`

Look for recent errors (last 10 lines).

## Quick Fix Checklist

- [ ] Apache is running (green in XAMPP)
- [ ] MySQL is running (green in XAMPP)
- [ ] Can access `http://localhost/`
- [ ] Can access `http://localhost/phpmyadmin`
- [ ] Can access `http://localhost/backend/api/v2/health`
- [ ] Database `tms_system` exists
- [ ] Browser console shows no CORS errors

## Most Likely Causes

1. **Apache not running** (90% of cases)
   - Solution: Start Apache in XAMPP

2. **Wrong project location** (5% of cases)
   - Solution: Move project to `C:\xampp\htdocs\`

3. **Port conflict** (3% of cases)
   - Solution: Change Apache port or stop conflicting program

4. **Database not set up** (2% of cases)
   - Solution: Import `database/schema.sql`

## What to Share

Please share:

1. **XAMPP Status:**
   - Is Apache green?
   - Is MySQL green?

2. **Browser Console:**
   - Press F12 → Console tab
   - Screenshot of errors

3. **Network Tab:**
   - Press F12 → Network tab
   - Screenshot of failed request

4. **Backend Test:**
   - Visit: `http://localhost/backend/api/v2/health`
   - What do you see?

5. **Project Location:**
   - Where is your project folder?
   - Full path?

---

**Most likely: Apache is not running. Check XAMPP Control Panel first!**
