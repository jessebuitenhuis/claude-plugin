# Custom Workflow Conventions

**Date:** 2026-02-04
**Version:** 1.0.0
**Status:** Active

---

## Philosophy: Smart Agents, Dumb Scripts

- **Agents (Smart):** Make decisions, handle ambiguity, adapt to context
- **Scripts (Dumb):** Execute deterministic operations, fail fast, clear error messages
- **Hooks:** Bridge between skills and scripts; registered in plugin.json
- **Skills:** Orchestrate workflows, invoke hooks, spawn agents

**Key Principle:** If a task requires decision-making, use an agent. If a task is deterministic, use a script.

---

## File Naming Conventions

### Skills
- **Path:** `/skills/<skill-name>/SKILL.md`
- **File:** Uppercase `SKILL.md`
- **Directory:** Lowercase, hyphen-separated
- **Example:** `/skills/spec-compliance/SKILL.md`

### Agents
- **Path:** `/agents/<agent-name>.md`
- **File:** Lowercase, hyphen-separated, `.md` extension
- **Example:** `/agents/implementator.md`

### Hooks
- **Registration:** In `.claude-plugin/plugin.json`
- **Implementation:** In `/scripts/<hook-name>.sh`
- **Naming:** Lowercase, hyphen-separated
- **Example:** Hook `verify-task` → Script `scripts/verify-task.sh`

### Scripts
- **Path:** `/scripts/<script-name>.sh`
- **File:** Lowercase, hyphen-separated, `.sh` extension
- **Permissions:** Must be executable (`chmod +x`)
- **Example:** `/scripts/verify-task.sh`

### Documentation
- **Path:** `/docs/<type>/<filename>.md`
- **Types:** `plans/`, `conventions/`, `references/`
- **Naming:** Lowercase, hyphen-separated
- **Example:** `/docs/plans/2026-02-04-custom-workflow-design.md`

---

## Skill Structure Convention

All skills follow this structure:

```markdown
---
name: skill-name
description: One-line description of what the skill does
---

## Role
[Brief description of the skill's role and perspective]

## Workflow
[Step-by-step process, organized by phases if applicable]

### Phase 1: [Name]
- Step 1
- Step 2

### Phase 2: [Name]
- Step 1
- Step 2

## Philosophy
[Principles and guidelines, if applicable]

## Notes
[Any important notes or caveats]
```

**Rules:**
- Frontmatter is required
- Sections: Role, Workflow (required), Philosophy (optional), Notes (optional)
- Use imperative language for workflow steps
- Be specific about inputs and outputs

---

## Agent Structure Convention

All agents follow this structure:

```markdown
---
name: agent-name
description: One-line description of what the agent does
model: sonnet | opus | haiku
permissions: acceptEdits | read-only
skills:
  - skill-one
  - skill-two
---

## Role
[Brief description of the agent's role]

## Input
[What the agent receives as input]

## Workflow
[Step-by-step process for the agent]

## Constraints
[Limits and boundaries for the agent]

## Output
[Expected output format]
```

**Rules:**
- Frontmatter is required
- Model: Choose based on task complexity (haiku for simple, sonnet for standard, opus for complex)
- Permissions: `acceptEdits` for implementation, `read-only` for analysis
- Skills: List skills the agent can use

---

## Hook Registration Convention

Hooks are registered in `.claude-plugin/plugin.json`:

```json
{
  "hooks": {
    "hook-name": {
      "description": "Human-readable description",
      "command": "bash scripts/script-name.sh"
    }
  }
}
```

**Rules:**
- Hook name: lowercase, hyphen-separated
- Description: Clear, human-readable
- Command: Full path from plugin root, `bash` prefix
- One hook per script (1:1 mapping)

---

## Task Conventions

### Definition
- **Duration:** 2-5 minutes for experienced developer
- **Independence:** Each task independently executable
- **Verification:** Clear acceptance criteria
- **File Scope:** Note affected file paths when applicable

