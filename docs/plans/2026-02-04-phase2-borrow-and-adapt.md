# Phase 2: Borrow and Adapt - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Adapt proven Superpowers skills (brainstorming, writing-plans) to the custom workflow architecture, integrating with verification hooks and maintaining compatibility with the new executor pattern.

**Architecture:** Replace placeholder skills with adapted Superpowers implementations while integrating with new deterministic layer (verify-task, verify-milestone scripts) and maintaining skill consistency across the codebase.

**Tech Stack:** Markdown (skills), Bash (scripts), Git (worktrees)

---

## Task 1: Adapt Brainstorming Skill

**Files:**
- Modify: `skills/brainstorming/SKILL.md`
- Reference: `~/.claude/plugins/cache/superpowers-marketplace/superpowers/4.1.1/skills/brainstorming/SKILL.md`

**Step 1: Read the Superpowers brainstorming skill source**

Run: `cat ~/.claude/plugins/cache/superpowers-marketplace/superpowers/4.1.1/skills/brainstorming/SKILL.md`
Expected: Full skill content displayed

**Step 2: Identify integration points with new architecture**

Key changes needed:
- Reference `scripts/setup-worktree.sh` instead of `superpowers:using-git-worktrees`
- Reference `planning` skill instead of `superpowers:writing-plans`
- Integrate with new workflow phases (Brainstorm → Plan → Execute → Verify)

**Step 3: Write adapted brainstorming skill**

Update `skills/brainstorming/SKILL.md` with:
- Core Superpowers brainstorming logic (Socratic questioning, one question at a time, present in sections)
- Updated references to local scripts and skills
- New workflow integration (mention executor skill, verification hooks)
- Maintained philosophical principles (YAGNI, explore alternatives, incremental validation)

**Step 4: Verify skill format**

Run: `head -5 skills/brainstorming/SKILL.md`
Expected:
```markdown
---
name: brainstorming
description: [updated description]
---
```

**Step 5: Commit**

```bash
git add skills/brainstorming/SKILL.md
git commit -m "feat(braintorming): adapt from Superpowers with new architecture integration"
```

---

## Task 2: Adapt Planning Skill

**Files:**
- Modify: `skills/planning/SKILL.md`
- Reference: `~/.claude/plugins/cache/superpowers-marketplace/superpowers/4.1.1/skills/writing-plans/SKILL.md`

**Step 1: Read the Superpowers writing-plans skill source**

Run: `cat ~/.claude/plugins/cache/superpowers-marketplace/superpowers/4.1.1/skills/writing-plans/SKILL.md`
Expected: Full skill content displayed

**Step 2: Identify integration points with new architecture**

Key changes needed:
- Reference `@executor` skill instead of `superpowers:executing-plans`
- Reference `@development` skill for implementation guidance
- Add milestone structure (3-6 tasks per milestone) to match design doc
- Integrate with `verify-task` and `verify-milestone` hooks

**Step 3: Write adapted planning skill**

Update `skills/planning/SKILL.md` with:
- Core Superpowers writing-plans logic (bite-sized tasks, exact file paths, complete code)
- Milestone structure (3-6 tasks grouped by dependency/feature)
- Updated execution handoff (executor skill with review checkpoints)
- Verification integration (verify-task after each task, verify-milestone at milestones)
- New plan header format referencing custom workflow

**Step 4: Verify skill format**

Run: `head -5 skills/planning/SKILL.md`
Expected:
```markdown
---
name: planning
description: Break down designs into actionable tasks (2-5 min each) and milestones (3-6 tasks)
---
```

**Step 5: Commit**

```bash
git add skills/planning/SKILL.md
git commit -m "feat(planning): adapt from Superpowers writing-plans with milestone structure"
```

---

## Task 3: Update Design Document Reference

**Files:**
- Modify: `docs/plans/2026-02-04-custom-workflow-design.md`

**Step 1: Remove placeholder notes**

Update lines in brainstorming and planning skill references to remove "Phase 1 placeholder" notes

**Step 2: Add Phase 2 completion note**

Add to implementation progress section:

```markdown
**Phase 2: Borrow and Adapt** ✅ COMPLETE
- Adapted `brainstorming` skill from Superpowers
- Adapted `planning` skill from Superpowers writing-plans
- Integrated with verification hooks (verify-task, verify-milestone)
- Maintained architectural consistency
```

**Step 3: Commit**

```bash
git add docs/plans/2026-02-04-custom-workflow-design.md
git commit -m "docs: mark Phase 2 complete in design document"
```

---

## Task 4: Create Integration Test Plan

**Files:**
- Create: `docs/plans/2026-02-04-phase2-integration-test.md`

**Step 1: Write integration test plan**

Create test document covering:

```markdown
# Phase 2 Integration Tests

## Test Scenarios

### Scenario 1: Brainstorm → Plan Flow
1. Invoke brainstorming skill with feature idea
2. Verify Socratic questioning works correctly
3. Verify design document creation
4. Verify handoff to planning skill
5. Verify plan includes milestones and tasks

### Scenario 2: Plan → Executor Handoff
1. Invoke planning skill with approved design
2. Verify plan structure (header, tasks, steps)
3. Verify execution handoff options presented
4. Verify executor skill reference in plan

### Scenario 3: Script Integration
1. Verify brainstorming references setup-worktree.sh
2. Verify planning references verify-task and verify-milestone
3. Test script execution with sample projects
```

