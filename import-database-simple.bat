@echo off
echo ========================================
echo Importing Database for Tourism System
echo ========================================
echo.

cd /d "%~dp0"

echo Creating database...
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS tms_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo.
echo Importing schema...
"C:\xampp\mysql\bin\mysql.exe" -u root tms_system < database\schema.sql

echo.
echo ========================================
echo DONE! Database imported successfully!
echo ========================================
echo.
echo Default users:
echo - admin@tms.com / Admin@123
echo - agent@tms.com / Agent@123  
echo - tourist@tms.com / Tourist@123
echo.
pause
