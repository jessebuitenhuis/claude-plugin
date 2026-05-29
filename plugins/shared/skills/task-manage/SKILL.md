---
name: task-manage
description: Create, update, or close individual tasks on demand. Use when the user wants to add a new task, change a task's status or assignee, refine a task that isn't ready yet, or close a specific task — outside of a full triage session.
---

Handle ad-hoc task operations. One or a few tasks at a time.

## Convention

**Who executes a task = the assignee, not a label.**
- `AusAgent` — the AI agent can execute it autonomously (clear spec, no external dependencies, no human judgment, no physical actions).
- `Jesse` — requires human judgment, a physical action, personal context, or input only Jesse can provide.

**Readiness = the status, not a label.** The pipeline:
- `Backlog` — an idea, not yet chosen to do.
- `Refine` — chosen to do, but not ready: spec or details missing.
- `Todo` — ready to pick up, by an agent or by Jesse.
- `In Progress` — actually picked up / being worked.
- `Blocked` / `In Review` — waiting on something / awaiting review.
- `Done` / `Canceled` / `Duplicate` — terminal.

**Golden rule:** agents and Jesse only pick work up from `Todo`. Nothing leaves `Refine` until it's specced enough to execute.

**Labels are for type only:** `Feature`, `Improvement`, `Bug`. The old `agent`, `jesse`, and `needs-elaboration` labels are deprecated — ownership is now the assignee, readiness is now the `Refine` status.

## Operations

**Create** — collect: title, project, assignee (`AusAgent` or `Jesse`), initial status. Use `Todo` if the spec is clear and ready, `Refine` if it's committed but needs detail, `Backlog` if it's just an idea. Set priority when known (anything with a due date is at least Medium). Add a type label when it fits. Write a brief, actionable description or leave it empty — no vague filler.

**Update** — change status, assignee, priority, labels, or description. Apply, confirm in one line what changed and on which task.

**Close** — set to `Canceled`. If the request covers all tasks in a project, show the count and ask for confirmation before applying.

**Refine** — for a task in `Refine`: ask targeted questions to fill the gap, update the description, move it to `Todo` once it's actionable.

## Rules

- Confirm every change in one line: what changed, which task.
- For bulk operations covering more than 5 tasks, show a summary table and wait for confirmation before applying.
- If the target project doesn't exist in the registry, say so before creating tasks.
- Statuses and label definitions cannot be created via the Linear MCP — those are manual in Linear Settings. If one is missing, give the exact Settings path.

---

To triage the full backlog, use `/task-triage`.
