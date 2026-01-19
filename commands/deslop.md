---
description: Remove AI-generated code slop from your branch
argument-hint: [base-branch]
allowed-tools: Bash(git:*)
---

# Remove AI Code Slop

Clean up AI-generated code patterns that don't match your codebase's style and conventions. This command uses a systematic multi-phase approach to safely identify and remove slop.

## Core Principles

- **Safety first**: Always get user confirmation before making changes
- **Transparency**: Show exactly what will be changed and why
- **Context-aware**: Understand existing codebase patterns before removing code
- **Use TodoWrite**: Track progress through all phases

---

## Arguments

**Base branch**: $ARGUMENTS (defaults to main if not provided)

---

## Phase 1: Setup & Analysis

**Goal**: Understand the current state and prepare for slop detection

**Actions**:

1. Create a todo list with all phases
2. Determine the base branch (from arguments or default to `main`)
3. Verify git status:
   - Check current branch name
   - Check if there are uncommitted changes
   - If uncommitted changes exist, ask user to confirm if they want to proceed anyway
   - Verify base branch exists
4. Get the diff against base branch: `git diff <base-branch>...HEAD`
5. Analyze the diff:
   - Count total files changed
   - List all modified files
   - Estimate lines added in this branch
6. Present summary to user:
   - Current branch: `feature-x`
   - Comparing against: `main`
   - Files modified: 12
   - Lines added: 450

---

## Phase 2: Codebase Style Learning

**Goal**: Understand the existing codebase's conventions and patterns

**Actions**:

1. For each modified file, read a few similar files from the base branch to understand:
   - Comment density and style (JSDoc vs inline, verbosity)
   - Error handling patterns (when try-catch is used vs not)
   - Type safety patterns (use of `any`, type assertions, strictness)
   - Defensive coding patterns (null checks, validation)
   - Naming conventions (verbosity, patterns)
2. Build a "style profile" for reference:
   - "This codebase uses minimal inline comments"
   - "Error handling is only in top-level API handlers"
   - "`any` types are never used except in `legacy/` directory"
   - "Null checks are only at API boundaries"
3. Present style profile to user for confirmation

---

## Phase 3: Slop Detection

**Goal**: Identify AI-generated patterns that don't match the codebase style

**Actions**:

1. For each file in the diff, analyze added lines for these patterns:

   **Comments**:
   - JSDoc that merely restates the function name
   - Inline comments explaining obvious code
   - Comment density higher than similar files
   - "AI-style" verbose explanations

   **Over-defensive code**:
   - Try-catch blocks in areas where similar code doesn't use them
   - Null/undefined checks in trusted code paths
   - Duplicate validation already done upstream
   - Redundant type guards

   **Type safety issues**:
   - Casts to `any` to bypass type errors
   - Unnecessary type assertions (`as Type`)
   - Non-null assertions (like !) without clear justification

   **Style inconsistencies**:
   - Naming patterns different from surrounding code
   - Overly verbose variable names
   - Unnecessary intermediate variables
   - Single-use helper functions

2. Categorize each slop instance:
   - File path and line numbers
   - Slop category (comment/defensive/type/style)
   - Confidence level (high/medium/low)
   - Risk level if removed (safe/review/risky)

3. Create a detailed removal plan with file-by-file breakdown

---

## Phase 4: User Review & Confirmation

**Goal**: Get explicit approval before making any changes

**DO NOT PROCEED WITHOUT USER APPROVAL**

**Actions**:

1. Present detailed report:

```
## Deslop Analysis Report

### Summary
Found 145 lines of potential AI-generated slop across 12 files

### By Category
- Comments: 45 lines (31%) - mostly redundant explanations
- Defensive code: 67 lines (46%) - unnecessary try-catch and null checks
- Type casts: 23 lines (16%) - any casts and assertions
- Style fixes: 10 lines (7%) - verbose naming and intermediate vars

### Files to be Modified

1. src/auth/login.ts (34 lines to remove)
   HIGH CONFIDENCE:
   - Lines 23-25: Redundant JSDoc comment
   - Lines 45-52: Try-catch around sync operation (inconsistent with codebase)
   - Line 78: Cast to `any` to bypass type error

   MEDIUM CONFIDENCE:
   - Lines 89-91: Defensive null check (may be intentional)

2. src/utils/helpers.ts (23 lines to remove)
   HIGH CONFIDENCE:
   - Lines 12-15: Inline comments explaining obvious code
   - Lines 34-38: Unnecessary intermediate variables

   [... continue for all files ...]

### Risk Assessment
- Safe changes: 120 lines (83%)
- Need review: 20 lines (14%) - marked above
- Risky: 5 lines (3%) - removing error handling

### High-Risk Changes Requiring Review
⚠️  src/payment/process.ts:67 - Removing try-catch in processPayment()
⚠️  src/api/user.ts:123 - Removing type cast may need proper type fix
```

2. **Ask user**: "Do you want to proceed with removing this slop? You can:
   - Approve all changes
   - Skip high-risk changes and only apply safe ones
   - Review specific files before applying
   - Cancel"

3. Wait for explicit user approval

---

## Phase 5: Application

**Goal**: Apply approved changes safely

**DO NOT START WITHOUT USER APPROVAL**

**Actions**:

1. For each approved file:
   - Read the current file
   - Apply the slop removals
   - Use Edit tool to make precise changes
   - Update todos as you progress through files
2. After all changes applied:
   - Show git diff summary: `git diff --stat`
   - Optionally run linter if configured in project

---

## Phase 6: Verification & Reporting

**Goal**: Confirm changes are safe and provide detailed summary

**Actions**:

1. Run verification checks:
   - Show `git status` to confirm files changed
   - Check if any linter errors were introduced
   - Optionally offer to run tests: `npm test` or equivalent

2. Present final detailed report:

```
## Deslop Completion Report

### Summary
Successfully cleaned 12 files, removing 145 lines of AI-generated slop

### Changes Applied
- Comments removed: 45 lines (31%)
- Defensive code removed: 67 lines (46%)
- Type casts removed: 23 lines (16%)
- Style improvements: 10 lines (7%)

### Files Modified
1. src/auth/login.ts - 34 lines removed
   ✓ Removed 1 redundant JSDoc block
   ✓ Removed 1 unnecessary try-catch
   ✓ Removed 1 any cast
   ⚠️  Skipped 1 high-risk change (defensive null check)

2. src/utils/helpers.ts - 23 lines removed
   ✓ Removed 4 inline comments
   ✓ Simplified variable declarations

[... continue for all files ...]

### Statistics
- Total lines removed: 145
- Files modified: 12
- Safe changes applied: 120
- High-risk changes skipped: 25

### Next Steps
1. Review the changes: `git diff`
2. Run tests: `npm test` (or your test command)
3. Commit changes: `git add . && git commit -m "chore: remove AI-generated slop"`
4. To undo: `git restore .` will revert uncommitted changes if needed
```

3. Mark all todos complete

---

## Error Handling

If at any point:

- Base branch doesn't exist → ask user for correct branch name
- Working directory has uncommitted changes → ask user to confirm if they want to proceed anyway
- No diff found → inform user and exit gracefully
- User cancels → exit cleanly without making changes
