---
name: quality-check
description: Audit a repo's quality tooling and propose fixes. Use when the user asks to check, improve, or set up code quality tooling — linting, formatting, type safety, test coverage, or git gates.
---

Audit the repo's quality tooling across five layers. Read the relevant config files before drawing conclusions. If the repo is a monorepo, check both root and package-level configs.

**Layers to inspect:**

1. **Formatting** — Is Prettier configured? Check for `.prettierrc*` or `prettier` key in `package.json`. Flag if missing or if these standard options differ: `singleQuote: true`, `trailingComma: "all"`, `printWidth: 100`, `semi: true`.

2. **Linting** — Is ESLint present with flat config (`eslint.config.*`)? Check for: `typescript-eslint` recommended, `eslint-config-prettier`, `no-explicit-any: "error"`, `max-lines` (≤200) and `max-lines-per-function` (≤15) warnings, `max-depth: ["error", 2]`, boolean variable naming (`is*`/`has*`/`can*`/`should*`), private class member prefix (`_`), and `no-restricted-imports` or `no-restricted-paths` for domain isolation. Note which are absent.

3. **TypeScript strictness** — Is `strict: true` set? Beyond that, check for: `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`. Report which extra flags are enabled and which aren't.

4. **Test coverage** — Is Vitest configured with `@vitest/coverage-v8`? Are coverage thresholds set? The standard is 95% on all four metrics (lines, functions, branches, statements). Check what's excluded — migrations, db connections, and entrypoints (`index.ts`, `bin.ts`) are typical and fine to skip.

5. **Git gates** — Is Husky present with a `pre-commit` hook running lint-staged (ESLint + Prettier on staged files)? Is commitlint configured with `@commitlint/config-conventional`? Is there a CI workflow (`.github/workflows/`) running lint → typecheck → build → test in that order, with `concurrency: cancel-in-progress: true`? Is build caching set up to match the tooling — a dependency-store cache (`cache: pnpm`/`npm`), plus a separate Turbo task cache (`.turbo` with `TURBO_CACHE_DIR`) when Turbo is the task runner?

**Deliver a report:**

For each layer: **present** / **partial** / **missing**, with a one-line note on what's there and what's not.

Then — for anything partial or missing — propose what to add and why, framed as a suggestion the user can accept, skip, or defer. Explain the tradeoff if skipping has a real cost. Ask which gaps they want to address and offer to implement them.

Don't apply any changes before the user confirms.

When generating or reviewing config, apply the known pitfalls documented in [pitfalls.md](./pitfalls.md).
