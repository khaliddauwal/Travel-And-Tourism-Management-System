@echo off
echo ========================================
echo Enabling mod_rewrite for Apache
echo ========================================
echo.

set APACHE_CONF=C:\xampp\apache\conf\httpd.conf

echo Step 1: Backing up httpd.conf...
copy "%APACHE_CONF%" "%APACHE_CONF%.backup" >nul 2>&1

echo Step 2: Enabling mod_rewrite...
powershell -Command "(Get-Content '%APACHE_CONF%') -replace '#LoadModule rewrite_module', 'LoadModule rewrite_module' | Set-Content '%APACHE_CONF%'"

echo Step 3: Enabling .htaccess (AllowOverride All)...
powershell -Command "(Get-Content '%APACHE_CONF%') -replace 'AllowOverride None', 'AllowOverride All' | Set-Content '%APACHE_CONF%'"

echo.
echo ========================================
echo Configuration updated!
echo ========================================
echo.
echo IMPORTANT: You must restart Apache now!
echo.
echo 1. Open XAMPP Control Panel
echo 2. Click "Stop" for Apache
echo 3. Wait 2 seconds
echo 4. Click "Start" for Apache
echo.
echo After restarting Apache, test registration again.
echo.
pause
