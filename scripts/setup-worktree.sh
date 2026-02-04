#!/usr/bin/env bash

# Creates isolated git worktree for parallel development
set -euo pipefail

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly NC='\033[0m' # No Color

# Constants
readonly WORKTREES_DIR=".worktrees"

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if worktree already exists
check_worktree_exists() {
    local worktree_path="$1"
    if [[ -d "$worktree_path" ]]; then
        log_error "Worktree already exists at: $worktree_path"
        return 1
    fi
    return 0
}

# Generate branch name from parameter or timestamp
generate_branch_name() {
    local custom_name="${1:-}"
    if [[ -n "$custom_name" ]]; then
        echo "$custom_name"
    else
        date +"feature/%Y-%m-%d-%H%M%S"
    fi
}

# Detect project type
detect_project_type() {
    if [[ -f "package.json" ]]; then
        echo "nodejs"
    else
        echo "unknown"
    fi
}

# Detect package manager for Node.js projects
detect_nodejs_package_manager() {
    if command -v yarn &> /dev/null && [[ -f "yarn.lock" ]]; then
        echo "yarn"
    elif command -v npm &> /dev/null; then
        echo "npm"
    else
        echo ""
    fi
}

# Install dependencies based on project type
install_dependencies() {
    local project_type="$1"
    local worktree_path="$2"

    log_info "Installing dependencies for $project_type project..."

    case "$project_type" in
        nodejs)
            local pkg_manager
            pkg_manager=$(detect_nodejs_package_manager)
            if [[ -z "$pkg_manager" ]]; then
                log_error "No Node.js package manager found (npm or yarn required)"
                return 1
            fi
            (
                cd "$worktree_path"
                case "$pkg_manager" in
                    yarn)
                        yarn install
                        ;;
                    npm)
                        npm install
                        ;;
                esac
            )
            ;;
        *)
            log_warn "Unknown project type, skipping dependency installation"
            ;;
    esac
}

# Run baseline tests to verify environment
run_baseline_tests() {
    local worktree_path="$1"
    local project_type="$2"

    log_info "Running baseline tests to verify environment..."

    case "$project_type" in
        nodejs)
            if grep -q '"test"' "$worktree_path/package.json" 2>/dev/null; then
                (
                    cd "$worktree_path"
                    # Run tests with --passWithNoTests to handle projects without tests
                    if ! npm test -- --passWithNoTests 2>&1; then
                        log_error "Baseline tests failed - environment not ready for development"
                        return 1
                    fi
                )
            else
                log_warn "No test script found in package.json"
            fi
            ;;
        *)
            log_warn "Unknown project type, skipping baseline tests"
            ;;
    esac
}

main() {
    # Get branch name from argument or generate timestamp-based name
    local branch_name
    branch_name=$(generate_branch_name "${1:-}")

    log_info "Setting up worktree for branch: $branch_name"

    # Create .worktrees directory if it doesn't exist
    if [[ ! -d "$WORKTREES_DIR" ]]; then
        mkdir -p "$WORKTREES_DIR"
        log_info "Created $WORKTREES_DIR directory"
    fi

    # Determine worktree path
    # Strip feature/ prefix if present, then get basename to avoid unnecessary nesting
    local clean_name="${branch_name#feature/}"
    local worktree_path="$WORKTREES_DIR/$(basename "$clean_name")"

    # Check if worktree already exists
    if ! check_worktree_exists "$worktree_path"; then
        exit 1
    fi

    # Create git worktree
    log_info "Creating git worktree at: $worktree_path"
    if ! git worktree add "$worktree_path" -b "$branch_name"; then
        log_error "Failed to create git worktree"
        exit 1
    fi

    # Detect project type
    local project_type
    project_type=$(detect_project_type)
    log_info "Detected project type: $project_type"

    # Install dependencies
    if ! install_dependencies "$project_type" "$worktree_path"; then
        log_error "Failed to install dependencies"
        # Clean up failed worktree
        git worktree remove "$worktree_path" 2>/dev/null || true
        git branch -D "$branch_name" 2>/dev/null || true
        exit 1
    fi

    # Run baseline tests
    if ! run_baseline_tests "$worktree_path" "$project_type"; then
        log_error "Environment validation failed, cleaning up worktree"
        git worktree remove "$worktree_path" 2>/dev/null || true
        git branch -D "$branch_name" 2>/dev/null || true
        exit 1
    fi

    # Output worktree path as last line for programmatic use
    echo "$worktree_path"

    log_info "Worktree setup complete!"
    exit 0
}

main "$@"