### Format
```
Task X.Y: [Brief title]
Description: [What needs to be done]
Acceptance Criteria:
- [Criterion 1]
- [Criterion 2]
Files: [file-path-1, file-path-2]
Dependencies: [Task X.Y-1, if any]
```

### Guidelines
- Make tasks atomic (one logical unit of work)
- Break down complex tasks into multiple subtasks
- Define success criteria unambiguously
- Note dependencies explicitly

---

## Milestone Conventions

### Definition
- **Size:** 3-6 tasks per milestone
- **Value:** Each milestone creates verifiable value
- **Reviewability:** Natural breakpoint for comprehensive review
- **Dependencies:** Order by dependency

### Format
```
Milestone N: [Brief title]
Description: [What this milestone achieves]
Tasks:
- Task N.1: [Description]
- Task N.2: [Description]
- Task N.3: [Description]
Verification: [What defines milestone completion]
```

### Guidelines
- Group related tasks
- Ensure each milestone is independently valuable
- Plan for verification at each milestone boundary
- Milestones should be meaningful progress markers

---

## Verification Conventions

### Task-Level Verification (Light)
- **Purpose:** Quick feedback after each task
- **Checks:** Build, test subset, lint, security audit, quick LLM review
- **Tool:** `verify-task` skill → hook → script
- **Duration:** ~1-2 minutes
- **Failure:** Retry task, fix issues, re-verify

### Milestone-Level Verification (Comprehensive)
- **Purpose:** Deep quality check before proceeding
- **Checks:** Full test suite, complete build, strict lint, strict security, branch status, coverage
- **Tool:** `verify-milestone` skill → hook → script
- **Duration:** ~5-10 minutes
- **Failure:** Review and fix before proceeding

### Output Format

**Task Verification:**
```markdown
## Task Verification Report

### Build: ✅ PASS / ❌ FAIL
### Tests: ✅ PASS / ❌ FAIL
### Lint: ✅ PASS / ❌ FAIL
### Security: ✅ PASS / ❌ FAIL
### Quick Review: ✅ PASS / ❌ FAIL

### Overall: ✅ PASS / ❌ FAIL
```

**Milestone Verification:**
```markdown
## Milestone Verification Report

### Full Test Suite: ✅ PASS / ❌ FAIL
[Tests: X passed, Y failed]

### Build: ✅ PASS / ❌ FAIL
### Lint (Strict): ✅ PASS / ❌ FAIL
### Security (Strict): ✅ PASS / ❌ FAIL
### Branch Status: ✅ CLEAN / ❌ DIRTY
### Coverage: ✅ PASS / ⚠️ FAILED (non-blocking)

### Milestone Readiness: ✅ READY / ❌ NOT READY
```

---

## Parallel Execution Conventions

### When to Parallelize
Can parallelize if ALL conditions are met:
- Tasks operate on different files
- No shared dependencies
- No database migrations
- No configuration changes
- No breaking changes to shared interfaces

### When to Sequentialize
Must sequentialize if ANY condition applies:
- Tasks modify the same files
- Tasks depend on each other's output
- Breaking changes involved
- Database migrations required
- Config changes required

### Decision Logic
```
For each task pair (T1, T2):
  if T1.files ∩ T2.files ≠ ∅:
    must_sequentialize(T1, T2)
  elif T1.dependencies ⊇ T2 or T2.dependencies ⊇ T1:
    must_sequentialize(T1, T2)
  else:
    can_parallelize(T1, T2)
```

### Execution Strategy
- **Independent groups:** Execute in parallel
- **Dependent tasks:** Execute in sequence
- **Mixed dependencies:** Create execution graph, identify critical path

---

## Error Handling Conventions

### Task Failure
- **Retry:** Up to 3 times with error context
- **Context:** Include error messages, logs, diffs
- **Escalation:** If 3 retries fail, involve implementator agent

