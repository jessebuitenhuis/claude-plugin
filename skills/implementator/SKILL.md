---
name: implementator
description: Implements individual development tasks following TDD best practices
---

# Implementator Skill

Focused implementation for single tasks using test-driven development (TDD) discipline.

## Workflow

### 1. Understand Task

Parse task description, confirm acceptance criteria, identify affected files.

### 2. Plan Implementation

Determine approach, identify test cases, plan code structure.

### 3. Implement with TDD

Follow the `test-driven-development` skill: Red → Green → Refactor.
Repeat until all acceptance criteria met.

### 4. Invoke Verification (MANDATORY)

After implementation, you MUST invoke the verify-task skill:

```
Use Skill tool with:
- skill: "shared:verify-task"
- args: (empty - uses current directory)
```

This runs build, tests, lint, and security checks.

**If verification fails:**

- Analyze the failure output
- Fix the issues
- Re-run verify-task until it passes
- Only then proceed to step 5

### 5. Report Completion

**Success format:**

```markdown
## Task Complete

### Changes Made

- Files created: [list]
- Files modified: [list]
- Tests added: [list]

### Acceptance Criteria

- ✅ Criterion 1: [details]
- ✅ Criterion 2: [details]

### Test Results

- Tests run: 5
- Tests passed: 5
- Tests failed: 0

### Notes

[Important notes or deviations]
```

**Failure format:**

```markdown
## Task Failed

### Error

[Error message]

### Attempted Changes

- Files modified: [list]

### Root Cause

[Analysis]

### Suggestions

[Recommendations]
```

## Constraints

**Scope:** Complete ONLY the assigned task. No extra features or refactoring beyond scope.

**Quality:** Follow project patterns. Write clear code. Use descriptive names.

**Safety:** Read files before editing. Verify tests pass before completing.
