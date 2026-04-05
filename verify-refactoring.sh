#!/bin/bash

# Tourism Management System - Role Refactoring Verification Script
# This script helps verify that the agent role has been successfully removed

echo "=========================================="
echo "Tourism Management System"
echo "Role Refactoring Verification"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for issues
ISSUES=0

echo "1. Checking for agent references in frontend..."
echo "----------------------------------------------"

# Check TypeScript/React files
AGENT_REFS=$(grep -r "agent" frontend/tourism-react/src --exclude-dir=node_modules --include="*.tsx" --include="*.ts" | grep -v "user_agent" | grep -v "// agent" | wc -l)

if [ "$AGENT_REFS" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $AGENT_REFS potential agent references in frontend${NC}"
    echo "Run: grep -r \"agent\" frontend/tourism-react/src --exclude-dir=node_modules --include=\"*.tsx\" --include=\"*.ts\" | grep -v \"user_agent\""
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓ No agent references found in frontend${NC}"
fi

echo ""
echo "2. Checking for agent references in backend..."
echo "----------------------------------------------"

# Check PHP files (excluding user_agent which is legitimate)
BACKEND_AGENT_REFS=$(grep -r "'agent'" backend/api --include="*.php" | wc -l)

if [ "$BACKEND_AGENT_REFS" -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $BACKEND_AGENT_REFS agent role references in backend${NC}"
    echo "Run: grep -r \"'agent'\" backend/api --include=\"*.php\""
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓ No agent role references found in backend${NC}"
fi

echo ""
echo "3. Checking database schema..."
echo "----------------------------------------------"

# Check if schema has been updated
if grep -q "2, 'agent'" database/schema.sql; then
    echo -e "${RED}✗ Agent role still exists in schema.sql${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓ Agent role removed from schema.sql${NC}"
fi

# Check if migration file exists
if [ -f "database/migration_remove_agent_role.sql" ]; then
    echo -e "${GREEN}✓ Migration script exists${NC}"
else
    echo -e "${RED}✗ Migration script not found${NC}"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "4. Checking route structure..."
echo "----------------------------------------------"

# Check for agent routes in App.tsx
if grep -q "/agent/" frontend/tourism-react/src/App.tsx; then
    echo -e "${RED}✗ Agent routes still exist in App.tsx${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓ No agent routes in App.tsx${NC}"
fi

# Check for tourist routes
if grep -q "/tourist/dashboard" frontend/tourism-react/src/App.tsx; then
    echo -e "${GREEN}✓ Tourist routes exist${NC}"
else
    echo -e "${RED}✗ Tourist routes not found${NC}"
    ISSUES=$((ISSUES + 1))
fi

# Check for admin routes
if grep -q "/admin/dashboard" frontend/tourism-react/src/App.tsx; then
    echo -e "${GREEN}✓ Admin routes exist${NC}"
else
    echo -e "${RED}✗ Admin routes not found${NC}"
    ISSUES=$((ISSUES + 1))
fi

echo ""
echo "5. Checking role type definitions..."
echo "----------------------------------------------"

# Check if agent is removed from UserRole type
if grep -q "'agent'" frontend/tourism-react/src/types/roles.ts; then
    echo -e "${RED}✗ Agent still in role type definitions${NC}"
    ISSUES=$((ISSUES + 1))
else
    echo -e "${GREEN}✓ Agent removed from role types${NC}"
fi

echo ""
echo "6. Checking dashboard components..."
echo "----------------------------------------------"

# Check if new dashboards exist
if [ -f "frontend/tourism-react/src/pages/admin/AdminDashboard.tsx" ]; then
    echo -e "${GREEN}✓ AdminDashboard.tsx exists${NC}"
else
    echo -e "${RED}✗ AdminDashboard.tsx not found${NC}"
    ISSUES=$((ISSUES + 1))
fi

if [ -f "frontend/tourism-react/src/pages/tourist/TouristDashboard.tsx" ]; then
    echo -e "${GREEN}✓ TouristDashboard.tsx exists${NC}"
else
    echo -e "${RED}✗ TouristDashboard.tsx not found${NC}"
    ISSUES=$((ISSUES + 1))
fi

# Check if old agent dashboard still exists
if [ -f "frontend/tourism-react/src/components/dashboards/AgentDashboard.tsx" ]; then
    echo -e "${YELLOW}⚠ AgentDashboard.tsx still exists (can be deleted)${NC}"
else
    echo -e "${GREEN}✓ AgentDashboard.tsx removed${NC}"
fi

echo ""
echo "7. Checking documentation..."
echo "----------------------------------------------"

if [ -f "REFACTORING_COMPLETE.md" ]; then
    echo -e "${GREEN}✓ Refactoring documentation exists${NC}"
else
    echo -e "${YELLOW}⚠ Refactoring documentation not found${NC}"
fi

if [ -f "ROLE_REFACTORING_GUIDE.md" ]; then
    echo -e "${GREEN}✓ Refactoring guide exists${NC}"
else
    echo -e "${YELLOW}⚠ Refactoring guide not found${NC}"
fi

echo ""
echo "=========================================="
echo "Verification Summary"
echo "=========================================="

if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Refactoring appears complete.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Run database migration: mysql -u root -p tms_system < database/migration_remove_agent_role.sql"
    echo "2. Build frontend: cd frontend/tourism-react && npm run build"
    echo "3. Test both tourist and admin accounts"
    echo "4. Optional: Delete AgentDashboard.tsx if it still exists"
else
    echo -e "${RED}✗ Found $ISSUES issue(s) that need attention${NC}"
    echo ""
    echo "Please review the issues above and make necessary corrections."
fi

echo ""
echo "=========================================="
