---
name: setup-isolated-environment
description: Sets up an isolated git worktree for safe parallel development
---

## Purpose
Convenient interface to invoke the setup-isolated-environment hook.

## Usage
Invoke when:
- Starting work on a new feature branch
- Creating isolated environment for testing
- Enabling parallel development work

## What It Does
1. Creates git worktree in `.worktrees/` directory
2. Installs dependencies (auto-detects project type)
3. Verifies environment is ready
4. Returns worktree path

## Workflow
Simply invoke this skill. It will:
- Call the setup-isolated-environment hook
- Execute scripts/setup-worktree.sh
- Report success with worktree location
- Report failures with clear error messages

## Expected Output
On success:
```
✅ Worktree created successfully
📍 Location: .worktrees/feature/YYYY-MM-DD-HHMMSS/
📦 Dependencies installed
✅ Baseline tests passed
```

On failure:
```
❌ Failed to create worktree
[Error details]
```
