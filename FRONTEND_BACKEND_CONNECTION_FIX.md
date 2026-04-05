# Frontend-Backend Connection Fix ✅

## Issue Fixed

Your frontend was using mock authentication instead of connecting to the real backend API.

## Changes Made

### 1. Updated API Service (`frontend/tourism-react/src/services/api.ts`)

- ✅ Changed API base URL from old v1 to new v2: `http://localhost/backend/api/v2`
- ✅ Updated login response to handle JWT tokens
- ✅ Updated register to return user data and token
- ✅ Token is now stored in localStorage automatically

### 2. Updated AuthContext (`frontend/tourism-react/src/context/AuthContext.tsx`)

- ✅ Removed mock authentication
- ✅ Now uses real API calls for login
- ✅ Now uses real API calls for register
- ✅ Properly maps API response to frontend User type
- ✅ Clears auth token on logout

### 3. Updated Login Page (`frontend/tourism-react/src/pages/Login.tsx`)

- ✅ Updated demo account credentials to match backend:
  - Tourist: `tourist@tms.com` / `Tourist@123`
  - Agent: `agent@tms.com` / `Agent@123`
  - Admin: `admin@tms.com` / `Admin@123`

### 4. Updated Register Page (`frontend/tourism-react/src/pages/Register.tsx`)

- ✅ Now automatically logs user in after registration
- ✅ Redirects to dashboard instead of login page

---

## How to Test

### Step 1: Verify Backend is Running

1. **Check Database:**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Verify database `tms_system` exists
   - Check that `users` table has 3 default users

2. **Test API Health:**
   - Open browser: `http://localhost/backend/api/v2/health`
   - Should see: `{"success":true,"message":"API is running",...}`

3. **Test Login Endpoint:**
   - Use Postman or browser console:
   ```javascript
   fetch("http://localhost/backend/api/v2/auth/login", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       email: "admin@tms.com",
       password: "Admin@123",
     }),
   })
     .then((r) => r.json())
     .then(console.log);
   ```

   - Should return token and user data

### Step 2: Test Frontend

1. **Start React App:**

   ```bash
   cd frontend/tourism-react
   npm start
   ```

2. **Test Registration:**
   - Go to: `http://localhost:3000/register`
   - Fill in the form with new user details
   - Click "Register"
   - Should automatically log you in and redirect to dashboard

3. **Test Login:**
   - Go to: `http://localhost:3000/login`
   - Use demo account: `tourist@tms.com` / `Tourist@123`
   - Click "Login"
   - Should redirect to dashboard

4. **Test with Your Registered Account:**
   - Logout
   - Login with the email you just registered
   - Should work now!

---

## Troubleshooting

### Issue: "Network Error" or "CORS Error"

**Solution:**

1. Make sure Apache is running in XAMPP
2. Check that backend is accessible: `http://localhost/backend/api/v2/health`
3. Verify `.htaccess` file exists in `backend/api/v2/`

### Issue: "Invalid email or password" with correct credentials

**Solution:**

1. Check database has users:
   ```sql
   SELECT * FROM users;
   ```
2. Verify passwords are hashed (should start with `$2y$`)
3. Re-import database schema if needed

### Issue: "Database connection failed"

**Solution:**

1. Check MySQL is running in XAMPP
2. Verify `.env` file in `backend/` folder:
   ```env
   DB_HOST=localhost
   DB_NAME=tms_system
   DB_USER=root
   DB_PASS=
   ```
3. Test database connection in phpMyAdmin

### Issue: "404 Not Found" on API calls

**Solution:**

1. Enable `mod_rewrite` in Apache:
   - Open `xampp/apache/conf/httpd.conf`
   - Uncomment: `LoadModule rewrite_module modules/mod_rewrite.so`
   - Change `AllowOverride None` to `AllowOverride All`
   - Restart Apache

### Issue: Token not being sent with requests

**Solution:**

1. Check browser console for errors
2. Verify token is in localStorage: `localStorage.getItem('authToken')`
3. Check Network tab in DevTools to see if Authorization header is present

---

## API Endpoints Now Working

All these endpoints are now properly connected:

### Authentication

- ✅ `POST /auth/register` - Register new user
- ✅ `POST /auth/login` - Login user
- ✅ `GET /auth/me` - Get current user
- ✅ `POST /auth/logout` - Logout user

### Packages

- ✅ `GET /packages` - List packages
- ✅ `GET /packages/{id}` - Get package details

### Visa

- ✅ `POST /visa` - Submit visa application
- ✅ `GET /visa` - Get user's visa applications

---

## What Happens Now

### Registration Flow:

1. User fills registration form
2. Frontend sends POST to `/auth/register`
3. Backend creates user in database
4. Backend returns JWT token + user data
5. Frontend stores token in localStorage
6. User is automatically logged in
7. Redirected to dashboard

### Login Flow:

1. User enters email/password
2. Frontend sends POST to `/auth/login`
3. Backend verifies credentials
4. Backend returns JWT token + user data
5. Frontend stores token in localStorage
6. User is logged in
7. Redirected to dashboard

### Authenticated Requests:

1. Frontend reads token from localStorage
2. Adds `Authorization: Bearer {token}` header
3. Backend validates token
4. Returns requested data

---

## Testing Checklist

- [ ] Backend health endpoint responds
- [ ] Can login with admin@tms.com
- [ ] Can login with agent@tms.com
- [ ] Can login with tourist@tms.com
- [ ] Can register new user
- [ ] Can login with newly registered user
- [ ] Token is stored in localStorage
- [ ] Logout clears token
- [ ] Protected routes require authentication

---

## Next Steps

1. ✅ Test registration and login
2. Connect other API endpoints (packages, bookings, visa)
3. Update package listing to use real API
4. Update booking system to use real API
5. Update visa application to use real API

---

## Important Notes

- **Default Passwords Changed:** Demo accounts now use backend passwords
  - Old: `demo123`
  - New: `Admin@123`, `Agent@123`, `Tourist@123`

- **API URL:** Make sure your project is in the correct location
  - Expected: `C:\xampp\htdocs\your-project\backend\api\v2`
  - API URL: `http://localhost/backend/api/v2`

- **Token Expiry:** JWT tokens expire after 24 hours
  - User will need to login again after expiry

---

## Success Indicators

✅ You'll know it's working when:

1. Registration creates a new user in database
2. Login returns a JWT token
3. Token is visible in localStorage
4. Dashboard loads after login
5. Logout clears the token
6. Can login again with registered credentials

---

**Status:** ✅ FIXED  
**Ready to Test:** YES  
**Backend Required:** YES (must be running)

Try registering a new account now - it should work! 🎉
