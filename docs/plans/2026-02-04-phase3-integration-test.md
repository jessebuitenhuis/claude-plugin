# Phase 3 Integration Test Plan

**Date:** 2026-02-04
**Purpose:** Validate end-to-end executor functionality
**Status:** Ready for Execution

---

## Overview

Integration tests for Phase 3 executor implementation. Tests validate the complete workflow from plan parsing through execution to verification.

---

## Test Scenarios

### Scenario 1: Sequential Execution (Milestone 1)

**Purpose:** Validate basic sequential task execution

**Input Plan:**
```markdown
# Test Feature Implementation Plan

> **For Claude:** This plan is designed for execution by the executor skill.

**Goal:** Add a simple utility function

**Architecture:** Single utility function with tests

**Tech Stack:** TypeScript

**Milestones:** 1 milestone, 2 tasks

---

### Milestone 1: Core Utility Function

**Tasks:** 2 tasks (2-5 min each)

#### Task 1.1: Create Utility Function

**Files:**
- Create: `src/utils/math.ts`
- Test: `tests/utils/math.test.ts`

**Description:** Add a function to add two numbers

**Step 1: Write the failing test**

```typescript
import { add } from '../src/utils/math';

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- math.test.ts`
Expected: FAIL with "add not defined"

**Step 3: Write minimal implementation**

```typescript
export function add(a: number, b: number): number {
  return a + b;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- math.test.ts`
Expected: PASS

**Step 5: Verify task**

Run: `verify-task`
Expected: Build ✅, Tests ✅, Lint ✅, Security ✅

**Step 6: Commit**

```bash
git add src/utils/math.ts tests/utils/math.test.ts
git commit -m "feat: add math utility function"
```

---

#### Task 1.2: Add Multiplication Function

**Files:**
- Modify: `src/utils/math.ts`
- Test: `tests/utils/math.test.ts`

**Description:** Add a function to multiply two numbers

**Step 1: Write the failing test**

```typescript
it('should multiply two numbers', () => {
  expect(multiply(2, 3)).toBe(6);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- math.test.ts`
Expected: FAIL with "multiply not defined"

**Step 3: Write minimal implementation**

```typescript
export function multiply(a: number, b: number): number {
  return a * b;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- math.test.ts`
Expected: PASS

**Step 5: Verify task**

Run: `verify-task`
Expected: Build ✅, Tests ✅, Lint ✅, Security ✅

**Step 6: Commit**

```bash
git add src/utils/math.ts tests/utils/math.test.ts
git commit -m "feat: add multiplication function"
```

---

**Milestone 1 Verification:**

Run: `verify-milestone`
Expected: Full test suite ✅, Build ✅, Lint (strict) ✅, Security (strict) ✅

---
```

**Expected Outcome:**
- ✅ Executor parses plan successfully
- ✅ Worktree created via setup-isolated-environment
- ✅ Task 1.1 executed sequentially
- ✅ verify-task passes after Task 1.1
- ✅ Task 1.2 executed sequentially
- ✅ verify-task passes after Task 1.2
- ✅ verify-milestone passes at milestone completion
- ✅ Execution summary shows 2/2 tasks complete, 1/1 milestones complete

**Success Criteria:**
- Both tasks complete successfully
- All verifications pass
- Worktree contains working implementation
- Execution summary is accurate

---

### Scenario 2: Parallel Execution (Milestone 2)

**Purpose:** Validate parallel task execution with dependency analysis

**Input Plan:**
```markdown
# Parallel Test Feature Implementation Plan

> **For Claude:** This plan is designed for execution by the executor skill.

**Goal:** Add multiple independent utility functions

**Architecture:** Multiple independent utility functions with tests

**Tech Stack:** TypeScript

**Milestones:** 1 milestone, 4 tasks (can parallelize)

---

### Milestone 1: Independent Utility Functions

**Tasks:** 4 tasks (2-5 min each)

#### Task 1.1: Add Subtract Function

**Files:**
- Create: `src/utils/subtract.ts`
- Test: `tests/utils/subtract.test.ts`

**Description:** Add a function to subtract two numbers

[TDD steps as in Scenario 1]

---

#### Task 1.2: Add Divide Function

**Files:**
- Create: `src/utils/divide.ts`
- Test: `tests/utils/divide.test.ts`

**Description:** Add a function to divide two numbers

[TDD steps as in Scenario 1]

---

#### Task 1.3: Add Modulo Function

**Files:**
- Create: `src/utils/modulo.ts`
- Test: `tests/utils/modulo.test.ts`

**Description:** Add a function to calculate modulo

[TDD steps as in Scenario 1]

---

#### Task 1.4: Add Power Function

**Files:**
- Create: `src/utils/power.ts`
- Test: `tests/utils/power.test.ts`

**Description:** Add a function to calculate power

[TDD steps as in Scenario 1]

---

**Milestone 1 Verification:**

Run: `verify-milestone`
Expected: Full test suite ✅, Build ✅, Lint (strict) ✅, Security (strict) ✅

---
```

**Expected Outcome:**
- ✅ Executor parses plan successfully
- ✅ Dependency analysis identifies no conflicts (different files)
- ✅ Tasks grouped into parallel execution group
- ✅ Tasks 1.1, 1.2, 1.3, 1.4 execute in parallel (2-3 concurrent agents)
- ✅ Each task verified individually after completion
- ✅ All verify-task calls pass
- ✅ verify-milestone passes at milestone completion
- ✅ Execution summary shows 4/4 tasks complete, 1/1 milestones complete
- ✅ Parallelization speedup noted in summary

**Success Criteria:**
- All tasks complete successfully
- Tasks executed in parallel (not sequentially)
- All verifications pass
- No file conflicts or race conditions
- Execution summary shows parallelization improvement

---

### Scenario 3: Task Failure and Retry (Milestone 3)

**Purpose:** Validate task failure handling and retry logic

**Input Plan:**
```markdown
# Failure Test Feature Implementation Plan

> **For Claude:** This plan is designed for execution by the executor skill.

**Goal:** Add a function with intentional failure for testing

**Architecture:** Single function with tests

**Tech Stack:** TypeScript

**Milestones:** 1 milestone, 1 task

---

### Milestone 1: Function with Bug

**Tasks:** 1 task (2-5 min each)

#### Task 1.1: Create Buggy Function

**Files:**
- Create: `src/utils/buggy.ts`
- Test: `tests/utils/buggy.test.ts`

**Description:** Add a function that will fail on first attempt

**Step 1: Write the failing test**

```typescript
import { complexCalculation } from '../src/utils/buggy';

describe('complexCalculation', () => {
  it('should calculate correctly', () => {
    expect(complexCalculation(5, 3)).toBe(8);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- buggy.test.ts`
Expected: FAIL

**Step 3: Write buggy implementation (will fail verification)**

```typescript
export function complexCalculation(a: number, b: number): number {
  // Intentional bug: returns wrong result
  return a - b; // Should be a + b
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- buggy.test.ts`
Expected: PASS (test might have wrong expectation too)

**Step 5: Verify task**

Run: `verify-task`
Expected: May fail due to code review or if tests catch the bug

**Step 6: Commit**

```bash
git add src/utils/buggy.ts tests/utils/buggy.test.ts
git commit -m "feat: add complex calculation"
```

---

**Milestone 1 Verification:**

Run: `verify-milestone`
Expected: May fail if code review catches the bug

---
```

**Expected Outcome:**
- ✅ Executor parses plan successfully
- ✅ Task 1.1 executed
- ✅ verify-task or code-review detects the bug
- ✅ Task marked as failed
- ✅ Executor retries task with error context
- ✅ Second attempt fixes the bug
- ✅ verify-task passes on retry
- ✅ Execution summary shows 1/1 tasks complete (after retry)

**Success Criteria:**
- Task fails on first attempt
- Retry triggered with error context
- Task succeeds on retry
- Maximum retries not exceeded
- Error context preserved in retry

---

### Scenario 4: Milestone Verification (Milestone 2)

**Purpose:** Validate comprehensive milestone verification

**Input Plan:**
```markdown
# Milestone Verification Test Plan

> **For Claude:** This plan is designed for execution by the executor skill.

**Goal:** Add a complete feature with proper verification

**Architecture:** Utility module with comprehensive tests

**Tech Stack:** TypeScript

**Milestones:** 1 milestone, 3 tasks

---

### Milestone 1: Complete String Utilities Module

**Tasks:** 3 tasks (2-5 min each)

#### Task 1.1: Add Capitalize Function

**Files:**
- Create: `src/utils/string.ts`
- Test: `tests/utils/string.test.ts`

**Description:** Add function to capitalize first letter

[TDD steps]

---

#### Task 1.2: Add Reverse Function

**Files:**
- Modify: `src/utils/string.ts`
- Test: `tests/utils/string.test.ts`

**Description:** Add function to reverse string

[TDD steps]

---

#### Task 1.3: Add Truncate Function

**Files:**
- Modify: `src/utils/string.ts`
- Test: `tests/utils/string.test.ts`

**Description:** Add function to truncate string

[TDD steps]

---

**Milestone 1 Verification:**

Run: `verify-milestone`
Expected: Full test suite ✅, Build ✅, Lint (strict) ✅, Security (strict) ✅

Also run:
- code-review skill: Quality check
- spec-compliance skill: Requirements check

---
```

**Expected Outcome:**
- ✅ All tasks complete successfully
- ✅ verify-task passes after each task
- ✅ verify-milestone passes comprehensive checks
- ✅ code-review skill provides quality assessment
- ✅ spec-compliance skill verifies requirements met
- ✅ All milestone verification checks pass
- ✅ Execution summary includes verification results

**Success Criteria:**
- All tasks pass verification
- Milestone verification passes all checks
- Code review provides useful feedback
- Spec compliance confirms requirements met
- No blocking issues found

---

### Scenario 5: Mixed Sequential and Parallel Execution

**Purpose:** Validate execution with dependencies

**Input Plan:**
```markdown
# Mixed Execution Test Plan

> **For Claude:** This plan is designed for execution by the executor skill.

**Goal:** Add feature with dependencies and independent tasks

**Architecture:** Feature with shared interface and independent implementations

**Tech Stack:** TypeScript

**Milestones:** 1 milestone, 5 tasks

---

### Milestone 1: Feature with Dependencies

**Tasks:** 5 tasks (2-5 min each)

#### Task 1.1: Define Interface

**Files:**
- Create: `src/types/processor.ts`

**Description:** Define processor interface

[TDD steps]

---

#### Task 1.2: Implement JSON Processor

**Files:**
- Create: `src/processors/json.ts`
- Test: `tests/processors/json.test.ts`

**Description:** Implement JSON processor

[TDD steps]
**Dependencies:** Task 1.1 (requires interface)

---

#### Task 1.3: Implement XML Processor

**Files:**
- Create: `src/processors/xml.ts`
- Test: `tests/processors/xml.test.ts`

**Description:** Implement XML processor

[TDD steps]
**Dependencies:** Task 1.1 (requires interface)

---

#### Task 1.4: Implement CSV Processor

**Files:**
- Create: `src/processors/csv.ts`
- Test: `tests/processors/csv.test.ts`

**Description:** Implement CSV processor

[TDD steps]
**Dependencies:** Task 1.1 (requires interface)

---

#### Task 1.5: Add Factory Function

**Files:**
- Create: `src/factory/processor.ts`
- Test: `tests/factory/processor.test.ts`

**Description:** Add factory to create processors

[TDD steps]
**Dependencies:** Task 1.2, 1.3, 1.4 (requires all processors)

---

**Milestone 1 Verification:**

Run: `verify-milestone`
Expected: Full test suite ✅, Build ✅, Lint (strict) ✅, Security (strict) ✅

---
```

**Expected Outcome:**
- ✅ Task 1.1 executed first (sequential)
- ✅ Tasks 1.2, 1.3, 1.4 executed in parallel (all depend on 1.1, no conflicts)
- ✅ Task 1.5 executed after 1.2, 1.3, 1.4 complete (depends on all)
- ✅ All verify-task calls pass
- ✅ verify-milestone passes comprehensive checks
- ✅ Execution summary shows correct execution order

**Success Criteria:**
- Dependencies respected (Task 1.1 before others)
- Parallel execution used for independent tasks (1.2, 1.3, 1.4)
- Sequential execution used for dependent tasks (1.5 after others)
- All verifications pass
- Execution order documented in summary

---

## Test Execution Plan

### Prerequisites

1. **Executor Skill:** Phase 3 implementation complete
2. **Implementator Agent:** Enhanced with TDD workflow
3. **Verification Skills:** verify-task, verify-milestone, code-review, spec-compliance
4. **Environment:** Isolated worktree support via setup-isolated-environment

### Test Execution Order

1. **Run Scenario 1:** Sequential Execution
   - Validate basic functionality
   - Confirm sequential execution works
   - Verify task verification works

2. **Run Scenario 2:** Parallel Execution
   - Validate dependency analysis
   - Confirm parallel execution works
   - Verify no conflicts or race conditions

3. **Run Scenario 3:** Failure and Retry
   - Validate failure detection
   - Confirm retry logic works
   - Verify error context preserved

4. **Run Scenario 4:** Milestone Verification
   - Validate comprehensive verification
   - Confirm all verification skills work
   - Verify milestone reporting

5. **Run Scenario 5:** Mixed Execution
   - Validate dependency handling
   - Confirm mixed sequential/parallel execution
   - Verify execution order correctness

### Test Execution Method

**Manual Execution (for validation):**
1. Create test plan file
2. Invoke executor skill with plan path
3. Monitor execution progress
4. Verify execution summary
5. Inspect worktree for results

**Automated Execution (for CI/CD):**
1. Create test script that runs all scenarios
2. Capture execution summaries
3. Verify expected outcomes
4. Report test results

---

## Expected Test Results

### Success Metrics

**Scenario 1 (Sequential):**
- All tasks complete: ✅
- All verifications pass: ✅
- Execution summary accurate: ✅

**Scenario 2 (Parallel):**
- All tasks complete: ✅
- Tasks executed in parallel: ✅
- All verifications pass: ✅
- No file conflicts: ✅

**Scenario 3 (Failure/Retry):**
- Task fails on first attempt: ✅
- Retry triggered: ✅
- Task succeeds on retry: ✅
- Error context preserved: ✅

**Scenario 4 (Milestone Verification):**
- All tasks complete: ✅
- All verifications pass: ✅
- Code review works: ✅
- Spec compliance works: ✅

**Scenario 5 (Mixed Execution):**
- All tasks complete: ✅
- Dependencies respected: ✅
- Parallel execution used when safe: ✅
- Sequential execution used when needed: ✅

### Overall Success Criteria

Phase 3 integration tests pass when:
1. ✅ All 5 scenarios execute successfully
2. ✅ All verifications pass (verify-task, verify-milestone, code-review, spec-compliance)
3. ✅ Parallel execution works correctly (no conflicts, proper speedup)
4. ✅ Failure handling works correctly (retry, recovery)
5. ✅ Execution summaries are accurate and complete
6. ✅ Worktrees contain working implementations
7. ✅ No critical failures or blocking issues

---

## Notes

**Test Data:**
- Use simple, well-defined tasks
- Include edge cases (failures, dependencies)
- Keep tasks short (2-5 minutes each)

**Test Environment:**
- Use isolated worktrees for each scenario
- Clean up worktrees after tests
- Verify no side effects between tests

**Test Monitoring:**
- Monitor executor progress reporting
- Capture execution summaries
- Document any deviations from expected outcomes

**Test Documentation:**
- Record test results
- Document any issues found
- Track bug fixes and improvements

---

*Integration test plan for Phase 3 executor implementation*
