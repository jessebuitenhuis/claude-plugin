---
name: verify-task
description: Verifies completed work by running build, test, lint, and security checks
---

## Purpose
Convenient interface to invoke the verify-task hook.

## Usage
Invoke after:
- Completing implementation task
- Making code changes
- Fixing bugs
- Implementing features

## What It Does
1. Runs build command
2. Runs test suite (fast subset)
3. Runs linter
4. Runs security audit
5. Performs quick LLM review (Haiku subagent)
6. Returns comprehensive verification report

## Expected Output
```markdown
## Task Verification Report

### Build: ✅ PASS / ❌ FAIL
### Tests: ✅ PASS / ❌ FAIL
### Lint: ✅ PASS / ❌ FAIL
### Security: ✅ PASS / ❌ FAIL
### Quick Review: ✅ PASS / ❌ FAIL

### Overall: ✅ PASS / ❌ FAIL
```

## Workflow
Simply invoke this skill. It will:
- Call the verify-task hook
- Execute scripts/verify-task.sh
- Spawn Haiku subagent for quick code review
- Combine results into comprehensive report
- Report pass/fail status

## Note
For milestone verification, use verify-milestone skill instead.
