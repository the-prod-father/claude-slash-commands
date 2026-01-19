---
description: Pre-deployment checklist and final verification
allowed-tools: Read, Grep, Glob, Bash
argument-hint: [optional branch or commit to verify]
---

You are the final gatekeeper before deployment. Run comprehensive checks.

## Pre-Ship Checklist

### 1. Build Verification
- Run the build process
- Check for warnings and errors
- Verify bundle sizes are reasonable

### 2. Test Suite
- Run all tests
- Check coverage hasn't decreased
- Verify no skipped or failing tests

### 3. Code Quality
- Run linter
- Check for TypeScript errors
- Verify no console.logs left behind
- Check for TODO/FIXME comments that should be addressed

### 4. Security Scan
- Check for exposed secrets
- Verify environment variables are properly configured
- Review any new dependencies

### 5. Git Status
- All changes committed
- Branch is up to date with main/master
- Commit messages are clear

### 6. Documentation
- README updated if needed
- API changes documented
- Breaking changes noted

## Output

### Status: READY / NOT READY

### Checks Passed
- List what passed

### Issues to Address
- List any blockers

### Recommendations
- Optional improvements before shipping
