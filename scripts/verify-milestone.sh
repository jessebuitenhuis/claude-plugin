#!/bin/bash

set -uo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ALL_PASS=true
TESTS_PASS=true
BUILD_PASS=true
LINT_PASS=true
SECURITY_PASS=true
BRANCH_CLEAN=true
COVERAGE_PASS=true
COVERAGE_AVAILABLE=false
RUNTIME_PASS="SKIPPED"
RUNTIME_OUTPUT=""

# Output functions
pass() { echo -e "${GREEN}✅ PASS${NC}"; }
fail() { echo -e "${RED}❌ FAIL${NC}"; }
warn() { echo -e "${YELLOW}⚠️ WARNING${NC}"; }

# Detect project type
detect_project_type() {
    if [ -f "package.json" ]; then
        echo "nodejs"
    elif [ -f "Cargo.toml" ]; then
        echo "rust"
    elif [ -f "pyproject.toml" ] || [ -f "setup.py" ] || [ -f "requirements.txt" ]; then
        echo "python"
    else
        echo "unknown"
    fi
}

PROJECT_TYPE=$(detect_project_type)
echo "Detected project type: $PROJECT_TYPE"
echo ""

# Test results variables
TEST_OUTPUT=""
BUILD_OUTPUT=""
LINT_OUTPUT=""
SECURITY_OUTPUT=""
COVERAGE_OUTPUT=""

