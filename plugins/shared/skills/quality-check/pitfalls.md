# Quality-check implementation pitfalls

Known traps surfaced from real end-to-end runs. Apply these when generating or reviewing config.

## 1. Boolean naming: use `@typescript-eslint/naming-convention`, not `id-match`

`id-match` applies to every identifier. A prefix regex like `^(is|has|can|should)` will incorrectly flag names like `cancelWorkItem` because they start with `can`. Use `@typescript-eslint/naming-convention` scoped to boolean-typed variables:

```ts
'@typescript-eslint/naming-convention': ['warn', {
  selector: 'variable',
  types: ['boolean'],
  format: null,
  custom: { regex: '^(is|has|can|should)', match: true },
}]
```

## 2. Add root config files to ESLint `ignores` when using `projectService`

With `projectService: true`, every linted file must be covered by a `tsconfig.json`. Root-level files (`eslint.config.ts`, `commitlint.config.ts`) and per-package `vitest.config.ts` are typically outside any package `include`, causing lint-staged to fail with a parse error. Add them upfront:

```ts
ignores: ['*.config.ts', '**/vitest.config.ts', '**/dist/**', '**/node_modules/**']
```

## 3. `eslint-disable-next-line` must sit above the offending token, not the function signature

When Prettier wraps a signature across lines, a disable comment above the function keyword only covers that line. Place it directly above the offending parameter:

```ts
// ✗ — targets the function keyword, not the parameter
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function foo(
  state: State,
  operation: Operation<State, any, any>,  // ← not covered
)

// ✓ — sits directly above the offending line
function foo(
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operation: Operation<State, any, any>,
)
```

## 4. `pnpm/action-setup@v4`: omit `version:` when `packageManager` is set

If `package.json` has a `packageManager` field (e.g. `"pnpm@10.10.0"`), the action reads it automatically. Specifying `version:` alongside it causes a hard CI error: *"Multiple versions of pnpm specified"*. Omit the key entirely:

```yaml
- uses: pnpm/action-setup@v4
  # no version: key — read from packageManager in package.json
```
