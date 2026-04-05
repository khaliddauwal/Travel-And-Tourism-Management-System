@echo off
echo ========================================
echo MySQL Service Status Check
echo ========================================
echo.

echo Checking if MySQL service is running...
sc query MySQL
echo.

echo ========================================
echo To start MySQL, run:
echo   net start MySQL
echo Or open XAMPP Control Panel and start MySQL
echo ========================================
pause
