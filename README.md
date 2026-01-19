# Claude Code Slash Commands + Subagents

**Stop prompting AI from scratch every time.** This repo contains reusable commands AND specialized AI personas that work together to give you consistent, high-quality results.

## What's In This Repo?

```
├── commands/          # Slash commands (the tasks)
├── agents/            # Core subagents (the personas)
│   └── niche/         # Specialized subagents for specific domains
```

**Think of it this way:**
- **Subagent** = WHO does the work (the persona)
- **Slash command** = WHAT they do (the task)

---

## The Power Combo

When you combine a subagent with a slash command:

```
/qa src/auth/ ──→ triggers qa-engineer subagent ──→ QA persona runs comprehensive tests
```

The **persona** knows how to think about the problem.
The **command** tells it exactly what to do.

**Result:** Consistent, expert-level output every time.

---

## Core Workflow

| Command | Subagent | What happens |
|---------|----------|--------------|
| `/explore` | `architect` | Analyzes problem, asks questions, maps dependencies |
| `/create-plan` | `architect` | Designs phased implementation plan |
| `/execute` | `developer` | Implements code following the plan |
| `/review` | `reviewer` | Security, performance, correctness review |
| `/qa` | `qa-engineer` | Comprehensive testing and bug hunting |
| `/document` | `technical-writer` | Updates docs to match code |
| `/learning-opportunity` | `mentor` | Explains concepts at 3 depth levels |

### Utility Commands

| Command | Description |
|---------|-------------|
| `/create-issue` | Quick bug/feature capture mid-development |
| `/peer-review` | Evaluate feedback from another AI model |
| `/deslop` | Remove AI-generated code bloat |

---

## The Subagents

### Core Team

| Agent | Role | Pairs with |
|-------|------|------------|
| `architect` | Thinks before building, designs solutions | `/explore`, `/create-plan` |
| `developer` | Ships clean, working code | `/execute` |
| `reviewer` | Catches problems before they ship | `/review` |
| `qa-engineer` | Breaks things before users do | `/qa` |
| `technical-writer` | Keeps docs accurate and useful | `/document` |
| `mentor` | Helps you truly understand concepts | `/learning-opportunity` |

### Niche Specialists (in `agents/niche/`)

| Agent | Specialty |
|-------|-----------|
| `mongodb-saas-architect` | MongoDB schemas for SaaS monetization |
| `stack-debugger-updater` | Next.js/Tailwind/TypeScript debugging |

---

## Example: Full Feature Workflow

```
You: /explore
     I need to add Stripe payments to my app

Claude: [architect persona activates]
        Let me analyze your codebase and ask some questions...
        - What payment flows do you need? (one-time, subscription, both)
        - Do you have existing user auth?
        - What's your database?
        [asks until fully understood]

You: /create-plan

Claude: [architect continues]
        # Stripe Integration Plan
        **Progress:** 0%

        ## Phase 1: Setup
        - [ ] Install Stripe SDK
        - [ ] Add environment variables
        - [ ] Create webhook endpoint

        ## Phase 2: Checkout Flow
        - [ ] Create checkout session API
        - [ ] Build payment UI component
        ...

You: /execute

Claude: [developer persona activates]
        Implementing Phase 1...
        ✅ Installed @stripe/stripe-js
        ✅ Created lib/stripe.ts
        🟨 Setting up webhook handler...

You: /qa src/payments/

Claude: [qa-engineer persona activates]
        ## QA Report: Payment Module

        ### Test Results
        | Suite | Passed | Failed |
        |-------|--------|--------|
        | Unit  | 12     | 1      |

        ### Bug Found
        **HIGH** - Webhook doesn't verify Stripe signature
        - Risk: Anyone could fake payment confirmations
        - Fix: Add signature verification middleware

You: /review

Claude: [reviewer persona activates]
        ### Security Issues
        - **CRITICAL**: API key exposed in client bundle
          Fix: Move to server-side only

        ### Looks Good
        - Proper error handling
        - Clean separation of concerns

You: /document

Claude: [technical-writer persona activates]
        Updated CHANGELOG.md:
        ### Added
        - Stripe payment integration
        - Checkout flow with success/cancel handling
        - Webhook endpoint for payment confirmation
```

---

## Installation

### Quick Start (Mac/Linux)

```bash
# Clone
git clone https://github.com/the-prod-father/claude-slash-commands.git
cd claude-slash-commands

# Install commands
mkdir -p ~/.claude/commands
cp commands/*.md ~/.claude/commands/

# Install core subagents
mkdir -p ~/.claude/agents
cp agents/*.md ~/.claude/agents/

# (Optional) Install niche subagents
cp agents/niche/*.md ~/.claude/agents/

# Clean up
cd .. && rm -rf claude-slash-commands
```

### Quick Start (Windows PowerShell)

```powershell
# Clone
git clone https://github.com/the-prod-father/claude-slash-commands.git
cd claude-slash-commands

# Install commands
mkdir -Force "$env:USERPROFILE\.claude\commands"
copy commands\*.md "$env:USERPROFILE\.claude\commands\"

# Install core subagents
mkdir -Force "$env:USERPROFILE\.claude\agents"
copy agents\*.md "$env:USERPROFILE\.claude\agents\"

# (Optional) Install niche subagents
copy agents\niche\*.md "$env:USERPROFILE\.claude\agents\"

# Clean up
cd .. ; Remove-Item -Recurse claude-slash-commands
```

### Manual Install

1. Download ZIP from GitHub
2. Copy `commands/*.md` → `~/.claude/commands/`
3. Copy `agents/*.md` → `~/.claude/agents/`
4. Restart Claude Code
5. Type `/help` to see your commands

---

## Why Both?

| Just Commands | Just Subagents | Both Together |
|---------------|----------------|---------------|
| Same persona every time | No structured tasks | Right persona + right task |
| Generic responses | Ad-hoc delegation | Consistent, specialized output |
| You define what | AI picks who | You control both |

---

## Customizing

### Commands (`~/.claude/commands/`)

```markdown
---
description: Shows in /help
allowed-tools: Bash, Read, Edit
---

Your prompt here...
```

### Subagents (`~/.claude/agents/`)

```markdown
---
name: agent-name
description: When Claude should use this agent
tools: Bash, Read, Grep, Glob
model: sonnet
---

Your persona description...
```

---

## Contributing

PRs welcome! Ideas:

- New slash commands for common workflows
- New subagents (DevOps, Security, UX, etc.)
- Improvements to prompts
- Examples and use cases

---

## Credits

Workflow inspired by [Zevi Arnovitz's AI Development Workflow](https://x.com/zaborwitz).

## License

MIT — use however you want.

---

**Questions?** Open an issue or DM [@theprodfather](https://x.com/theprodfather)
