# Coding Standards

## Code style

- **Default to no comment** — names and small named helpers carry intent; a comment can't, and it drifts. Never restate what the code does (extract a named function instead) and never put the _why of a change_ in code (ADR/spec/PR refs, "comes later" — that's the commit message). The rare exception: a non-inferable external constraint (a protocol quirk, a library ordering requirement, a type gotcha).
- **One concept per file.** One type, class, function, or tightly-bound group. When in doubt, split. Folders group; files isolate. No grab-bag utility files.
- **Single level of abstraction per function**, **one level of nesting** (guard clauses, early returns), **~7-10 line functions**, soft **150-200 line file** ceiling.
- **DRY.** The same block appearing twice is a signal to extract.
- **Naming:** booleans `is*`/`has*`/`can*`/`should*`; handlers for the action (`saveAccount`), not the event; private members `_`-prefixed.
- **TS:** constructor parameter properties (`constructor(private readonly _foo: Foo) {}`); initialize fields inline.
- **No emojis** in code or output unless asked.

## Type safety

- **No `as any`** — use `unknown` + a type guard. Avoid raw assertions (`as X`, `as unknown as X`); `as const` is fine.
- **Schema-first:** define a Zod schema, derive the type via `z.infer`.

## Architecture

- **SOLID, SRP + DIP.** Depend on abstractions at boundaries, concretions inside. Domain logic knows nothing about transport (HTTP, MCP, UI) — adapters live at the edges.
- **Own the interface, not the library.** Depend on your domain type, never a library's shape; wrap the library behind one typed seam so its type never crosses a package's public barrel (not re-exported, not derived via `ReturnType<sdk.foo>`). Test: could you swap the library without touching a consumer?
- **DIP keeps domains leaf-shaped.** When domain A needs domain B, A defines a port; the app wires a B-backed adapter. A never imports B.
- **Packages don't import siblings.** Cross-package composition happens in apps.
- **Introduce abstractions on demand** — wait for the second concrete use. **Compose, don't inherit.** Organize by concept, not technology.
- **Name the use-case layer.** Behavior composing two domains is itself a responsibility — give it a home above them (a package, a service), or it defaults into the app and grows a transport god-file.
- **Subtract to find the owner:** "would this behavior exist without X?" If yes, it belongs to what remains.
- **Reuse UI primitives** (shadcn/ui over hand-rolled) and **icon libraries** (never inline SVG). Smart components hold state; dumb components take props and emit callbacks.
- **Thin controllers** parse input and map results; business logic lives in a named service. **Repository/mapper** for data access.

## Testing

- **Co-locate:** `foo.ts` → `foo.test.ts`. No `__tests__` trees.
- **TDD:** red → green → refactor. **Test the unit, mock the boundary** — real internal collaborators, doubles only for external SDKs/DBs.
- **Parameterize with `it.each`** for 3+ cases of the same shape. Setup repeated 3+ times → co-located `*.test-helpers.ts`.
- **Test behavior, not static styling.** Run tests through the repo script (`pnpm test`), never `vitest`/`jest` directly.

## Git & commits

- **Conventional Commits** (`feat:`/`fix:`/`refactor:`/`docs:`/`test:`/`chore:`). Small, atomic — one logical unit; tests + impl together.
- **Commit only when build and tests pass.** Hook fails → fix the cause, new commit. Never amend, never `--no-verify`.
- **Never commit secrets.** Stage by name, not `git add -A`.

## Communication

- **Be concise.** No preambles, no trailing recap — the diff speaks.
- **Ask when intent is unclear; proceed when it's clear.** Treat preferences as the target, not a debate.
- **Stay in scope.** Nice-to-haves are follow-ups. Boy Scout rule applies only to code you're already touching.

## Process

- **Match autonomy to complexity.** Simple → do it. Complex/architectural → understand, plan, get approval, execute.
- **Specs describe WHAT, not HOW.** Skip file paths, signatures, schemas — they take autonomy from the implementer and rot.
- **ADRs for long-term decisions only.** Ship in small, verifiable increments. **Fix root causes, not symptoms** — never bypass a failing check.
- **Persist durable knowledge in the repo** (CLAUDE.md, ADRs, specs), not external memory.

## Self-learning

When a generalizable principle emerges, offer to invoke capture-learning without being asked.

## When in doubt

Prefer the smaller, named, isolated, tested version. Splitting a file you didn't need to split costs nothing. A god-file is paid for on every read.
