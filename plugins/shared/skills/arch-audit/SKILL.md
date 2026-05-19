---
name: arch-audit
description: Audit a slice of the codebase and propose a refactor. Use when the user asks to review architecture, find smells, or plan a cross-module change.
---

Audit a slice of the codebase. Ask once for scope if it isn't obvious — reviewing "everything" produces shallow audits.

Read the slice end-to-end before generalising. Look through these lenses:

- **Responsibility** — what each module owns, what's owned in the wrong place.
- **Dependencies** — imports pointing the wrong way, cycles, domain reaching into transport, sibling-package coupling.
- **Duplication** — parallel implementations that should converge.
- **Hotspots** — where churn or repeated bugs say the design is fighting the work.

Deliver a report with findings and recommendations. Don't write code or create tickets unless asked.
