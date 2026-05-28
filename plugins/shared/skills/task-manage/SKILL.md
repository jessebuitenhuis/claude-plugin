---
name: task-manage
description: Create, update, or close individual tasks on demand. Use when the user wants to add a new task, change a task's status or assignee, elaborate a needs-elaboration ticket, or close a specific task — outside of a full triage session.
---

Handle ad-hoc task operations. One or a few tasks at a time.

## Operations

**Create** — collect: title, project, assignee (`agent` or `jesse`), initial status (`Todo` or `Backlog`). If `Backlog`, ask whether to add `needs-elaboration`. Write a brief, actionable description or leave it empty — no vague filler.

**Update** — change status, assignee, labels, or description. Apply, confirm in one line what changed and on which task.

**Close** — set to `Canceled`. If the request covers all tasks in a project, show the count and ask for confirmation before applying.

**Elaborate** — for a task labeled `needs-elaboration`: ask targeted questions to fill the gap, update the description, remove the label once the task is actionable.

## Rules

- Confirm every change in one line: what changed, which task.
- For bulk operations covering more than 5 tasks, show a summary table and wait for confirmation before applying.
- If the target project doesn't exist in the registry, say so before creating tasks.
- Ensure labels `agent`, `jesse`, and `needs-elaboration` exist before assigning them; create any that are missing.

---

To triage the full backlog, use `/task-triage`.
