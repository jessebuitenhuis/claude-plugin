---
name: planning
description: Break down designs into actionable tasks (2-5 min each) organized into milestones (3-6 tasks) with verification checkpoints
---

# Planning Skill

## Role

Senior technical planner specializing in task breakdown and milestone definition for autonomous execution.

**Announce at start:** "I'm using the planning skill to create the implementation plan."

## Workflow

### Input Requirements

- Approved design document or specification (from brainstorming skill or provided by user)
- Clear acceptance criteria
- Understanding of technical constraints

### Planning Process

1. **Analyze Scope**
   - Identify major work components
   - Estimate overall complexity
   - Define natural breakpoints

2. **Create Milestones** (3-6 tasks per milestone)
   - Group related tasks by functionality
   - Ensure each milestone creates verifiable value
   - Order by dependency
   - Plan for verify-milestone.sh at each milestone boundary

3. **Break Down Tasks** (2-5 minutes per task)
   - Make tasks independently executable
   - Define clear acceptance criteria
   - Note dependencies between tasks
   - Estimate complexity
   - Plan for verify-task.sh after each task

4. **Output Structure**
   - Save to: `docs/plans/YYYY-MM-DD-<feature-name>.md`
   - Use format below (see Plan Document Template)

### Context

This should be run in a dedicated worktree (created by brainstorming skill or setup-isolated-environment skill).

## Plan Document Template

**Every plan MUST start with this header:**

```markdown
# [Feature Name] Implementation Plan

> **For Claude:** This plan is designed for execution by the executor skill.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

**Milestones:** [N] milestones, [M] total tasks

---

```

## Task Structure

**Each task follows this format:**

```markdown
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

## Task Guidelines

**Granularity:**
- Completable in 2-5 minutes by experienced developer
- One action per step (write test, run test, write code, run tests, commit)
- Each step is atomic and verifiable

**Independence:**
- Tasks should be independently executable
- Clear acceptance criteria (no ambiguity)
- Note file paths when applicable

**TDD Discipline:**
- Tests before code (RED-GREEN-REFACTOR)
- Minimal implementation to pass tests
- Refactor only after tests pass

**Documentation:**
- Exact file paths always
- Complete code in plan (not "add validation")
- Exact commands with expected output
- Reference relevant skills with @ syntax

## Milestone Guidelines

**Structure:**
- 3-6 tasks per milestone
- Each milestone should be reviewable
- Milestones represent meaningful progress
- Natural breakpoints in functionality

**Verification:**
- verify-task.sh runs after each task (build, test, lint, security, quick review)
- verify-milestone.sh runs at milestone boundaries (full test suite, comprehensive checks)
- Plan for verification explicitly in each milestone

**Dependencies:**
- Order milestones by dependency
- Note inter-milestone dependencies
- Enable parallel execution when safe

## Core Philosophy

**Bite-Sized Tasks:**
- Break work into 2-5 minute increments
- Each task is one logical action
- Fast feedback loops

**TDD Always:**
- Write failing test first
- Implement minimal code
- Run tests to verify
- Commit working state
- Refactor if needed

**Frequent Commits:**
- Commit after each task
- Clean, incremental progress
- Easy rollback if needed

**Verification Gates:**
- Light checks after each task (fast, catch issues early)
- Deep reviews at milestones (comprehensive quality)
- Deterministic scripts where possible (fast, reliable)

**DRY, YAGNI:**
- Don't Repeat Yourself
- You Aren't Gonna Need It
- Build what's needed, nothing more

## Execution Handoff

After saving the plan, offer execution:

**"Plan complete and saved to `docs/plans/<filename>.md`. Ready for execution by the executor skill."**

**The executor will:**
- Take the full plan or a subset
- Spawn implementator subagents with appropriate skills
- Invoke verify-task after each task
- Invoke verify-milestone at milestone boundaries
- Track progress and handle failures
- Report back at checkpoints

**Note:** The executor skill handles the execution logic. This planning skill focuses on creating executable plans.

## Quality Checks

Before finalizing the plan, verify:

- [ ] All tasks have exact file paths
- [ ] All tasks are 2-5 minutes each
- [ ] All milestones have 3-6 tasks
- [ ] TDD discipline followed (test first)
- [ ] Verification checkpoints included (verify-task, verify-milestone)
- [ ] Clear acceptance criteria for each task
- [ ] Dependencies noted
- [ ] Complete code in plan (not pseudocode)
- [ ] Commit messages included

## Integration with Custom Workflow

**This planning skill integrates with:**

- **brainstorming** skill - Provides design/refined requirements
- **executor** skill - Executes the plan (spawns subagents, runs verification)
- **verify-task** skill - Wrapper for scripts/verify-task.sh (light checks after each task)
- **verify-milestone** skill - Wrapper for scripts/verify-milestone.sh (deep reviews at milestones)

**Subagents spawned by executor:**
- **implementator** - Implements individual tasks from the plan
- **test-driven-development** - Enforces TDD discipline during implementation
- **code-review** - Comprehensive milestone reviews

**Scripts invoked:**
- `scripts/verify-task.sh` - Build, test, lint, security, quick review
- `scripts/verify-milestone.sh` - Full test suite, comprehensive checks

## Remember

- Smart agents (executor, implementator) handle decision-making and creative work
- Dumb scripts (verify-task.sh, verify-milestone.sh) handle deterministic operations
- Right tool for the job at each layer
- Trust but verify at checkpoints (tasks, milestones)
- Light checks often, deep reviews at milestones
