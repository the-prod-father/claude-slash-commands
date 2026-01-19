---
name: testing
description: Use when running tests, analyzing coverage, writing test cases, or hunting for bugs. Provides testing strategies and bug report formats.
version: 1.0.0
---

# Testing Skill

Comprehensive knowledge for QA and testing. Use these strategies and reference detailed guides for specific test types.

## Testing Pyramid

```
        /\
       /  \     E2E Tests (few)
      /----\    - Critical user flows
     /      \   - Slow, expensive
    /--------\  Integration Tests (some)
   /          \ - Component interactions
  /------------\- API contracts
 /              \ Unit Tests (many)
/----------------\- Fast, isolated, cheap
```

## Test Case Categories

### Happy Path
- Does it work with valid input?
- Does the main flow complete successfully?

### Edge Cases
- Empty input, null, undefined
- Boundary values (0, -1, MAX_INT)
- Single item vs many items
- First and last items

### Error States
- Invalid input
- Network failures
- Timeout scenarios
- Missing permissions

### Security Cases
- Unauthorized access attempts
- Malformed input (injection attempts)
- Rate limiting behavior

## Coverage Analysis

### What to Measure
- **Line coverage** - Which lines executed?
- **Branch coverage** - Which if/else paths taken?
- **Function coverage** - Which functions called?

### Coverage Targets
| Type | Target | Notes |
|------|--------|-------|
| Critical paths | 100% | Auth, payments, data mutations |
| Business logic | 80%+ | Core features |
| Utilities | 70%+ | Helpers, formatters |
| UI components | 60%+ | Interaction handlers |

### Coverage Isn't Everything
- High coverage with bad tests = false confidence
- Test behavior, not implementation
- Critical paths matter more than percentage

## Bug Report Format

```markdown
## Bug: [Clear title describing the issue]

**Severity:** Critical / High / Medium / Low

**Environment:**
- Browser/OS: Chrome 120 / macOS 14
- App version: 1.2.3
- User role: Admin

**Steps to Reproduce:**
1. Go to /settings
2. Click "Change Password"
3. Enter password shorter than 8 characters
4. Click "Save"

**Expected Result:**
Error message "Password must be at least 8 characters"

**Actual Result:**
Form submits successfully, password unchanged, no error shown

**Evidence:**
- Screenshot: [link]
- Console errors: None
- Network: POST /api/password returned 200

**Additional Context:**
Works correctly when password is 8+ characters.
Issue may be in client-side validation.
```

## Test Strategy Template

```markdown
## Test Plan: [Feature Name]

### Scope
- What's being tested
- What's NOT being tested

### Test Cases

#### Unit Tests
- [ ] Function X handles valid input
- [ ] Function X rejects invalid input
- [ ] Function X handles edge case Y

#### Integration Tests
- [ ] Component A communicates with Service B
- [ ] API endpoint returns correct data format

#### E2E Tests
- [ ] User can complete flow from start to finish
- [ ] Error states show appropriate messages

### Risks
- Areas with less coverage
- Known flaky tests
- Dependencies on external services
```

## Detailed References

- [Test Patterns](references/patterns.md) - Common testing patterns by type
- [Bug Hunting](references/bug-hunting.md) - How to find bugs systematically