# Run checks based on project type
case "$PROJECT_TYPE" in
    nodejs)
        echo "=== Running Full Test Suite ==="
        if npm test > /tmp/test_output.txt 2>&1; then
            TESTS_PASS=true
            TEST_OUTPUT=$(cat /tmp/test_output.txt | tail -20)
        else
            TESTS_PASS=false
            ALL_PASS=false
            TEST_OUTPUT=$(cat /tmp/test_output.txt | tail -20)
        fi

        echo ""
        echo "=== Running Build ==="
        if npm run build > /tmp/build_output.txt 2>&1; then
            BUILD_PASS=true
            BUILD_OUTPUT="Build completed successfully"
        else
            BUILD_PASS=false
            ALL_PASS=false
            BUILD_OUTPUT=$(cat /tmp/build_output.txt | tail -20)
        fi

        echo ""
        echo "=== Running Lint (Strict Mode) ==="
        if npm run lint -- --max-warnings 0 > /tmp/lint_output.txt 2>&1; then
            LINT_PASS=true
            LINT_OUTPUT="No lint errors or warnings"
        else
            LINT_PASS=false
            ALL_PASS=false
            LINT_OUTPUT=$(cat /tmp/lint_output.txt | tail -20)
        fi

        echo ""
        echo "=== Running Security Audit (Strict Mode) ==="
        if npm audit --audit-level=moderate > /tmp/security_output.txt 2>&1; then
            SECURITY_PASS=true
            SECURITY_OUTPUT="No vulnerabilities found"
        else
            SECURITY_PASS=false
            ALL_PASS=false
            SECURITY_OUTPUT=$(cat /tmp/security_output.txt | tail -20)
        fi

        echo ""
        echo "=== Checking Git Status ==="
        if [ -n "$(git status --porcelain)" ]; then
            BRANCH_CLEAN=false
            ALL_PASS=false
        fi

        echo ""
        echo "=== Running Code Coverage (Non-blocking) ==="
        COVERAGE_AVAILABLE=true
        if npm run test:coverage > /tmp/coverage_output.txt 2>&1 || npm test -- --coverage > /tmp/coverage_output.txt 2>&1; then
            COVERAGE_PASS=true
            COVERAGE_OUTPUT=$(cat /tmp/coverage_output.txt | grep -A 5 "Coverage summary" || cat /tmp/coverage_output.txt | tail -10)
        else
            COVERAGE_PASS=false
            COVERAGE_OUTPUT=$(cat /tmp/coverage_output.txt | tail -20)
        fi

        echo ""
        echo "=== Runtime Verification (Non-blocking) ==="
        if grep -q '"dev"' package.json; then
            # Try to start dev server and check if it listens (with timeout)
            if timeout 15 npm run dev > /tmp/dev_output.txt 2>&1; then
                # Check if server started successfully
                if grep -qi "listen\|ready\|started" /tmp/dev_output.txt; then
                    RUNTIME_PASS="PASS"
                    RUNTIME_OUTPUT="Application started successfully"
                else
                    RUNTIME_PASS="FAIL"
                    RUNTIME_OUTPUT="Server started but no ready signal detected"
                fi
            else
                # Timeout or failure - this is OK for non-blocking check
                RUNTIME_PASS="FAIL"
                RUNTIME_OUTPUT="Failed to start dev server (timeout or error)"
            fi
        else
            echo "No dev script found, skipping runtime check..."
            RUNTIME_OUTPUT="No dev script found"
        fi
        ;;

    rust)
        echo "=== Running Full Test Suite ==="
        if cargo test --all-targets > /tmp/test_output.txt 2>&1; then
            TESTS_PASS=true
            TEST_OUTPUT="All tests passed"
        else
            TESTS_PASS=false
            ALL_PASS=false
            TEST_OUTPUT=$(cat /tmp/test_output.txt | tail -20)
        fi

        echo ""
        echo "=== Running Build ==="
        if cargo build --release > /tmp/build_output.txt 2>&1; then
            BUILD_PASS=true
            BUILD_OUTPUT="Release build completed successfully"
        else
            BUILD_PASS=false
            ALL_PASS=false
            BUILD_OUTPUT=$(cat /tmp/build_output.txt | tail -20)
        fi

        echo ""
        echo "=== Running Lint (Strict Mode) ==="
        if cargo clippy --all-targets -- -D warnings > /tmp/lint_output.txt 2>&1; then
            LINT_PASS=true
            LINT_OUTPUT="No clippy warnings"
        else
            LINT_PASS=false
            ALL_PASS=false
            LINT_OUTPUT=$(cat /tmp/lint_output.txt | tail -20)
        fi

        echo ""
        echo "=== Running Security Audit (Strict Mode) ==="
        if cargo audit > /tmp/security_output.txt 2>&1; then
            SECURITY_PASS=true
            SECURITY_OUTPUT="No security vulnerabilities found"
        else
            SECURITY_PASS=false
            ALL_PASS=false
            SECURITY_OUTPUT=$(cat /tmp/security_output.txt | tail -20)
        fi

        echo ""
        echo "=== Checking Git Status ==="
        if [ -n "$(git status --porcelain)" ]; then
            BRANCH_CLEAN=false
            ALL_PASS=false
        fi

        echo ""
        echo "=== Running Code Coverage (Non-blocking) ==="
        COVERAGE_AVAILABLE=true
        if command -v cargo-tarpaulin &> /dev/null; then
            if cargo tarpaulin > /tmp/coverage_output.txt 2>&1; then
                COVERAGE_PASS=true
                COVERAGE_OUTPUT=$(cat /tmp/coverage_output.txt | grep -E "[0-9]+\.[0-9]+% coverage" || cat /tmp/coverage_output.txt | tail -10)
            else
                COVERAGE_PASS=false
                COVERAGE_OUTPUT=$(cat /tmp/coverage_output.txt | tail -20)
            fi
        else
            COVERAGE_AVAILABLE=false
            COVERAGE_OUTPUT="cargo-tarpaulin not installed"
        fi
        ;;

    python)
        echo "=== Running Full Test Suite ==="
        if pytest > /tmp/test_output.txt 2>&1; then
            TESTS_PASS=true
            TEST_OUTPUT=$(cat /tmp/test_output.txt | tail -5)
        else
            TESTS_PASS=false
            ALL_PASS=false
            TEST_OUTPUT=$(cat /tmp/test_output.txt | tail -20)
        fi

        echo ""
        echo "=== Running Build ==="
        if python -m build > /tmp/build_output.txt 2>&1; then
            BUILD_PASS=true
            BUILD_OUTPUT="Build completed successfully"
        else
            BUILD_PASS=false
            ALL_PASS=false
            BUILD_OUTPUT=$(cat /tmp/build_output.txt | tail -20)
        fi

        echo ""
        echo "=== Running Lint (Strict Mode) ==="
        if command -v ruff &> /dev/null; then
            if ruff check --select ALL > /tmp/lint_output.txt 2>&1; then
                LINT_PASS=true
                LINT_OUTPUT="No lint errors"
            else
                LINT_PASS=false
                ALL_PASS=false
                LINT_OUTPUT=$(cat /tmp/lint_output.txt | tail -20)
            fi
        elif command -v pylint &> /dev/null; then
            if pylint --errors-only . > /tmp/lint_output.txt 2>&1; then
                LINT_PASS=true
                LINT_OUTPUT="No critical lint errors"
            else
                LINT_PASS=false
                ALL_PASS=false
                LINT_OUTPUT=$(cat /tmp/lint_output.txt | tail -20)
            fi
        else
            LINT_PASS=false
            ALL_PASS=false
            LINT_OUTPUT="No linter found (ruff or pylint required)"
        fi

        echo ""
        echo "=== Running Security Audit (Strict Mode) ==="
        if command -v bandit &> /dev/null; then
            if bandit -r . -ll > /tmp/security_output.txt 2>&1; then
                SECURITY_PASS=true
                SECURITY_OUTPUT="No security issues found"
            else
                SECURITY_PASS=false
                ALL_PASS=false
                SECURITY_OUTPUT=$(cat /tmp/security_output.txt | tail -20)
            fi
        elif command -v safety &> /dev/null; then
            if safety check > /tmp/security_output.txt 2>&1; then
                SECURITY_PASS=true
                SECURITY_OUTPUT="No security issues found"
            else
                SECURITY_PASS=false
                ALL_PASS=false
                SECURITY_OUTPUT=$(cat /tmp/security_output.txt | tail -20)
            fi
        else
            SECURITY_PASS=false
            ALL_PASS=false
            SECURITY_OUTPUT="No security tool found (bandit or safety required)"
        fi

        echo ""
        echo "=== Checking Git Status ==="
        if [ -n "$(git status --porcelain)" ]; then
            BRANCH_CLEAN=false
            ALL_PASS=false
        fi

        echo ""
        echo "=== Running Code Coverage (Non-blocking) ==="
        COVERAGE_AVAILABLE=true
        if pytest --cov=. --cov-report=term-missing > /tmp/coverage_output.txt 2>&1; then
            COVERAGE_PASS=true
            COVERAGE_OUTPUT=$(cat /tmp/coverage_output.txt | tail -20)
        else
            COVERAGE_PASS=false
            COVERAGE_OUTPUT=$(cat /tmp/coverage_output.txt | tail -20)
        fi
        ;;

    *)
        echo "Unknown project type. Cannot run milestone verification."
        exit 1
        ;;
