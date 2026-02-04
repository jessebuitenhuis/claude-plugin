# Custom Development Workflow - Design Document

**Date:** 2026-02-04
**Status:** Draft
**Purpose:** Automated development workflow that executes autonomous work while keeping user in control

---

## Vision

A Claude plugin that automates software development through smart agents supported by deterministic primitives. Replaces Superpowers with a more efficient, predictable workflow.

**Core Philosophy:** Smart agents, dumb scripts
- AI handles decision-making and creative work
- Scripts handle deterministic operations (build, test, setup)
- Right tool for the job at each layer

---

## The Workflow

**4-Phase Flow:**
1. **Brainstorm** - Design refinement through Socratic questioning
2. **Plan** - Break design into tasks and milestones
3. **Execute** - Subagent-driven execution with deterministic checks
4. **Verify** - Final verification and merge decision

**Execution Model:**
- Main session handles brainstorming and planning (agentic, high-touch)
- Executor skill handles plan execution (agentic coordination)
- Hooks and scripts handle deterministic operations (fast, reliable)
- Subagents handle implementation work (parallel when safe)

---

## Architecture

### Components

**Deterministic Layer (Hooks + Scripts)**
```
setup-isolated-environment
  → scripts/setup-worktree.sh

verify-task
  → scripts/verify-task.sh (build + test + lint + security audit)
  → haiku subagent for quick-llm-review (receives git diff)

verify-milestone
  → scripts/verify-milestone.sh (full test suite)
```

**Agentic Layer (Skills)**

Main Session:
- `brainstorming` - Design refinement, presents in sections
- `planning` - Creates tasks (2-5 min) and milestones (3-6 tasks)

Subagents:
- `implementator` - Implements individual tasks
- `test-driven-development` - Enforces TDD discipline
- `spec-compliance` - Reviews against approved spec
- `code-review` - Comprehensive milestone reviews

Wrapper Skills (make hooks easily invocable):
- `setup-isolated-environment`
- `verify-task`
- `verify-milestone`

**The Executor**
- Takes plan (full or subset)
- Spawns subagents with appropriate skills
- Invokes wrapper skills for checks
- Tracks progress, decides parallelization
- Keeps minimal context

---

## Executor Logic

**Decision Making:**
- Analyzes file paths to determine parallel vs sequential
- Always runs verify-task after each task
- Always runs deep reviews at milestones
- Handles failures adaptively

**Failure Handling:**
```
Task fails:
  → Spawn new implementator with error context

Milestone fails (minor):
  → Spawn implementator to fix

Milestone fails (major):
  → Involve planner to revise plan

Milestone fails (critical):
  → Halt and report to main session
```

**Context Management:**
- Executor keeps minimal state (task IDs, status, next action)
- Subagents carry full task details
- Enables long-running sessions without context bloat

---

## Success Criteria

**Execution Complete When:**
1. **Spec Compliance** - Deliverable matches approved design
2. **Quality Gates** - All tests pass, no critical linter errors
3. **Merge Readiness** - Branch clean, documented, ready to merge

---

## Guardrails

**Deterministic (enforced by hooks):**
- Pre-task: Worktree clean, baseline tests pass
- Post-task: Build ✅, tests ✅, lint ✅, security ✅
- Pre-milestone: All tasks complete, individual checks passed
- Pre-merge: Full test suite, branch clean

**Agentic (enforced by skills):**
- TDD: Tests before code, RED-GREEN-REFACTOR
- Quality: Project patterns, security, performance, maintainability
- Spec: No gaps, no scope creep

---

## Key Advantages Over Superpowers

✅ **Speed and Efficiency**
- Hooks and scripts run fast, no wasted tokens on deterministic operations

✅ **Better Review Cadence**
- Light checks after each task (build, test, quick review)
- Deep reviews at milestones (comprehensive analysis)

✅ **Determinism and Predictability**
- Deterministic operations always work the same way
- Scripts are testable and debuggable

✅ **Adaptive Interaction**
- Hands-off for simple features
- More involved for complex work
- User chooses engagement level

---

## Implementation Approach

**Phase 1: Structure**
- Set up plugin structure
- Create placeholder skills and hooks
- Establish conventions

**Phase 2: Borrow and Adapt**
- Reuse Superpowers components that work:
  - `brainstorming` skill
  - `planning` skill
  - `code-review` skill
- Adapt to new architecture

**Phase 3: Fill Gaps**
- Build `executor` skill (core innovation)
- Create hooks and scripts
- Implement `implementator` subagent
- Build `verify-task` and `verify-milestone` skills

**Phase 4: Integration**
- Wire end-to-end flow
- Test on real features
- Iterate based on usage

---

## Open Questions and Risks

**Biggest Risk: Executor Complexity**
- Executor must make smart decisions about:
  - Parallel vs sequential execution
  - Failure recovery strategies
  - When to involve planner vs handle directly
- Mitigation: Start simple, evolve complexity based on needs

**Future Exploration:**
- Claude hooks (agent hooks, background hooks, on-file-change)
- Repository-specific configuration
- Custom security tooling per repo type

---

## User Experience Vision

**Day-to-Day Interaction:**
- You give high-level direction: "Add user authentication"
- Brainstorming skill refines the design with you
- Planning skill breaks it into executable tasks
- You say "Execute this plan"
- Executor runs for 1-2 hours, checking in at milestones
- You review progress, approve or give guidance
- Either continue or make adjustments
- Feature complete, verified, ready to merge

**Adaptive Control:**
- Simple features → mostly hands-off
- Complex features → more involved at milestones
- You choose the level of engagement

---

## Philosophical Principles

1. **Smart agents, dumb scripts**
   - AI for decision-making and creativity
   - Scripts for deterministic operations

2. **Right review at the right time**
   - Light checks often (catch issues fast)
   - Deep reviews at milestones (holistic quality)

3. **Determinism where possible**
   - If it can be scripted, script it
   - Save AI for where intelligence actually matters

4. **Trust but verify**
   - Let agents work autonomously
   - Verify at checkpoints (tasks, milestones)

---

## Next Steps

1. Create plugin structure
2. Identify which Superpowers skills to reuse
3. Design executor skill (core innovation)
4. Implement hooks and scripts
5. Build end-to-end flow
6. Test on real features

---

*This document captures the design vision as of 2026-02-04. Details will evolve as we build and learn.*
