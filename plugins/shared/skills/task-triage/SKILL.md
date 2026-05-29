---
name: task-triage
description: Triage the full task backlog — classify every open task by assignee, readiness, and relevance, then bulk-apply all changes. Use when the user wants to process, clean up, or get a status overview of their backlog.
---

Triage the full task backlog. Load everything, decide everything, apply once.

## Phase 1 — Load

Fetch all open tasks (any status except Done and Canceled). Load the project registry to determine which projects are active and which are archived.

Start immediately — no confirmation needed.

## Phase 2 — Classify

Make three decisions per task. **Ownership is the assignee, readiness is the status — not labels.**

**Assignee (who executes it)**
- `AusAgent` — the AI agent can execute it independently: spec is complete, no external dependencies, no judgment calls, no physical actions.
- `Jesse` — requires human judgment, a physical action, personal context, or input only Jesse can provide.

**Readiness (status)**
- `Todo` — ready to pick up right now (by an agent or by Jesse).
- `Refine` — chosen to do, but the scope is unclear, the spec is missing, or more context is needed before work can start.
- `Backlog` — just an idea, not yet chosen to do.

**Cancel?**
- `Canceled` when: the project is archived, the task is no longer relevant, or it has no remaining value.

Tasks belonging to archived projects are always canceled — no confirmation needed.

## Phase 3 — Present

Group tasks by project. For each project, show a table:

| Task | Current | Recommended status | Assignee | Cancel? | Reason |
|------|---------|--------------------|----------|---------|--------|

Below the tables, list only genuinely uncertain cases as focused questions. One question per uncertainty — not one per task.

## Phase 4 — Incorporate feedback

When the user corrects a decision, look for the pattern: if the correction clearly applies to similar tasks (same project, same type, same shape), apply it to those too — without re-asking. State which tasks were updated by the same rule.

Collect all final decisions before writing anything.

## Phase 5 — Execute

1. Apply all status changes, assignee changes, and cancellations in bulk via `save_issue`.
2. Confirm: how many tasks moved to `Todo`, `Refine`, `Backlog`, and how many canceled.

Note: statuses cannot be created via the Linear MCP — if `Refine` (or any needed status) is missing, tell Jesse the Settings path to add it (Settings → Team → Workflow).

---

For ad-hoc task creation or individual updates outside of a triage session, use `/task-manage`.