esac

# Generate markdown report
echo ""
echo "## Milestone Verification Report"
echo ""
echo "### Full Test Suite: $([ "$TESTS_PASS" = true ] && pass || fail)"
if [ -n "$TEST_OUTPUT" ]; then
    echo "$TEST_OUTPUT"
fi
echo ""
echo "### Build: $([ "$BUILD_PASS" = true ] && pass || fail)"
echo ""
echo "### Lint (Strict): $([ "$LINT_PASS" = true ] && pass || fail)"
echo ""
echo "### Security (Strict): $([ "$SECURITY_PASS" = true ] && pass || fail)"
echo ""
echo "### Branch Status: $([ "$BRANCH_CLEAN" = true ] && echo -e "${GREEN}✅ CLEAN${NC}" || echo -e "${RED}❌ DIRTY${NC}")"
echo ""
if [ "$COVERAGE_AVAILABLE" = true ]; then
    if [ "$COVERAGE_PASS" = true ]; then
        echo "### Coverage: $(pass)"
    else
        echo "### Coverage: $(warn) (non-blocking)"
    fi
    if [ -n "$COVERAGE_OUTPUT" ]; then
        echo "$COVERAGE_OUTPUT"
    fi
else
    echo "### Coverage: N/A (not available)"
fi
echo ""
# Runtime check (non-blocking)
if [ "$RUNTIME_PASS" = "PASS" ]; then
    echo "### Runtime Check: $(pass)"
elif [ "$RUNTIME_PASS" = "FAIL" ]; then
    echo "### Runtime Check: $(warn) (non-blocking)"
else
    echo "### Runtime Check: ⏭️  SKIPPED"
fi
if [ -n "$RUNTIME_OUTPUT" ]; then
    echo "$RUNTIME_OUTPUT"
fi
echo ""
echo "### Browser Testing: ⏳ PENDING"
echo "For comprehensive browser testing, run: /shared:browser-verification"
echo ""
echo "### Milestone Readiness: $([ "$ALL_PASS" = true ] && echo -e "${GREEN}✅ READY${NC}" || echo -e "${RED}❌ NOT READY${NC}")"
echo ""

# Exit with appropriate code
if [ "$ALL_PASS" = true ]; then
    exit 0
else
    exit 1
fi