**Step 2: Commit**

```bash
git add docs/plans/2026-02-04-phase2-integration-test.md
git commit -m "test: add Phase 2 integration test plan"
```

---

## Task 5: Verify Skill Metadata

**Files:**
- Verify: `skills/brainstorming/SKILL.md`
- Verify: `skills/planning/SKILL.md`

**Step 1: Check brainstorming skill metadata**

Run: `grep -A 2 "^name:" skills/brainstorming/SKILL.md`
Expected:
```markdown
---
name: brainstorming
description: [description text]
---
```

**Step 2: Check planning skill metadata**

Run: `grep -A 2 "^name:" skills/planning/SKILL.md`
Expected:
```markdown
---
name: planning
description: [description text]
---
```

**Step 3: Verify no broken references**

Run: `grep -r "superpowers:" skills/brainstorming/ skills/planning/`
Expected: No output (no Superpowers references remain)

**Step 4: Commit metadata verification**

```bash
git add skills/brainstorming/SKILL.md skills/planning/SKILL.md
git commit -m "chore: verify skill metadata and references"
```

---

## Task 6: Documentation Update

**Files:**
- Create: `docs/phase2-completion-report.md`

**Step 1: Write completion report**

```markdown
# Phase 2 Completion Report

## Implemented Skills

### Brainstorming
- Source: Superpowers brainstorming skill
- Adaptations:
  - Updated script references (setup-worktree.sh)
  - Updated skill references (planning)
  - Integrated with new workflow phases
- Preserved: Socratic questioning, incremental validation, YAGNI principles

### Planning
- Source: Superpowers writing-plans skill
- Adaptations:
  - Added milestone structure (3-6 tasks per milestone)
  - Updated execution handoff (executor skill)
  - Integrated verification hooks (verify-task, verify-milestone)
- Preserved: Bite-sized tasks, exact file paths, TDD approach

## Integration Points

### Deterministic Layer
- `setup-worktree.sh` - Environment isolation (referenced by brainstorming)
- `verify-task.sh` - Post-task verification (referenced by planning)
- `verify-milestone.sh` - Milestone verification (referenced by planning)

### Skill Coordination
- brainstorming → planning (design to tasks)
- planning → executor (tasks to execution)
- executor → code-review (milestone reviews)

## Next Steps
- Phase 3: Build executor skill
- Phase 4: End-to-end integration testing
```

**Step 2: Commit**

```bash
git add docs/phase2-completion-report.md
git commit -m "docs: add Phase 2 completion report"
```

---

## Task 7: Final Verification

**Files:**
- All modified files

**Step 1: Run verify-task script**

Run: `bash scripts/verify-task.sh`
Expected: ✅ PASS (build, tests, lint pass)

**Step 2: Verify skill consistency**

Run: `ls -la skills/brainstorming/ skills/planning/ skills/code-review/`
Expected: All three skills present with SKILL.md files

**Step 3: Check for Phase 1 placeholders**

Run: `grep -r "Phase 1 placeholder" skills/`
Expected: No output (all placeholders removed)

**Step 4: Verify design document alignment**

Run: `grep -A 5 "Phase 2" docs/plans/2026-02-04-custom-workflow-design.md`
Expected: Phase 2 marked as complete

**Step 5: Final commit**

```bash
git add .
git commit -m "feat: Phase 2 complete - borrow and adapt Superpowers skills

- Adapted brainstorming skill with new architecture integration
- Adapted planning skill with milestone structure and verification hooks
- Maintained core Superpowers principles (YAGNI, TDD, bite-sized tasks)
- Integrated with deterministic layer (setup-worktree, verify-task, verify-milestone)
- Removed all Phase 1 placeholders
- Added integration test plan and completion report"
```

---

## Success Criteria

Phase 2 is complete when:
1. ✅ Brainstorming skill adapted from Superpowers with new architecture references
2. ✅ Planning skill adapted from Superpowers writing-plans with milestone structure
3. ✅ No "Phase 1 placeholder" notes remain in skills
4. ✅ All script references point to local scripts (not Superpowers)
5. ✅ Design document updated to reflect Phase 2 completion
6. ✅ Integration test plan documented
7. ✅ All verification scripts pass (verify-task, verify-milestone)

---

## Parallel Execution Opportunities

- **Task 1 and Task 2** can run in parallel (independent skill adaptations)
- **Task 3 and Task 4** can run in parallel (documentation updates)
- **Task 5 depends on Task 1 and Task 2** (metadata verification requires skills)
- **Task 6 depends on Task 3, 4, 5** (documentation requires all prior work)
- **Task 7 depends on all tasks** (final verification requires complete implementation)

---

*This plan follows the writing-plans skill format adapted for the custom workflow architecture.*
