# Claude Code Slash Commands

**Stop prompting AI from scratch every time.** These are reusable commands that give Claude Code a structured workflow—so you get consistent, high-quality results instead of random outputs.

## What Is This?

Slash commands are saved prompts you can trigger with `/command-name` in Claude Code. Instead of typing "please review my code for security issues..." every time, you just type `/review`.

This collection creates a complete development workflow:

```
/explore → /create-plan → /execute → /review → /document
```

**Think of it like giving your AI assistant a playbook** instead of improvising every conversation.

---

## Why Use These?

| Without slash commands | With slash commands |
|------------------------|---------------------|
| AI gives inconsistent responses | Same quality every time |
| You forget to check for security issues | Built-in checklists |
| AI jumps straight to coding | Forces thinking before building |
| No structure to complex tasks | Step-by-step workflow |
| AI adds unnecessary code | `/deslop` cleans up the mess |

---

## The Commands

### Core Workflow

| Command | What it does | When to use it |
|---------|--------------|----------------|
| `/explore` | AI analyzes the problem and asks clarifying questions | Before building anything new |
| `/create-plan` | Generates a step-by-step plan with progress tracking | After exploration, before coding |
| `/execute` | Implements the plan systematically | When you're ready to build |
| `/review` | Comprehensive code review (security, performance, etc.) | Before merging or deploying |
| `/document` | Updates docs based on actual code changes | After finishing a feature |

### Utility Commands

| Command | What it does | When to use it |
|---------|--------------|----------------|
| `/create-issue` | Quickly captures a bug or feature idea | When you notice something mid-coding |
| `/peer-review` | Evaluates feedback from another AI (GPT, Gemini, etc.) | Cross-checking AI suggestions |
| `/learning-opportunity` | AI explains concepts at 3 complexity levels | When you want to understand, not just copy |
| `/deslop` | Removes AI-generated code bloat from your branch | After AI writes too many comments/try-catches |

---

## Installation (Step-by-Step)

### What You'll Need

- [Claude Code](https://claude.ai/code) installed on your computer
- A terminal (Terminal on Mac, Command Prompt or PowerShell on Windows)

### Option 1: Download as ZIP (Easiest)

1. **Click the green "Code" button** at the top of this page
2. **Click "Download ZIP"**
3. **Unzip the folder** somewhere on your computer
4. **Open your terminal** and run these commands:

**On Mac/Linux:**
```bash
mkdir -p ~/.claude/commands
cp ~/Downloads/claude-slash-commands-main/commands/*.md ~/.claude/commands/
```

**On Windows (PowerShell):**
```powershell
mkdir -Force "$env:USERPROFILE\.claude\commands"
copy "$env:USERPROFILE\Downloads\claude-slash-commands-main\commands\*.md" "$env:USERPROFILE\.claude\commands\"
```

5. **Done!** Open Claude Code and type `/help` to see your new commands.

### Option 2: Using Git (If you have it installed)

```bash
# Clone the repository
git clone https://github.com/the-prod-father/claude-slash-commands.git

# Copy commands to your Claude config
mkdir -p ~/.claude/commands
cp claude-slash-commands/commands/*.md ~/.claude/commands/

# Clean up
rm -rf claude-slash-commands
```

### Option 3: Manual (Copy-Paste Each File)

1. Go to the `commands/` folder in this repo
2. Click on any `.md` file
3. Click the "Raw" button
4. Copy all the text
5. Create a new file at `~/.claude/commands/[command-name].md`
6. Paste and save

---

## Examples

### Example 1: Building a New Feature

You want to add user authentication to your app.

```
You: /explore

Claude: I understand you want to explore a problem before implementing.
        Please describe what you want to build...

You: I need to add login/logout to my React app with Supabase

Claude: Let me analyze your codebase and ask some questions...
        - Do you need social logins (Google, GitHub) or just email/password?
        - Should sessions persist across browser closes?
        - Do you have existing user data to migrate?
        [continues asking until fully understood]

You: /create-plan

Claude: # Authentication Implementation Plan
        **Overall Progress:** 0%

        ## Tasks:
        - [ ] 🟥 Step 1: Set up Supabase auth client
        - [ ] 🟥 Step 2: Create login/signup components
        - [ ] 🟥 Step 3: Add protected route wrapper
        ...

You: /execute

Claude: [Implements each step, updating progress as it goes]
        ✅ Step 1 complete - created supabaseClient.ts
        🟨 Starting Step 2...
```

### Example 2: Quick Bug Capture

You're coding and notice something broken, but don't want to lose focus.

```
You: /create-issue

Claude: What's the issue?

You: the date picker breaks on mobile safari

Claude: Got it. A few quick questions:
        - Does it not open, or open incorrectly?
        - Any error in console?

You: doesn't open at all, no error

Claude: ## Issue: Date Picker Broken on Mobile Safari

        **Type:** Bug | **Priority:** High | **Effort:** Medium

        **Current:** Date picker doesn't open on iOS Safari
        **Expected:** Should open native date picker

        **Files:** src/components/DatePicker.tsx

        **Notes:** Likely needs native input fallback for iOS
```

### Example 3: Cleaning Up AI Slop

Claude wrote a feature but added way too many comments and unnecessary error handling.

```
You: /deslop main

Claude: Analyzing your branch against main...

        Found 87 lines of potential AI slop:
        - 34 redundant comments ("// Initialize the user array")
        - 28 unnecessary try-catch blocks
        - 15 verbose variable names
        - 10 defensive null checks in trusted code

        Want me to show the detailed report before removing?

You: yes

Claude: [Shows exactly what will be removed and why]

        Proceed with cleanup?

You: yes

Claude: ✅ Removed 87 lines across 6 files
        Run `git diff` to review changes
```

---

## Which Projects Is This Good For?

These commands work for **any coding project**, but they're especially valuable for:

| Project Type | Why it helps |
|--------------|--------------|
| **Side projects** | Keeps you organized when working alone |
| **Startups** | Move fast without breaking things |
| **Learning to code** | `/learning-opportunity` explains as you go |
| **Client work** | `/review` catches issues before delivery |
| **Open source** | `/document` keeps docs in sync |
| **Refactoring** | `/explore` first, then `/create-plan` |

**Languages:** Works with any language—JavaScript, Python, TypeScript, Go, Rust, etc.

**Frameworks:** React, Next.js, Django, Rails, FastAPI, whatever you're using.

---

## Customizing Commands

Each command is just a markdown file. Open any file in `~/.claude/commands/` and edit it:

```markdown
---
description: What shows up in /help
allowed-tools: Bash(git:*), Read, Edit
---

Your prompt goes here...
```

Make them your own:
- Add your team's coding standards
- Include project-specific checklists
- Change the tone or verbosity
- Add new commands for your workflow

---

## Troubleshooting

**Commands not showing up?**
- Make sure files are in `~/.claude/commands/` (note the dot before `claude`)
- Files must end in `.md`
- Restart Claude Code

**Command not working as expected?**
- Open the `.md` file and read the prompt—you can edit it
- Some commands expect arguments (like `/deslop main`)

**Want project-specific commands?**
- Put them in `.claude/commands/` in your project root
- Project commands override personal ones with the same name

---

## Credits

Workflow based on [Zevi Reinitz's AI Development Workflow](https://x.com/zaborwitz). Adapted and extended for Claude Code.

## License

MIT — use it however you want, no attribution required.

---

**Questions?** Open an issue or reach out on [Twitter/X](https://x.com/theprodfather).
