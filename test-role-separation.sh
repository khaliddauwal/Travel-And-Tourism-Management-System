#!/bin/bash

echo "🔍 Testing Role-Based Dashboard Separation"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check folder structure
echo "📁 Test 1: Checking folder structure..."
if [ -d "frontend/tourism-react/src/pages/admin/components" ]; then
    echo -e "${GREEN}✓${NC} Admin components folder exists"
else
    echo -e "${RED}✗${NC} Admin components folder missing"
fi

if [ -d "frontend/tourism-react/src/pages/tourist/components" ]; then
    echo -e "${GREEN}✓${NC} Tourist components folder exists"
else
    echo -e "${RED}✗${NC} Tourist components folder missing"
fi

echo ""

# Test 2: Check component separation
echo "🔧 Test 2: Checking component separation..."

# Admin components
if [ -f "frontend/tourism-react/src/pages/admin/components/AdminVisaManagement.tsx" ]; then
    echo -e "${GREEN}✓${NC} AdminVisaManagement in admin folder"
else
    echo -e "${RED}✗${NC} AdminVisaManagement not found"
fi

# Tourist components
TOURIST_COMPONENTS=(
    "VisaRequestForm.tsx"
    "VisaStatusDashboard.tsx"
    "AIRecommendations.tsx"
    "BookingForm.tsx"
    "PaymentForm.tsx"
    "ReviewSystem.tsx"
)

for component in "${TOURIST_COMPONENTS[@]}"; do
    if [ -f "frontend/tourism-react/src/pages/tourist/components/$component" ]; then
        echo -e "${GREEN}✓${NC} $component in tourist folder"
    else
        echo -e "${RED}✗${NC} $component not found"
    fi
done

echo ""

# Test 3: Check shared components (should still exist)
echo "🌐 Test 3: Checking shared components..."
SHARED_COMPONENTS=(
    "Header.tsx"
    "Footer.tsx"
    "ErrorBoundary.tsx"
    "LoadingSpinner.tsx"
    "ProtectedRoute.tsx"
    "Toast.tsx"
)

for component in "${SHARED_COMPONENTS[@]}"; do
    if [ -f "frontend/tourism-react/src/components/$component" ]; then
        echo -e "${GREEN}✓${NC} $component in shared folder"
    else
        echo -e "${RED}✗${NC} $component missing from shared"
    fi
done

echo ""

# Test 4: Check old components removed
echo "🗑️  Test 4: Checking old components removed..."
OLD_COMPONENTS=(
    "VisaRequestForm.tsx"
    "VisaStatusDashboard.tsx"
    "AdminVisaManagement.tsx"
    "AIRecommendations.tsx"
    "BookingForm.tsx"
    "PaymentForm.tsx"
    "ReviewSystem.tsx"
)

for component in "${OLD_COMPONENTS[@]}"; do
    if [ ! -f "frontend/tourism-react/src/components/$component" ]; then
        echo -e "${GREEN}✓${NC} $component removed from shared folder"
    else
        echo -e "${YELLOW}⚠${NC} $component still in shared folder (should be moved)"
    fi
done

echo ""

# Test 5: Check App.tsx imports
echo "📦 Test 5: Checking App.tsx imports..."
if grep -q "pages/tourist/components/VisaRequestForm" frontend/tourism-react/src/App.tsx; then
    echo -e "${GREEN}✓${NC} App.tsx imports tourist components correctly"
else
    echo -e "${RED}✗${NC} App.tsx imports need updating"
fi

if grep -q "pages/admin/components/AdminVisaManagement" frontend/tourism-react/src/App.tsx; then
    echo -e "${GREEN}✓${NC} App.tsx imports admin components correctly"
else
    echo -e "${RED}✗${NC} App.tsx admin imports need updating"
fi

echo ""

# Test 6: Check route protection
echo "🔐 Test 6: Checking route protection..."
if grep -q 'requiredRole="admin"' frontend/tourism-react/src/App.tsx; then
    echo -e "${GREEN}✓${NC} Admin routes have role protection"
else
    echo -e "${RED}✗${NC} Admin routes missing role protection"
fi

if grep -q 'requiredRole="tourist"' frontend/tourism-react/src/App.tsx; then
    echo -e "${GREEN}✓${NC} Tourist routes have role protection"
else
    echo -e "${RED}✗${NC} Tourist routes missing role protection"
fi

echo ""

# Test 7: Check backend authorization
echo "🔒 Test 7: Checking backend authorization..."
if grep -q "authorize(\['administrator'\])" backend/api/v2/controllers/VisaController.php; then
    echo -e "${GREEN}✓${NC} Backend has admin authorization checks"
else
    echo -e "${YELLOW}⚠${NC} Backend authorization might need review"
fi

echo ""

# Summary
echo "=========================================="
echo "✅ Role Separation Testing Complete!"
echo ""
echo "Next steps:"
echo "1. Run 'cd frontend/tourism-react && npm start' to test frontend"
echo "2. Login as admin and verify admin dashboard"
echo "3. Login as tourist and verify tourist dashboard"
echo "4. Try accessing opposite role routes (should be denied)"
echo ""
