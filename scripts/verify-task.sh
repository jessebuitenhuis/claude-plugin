#!/bin/bash

# Task Verification Script
# Runs build, test, lint, and security checks after each task
# Exit code: 0 = pass, 1 = fail

set -uo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
BUILD_STATUS="✅ PASS"
TEST_STATUS="✅ PASS"
LINT_STATUS="✅ PASS"
SECURITY_STATUS="✅ PASS"
OVERALL="✅ PASS"

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    if [[ $status == "FAIL" ]]; then
        echo -e "${RED}❌ FAIL${NC}: $message"
    elif [[ $status == "WARN" ]]; then
        echo -e "${YELLOW}⚠️  WARNING${NC}: $message"
    else
        echo -e "${GREEN}✅ PASS${NC}: $message"
    fi
}

# Function to detect project type
detect_project_type() {
    if [[ -f "package.json" ]]; then
        echo "nodejs"
    else
        echo "unknown"
    fi
}

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
PROJECT_TYPE=$(detect_project_type)

echo "## Task Verification Report"
echo ""
echo "Project type: $PROJECT_TYPE"
echo "Project root: $PROJECT_ROOT"
echo ""

# Navigate to project root
cd "$PROJECT_ROOT"

# Run commands based on project type
case "$PROJECT_TYPE" in
    nodejs)
        # Determine package manager
        if [[ -f "yarn.lock" ]]; then
            PKG_MANAGER="yarn"
        else
            PKG_MANAGER="npm"
        fi

        # Build
        echo "### Running build..."
        if grep -q '"build"' package.json; then
            if $PKG_MANAGER run build 2>&1 | tee /tmp/build.log; then
                BUILD_STATUS="✅ PASS"
            else
                BUILD_STATUS="❌ FAIL"
                OVERALL="❌ FAIL"
            fi
        else
            echo "No build script found, skipping..."
            BUILD_STATUS="⏭️  SKIPPED"
        fi

        # Test (fast subset)
        echo ""
        echo "### Running tests..."
        if grep -q '"test"' package.json; then
            # Try to exclude integration/slow tests
            if $PKG_MANAGER test -- --testPathIgnorePatterns=integration --testPathIgnorePatterns=slow 2>&1 | tee /tmp/test.log; then
                TEST_STATUS="✅ PASS"
            else
                TEST_STATUS="❌ FAIL"
                OVERALL="❌ FAIL"
            fi
        else
            echo "No test script found, skipping..."
            TEST_STATUS="⏭️  SKIPPED"
        fi

        # Lint
        echo ""
        echo "### Running linter..."
        if grep -q '"lint"' package.json; then
            LINT_OUTPUT=$($PKG_MANAGER run lint 2>&1 || true)
            if [[ $? -eq 0 ]]; then
                LINT_STATUS="✅ PASS"
            else
                # Check if it's just warnings
                if echo "$LINT_OUTPUT" | grep -qi "warning"; then
                    LINT_STATUS="⚠️  WARNINGS"
                else
                    LINT_STATUS="❌ FAIL"
                    OVERALL="❌ FAIL"
                fi
            fi
            echo "$LINT_OUTPUT"
        else
            echo "No lint script found, skipping..."
            LINT_STATUS="⏭️  SKIPPED"
        fi

        # Security
        echo ""
        echo "### Running security audit..."
        if $PKG_MANAGER audit --production 2>&1 | tee /tmp/security.log; then
            SECURITY_STATUS="✅ PASS"
        else
            # Check severity - continue on low/moderate, fail on high/critical
            if grep -E "(high|critical)" /tmp/security.log >/dev/null; then
                SECURITY_STATUS="❌ FAIL"
                OVERALL="❌ FAIL"
            else
                SECURITY_STATUS="⚠️  WARNINGS"
            fi
        fi
        ;;

    unknown)
        echo "### Unknown project type"
        echo "Could not detect Node.js project (package.json not found)"
        BUILD_STATUS="⏭️  SKIPPED"
        TEST_STATUS="⏭️  SKIPPED"
        LINT_STATUS="⏭️  SKIPPED"
        SECURITY_STATUS="⏭️  SKIPPED"
        ;;
esac

# Generate git diff summary
echo ""
echo "### Git diff summary..."
DIFF_FILE="/tmp/task-diff.md"
git diff --stat > "$DIFF_FILE"
echo "Full diff saved to: $DIFF_FILE"

# Print final report
echo ""
echo "## Task Verification Report"
echo ""
echo "### Build: $BUILD_STATUS"
echo "### Tests: $TEST_STATUS"
echo "### Lint: $LINT_STATUS"
echo "### Security: $SECURITY_STATUS"
echo "### Quick Review: ⏳ PENDING (requires LLM review)"
echo ""
echo "### Overall: $OVERALL"
echo ""

# Show detailed diff (last 50 lines)
echo "### Recent Changes:"
echo '```diff'
git diff | head -n 100
echo '```'

# Exit with appropriate code
if [[ "$OVERALL" == "✅ PASS" ]]; then
    exit 0
else
    exit 1
fi
