# Claude Code Slash Commands + Subagents

**Stop prompting AI from scratch every time.** This repo contains reusable commands AND specialized AI personas that work together to give you consistent, high-quality results.

## What's In This Repo?

Two powerful features that work together:

| Feature | What it is | Location |
|---------|------------|----------|
| **Slash Commands** | Reusable prompts triggered with `/command` | `~/.claude/commands/` |
| **Subagents** | Specialized AI personas with specific expertise | `~/.claude/agents/` |

**Think of it this way:**
- **Subagent** = WHO does the work (the persona)
- **Slash command** = WHAT they do (the task)

---

## The Power Combo: Subagents + Slash Commands

Here's where it gets interesting. When you combine these:

```
/qa src/auth/ ──→ Slash command triggers ──→ Claude delegates to qa-engineer subagent ──→ QA persona runs tests
```

### Example: QA Testing

**The subagent** (`agents/qa-engineer.md`) gives Claude a QA engineer persona:
- Thinks like a QA engineer
- Skeptical of "it works on my machine"
- Obsessed with edge cases
- Knows how to break things

**The slash command** (`commands/qa.md`) tells that persona what to do:
- Run test suites
- Check coverage
- Hunt for bugs
- Generate a report

**In practice:**

```
You: /qa src/components/DatePicker.tsx

Claude: [Delegates to qa-engineer subagent]

QA Engineer: Analyzing DatePicker.tsx for quality assurance...

        ## QA Report: DatePicker.tsx

        ### Test Results
        | Suite      | Passed | Failed | Skipped |
        |------------|--------|--------|---------|
        | Unit       | 12     | 2      | 0       |
        | Integration| 5      | 1      | 0       |

        ### Bugs Found
        1. **HIGH** - Mobile Safari doesn't trigger onChange
           - Steps: Open on iOS Safari, tap date
           - Expected: Date picker opens
           - Actual: Nothing happens
           - Fix: Add touchstart event listener

        2. **MEDIUM** - No keyboard navigation
           - Steps: Tab to field, press arrow keys
           - Expected: Navigate dates
           - Actual: No response

        ### Coverage Gaps
        - No tests for timezone handling
        - Missing accessibility tests
        - No tests for min/max date props
```

**Why this is powerful:**
- The QA *persona* knows how to think about testing
- The slash command gives it a *specific task*
- You get consistent, thorough QA every time

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
| `/qa` | Comprehensive QA testing (pairs with qa-engineer subagent) | Before shipping any feature |
| `/create-issue` | Quickly captures a bug or feature idea | When you notice something mid-coding |
| `/peer-review` | Evaluates feedback from another AI (GPT, Gemini, etc.) | Cross-checking AI suggestions |
| `/learning-opportunity` | AI explains concepts at 3 complexity levels | When you want to understand, not just copy |
| `/deslop` | Removes AI-generated code bloat from your branch | After AI writes too many comments/try-catches |

---

## The Subagents

