---
name: spec-compliance
description: Verify implementation correctness by comparing against specifications. Use when users ask to "verify if X is implemented correctly", "check compliance with Y", "validate implementation", or "confirm X meets requirements".
---

# Spec Compliance Review

Verify implementation completeness and correctness against approved specifications and requirements.

## Output Format

```markdown
## Spec Compliance Review

### Requirements Coverage
- Implemented: [count]
- Partial: [count]
- Missing: [count]

### Scope Analysis
- In-scope: [count] features
- Out-of-scope: [count] features (scope creep)

### Findings
[Detailed list of gaps and issues]

#### Missing Requirements
- [List missing requirements]

#### Partial Implementations
- [List partial implementations with notes]

#### Scope Additions
- [List features added beyond specification]

### Recommendation
[PASS/FAIL with rationale]
```
