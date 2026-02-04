---
name: executor
description: Orchestrates plan execution through subagent coordination and systematic verification
---

# Executor Skill

Orchestrate plan execution through subagent coordination and verification.

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
