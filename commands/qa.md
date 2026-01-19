---
description: Run comprehensive QA testing with the QA engineer subagent
allowed-tools: Bash, Read, Grep, Glob, Write, Edit
argument-hint: [file, directory, or feature to test]
---

# QA Testing Task

Delegate this to the **qa-engineer subagent** to run comprehensive quality assurance.

## Target

Test: $ARGUMENTS

## Task

1. **Analyze the target** - Understand what needs testing
2. **Identify test coverage** - What tests exist? What's missing?
3. **Run existing tests** - Execute test suites, capture results
4. **Hunt for bugs** - Look for edge cases, error handling gaps, potential issues
5. **Generate report** - Clear summary with actionable findings

## Expected Output

```
## QA Report: [Target]

### Test Results
| Suite | Passed | Failed | Skipped |
|-------|--------|--------|---------|
| ...   | ...    | ...    | ...     |

### Coverage
- Current: X%
- Critical paths covered: Yes/No
- Gaps identified: [list]

### Bugs Found
1. **[Severity]** Description
   - Steps to reproduce
   - Expected vs actual
   - Suggested fix

### Recommendations
- [Actionable improvements]
```

Use TodoWrite to track progress through each phase.