### Milestone Failure (Minor)
- **Definition:** Non-critical tests failing, warnings
- **Action:** Spawn implementator agent to fix
- **Continue:** Proceed to next milestone after fix

### Milestone Failure (Major)
- **Definition:** Critical tests failing, broken functionality
- **Action:** Halt execution, involve planner
- **Decision:** Re-plan milestone or fix issues

### Milestone Failure (Critical)
- **Definition:** Fundamental design flaw, architecture issue
- **Action:** Halt execution, report to main session
- **Resolution:** User decision required

### Script Error Handling
- **Fail fast:** Exit immediately on error
- **Clear messages:** Print error context before exit
- **Exit codes:** 0 for success, 1 for failure
- **Idempotency:** Safe to run multiple times

---

## Context Management Conventions

### Principle
- **Minimal state:** Only track what's necessary (task IDs, status)
- **Explicit passing:** Pass context explicitly, don't rely on globals
- **Cleanup:** Clean up temporary state after use

### Executor State
```markdown
## Executor State

Active Milestone: N
Active Tasks: [N.1, N.2, N.3]
Completed Tasks: [N-1.1, ..., N-1.6]
Failed Tasks: []
Worktree Path: /path/to/worktree
```

### Agent Context
- **Input:** Task description, acceptance criteria, file context, dependencies
- **Output:** Summary, changes made, acceptance criteria status, notes
- **Cleanup:** Agent terminates after task completion

### File Context
- **Read:** Use Read tool to load file context before editing
- **Scope:** Only pass relevant files to agents
- **Size:** Keep context minimal, focus on affected files

---

## Script Conventions

### Structure
```bash
#!/bin/bash
set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Functions
function main() {
  # Script logic here
}

# Entry point
main "$@"
```

### Rules
- **Shebang:** `#!/bin/bash` required
- **Strict mode:** `set -euo pipefail` required
- **Functions:** Use functions for organization
- **Idempotency:** Safe to run multiple times
- **Error messages:** Clear, actionable error messages
- **Exit codes:** 0 for success, 1 for failure

### Project Detection
Auto-detect project type from presence of files:
- **Node.js:** `package.json` present
- **Rust:** `Cargo.toml` present
- **Python:** `pyproject.toml` or `requirements.txt` present

### Commands by Project Type

**Node.js:**
- Build: `npm run build` or `yarn build`
- Test: `npm test` or `yarn test`
- Lint: `npm run lint` or `yarn lint`
- Security: `npm audit` or `yarn audit`

**Rust:**
- Build: `cargo build`
- Test: `cargo test`
- Lint: `cargo clippy`
- Security: `cargo audit`

**Python:**
- Build: `python -m build` or `pip install -e .`
- Test: `pytest`
- Lint: `ruff check` or `flake8` or `pylint`
- Security: `bandit` or `safety check`

---

## Code Quality Conventions

### General Principles
- **Clarity over cleverness:** Prefer readable code
- **Consistency:** Follow existing patterns in the codebase
- **Simplicity:** Avoid over-engineering
- **Tests:** Write tests for non-trivial code

### Style Guidelines
- **Naming:** Follow language conventions (camelCase for JS/TS, snake_case for Python)
- **Indentation:** Use spaces, not tabs
- **Line length:** Keep lines under 100 characters
- **Comments:** Comment why, not what

### Error Handling
- **Explicit:** Handle errors explicitly, don't ignore
- **Logging:** Log errors with context
- **Recovery:** Attempt recovery when possible
- **User-facing:** Provide clear error messages to users

---

## Git Workflow Conventions

### Branching Strategy
- **Main:** Production-ready code
- **Worktrees:** Isolated development environments in `.worktrees/`
- **Branch naming:** `feature/<name>`, `bugfix/<name>`, or timestamp-based

### Worktree Usage
- **Creation:** Use `setup-isolated-environment` skill
- **Location:** `.worktrees/<branch-name>/`
- **Cleanup:** Remove worktree after merge or when abandoned
- **Isolation:** Each worktree is independent git working directory

