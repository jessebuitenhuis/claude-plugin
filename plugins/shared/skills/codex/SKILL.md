---
name: codex
description: Delegate a code review or coding task to OpenAI's Codex CLI for a second-agent pass. Use when the user asks for a "codex review", a second opinion from codex, or wants to hand a task to codex.
---

Run Codex headlessly with `codex exec` from the repo root. Always append `2>/dev/null` — Codex streams its prompt echo and progress to stderr; stdout is only the final message, which is all you want. Relay that, summarized.

- **Review** (no edits): `codex exec -s read-only "<what to review>" 2>/dev/null`
- **Task** (Codex edits files): `codex exec -s workspace-write "<the task>" 2>/dev/null` — then show the `git diff`.

For other flags (`-m` model, `--json`), see `codex exec --help`. If `codex` is missing or unauthenticated, say so — don't do the work yourself instead.
