---
name: executor
description: Execute a development plan from start to finish. Use when user has a plan with milestones/tasks and wants automated implementation with verification checkpoints. Automatically coordinates subagents, runs tests, and ensures quality gates.
---

# Executor Skill

Orchestrate plan execution through subagent coordination and verification.

## Goal

Execute a development plan from start to finish, coordinating multiple subagents and verification checkpoints to deliver a working implementation.

## Constraints

- **Always work in isolated git worktree** - never modify main branch
- **Verify everything** - every task gets verified, every milestone gets comprehensive review
- **Keep minimal state** - track task IDs and status only, let subagents carry context
- **Limit parallelization** - max 2-3 concurrent agents
- **Respect dependencies** - never execute tasks out of dependency order
- **Fail gracefully** - assess severity, provide actionable guidance, preserve worktree

## Process

**1. Parse Plan**

- Extract milestones, tasks, dependencies, file paths
- Validate structure (task IDs, descriptions, file paths)
- Exit if validation fails

**2. Setup Environment**

- Invoke `setup-isolated-environment` skill to create git worktree
- Capture worktree path for all operations
- Exit if setup fails

**3. Execute Milestones**

For each milestone:

**a) Analyze Dependencies**

- Build dependency graph for tasks
- Check file path conflicts, dependencies, migrations, config changes
- Create execution groups (parallel vs sequential)

**b) Execute Tasks**

- Sequential: Execute one task at a time
- Parallel: Execute 2-3 independent tasks simultaneously
- For each task:
  - Use Task tool with implementator skill
  - Invoke `verify-task` skill (build, tests, lint, security)
  - On fail: retry up to 3 times with error context
  - On pass: mark complete, continue

**c) Verify Milestone**

- Invoke `code-review` skill for quality assessment
- Invoke `spec-compliance` skill for requirements check
- Invoke `verify-milestone` skill (full test suite, strict checks)
- On fail: assess severity, halt or fix based on severity
- On pass: continue to next milestone

**4. Report Completion**

```markdown
## Execution Summary

### Milestones Completed: X/Y

- [✅/❌] Milestone 1: [Description]
- [✅/❌] Milestone 2: [Description]

### Tasks Completed: A/B

- [✅/❌] Task 1.1: [Description] (File: path)
- [✅/❌] Task 1.2: [Description] (File: path)

### Status

**Result:** ✅ SUCCESS / ❌ FAILED

### Details

**Total Time:** X minutes
**Failures:** None / [details]

**Next Steps:**

- [ ] Review implementation in worktree
- [ ] Run comprehensive tests
- [ ] Merge to main branch
```

## Parallelization Logic

Tasks can run in parallel when:

- Different file paths (no overlap)
- No dependencies between tasks
- No migrations or config changes
- No breaking changes

Tasks must run sequentially when:

- Same file paths
- Explicit dependencies noted
- Migrations or config changes present

Limit concurrent agents to 2-3.

## Failure Handling

**Task fails:**

- Retry up to 3 times with error context
- If still failing, assess severity:
  - Minor: Auto-fix with implementator
  - Major: Halt, suggest planner involvement
  - Critical: Halt, await human guidance

**Milestone verification fails:**

- Assess severity:
  - Minor: Fix with implementator, re-verify
  - Major: Halt, notify user, suggest planner review
  - Critical: Halt immediately, preserve worktree for human review
