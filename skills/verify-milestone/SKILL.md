---
name: verify-milestone
description: Verifies milestone completion by running full test suite and comprehensive checks
---

## Purpose
Convenient interface to invoke the verify-milestone hook.

## Usage
Invoke after:
- Completing all tasks in a milestone
- Before moving to next milestone
- Before requesting code review
- Before merging work

## What It Does
1. Runs full test suite (including slow/integration tests)
2. Runs complete build process
3. Runs all linters
4. Runs security audit
5. Checks branch status
6. Returns comprehensive milestone report

## Expected Output
```markdown
## Milestone Verification Report

### Full Test Suite: ✅ PASS / ❌ FAIL
[Details including test counts, coverage]

### Build: ✅ PASS / ❌ FAIL
### Lint (Strict): ✅ PASS / ❌ FAIL
### Security (Strict): ✅ PASS / ❌ FAIL
### Branch Status: ✅ CLEAN / ❌ DIRTY

### Milestone Readiness: ✅ READY / ❌ NOT READY
```

## Workflow
Simply invoke this skill. It will:
- Call the verify-milestone hook
- Execute scripts/verify-milestone.sh
- Report comprehensive milestone status
- Provide clear next steps

## Difference from verify-task
- verify-task: Fast checks for individual tasks (subset of tests, quick review)
- verify-milestone: Comprehensive checks for milestones (full test suite, no review)
