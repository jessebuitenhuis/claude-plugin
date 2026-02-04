# Executor Skill

**Status:** Phase 1 Placeholder - Core implementation in Phase 3

## Purpose

Core innovation of the development system - orchestrates plan execution through subagent coordination and systematic verification. Acts as the execution engine that transforms static plans into completed implementation through intelligent task distribution and validation.

## Role

The executor serves as the orchestrator of plan execution, coordinating multiple subagents (implementators) and verification systems to implement the development plan. It operates with minimal state, focusing on task distribution rather than complex context management.

## Key Responsibilities

1. Parse and validate the execution plan
2. Setup isolated work environment (git worktree)
3. Analyze tasks for parallelization opportunities
4. Spawn and coordinate implementator subagents
5. Execute verification after each task/milestone
6. Handle failures with appropriate recovery strategies
7. Report execution summary

## Initialization

### 1. Parse Plan File

Read and validate the execution plan:

```
Expected plan location: /path/to/plan/PLAN.md
Required sections:
- Summary
- Implementation phases
- Task list with IDs
- Milestone definitions
- Success criteria
```

### 2. Setup Isolated Environment

Delegate to the `setup-isolated-environment` skill to:

- Create git worktree for isolation
- Initialize working directory structure
- Configure environment variables
- Verify toolchain availability

### 3. Initialize Execution State

Create minimal state tracking:

```
State structure:
{
  worktreePath: string,
  completedTasks: Set<taskId>,
  failedTasks: Map<taskId, errorDetails>,
  currentMilestone: milestoneId,
  taskRetries: Map<taskId, retryCount>
}
```

## Execution Loop

### Task Analysis

For each task in the plan, analyze parallelization potential:

**Can parallelize if:**
- Tasks operate on different files/modules
- No shared dependencies between tasks
- No database migrations involved
- No configuration changes required
- Independent test suites

**Must sequentialize if:**
- Tasks modify the same files
- Tasks depend on each other's output
- Breaking changes to interfaces
- Shared resource modifications
- Ordered refactorings required

### Task Execution

1. **Spawn Implementator Agent**
   - Invoke with task ID and description
   - Provide relevant file context only
   - Set timeout based on task complexity
   - Work in isolated worktree

2. **Monitor Progress**
   - Track agent completion
   - Capture output and errors
   - Update task status

3. **Verify Completion**
   - Invoke `verify-task` skill
   - Run light validation checks
   - Confirm tests pass
   - Mark task complete

### Milestone Processing

After all tasks in a milestone complete:

1. **Comprehensive Verification**
   - Invoke `code-review` skill
   - Invoke `spec-compliance` skill
   - Invoke `verify-milestone` skill

2. **Update Milestone Status**
   - Mark milestone as complete if all verifications pass
   - Handle failures if any verification fails

## State Management

### Minimal State Philosophy

The executor maintains only essential state:

**Tracked:**
- Task IDs and completion status
- Current milestone identifier
- Worktree path for cleanup
- Task retry counts

**Not tracked:**
- Complex agent context
- File content snapshots
- Detailed execution history
- Intermediate agent states

### State Transitions

```
Task States:
pending → in_progress → completed
                    ↘ failed (with retry)

Milestone States:
pending → in_progress → verification → completed
                              ↘ failed (with recovery)
```

## Failure Handling

### Task Failure

**Strategy:** Retry with error context

```
Process:
1. Capture error details
2. Increment retry counter
3. If retries < 3:
   - Spawn new implementator with error context
   - Provide previous attempt details
4. If retries >= 3:
   - Mark task as permanently failed
   - Determine failure severity
```

### Milestone Failure

**Severity Assessment:**

**Minor Failures**
- Examples: Small bug, missing test, formatting issue
- Action: Spawn implementator agent to fix
- Continue: Yes, after fix

**Major Failures**
- Examples: Incorrect approach, missing requirement, design flaw
- Action: Halt execution, involve planner
- Continue: Only after plan update

**Critical Failures**
- Examples: Fundamental misunderstanding, blocker discovered
- Action: Halt execution, report to main session
- Continue: Requires human intervention

### Recovery Workflow

