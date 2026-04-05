@echo off
echo ========================================
echo Testing Role-Based Dashboard Separation
echo ========================================
echo.

REM Test 1: Check folder structure
echo [Test 1] Checking folder structure...
if exist "frontend\tourism-react\src\pages\admin\components" (
    echo [OK] Admin components folder exists
) else (
    echo [FAIL] Admin components folder missing
)

if exist "frontend\tourism-react\src\pages\tourist\components" (
    echo [OK] Tourist components folder exists
) else (
    echo [FAIL] Tourist components folder missing
)
echo.

REM Test 2: Check component separation
echo [Test 2] Checking component separation...

if exist "frontend\tourism-react\src\pages\admin\components\AdminVisaManagement.tsx" (
    echo [OK] AdminVisaManagement in admin folder
) else (
    echo [FAIL] AdminVisaManagement not found
)

if exist "frontend\tourism-react\src\pages\tourist\components\VisaRequestForm.tsx" (
    echo [OK] VisaRequestForm in tourist folder
) else (
    echo [FAIL] VisaRequestForm not found
)

if exist "frontend\tourism-react\src\pages\tourist\components\VisaStatusDashboard.tsx" (
    echo [OK] VisaStatusDashboard in tourist folder
) else (
    echo [FAIL] VisaStatusDashboard not found
)

if exist "frontend\tourism-react\src\pages\tourist\components\AIRecommendations.tsx" (
    echo [OK] AIRecommendations in tourist folder
) else (
    echo [FAIL] AIRecommendations not found
)

if exist "frontend\tourism-react\src\pages\tourist\components\BookingForm.tsx" (
    echo [OK] BookingForm in tourist folder
) else (
    echo [FAIL] BookingForm not found
)

if exist "frontend\tourism-react\src\pages\tourist\components\PaymentForm.tsx" (
    echo [OK] PaymentForm in tourist folder
) else (
    echo [FAIL] PaymentForm not found
)

if exist "frontend\tourism-react\src\pages\tourist\components\ReviewSystem.tsx" (
    echo [OK] ReviewSystem in tourist folder
) else (
    echo [FAIL] ReviewSystem not found
)
echo.

REM Test 3: Check shared components
echo [Test 3] Checking shared components...
if exist "frontend\tourism-react\src\components\Header.tsx" (
    echo [OK] Header in shared folder
) else (
    echo [FAIL] Header missing
)

if exist "frontend\tourism-react\src\components\Footer.tsx" (
    echo [OK] Footer in shared folder
) else (
    echo [FAIL] Footer missing
)

if exist "frontend\tourism-react\src\components\ProtectedRoute.tsx" (
    echo [OK] ProtectedRoute in shared folder
) else (
    echo [FAIL] ProtectedRoute missing
)
echo.

REM Test 4: Check old components removed
echo [Test 4] Checking old components removed...
if not exist "frontend\tourism-react\src\components\VisaRequestForm.tsx" (
    echo [OK] VisaRequestForm removed from shared
) else (
    echo [WARN] VisaRequestForm still in shared folder
)

if not exist "frontend\tourism-react\src\components\AdminVisaManagement.tsx" (
    echo [OK] AdminVisaManagement removed from shared
) else (
    echo [WARN] AdminVisaManagement still in shared folder
)

if not exist "frontend\tourism-react\src\components\AIRecommendations.tsx" (
    echo [OK] AIRecommendations removed from shared
) else (
    echo [WARN] AIRecommendations still in shared folder
)
echo.

REM Summary
echo ========================================
echo Role Separation Testing Complete!
echo.
echo Next steps:
echo 1. Run 'cd frontend\tourism-react && npm start' to test frontend
echo 2. Login as admin and verify admin dashboard
echo 3. Login as tourist and verify tourist dashboard
echo 4. Try accessing opposite role routes (should be denied)
echo.
pause
