# 🔧 Enable mod_rewrite - Simple Steps

## Step 1: Open XAMPP Control Panel

1. Look for XAMPP icon on your desktop or Start menu
2. Double-click to open XAMPP Control Panel
3. You should see Apache and MySQL with Start/Stop buttons

## Step 2: Open Apache Configuration

1. In XAMPP Control Panel, find the "Apache" row
2. Click the "Config" button (next to Apache)
3. A menu will appear
4. Click "Apache (httpd.conf)"
5. The file will open in Notepad

## Step 3: Enable mod_rewrite Module

1. In Notepad, press `Ctrl + F` (Find)
2. Type: `LoadModule rewrite_module`
3. Click "Find Next"
4. You'll see a line like:
   ```
   #LoadModule rewrite_module modules/mod_rewrite.so
   ```
5. Remove the `#` at the beginning:
   ```
   LoadModule rewrite_module modules/mod_rewrite.so
   ```
6. Press `Ctrl + S` to save

## Step 4: Allow .htaccess Files

1. Still in the same file (httpd.conf)
2. Press `Ctrl + F` (Find)
3. Type: `AllowOverride None`
4. Click "Find Next"
5. You'll see a section like:
   ```apache
   <Directory "C:/xampp/htdocs">
       Options Indexes FollowSymLinks Includes ExecCGI
       AllowOverride None
       Require all granted
   </Directory>
   ```
6. Change `None` to `All`:
   ```apache
   <Directory "C:/xampp/htdocs">
       Options Indexes FollowSymLinks Includes ExecCGI
       AllowOverride All
       Require all granted
   </Directory>
   ```
7. Press `Ctrl + S` to save
8. Close Notepad

## Step 5: Restart Apache

1. Go back to XAMPP Control Panel
2. Click "Stop" button next to Apache
3. Wait 2-3 seconds
4. Click "Start" button next to Apache
5. Wait for it to turn GREEN

## Step 6: Test It Works

1. Open your web browser
2. Go to: `http://localhost/backend/api/v2/health`
3. You should see JSON like:
   ```json
   {
     "success": true,
     "message": "API is running"
   }
   ```
4. ✅ If you see this, it's working!
5. ❌ If you still see 404, double-check the steps above

## Step 7: Test Registration

1. Your React app should already be open at `http://localhost:3000`
2. Go to the Register page
3. Fill in the form
4. Click "Register"
5. ✅ Should work now!

---

## Quick Checklist

- [ ] Opened XAMPP Control Panel
- [ ] Clicked Config → Apache (httpd.conf)
- [ ] Found `#LoadModule rewrite_module` and removed `#`
- [ ] Saved file (Ctrl+S)
- [ ] Found `AllowOverride None` and changed to `All`
- [ ] Saved file (Ctrl+S)
- [ ] Closed Notepad
- [ ] Stopped Apache in XAMPP
- [ ] Started Apache in XAMPP
- [ ] Apache is GREEN
- [ ] Tested `http://localhost/backend/api/v2/health`
- [ ] Saw JSON response (not 404)
- [ ] Tested registration

---

## Troubleshooting

### Apache Won't Start After Changes

**Problem:** Apache button stays red or shows error

**Solution:**
1. You probably have a typo in httpd.conf
2. In XAMPP, click "Logs" button next to Apache
3. Open "error.log"
4. Look at the last few lines for the error
5. Fix the typo or undo your changes

### Still Getting 404

**Check these:**
1. Did you save the file? (Ctrl+S)
2. Did you restart Apache?
3. Is Apache green in XAMPP?
4. Try accessing: `http://localhost/backend/api/v2/test.php`
   - If this works but `/health` doesn't, recheck the steps

### Can't Find the Lines

**For mod_rewrite:**
- Search for: `rewrite_module`
- It's usually around line 145-150

**For AllowOverride:**
- Search for: `AllowOverride None`
- It's usually around line 230-240
- Make sure it's in the `<Directory "C:/xampp/htdocs">` section

---

## What These Changes Do

**mod_rewrite:**
- Allows Apache to rewrite URLs
- Makes `/health` work inste