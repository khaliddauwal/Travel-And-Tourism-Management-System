@echo off
REM Tourism Management System - Role Refactoring Verification Script
REM This script helps verify that the agent role has been successfully removed

echo ==========================================
echo Tourism Management System
echo Role Refactoring Verification
echo ==========================================
echo.

set ISSUES=0

echo 1. Checking for agent references in frontend...
echo ----------------------------------------------
findstr /S /I /C:"agent" frontend\tourism-react\src\*.tsx frontend\tourism-react\src\*.ts 2>nul | findstr /V /C:"user_agent" /C:"// agent" >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Found potential agent references in frontend
    set /A ISSUES+=1
) else (
    echo [OK] No agent references found in frontend
)

echo.
echo 2. Checking for agent references in backend...
echo ----------------------------------------------
findstr /S /C:"'agent'" backend\api\*.php 2>nul >nul
if %ERRORLEVEL% EQU 0 (
    echo [WARNING] Found agent role references in backend
    set /A ISSUES+=1
) else (
    echo [OK] No agent role references found in backend
)

echo.
echo 3. Checking database schema...
echo ----------------------------------------------
findstr /C:"2, 'agent'" database\schema.sql >nul
if %ERRORLEVEL% EQU 0 (
    echo [ERROR] Agent role still exists in schema.sql
    set /A ISSUES+=1
) else (
    echo [OK] Agent role removed from schema.sql
)

if exist "database\migration_remove_agent_role.sql" (
    echo [OK] Migration script exists
) else (
    echo [ERROR] Migration script not found
    set /A ISSUES+=1
)

echo.
echo 4. Checking route structure...
echo ----------------------------------------------
findstr /C:"/agent/" frontend\tourism-react\src\App.tsx >nul
if %ERRORLEVEL% EQU 0 (
    echo [ERROR] Agent routes still exist in App.tsx
    set /A ISSUES+=1
) else (
    echo [OK] No agent routes in App.tsx
)

findstr /C:"/tourist/dashboard" frontend\tourism-react\src\App.tsx >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Tourist routes exist
) else (
    echo [ERROR] Tourist routes not found
    set /A ISSUES+=1
)

findstr /C:"/admin/dashboard" frontend\tourism-react\src\App.tsx >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Admin routes exist
) else (
    echo [ERROR] Admin routes not found
    set /A ISSUES+=1
)

echo.
echo 5. Checking role type definitions...
echo ----------------------------------------------
findstr /C:"'agent'" frontend\tourism-react\src\types\roles.ts >nul
if %ERRORLEVEL% EQU 0 (
    echo [ERROR] Agent still in role type definitions
    set /A ISSUES+=1
) else (
    echo [OK] Agent removed from role types
)

echo.
echo 6. Checking dashboard components...
echo ----------------------------------------------
if exist "frontend\tourism-react\src\pages\admin\AdminDashboard.tsx" (
    echo [OK] AdminDashboard.tsx exists
) else (
    echo [ERROR] AdminDashboard.tsx not found
    set /A ISSUES+=1
)

if exist "frontend\tourism-react\src\pages\tourist\TouristDashboard.tsx" (
    echo [OK] TouristDashboard.tsx exists
) else (
    echo [ERROR] TouristDashboard.tsx not found
    set /A ISSUES+=1
)

if exist "frontend\tourism-react\src\components\dashboards\AgentDashboard.tsx" (
    echo [WARNING] AgentDashboard.tsx still exists ^(can be deleted^)
) else (
    echo [OK] AgentDashboard.tsx removed
)

echo.
echo 7. Checking documentation...
echo ----------------------------------------------
if exist "REFACTORING_COMPLETE.md" (
    echo [OK] Refactoring documentation exists
) else (
    echo [WARNING] Refactoring documentation not found
)

if exist "ROLE_REFACTORING_GUIDE.md" (
    echo [OK] Refactoring guide exists
) else (
    echo [WARNING] Refactoring guide not found
)

echo.
echo ==========================================
echo Verification Summary
echo ==========================================

if %ISSUES% EQU 0 (
    echo [SUCCESS] All checks passed! Refactoring appears complete.
    echo.
    echo Next steps:
    echo 1. Run database migration: mysql -u root -p tms_system ^< database\migration_remove_agent_role.sql
    echo 2. Build frontend: cd frontend\tourism-react ^&^& npm run build
    echo 3. Test both tourist and admin accounts
    echo 4. Optional: Delete AgentDashboard.tsx if it still exists
) else (
    echo [FAILED] Found %ISSUES% issue^(s^) that need attention
    echo.
    echo Please review the issues above and make necessary corrections.
)

echo.
echo ==========================================
pause
