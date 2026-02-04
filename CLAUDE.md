# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Claude Plugin: Shared** - a custom development workflow plugin for Claude that automates software development through smart agent architecture. The plugin implements a 4-phase workflow: Brainstorm → Plan → Execute → Verify.

**Core Philosophy:** "Smart agents, dumb scripts" - AI handles decision-making/creativity, scripts handle deterministic operations (build, test, lint).

---

## Architecture

The system has two layers:

### Deterministic Layer (Hooks + Scripts)
- **setup-worktree.sh** - Creates isolated git worktrees for parallel development
- **verify-task.sh** - Fast verification after each task (build, test subset, lint, security)
- **verify-milestone.sh** - Comprehensive verification at milestones (full test suite, strict checks)

These scripts auto-detect Node.js projects and run appropriate commands.

### Agentic Layer (Skills)
- **Main Session Skills:** `brainstorming`, `planning` - Design refinement and task breakdown
- **Subagent Skills:** `implementator`, `test-driven-development`, `spec-compliance`, `code-review` - Implementation work
- **Wrapper Skills:** `verify-task`, `verify-milestone`, `setup-isolated-environment` - Make hooks easily invocable
- **Orchestrator:** `executor` - Coordinates plan execution through subagents

### The Executor (Core Innovation)
The executor skill is the heart of the system:
- Takes a plan (tasks grouped into milestones)
- Spawns implementator subagents for each task
- Decides parallel vs sequential execution based on file paths and dependencies
- Runs verify-task after each task
- Runs comprehensive reviews at milestones
- Handles failures adaptively (retry → fix → re-plan → halt based on severity)

---

## Testing the Plugin

This plugin is designed to work with Node.js projects. The scripts auto-detect and run:

**Node.js:**
- Build: `npm run build` or `yarn build`
- Test: `npm test -- --testPathIgnorePatterns=integration` (fast subset)
- Lint: `npm run lint` or `yarn lint`
- Security: `npm audit --production`

---

## File Structure Conventions

This plugin follows strict conventions documented in `docs/conventions/workflow-conventions.md`:

- **Skills:** `/skills/<skill-name>/SKILL.md` (uppercase filename)
- **Agents:** `/agents/<agent-name>.md` (lowercase)
- **Scripts:** `/scripts/<script-name>.sh` (executable, lowercase)
- **Hooks:** Registered in `.claude-plugin/plugin.json`

All skills must have frontmatter with `name` and `description`.

---

## Workflow Conventions

### Task Definition
- **Duration:** 2-5 minutes for experienced developer
- **Scope:** Atomic, independently executable
- **Format:** Title, description, acceptance criteria, affected files, dependencies

### Milestone Definition
- **Size:** 3-6 tasks per milestone
- **Value:** Each milestone creates verifiable value
- **Verification:** Comprehensive quality gate at each milestone

### Parallel Execution
Tasks can run in parallel if:
- Operating on different files
- No shared dependencies
- No breaking changes to shared interfaces

Otherwise, execute sequentially.

---

## Development Status

**Phase 2 Complete:**
- ✅ Brainstorming and planning skills adapted from Superpowers
- ✅ Verification hooks and scripts implemented
- ✅ Architectural consistency maintained

**Remaining Phases:**
- Phase 3: Build executor skill (core innovation)
- Phase 4: End-to-end integration testing

See `docs/plans/2026-02-04-custom-workflow-design.md` for full design context.

---

## Workflow Usage

### For Users

1. **Plan your work:** Use `/shared:brainstorming` to explore ideas, then `/shared:planning` to create detailed implementation plans
2. **Execute automatically:** Run `/shared:executor <plan-path>` to have Claude execute the entire plan with verification
3. **Or execute manually:** Implement tasks yourself, running `/shared:verify-task` after each task
4. **Verify milestones:** Run `/shared:verify-milestone` after completing groups of tasks
5. **Review code:** Use `/shared:code-review` and `/shared:spec-compliance` for quality checks

### Expected Behavior

- **Executor creates worktree:** `.worktrees/<branch-name>/` for isolated development (with unnecessary `feature/` nesting removed)
- **Verification runs automatically:** After each task (verify-task) and each milestone (verify-milestone)
- **Failures halt execution:** Tests or build failures will stop execution with clear error messages
- **Manual steps required:** Browser testing, final review, PR creation, and worktree cleanup

### Troubleshooting

**If executor doesn't invoke automatically:**
- Invoke manually: `/shared:executor <plan-path>`
- Check that your request mentions "execute", "implement", or "follow the plan"

**If verification fails:**
- Check the error output
- Fix issues in the worktree
- Re-run verification
- Executor will retry up to 3 times

**If worktree creation fails:**
- Check baseline tests pass in main branch
- Verify dependencies install correctly
- Check disk space

---

## Key Philosophical Principles

1. **Smart agents, dumb scripts** - Use AI for decisions, scripts for deterministic ops
2. **Right review at right time** - Light checks after tasks, deep reviews at milestones
3. **Determinism where possible** - Script what can be scripted
4. **Trust but verify** - Let agents work autonomously with verification checkpoints

---

## How Skills Work

Skills are invoked by Claude Code when their name is mentioned or through slash commands. Each skill follows a structure:

```markdown
---
name: skill-name
description: One-line description
---

## Role
[Brief role description]

## Workflow
[Step-by-step process]

## Philosophy
[Principles and guidelines]

## Notes
[Important notes]
```

Skills can invoke hooks (through wrapper skills) and spawn subagents (through the Task tool).
