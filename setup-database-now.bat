@echo off
echo ========================================
echo Database Setup for Tourism Management System
echo ========================================
echo.

echo Step 1: Creating database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS tms_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create database. Make sure MySQL is running.
    pause
    exit /b 1
)

echo SUCCESS: Database created!
echo.

echo Step 2: Importing schema...
mysql -u root tms_system < database\schema.sql

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to import schema.
    pause
    exit /b 1
)

echo SUCCESS: Schema imported!
echo.

echo ========================================
echo Database setup complete!
echo ========================================
echo.
echo Default users created:
echo - Admin: admin@tms.com / Admin@123
echo - Agent: agent@tms.com / Agent@123
echo - Tourist: tourist@tms.com / Tourist@123
echo.
echo You can now register new users!
echo.
pause
