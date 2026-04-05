# Package Creation Issue - Debug Guide

## Issue

Package creation is not working in the admin panel.

## Possible Causes

### 1. Frontend Issues

- Form validation failing
- FormData not being constructed correctly
- API call failing
- CORS issues
- Authentication token missing or invalid

### 2. Backend Issues

- Missing required fields
- Validation errors
- Database connection issues
- Permission issues
- File upload issues

## Debug Steps

### Step 1: Check Browser Console

Open the browser developer tools (F12) and check the Console tab for errors when you try to create a package.

Look for:

- Network errors (404, 500, 401, 403)
- JavaScript errors
- CORS errors
- Validation errors

### Step 2: Check Network Tab

In the browser developer tools, go to the Network tab and:

1. Try to create a package
2. Find the POST request to `/backend/api/v2/packages`
3. Check the request payload
4. Check the response

### Step 3: Check Backend Logs

Check the file: `backend/logs/app.log` for any PHP errors.

### Step 4: Test API Directly

Use the test script `test-package-creation.php` to test the endpoint directly:

```bash
php test-package-creation.php
```

## Common Issues and Solutions

### Issue 1: "Unauthorized" or 401 Error

**Cause**: Authentication token is missing or invalid
**Solution**:

- Check if you're logged in as admin
- Check if the token is being sent in the Authorization header
- Try logging out and logging back in

### Issue 2: "Validation Error" or 422 Error

**Cause**: Required fields are missing or invalid
**Solution**:

- Check that all required fields are filled
- Check field formats (numbers, URLs, etc.)
- Check minimum length requirements

### Issue 3: "Forbidden" or 403 Error

**Cause**: User doesn't have permission to create packages
**Solution**:

- Verify you're logged in as an administrator
- Check the user's role in the database

### Issue 4: "Server Error" or 500 Error

**Cause**: Backend PHP error
**Solution**:

- Check `backend/logs/app.log` for details
- Check database connection
- Check file permissions

### Issue 5: CORS Error

**Cause**: Cross-origin request blocked
**Solution**:

- Check that the API allows requests from your frontend origin
- Verify CORS headers in `backend/api/v2/index.php`

## Frontend Form Data Mapping

The frontend sends these fields:

```javascript
formDataToSend.append("name", formData.name);
formDataToSend.append("destination", formData.location);
formDataToSend.append("type", formData.type.toLowerCase().replace(" ", "_"));
formDataToSend.append("duration", formData.duration.toString());
formDataToSend.append("price", formData.priceNGN.toString());
formDataToSend.append("description", formData.details);
formDataToSend.append("inclusions", formData.features);
formDataToSend.append("status", formData.status);
formDataToSend.append("image", formData.image);
```

## Backend Expected Fields

The backend expects:

- `name` (required, string)
- `destination` (required, string)
- `type` (required, enum: city_tour, adventure, festival, cultural, nature, wildlife)
- `duration` (required, integer, min: 1)
- `price` (required, numeric, min: 0)
- `description` (required, string)
- `inclusions` (optional, string)
- `itinerary` (optional, string)
- `requirements` (optional, string)
- `image` (optional, file or URL)
- `status` (optional, enum: draft, published, archived)

## Quick Test

To quickly test if the issue is frontend or backend:

1. Open browser console
2. Run this code (replace with your actual values):

```javascript
const formData = new FormData();
formData.append("name", "Test Package");
formData.append("destination", "Lagos, Nigeria");
formData.append("type", "city_tour");
formData.append("duration", "3");
formData.append("price", "50000");
formData.append(
  "description",
  "This is a test package with a long description that meets the minimum requirements.",
);
formData.append("inclusions", "Hotel, Transport, Guide");
formData.append("status", "draft");

fetch("http://localhost/TTMS-DUAL-ROLES/backend/api/v2/packages", {
  method: "POST",
  headers: {
    Authorization: "Bearer " + localStorage.getItem("authToken"),
  },
  body: formData,
})
  .then((res) => res.json())
  .then((data) => console.log("Success:", data))
  .catch((err) => console.error("Error:", err));
```

## Next Steps

1. Check browser console for errors
2. Check network tab for the actual request/response
3. Share the error message you see
4. Check backend logs if it's a server error

Once you provide the specific error message, I can give you a targeted solution.
