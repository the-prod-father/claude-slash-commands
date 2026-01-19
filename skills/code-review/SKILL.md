---
name: code-review
description: Use when reviewing code for security, performance, or quality issues. Provides checklists and patterns for thorough code review.
version: 1.0.0
---

# Code Review Skill

Comprehensive knowledge for reviewing code. Use the checklists below and reference detailed guides for specific domains.

## Review Process

1. **Understand context** - What does this code do? What problem does it solve?
2. **Check correctness** - Does it work? Are there logic errors?
3. **Check security** - Any vulnerabilities? See [security checklist](references/security.md)
4. **Check performance** - Any bottlenecks? See [performance patterns](references/performance.md)
5. **Check maintainability** - Is it readable? Testable? Well-organized?

## Quick Security Checklist

- [ ] Input validation on all user data
- [ ] No SQL/NoSQL injection vectors
- [ ] No XSS vulnerabilities (output encoding)
- [ ] Authentication checked on protected routes
- [ ] Authorization verified for data access
- [ ] No hardcoded secrets or credentials
- [ ] Sensitive data not logged
- [ ] CSRF protection where needed

## Quick Performance Checklist

- [ ] No N+1 queries
- [ ] Expensive operations are cached or memoized
- [ ] No unnecessary re-renders (React)
- [ ] Database queries use indexes
- [ ] No memory leaks (cleanup in effects)
- [ ] Large lists are virtualized or paginated

## Quick Quality Checklist

- [ ] Clear naming (functions, variables, files)
- [ ] Single responsibility principle
- [ ] Error handling covers failure modes
- [ ] No dead code or debug statements
- [ ] Tests cover critical paths
- [ ] Types are accurate (no `any` abuse)

## Severity Levels

| Level | Criteria | Action |
|-------|----------|--------|
| **CRITICAL** | Security vulnerability, data loss risk, crash | Must fix before merge |
| **HIGH** | Bug, significant performance issue, bad UX | Should fix before merge |
| **MEDIUM** | Code quality, maintainability concern | Fix soon |
| **LOW** | Style, minor improvement | Optional |

## Output Format

```markdown
## Code Review: [file/feature]

### Summary
One paragraph overall assessment.

### Critical Issues
- **[SEVERITY]** file:line - Description
  - Why it's a problem
  - Suggested fix

### Recommendations
- Improvement suggestions

### What's Good
- Positive observations
```

## Detailed References

- [Security Checklist](references/security.md) - Full security review guide
- [Performance Patterns](references/performance.md) - Performance anti-patterns and fixes
