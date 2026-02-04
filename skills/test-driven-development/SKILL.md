---
name: test-driven-development
description: always use when writing, reviewing or analyzing tests (e.g. unit, integration, e2e etc.)
---

# Test Driven Development

Use red/green/refactor method:

1. Red: Create a failing test
2. Green: Write minimal code to pass
3. Refactor: Improve the code

## Test Organization

- Place test files in `*.test.*` files in same folder
- Keep test setup DRY
- Separate UI interactions from tests with page object pattern

## Quality

- Test behavior, not implementation details or styling
- Use integration tests for component interactions
- Mock external dependencies appropriately

## Tools

- Run tests: `npm test`
- All tests must pass before committing
