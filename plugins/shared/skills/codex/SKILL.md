---
name: codex
description: Delegate a code review or coding task to OpenAI's Codex CLI for a second-agent pass. Use when the user asks for a "codex review", a second opinion from codex, or wants to hand a task to codex.
---

Run Codex headlessly with `codex exec` from the repo root. It prints its final message to stdout — relay that, summarized.

- **Review** (no edits): `codex exec -s read-only "<what to review>"`
- **Task** (Codex edits files): `codex exec -s workspace-write "<the task>"` — then show the `git diff`.

For other flags (`-m` model, `--json`), see `codex exec --help`. If `codex` is missing or unauthenticated, say so — don't do the work yourself instead.
