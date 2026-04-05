@echo off
echo ========================================
echo System Check for TMS
echo ========================================
echo.

echo Checking Apache...
curl -s http://localhost/ >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Apache is running
) else (
    echo [ERROR] Apache is NOT running!
    echo Please start Apache in XAMPP Control Panel
)
echo.

echo Checking Backend API...
curl -s http://localhost/backend/api/v2/health >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Backend API is accessible
    curl -s http://localhost/backend/api/v2/health
) else (
    echo [ERROR] Backend API is NOT accessible!
    echo Check if Apache is running and project is in correct location
)
echo.

echo Checking MySQL...
curl -s http://localhost/phpmyadmin >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] phpMyAdmin is accessible
) else (
    echo [ERROR] phpMyAdmin is NOT accessible!
    echo Please start MySQL in XAMPP Control Panel
)
echo.

echo ========================================
echo Summary
echo ========================================
echo If you see [ERROR] above, fix those issues first!
echo.
echo Next steps:
echo 1. Start Apache and MySQL in XAMPP
echo 2. Import database/schema.sql in phpMyAdmin
echo 3. Try registration again
echo.
pause