| Agent | Persona | Best paired with |
|-------|---------|------------------|
| `qa-engineer` | Senior QA who breaks things before users do | `/qa` command |
| `mongodb-saas-architect` | Database specialist for SaaS monetization | Database design tasks |
| `stack-debugger-updater` | Next.js/Tailwind/TypeScript debugging expert | Debugging and dependency updates |

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
# Install commands
mkdir -p ~/.claude/commands
cp ~/Downloads/claude-slash-commands-main/commands/*.md ~/.claude/commands/

# Install subagents
mkdir -p ~/.claude/agents
cp ~/Downloads/claude-slash-commands-main/agents/*.md ~/.claude/agents/
```

**On Windows (PowerShell):**
```powershell
# Install commands
mkdir -Force "$env:USERPROFILE\.claude\commands"
copy "$env:USERPROFILE\Downloads\claude-slash-commands-main\commands\*.md" "$env:USERPROFILE\.claude\commands\"

# Install subagents
mkdir -Force "$env:USERPROFILE\.claude\agents"
copy "$env:USERPROFILE\Downloads\claude-slash-commands-main\agents\*.md" "$env:USERPROFILE\.claude\agents\"
```

5. **Done!** Open Claude Code and type `/help` to see your new commands.

### Option 2: Using Git

```bash
# Clone the repository
git clone https://github.com/the-prod-father/claude-slash-commands.git

# Install commands
mkdir -p ~/.claude/commands
cp claude-slash-commands/commands/*.md ~/.claude/commands/

# Install subagents
mkdir -p ~/.claude/agents
cp claude-slash-commands/agents/*.md ~/.claude/agents/

# Clean up
rm -rf claude-slash-commands
```

---

## Examples

### Example 1: The Full Workflow

Building a new feature from start to finish:

```
You: /explore

Claude: Please describe what you want to build...

You: I need to add login/logout to my React app

Claude: Let me ask some questions first...
        [Asks clarifying questions until fully understood]

You: /create-plan

Claude: # Authentication Implementation Plan
        **Overall Progress:** 0%
        - [ ] 🟥 Step 1: Set up auth client
        - [ ] 🟥 Step 2: Create login component
        ...

You: /execute

Claude: [Implements each step, updating progress]
        ✅ Step 1 complete
        🟨 Starting Step 2...

You: /qa src/auth/

Claude: [Delegates to QA engineer subagent]
        Running comprehensive QA on auth module...
        [Returns detailed test report]

You: /review

Claude: [Runs security/performance review]

You: /document

Claude: [Updates docs to match implementation]
```

### Example 2: Subagent + Slash Command Combo

You just built a feature and want thorough QA:

```
You: /qa src/components/PaymentForm.tsx

Claude: [Activates qa-engineer persona]

QA Engineer: Running QA analysis on PaymentForm.tsx...

        ## QA Report: PaymentForm

        ### Security Checks
        ✅ No PCI data logged
        ✅ Input sanitization present
        ⚠️  Card number not masked in state

        ### Test Results
        | Suite | Passed | Failed |
        |-------|--------|--------|
        | Unit  | 8      | 2      |

        ### Bugs Found
        1. **CRITICAL** - Card number visible in React DevTools
           - Fix: Use masked state for display

        2. **HIGH** - No rate limiting on submit
           - Fix: Add debounce/throttle

        ### Missing Test Coverage
        - Declined card scenarios
        - Network timeout handling
        - Accessibility (screen reader)
```

The QA engineer *persona* knows what to look for. The `/qa` *command* tells it exactly what to test.

### Example 3: Cleaning Up AI Slop

```
You: /deslop main

Claude: Found 87 lines of AI slop across 6 files...
        [Shows detailed report]

        Proceed with cleanup?

You: yes

Claude: ✅ Removed 87 lines
        Run `git diff` to review
```

---

## Why Subagents + Slash Commands > Either Alone

| Just Slash Commands | Just Subagents | Both Together |
|---------------------|----------------|---------------|
| Same persona every time | No structured tasks | Right persona + right task |
| Generic responses | Ad-hoc delegation | Consistent, specialized output |
| You define what | AI picks who | You control both |

**The combo gives you:**
1. **Consistency** - Same quality every time
2. **Specialization** - Expert personas for specific domains
3. **Control** - You decide who does what
4. **Speed** - No re-explaining context

---

## Which Projects Is This Good For?

| Project Type | Why it helps |
|--------------|--------------|
| **Side projects** | Keeps you organized when working alone |
| **Startups** | Move fast without breaking things |
| **Learning to code** | `/learning-opportunity` explains as you go |
| **Client work** | `/qa` and `/review` catch issues before delivery |
| **Open source** | `/document` keeps docs in sync |

**Languages:** JavaScript, Python, TypeScript, Go, Rust, etc.

**Frameworks:** React, Next.js, Django, Rails, FastAPI, whatever you're using.

---

## Customizing

### Slash Commands

Edit files in `~/.claude/commands/`:

```markdown
---
description: What shows up in /help
allowed-tools: Bash(git:*), Read, Edit
---

Your prompt here...
```

### Subagents

Edit files in `~/.claude/agents/`:

```markdown
---
name: your-agent-name
description: When to use this agent
tools: Bash, Read, Grep, Glob
model: sonnet
---

Your persona description...
```

---

## Troubleshooting

**Commands not showing up?**
- Files must be in `~/.claude/commands/` (note the dot)
- Files must end in `.md`
- Restart Claude Code

**Subagents not working?**
- Files must be in `~/.claude/agents/`
- Check the `description` field—Claude uses this to decide when to delegate

---

## Contributing

Got a command or subagent that works well for you? PRs welcome!

Ideas for contributions:
- New slash commands for common workflows
- Specialized subagents (DevOps engineer, Security analyst, etc.)
- Improvements to existing prompts

---

## Credits

Workflow based on [Zevi Arnovitz's AI Development Workflow](https://x.com/zaborwitz). Adapted and extended for Claude Code.

## License

MIT — use it however you want.

---

**Questions?** Open an issue or reach out on [Twitter/X](https://x.com/theprodfather).
