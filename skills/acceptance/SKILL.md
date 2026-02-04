---
name: acceptance
description: always use when testing or verifying application behavior in the browser (e.g. features, bugs, ux research, reproducing issues)
context: fork
model: sonnet
---

# Acceptance

Test $ARGUMENTS from a user perspective. Do not read code.

## Tools
- Start dev server: `npm run dev` (background)
- Interact with app: `npx agent-browser`
- Get help: `npx agent-browser --help`
- Analyze UX: `npx agent-browser screenshot`

## Reporting
Save report as markdown in `.claude/artifacts/` with commit hash.
