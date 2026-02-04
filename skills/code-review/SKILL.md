---
name: code-review
description: Comprehensive code quality reviews at milestones
---

# Code Review

Comprehensive review of code changes focusing on correctness, quality, architecture, security, performance, testing, and maintainability.

## Output Format

```markdown
## Code Review Report

### Executive Summary
- Files changed: [count]
- Lines added/removed: [+X / -Y]
- Overall: [EXCELLENT/GOOD/NEEDS WORK/CRITICAL ISSUES]

### Critical Issues (Must Fix)
[List blocking issues with file:line references]

### Major Issues (Should Fix)
[List important issues with file:line references]

### Minor Issues (Nice to Fix)
[List suggestions with file:line references]

### Positive Observations
[Call out good patterns and practices]

### Recommendations
[PASS/CONDITIONAL PASS/FAIL with next steps]
```
