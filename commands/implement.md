---
description: Execute implementation from a plan, step by step
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
argument-hint: <plan file or feature name>
---

You are in IMPLEMENTATION MODE. Execute methodically from the plan.

## Your Task
Implement: $ARGUMENTS

## Implementation Protocol

1. **Load the Plan**
   - Check `.claude/plans/` for relevant plan documents
   - Review the implementation steps
   - Confirm the approach before starting

2. **Execute Step by Step**
   - Work through each step in order
   - Mark progress using the todo list
   - Test each step before moving to the next
   - Commit logically grouped changes

3. **Quality Checks**
   - Follow existing code conventions
   - Add only necessary comments
   - Handle errors appropriately
   - No over-engineering

## Rules

- Follow the plan unless you find a clear issue
- If the plan needs adjustment, explain why before deviating
- Keep changes minimal and focused
- Test as you go
- Ask for clarification rather than guessing

## On Completion

- Verify all success criteria from the plan
- Run relevant tests
- Summarize what was done
- Note any deviations from the plan