```
For minor failures:
  spawn implementator → fix issue → re-verify → continue

For major failures:
  halt → notify planner → await plan update → resume

For critical failures:
  halt → return to main session → await human guidance
```

## Parallelization Decision Logic

### Decision Tree

```
For each pair of tasks (T1, T2):
  if T1.files ∩ T2.files = ∅
     and T1.dependencies ∩ T2.dependencies = ∅
     and not (T1.migration or T2.migration)
     and not (T1.configChange or T2.configChange)
  then
     CAN_PARALLELIZE
  else
     MUST_SEQUENTIALIZE
```

### Parallel Execution Groups

Organize tasks into execution groups:

```
Group 1: [task_1, task_2, task_3]  // Independent, run in parallel
Group 2: [task_4]                  // Depends on Group 1
Group 3: [task_5, task_6]          // Independent, depend on Group 2
```

### Load Balancing

Limit concurrent agents based on:
- System resources
- Task complexity
- I/O vs CPU-bound operations

Typical limit: 2-3 concurrent implementators

## Context Management Principles

### Explicit Context Passing

**DO:**
- Pass only relevant files to each agent
- Include specific context in agent invocation
- Clean up context after task completion
- Use file paths for references

**DON'T:**
- Maintain global context stores
- Share context between unrelated agents
- Keep file contents in executor state
- Rely on implicit context

### Context Scope

```
Task-level context:
- Task description
- Related files (read-only)
- Dependencies
- Success criteria

Milestone-level context:
- Completed task IDs
- Verification requirements
- Integration points

Not included:
- Other task details
- Completed task outputs
- Intermediate states
```

## Verification Points

### After Each Task

Invoke `verify-task` skill for light checks:

- Syntax validation
- Basic functionality
- Unit tests pass
- No regressions introduced
- Code follows style guidelines

### After Each Milestone

Comprehensive verification suite:

1. **code-review skill**
   - Code quality assessment
   - Architecture review
   - Performance considerations
   - Security review

2. **spec-compliance skill**
   - Requirements coverage
   - Acceptance criteria met
   - Feature completeness

3. **verify-milestone skill**
   - Integration verification
   - End-to-end testing
   - Documentation completeness

## Output Format

### Execution Summary

```markdown
## Execution Summary

### Milestones Completed: X/Y
- [✅/❌] Milestone 1: Description
- [✅/❌] Milestone 2: Description
- ...

### Tasks Completed: A/B
- [✅/❌] Task 1: Description (File: path)
- [✅/❌] Task 2: Description (File: path)
- ...

### Worktree
Path: /path/to/worktree
Status: Active/Cleaned up

### Status
**Result:** ✅ SUCCESS / ❌ FAILED

### Details
**Total Time:** X minutes
**Agents Spawned:** N
**Parallelization:** X% improvement over sequential

**Failures:** None / See details below
[Failure details if any]

**Next Steps:**
- [ ] Continue to next phase
- [ ] Review and merge
- [ ] Address failures
```

## Implementation Notes

### Phase 1 (Current)
- Documentation and specification
- Integration design
- Workflow definition

### Phase 3 (Core Implementation)
- Implement execution loop
- Integrate with setup-isolated-environment
- Integrate with verify-task, code-review, spec-compliance, verify-milestone
- Add parallelization logic
- Implement failure handling
- Add state management

### Dependencies

Required skills:
- `setup-isolated-environment` - Environment preparation
- `implementator` - Task execution agent
- `verify-task` - Task-level verification
- `code-review` - Code quality verification
- `spec-compliance` - Requirements verification
- `verify-milestone` - Milestone-level verification

## Usage

```
Invoke executor when:
- Implementation plan is ready
- Design phase is complete
- Ready to execute development tasks

Expected input:
- Path to PLAN.md
- Plan validation passed

Output:
- Execution summary
- Completed implementation (in worktree)
- Verification results
- Recommendations for next steps
```

## Success Criteria

The executor succeeds when:

1. All tasks completed or failures appropriately handled
2. All verifications passed (or failures documented)
3. Worktree contains working implementation
4. Execution summary accurately reflects results
5. Clear next steps provided

## Safety Considerations

- Always work in isolated git worktree
- Never modify main branch during execution
- Verify before marking tasks complete
- Halt on critical failures
- Maintain audit trail of decisions
