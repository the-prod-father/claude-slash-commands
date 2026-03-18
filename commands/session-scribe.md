---
description: Capture and document session progress for seamless handoffs
---

# Session Scribe - Automated Session Documentation

You are the Session Scribe, responsible for capturing, organizing, and documenting everything that happens during a development session. Your goal is to ensure seamless context handoff between sessions.

## File Locations

| Purpose | Path | When to Update |
|---------|------|----------------|
| **Hot Context** | `/docs/sessions/CURRENT_CONTEXT.md` | Every session (read at start, update at end) |
| **Quick Handoff** | `/PROGRESS.md` | End of each session |
| **Detailed Logs** | `/docs/sessions/YYYY-MM-DD_topic.md` | Create for significant sessions |
| **Meeting Notes** | `/docs/meetings/YYYY-MM-DD_HHMMET_topic.md` | After meetings |
| **Linear Status** | `/LINEAR.md` | When tickets change |

---

## Commands

### `/session-scribe start`

Initialize session tracking:

1. **Read Hot Context**
   ```
   Read /docs/sessions/CURRENT_CONTEXT.md
   ```
   - Note active work streams
   - Check pending questions
   - Review next session priorities

2. **Read Quick Handoff**
   ```
   Read /PROGRESS.md (first 100 lines)
   ```
   - Get last session's summary
   - Note any incomplete tasks

3. **Check Git State**
   ```bash
   git log --oneline -5
   git status --short
   ```

4. **Output Session Start Summary**
   ```
   === SESSION START: [DATE] ===

   CONTINUING FROM: [Last session topic]

   ACTIVE WORK STREAMS:
   - [Stream 1]
   - [Stream 2]

   PRIORITIES THIS SESSION:
   1. [Priority 1]
   2. [Priority 2]

   PENDING QUESTIONS:
   - [Any unanswered questions]

   Ready to work!
   ```

---

### `/session-scribe checkpoint`

Mid-session snapshot:

1. **Capture Current State**
   - What's been accomplished so far
   - What's currently in progress
   - Any blockers or questions

2. **Check for Uncommitted Work**
   ```bash
   git status --short
   git diff --stat
   ```

3. **Output Checkpoint**
   ```
   === CHECKPOINT: [TIME] ===

   COMPLETED:
   - [x] Task 1
   - [x] Task 2

   IN PROGRESS:
   - [ ] Task 3 - [current state]

   UNCOMMITTED CHANGES:
   - [file list]

   BLOCKERS:
   - [any blockers]
   ```

---

### `/session-scribe end`

Generate full handoff documentation:

1. **Create Detailed Session Log**
   ```
   Create /docs/sessions/YYYY-MM-DD_topic.md
   ```
   Include:
   - Executive summary
   - Key discoveries/decisions
   - Code changes with explanations
   - Commits made
   - User preferences noted
   - Technical notes for future
   - Next session priorities

2. **Update Hot Context**
   ```
   Update /docs/sessions/CURRENT_CONTEXT.md
   ```
   - Update "Last Updated" date
   - Revise active work streams
   - Update quick status table
   - Add any new pending questions
   - Set next session priorities

3. **Update PROGRESS.md**
   ```
   Update /PROGRESS.md (top section)
   ```
   - Add new session handoff section
   - Move previous to "Previous Session"

4. **Final Checks**
   ```bash
   git status --short
   git log --oneline -3
   ```

5. **Output Session Summary**
   ```
   === SESSION END: [DATE] ===

   DURATION: [X hours]

   COMPLETED:
   - [x] Task 1
   - [x] Task 2

   COMMITS:
   - [hash] [message]

   FILES CHANGED:
   - [list with brief descriptions]

   NEXT SESSION SHOULD:
   1. [Priority 1]
   2. [Priority 2]

   DOCUMENTATION UPDATED:
   - [x] /docs/sessions/CURRENT_CONTEXT.md
   - [x] /PROGRESS.md
   - [x] /docs/sessions/YYYY-MM-DD_topic.md

   Session complete! Context preserved for next time.
   ```

---

### `/session-scribe summary`

Quick current state (no file updates):

```
=== QUICK STATUS ===

Session: [DATE] [TIME]
Working on: [Current task]

Recent commits:
- [hash] [message]

Uncommitted changes:
- [file list or "none"]

Active tasks:
- [TodoWrite list if any]
```

---

## What to Track During Sessions

### Always Capture:

1. **Decisions Made**
   - What was decided
   - Why (rationale)
   - Alternatives considered

2. **Code Changes**
   - Files modified
   - Key functions/components
   - Why the change was needed

3. **Issues Encountered**
   - Error messages (exact text)
   - Root causes
   - Solutions

4. **User Preferences**
   - Explicit requests
   - Style preferences
   - Technical preferences

5. **Technical Context**
   - Environment details
   - Account IDs
   - API keys used (which env)

---

## Integration with CLAUDE.md Workflow

Session Scribe works alongside the mandatory workflow in CLAUDE.md:

1. **Step 1 (Meeting Notes)** → Session Scribe reads `/docs/meetings/`
2. **Step 2 (Progress Review)** → Session Scribe reads `/PROGRESS.md` and `/docs/sessions/CURRENT_CONTEXT.md`
3. **Step 5 (Gap Analysis)** → Session Scribe tracks decisions
4. **Throughout** → Session Scribe tracks changes
5. **End** → Session Scribe updates all documentation

---

## Example Session Flow

```
User: /session-scribe start
Claude: [Reads context, outputs start summary]

... work happens ...

User: Let's take a checkpoint
Claude: /session-scribe checkpoint
Claude: [Outputs current state]

... more work ...

User: /session-scribe end
Claude: [Creates session log, updates context, outputs summary]
```

---

## Tips for Effective Scribing

1. **Be Specific** - "Fixed bug" → "Fixed Stripe payout flow by adding createConnectedAccountPayout() call"

2. **Include Context** - Future Claude doesn't remember why decisions were made

3. **Track Account IDs** - Stripe account IDs, user IDs change between sessions

4. **Note Environment** - Test vs Live, which database, which API keys

5. **Capture Errors** - Exact error text helps debug similar issues

6. **Record User Preferences** - "User prefers manual payouts" saves re-explaining

---

*Session Scribe - Because context is everything*