### Commit Conventions
- **Frequency:** Commit after each verified task
- **Messages:** Clear, descriptive commit messages
- **Atomic:** One logical change per commit
- **Verification:** Only commit verified code

### Merge Conventions
- **Verification:** Run `verify-milestone` before merging
- **Review:** Code review required for milestones
- **Clean:** Ensure branch is clean before merge
- **Test:** Run full test suite on main after merge

---

## Documentation Conventions

### Documentation Types
- **Plans:** `/docs/plans/` - Design and implementation plans
- **Conventions:** `/docs/conventions/` - Workflow and coding conventions
- **References:** `/docs/references/` - Reference materials, strategies

### Format
- **Markdown:** Use GitHub Flavored Markdown
- **Frontmatter:** Include title, date, version, status
- **Structure:** Clear headings, organized sections
- **Links:** Use relative links for internal references

### Update Convention
- **Version:** Bump version number when updating
- **Date:** Include update date in frontmatter
- **Changelog:** Add changelog section for significant updates

---

## Version Convention

### Plugin Version
- **Format:** Semantic versioning (MAJOR.MINOR.PATCH)
- **MAJOR:** Breaking changes
- **MINOR:** New features, backward compatible
- **PATCH:** Bug fixes, minor improvements

### Bump Rules
- **MAJOR:** File structure changes, breaking API changes
- **MINOR:** New skills, new agents, new hooks
- **PATCH:** Bug fixes, documentation updates, script improvements

### Current Version
- **Version:** 1.1.0
- **Status:** Phase 1 Implementation

---

## Testing Conventions

### Test Types
- **Unit:** Test individual functions/classes
- **Integration:** Test component interactions
- **E2E:** Test full workflows
- **Property:** Test invariants with generated inputs

### Coverage Goals
- **Minimum:** 80% code coverage
- **Target:** 90% code coverage
- **Critical paths:** 100% coverage

### Test Organization
- **Co-location:** Place tests near implementation
- **Naming:** Test names describe behavior, not implementation
- **Structure:** Arrange-Act-Assert (AAA) pattern

### Test Execution
- **Fast subset:** Run after each task
- **Full suite:** Run at milestones
- **Slow tests:** Run in CI or on-demand

---

## Security Conventions

### Security Audits
- **Frequency:** Run after each task (light), at milestones (strict)
- **Tools:** Use language-specific security tools
- **Vulnerabilities:** Zero critical/high vulnerabilities allowed

### Dependency Management
- **Updates:** Keep dependencies up to date
- **Vet:** Review new dependencies before adding
- **Lock:** Use lockfiles (package-lock.json, Cargo.lock)

### Secrets Management
- **Never commit:** Secrets, API keys, credentials
- **Environment:** Use environment variables
- **Gitignore:** Ensure secrets files are gitignored

### Security Checks by Project Type

**Node.js:** `npm audit` or `yarn audit`
**Rust:** `cargo audit`
**Python:** `safety check` or `bandit`

---

## Communication Conventions

### Agent Communication
- **Explicit:** Pass messages explicitly
- **Structured:** Use structured formats (JSON, markdown)
- **Clear:** Be clear and concise
- **Context:** Include relevant context

### Error Reporting
- **Context:** Include error context (file, line, error message)
- **Reproduction:** Include steps to reproduce
- **Logs:** Include relevant logs
- **Suggestions:** Suggest fixes when possible

### User Communication
- **Progress:** Report progress regularly
- **Blocking:** Inform user of blocking issues immediately
- **Decisions:** Ask user for decisions when needed
- **Summaries:** Provide summaries of completed work

---

## Convention Updates

This document is a living reference. When patterns emerge or issues are discovered, update this document first, then apply changes consistently.

**To propose a convention change:**
1. Document the issue with current convention
2. Propose new convention with rationale
3. Apply consistently across all components
4. Update this document

---

*Conventions established for Phase 1 implementation of custom development workflow*
