# Coding Standards

## Code style

- **One concept per file.** A file exports one type, one class, one function, or one tightly-bound group (a type plus its narrow helpers). When in doubt, split. No grab-bag utility files.
- **Folders group concepts, files isolate them.** A folder containing multiple narrow files is fine; a single 400-line file covering several concepts is not.
- **Self-documenting code.** Clear names and extracted functions over comments. Comments explain _why_ when the _why_ isn't obvious — never restate _what_ the code does. If a block needs a comment to explain it, extract a function and let the name do the work.
- **Single level of abstraction per function.** A function either orchestrates other named operations or performs one concrete operation — not both.
- **One level of nesting per function.** Use guard clauses and early returns. Two levels of indentation is a smell; three is a refactor.
- **Small functions, small files.** Aim for ~7-10 line functions and a soft 150-200 line file ceiling.
- **DRY.** Extract duplicated logic. The same `className` or block appearing in multiple places is a signal to extract.
- **Boolean naming:** `is*`, `has*`, `can*`, `should*`.
- **Event handlers named for the action** (`saveAccount`), not the event (`handleClick`).
- **Prefix private/protected class members with `_`**.
- **Use TypeScript constructor parameter properties:** `constructor(private readonly _foo: Foo) {}`. Initialize fields inline where possible.
- **No emojis** in code or output unless explicitly requested.

## Type safety

- **Never use `as any`.** Use `unknown` plus a type guard.
- **Avoid raw type assertions** (`as string`, `as unknown as X`, `as never`). Use guards, schemas, or named mappers. `as const` is fine.
- **Schema-first types.** Define a Zod (or equivalent) schema, then derive the type via `z.infer`.

## Architecture

- **SOLID, with emphasis on SRP and DIP.** Each module has one reason to change. Depend on abstractions at package/module boundaries, concretions inside.
- **Clean architecture boundaries.** Domain logic knows nothing about transport (HTTP, MCP, stdio, UI). Transport adapters live at the edges.
- **Packages do not import siblings.** Cross-package composition happens in apps.
- **Composition over inheritance.** Compose small pieces; avoid deep class hierarchies and monolithic modules.
- **Organize by domain/concept, not by technology.** A flat folder of 50+ files is a smell — group by what things mean, not what they are.
- **Smart vs. dumb components.** Smart components hold state and logic; dumb components receive props, emit callbacks, and have no side effects.
- **Reuse UI primitives.** Prefer established component libraries (e.g. shadcn/ui) over hand-rolled equivalents. Extract any UI pattern that appears 2+ times with only content differences.
- **Use icon libraries.** Never inline SVG markup inside feature components.
- **Repository / mapper patterns for data access.** Keep persistence concerns out of domain code.
- **Thin controllers.** Route and request handlers parse input (form data, query params, body) and map results to responses (status codes, JSON). Business logic belongs in a named service.
- **Introduce abstractions on demand.** Don't add state libraries, caches, or layers "just in case" — wait until the second concrete use.
- **Name the use-case layer.** When a behaviour composes two domains, it is itself a responsibility — give it a home above the domains (a package, a service, a named use case). If it has no home, it defaults into the app and the app's transport layer grows a god-file.
- **DIP keeps domains leaf-shaped.** When domain A's use case needs domain B, A defines a port; the app wires a B-backed adapter. A still owns the orchestration. A never imports B.
- **Subtract to find the owner.** Ask "would this behaviour still exist without X?". If yes, it belongs to the thing that remains and X is an augmentation. Use this to decide whether logic lives in a domain, in a use-case layer, or in the app.

## Testing

- **Co-locate tests with source.** `foo.ts` → `foo.test.ts` in the same directory. No `__tests__` directories, no parallel test trees.
- **TDD: red → green → refactor.** Write the failing test first.
- **Test the unit, mock the boundary.** Use real internal collaborators; reserve test doubles for external SDKs and databases.
- **Parameterize with `it.each`** for any test that varies only by input/output (3+ cases of the same shape).
- **Helpers and page objects over duplicated setup.** Setup repeated across more than two tests goes into a co-located `*.test-helpers.ts`.
- **Test behavior, not styling.** Conditional classes are fair game; static styles are not.
- **Run tests through the repo's script** (`npm test`, `pnpm test`) — never invoke `vitest` or `jest` directly, which bypasses cache and workspace config.
- Coverage is a guide, not a goal. Maintainability wins over the number.

## Git & commits

- **Conventional Commits.** `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- **Small, atomic commits.** One logical unit per commit. Tests and implementation for the same change live in the same commit.
- **Only commit when the build and tests pass.** If a pre-commit hook fails, fix the cause and create a new commit — never amend, never `--no-verify`.
- **Never commit secrets** (`.env`, credentials, tokens). Stage files by name rather than `git add -A`.

## Communication

- **Be concise.** No preambles ("Great question!", "I'll now…"), no trailing recap of what you just did — the diff speaks for itself.
- **Ask when intent is unclear; proceed when it's clear.** One question at a time, conversational.
- **Adapt to feedback.** Treat user preferences as the target, not a position to debate.
- **Stay within scope.** Nice-to-haves become separate follow-up tasks, not silent additions. The Boy Scout rule applies only to code you're already touching.

## Process

- **Match autonomy to complexity.** Simple, clear tasks → just do them. Complex or architectural tasks → understand, plan, get approval, then execute.
- **Specs describe WHAT, not HOW.** Capture the problem, expected behavior, and test scenarios. Skip file paths, class names, signatures, and schemas — pre-baking implementation details takes autonomy from the implementer and rots over time.
- **ADRs for long-term architectural decisions only.** Record context, options, and consequences when the decision will guide work beyond a single change.
- **Ship in small, verifiable increments.** Build, test, and lint after each task; deeper review at milestones.
- **Persist durable knowledge in the repo** (CLAUDE.md, ADRs, specs) rather than in external memory.
- **Fix root causes, not symptoms.** When lint, types, or tests fail, address the underlying issue rather than bypassing the check.

## When in doubt

Prefer the smaller, named, isolated, tested version. The cost of splitting a file you didn't need to split is zero. The cost of leaving a god-file is paid every time someone reads it.
