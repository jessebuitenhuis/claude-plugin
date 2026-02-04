---
name: setup-isolated-environment
description: Sets up an isolated git worktree for safe parallel development
---

# Setup Isolated Environment

Creates isolated git worktree for parallel development.

## Quick Setup
```bash
bash scripts/setup-worktree.sh
```

Report worktree location on success or error details on failure.

## Full Workflow (with PR)
For complete feature work in isolation:

**1. Setup**
```bash
bash scripts/setup-worktree.sh
```

**2. Work**
Execute the assigned task in the worktree.

**3. Publish**
```bash
git add .
git commit -m "message"
git push -u origin branch-name
gh pr create --title "title" --body "description"
```

**4. Cleanup**
Remove worktree after successful PR creation.
