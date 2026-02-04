---
name: planning
description: Break down designs into actionable tasks (2-5 min each) organized into milestones (3-6 tasks) with verification checkpoints
---

# Planning Skill

Break down designs into executable plans with clear tasks and milestones.

## Process

**1. Analyze Scope**
- Identify major work components
- Estimate overall complexity
- Define natural breakpoints

**2. Create Milestones** (3-6 tasks per milestone)
- Group related tasks by functionality
- Ensure each milestone creates verifiable value
- Order by dependency
- Plan for verify-milestone.sh at each milestone boundary

**3. Break Down Tasks** (2-5 minutes per task)
- Make tasks independently executable
- Define clear acceptance criteria
- Note dependencies between tasks
- Note file paths (create/modify/test)
- Plan for verify-task.sh after each task

**4. Output Plan**
- Save to: `docs/plans/YYYY-MM-DD-<feature-name>.md`
- Use format below

## Plan Format

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** This plan is designed for execution by the executor skill.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Milestones:** [N] milestones, [M] total tasks

---

### Milestone N: [Milestone Name]

**Tasks:** [K] tasks (2-5 min each)

#### Task N.K: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Description:** [What this task accomplishes]

**Step 1: Write the failing test**

```python
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

**Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

```python
def function(input):
    return expected
```

**Step 4: Run test to verify it passes**

Run: `pytest tests/path/test.py::test_name -v`
Expected: PASS

**Step 5: Verify task**

Run: `verify-task` (invokes scripts/verify-task.sh)
Expected: Build ✅, Tests ✅, Lint ✅, Security ✅

**Step 6: Commit**

```bash
git add tests/path/test.py src/path/file.py
git commit -m "feat: add specific feature"
```

---

**Milestone N Verification:**

Run: `verify-milestone` (invokes scripts/verify-milestone.sh)
Expected: Full test suite ✅, Build ✅, Lint (strict) ✅, Security (strict) ✅

---
```

## Handoff

After saving the plan:

**"Plan complete and saved to `docs/plans/<filename>.md`. Ready for execution by the executor skill."**

## Handoff to Execution

After the plan is approved:

1. **User invokes executor:**
   ```
   /shared:executor <path-to-plan>
   ```

2. **Executor will:**
   - Create isolated worktree
   - Execute tasks through implementator subagents
   - Run verification after each task
   - Perform comprehensive reviews at milestones
   - Report completion with next steps

3. **Manual alternatives:**
   - Review the plan manually
   - Implement tasks one at a time
   - Run verify-task after each task
   - Run verify-milestone after completing milestones
