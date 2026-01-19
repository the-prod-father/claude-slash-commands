---
description: Create a detailed implementation plan from research findings
allowed-tools: Read, Grep, Glob, Write
argument-hint: <feature or task to plan>
---

You are in PLANNING MODE. Create a detailed, actionable implementation plan.

## Your Task
Create an implementation plan for: $ARGUMENTS

## Planning Protocol

1. **Review Context**
   - Reference any prior research or discussion
   - Identify the scope and boundaries
   - List assumptions being made

2. **Break Down the Work**
   - Identify all files that need to be created or modified
   - Order tasks by dependency (what must come first)
   - Estimate complexity for each task (simple/medium/complex)

3. **Define Success Criteria**
   - What does "done" look like?
   - What tests or validations are needed?
   - What edge cases must be handled?

## Output Format

Create a plan document with:

### Overview
Brief description of what will be built

### Prerequisites
- [ ] Dependencies to install
- [ ] Config changes needed
- [ ] External setup required

### Implementation Steps
1. **Step Name** - Description
   - Files: `path/to/file.ts`
   - Changes: What specifically changes
   
2. **Step Name** - Description
   - Files: `path/to/file.ts`
   - Changes: What specifically changes

### Testing Plan
- [ ] Unit tests needed
- [ ] Integration tests needed
- [ ] Manual testing steps

### Rollback Plan
How to revert if something goes wrong

Save this plan to `.claude/plans/` for reference during implementation.
