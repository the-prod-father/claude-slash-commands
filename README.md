# Claude Code Slash Commands + Subagents + Skills

**Stop prompting AI from scratch every time.** This repo contains three powerful features that work together:

| Feature | What it is | Purpose |
|---------|------------|---------|
| **Slash Commands** | Task prompts | WHAT to do |
| **Subagents** | AI personas | WHO does it |
| **Skills** | Knowledge libraries | HOW to do it well |

## How They Work Together

```
/review src/auth/
   │
   ▼
┌─────────────────┐
│  Slash Command  │  ← "Review this code"
│   /review       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Subagent     │  ← "I'm a senior code reviewer"
│    reviewer     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Skill       │  ← Security checklists, performance patterns
│   code-review   │
└────────┬────────┘
         │
         ▼
   Expert output
```

- **Command** triggers the task
- **Subagent** brings the right mindset
- **Skill** provides deep knowledge

**Result:** Consistent, expert-level output every time.

---

## When to Use What

| Situation | Use |
|-----------|-----|
| Quick task, just need a prompt | Slash Command alone |
| Need expert thinking | Subagent alone |
| Need reference material | Skill alone |
| Structured expert task | Command + Subagent |
| Expert with deep knowledge | Subagent + Skill |
| Maximum power | Command + Subagent + Skill |

### Examples

**Just a command:**
```
/create-issue
```
Quick bug capture. No special persona needed.

**Just a subagent:**
```
"Debug this authentication error"
```
Claude auto-picks the right expert.

**Command + Subagent:**
```
/qa src/payments/
```
QA engineer persona runs comprehensive tests.

**Full stack (Command + Subagent + Skill):**
```
/review src/auth/
```
→ Reviewer persona activates
→ code-review skill loads (security checklists, performance patterns)
→ Thorough, consistent review

---

## What's Included

### Slash Commands

| Command | Pairs with | What it does |
|---------|------------|--------------|
| `/explore` | architect | Analyze problem, ask questions |
| `/create-plan` | architect | Design phased implementation |
| `/execute` | developer | Implement the plan |
| `/review` | reviewer + code-review skill | Security/performance review |
| `/qa` | qa-engineer + testing skill | Comprehensive testing |
| `/document` | technical-writer + documentation skill | Update docs |
| `/learning-opportunity` | mentor | Explain concepts deeply |
| `/create-issue` | - | Quick bug/feature capture |
| `/peer-review` | - | Evaluate other AI's feedback |
| `/deslop` | - | Remove AI code bloat |

### Subagents

| Agent | Role | Has Skill |
|-------|------|-----------|
| `architect` | Thinks before building | - |
| `developer` | Ships clean code | - |
| `reviewer` | Catches problems | `code-review` |
| `qa-engineer` | Breaks things before users | `testing` |
| `technical-writer` | Keeps docs accurate | `documentation` |
| `mentor` | Explains concepts | - |

### Skills

| Skill | Provides | Used by |
|-------|----------|---------|
| `code-review` | Security checklists, performance patterns | `reviewer` |
| `testing` | Test strategies, bug report formats | `qa-engineer` |
| `documentation` | Doc standards, changelog format | `technical-writer` |

### Niche Subagents (in `agents/niche/`)

| Agent | Specialty |
|-------|-----------|
| `mongodb-saas-architect` | MongoDB schemas for SaaS |
| `stack-debugger-updater` | Next.js/Tailwind debugging |

---

## Installation

### Quick Start (Mac/Linux)

```bash
git clone https://github.com/the-prod-father/claude-slash-commands.git
cd claude-slash-commands

# Install everything
mkdir -p ~/.claude/commands ~/.claude/agents ~/.claude/skills
cp commands/*.md ~/.claude/commands/
cp agents/*.md ~/.claude/agents/
cp -r skills/* ~/.claude/skills/

# (Optional) Niche subagents
cp agents/niche/*.md ~/.claude/agents/

# Clean up
cd .. && rm -rf claude-slash-commands
```

### Quick Start (Windows PowerShell)

```powershell
git clone https://github.com/the-prod-father/claude-slash-commands.git
cd claude-slash-commands

# Install everything
mkdir -Force "$env:USERPROFILE\.claude\commands"
mkdir -Force "$env:USERPROFILE\.claude\agents"
mkdir -Force "$env:USERPROFILE\.claude\skills"
copy commands\*.md "$env:USERPROFILE\.claude\commands\"
copy agents\*.md "$env:USERPROFILE\.claude\agents\"
Copy-Item -Recurse skills\* "$env:USERPROFILE\.claude\skills\"

# Clean up
cd .. ; Remove-Item -Recurse claude-slash-commands
```

---

## Example: Complete Feature Workflow

```
You: /explore
     I need to add Stripe payments

Claude: [architect activates]
        Let me analyze your codebase...
        Questions:
        - One-time payments, subscriptions, or both?
        - What's your auth setup?
        - Database?

You: One-time only, using Supabase auth

Claude: Got it. A few more questions...
        [continues until fully understood]

You: /create-plan

Claude: [architect continues]
        # Stripe Integration Plan
        **Progress:** 0%

        ## Phase 1: Setup
        - [ ] Install Stripe SDK
        - [ ] Configure environment variables
        - [ ] Create webhook endpoint

        ## Phase 2: Checkout
        - [ ] Create checkout session API
        - [ ] Build payment UI
        ...

You: /execute

Claude: [developer activates]
        Implementing Phase 1...
        ✅ Installed @stripe/stripe-js
        ✅ Created lib/stripe.ts
        🟨 Building webhook handler...

You: /qa src/payments/

Claude: [qa-engineer activates + testing skill loads]

        ## QA Report: Payment Module

        ### Test Results
        | Suite | Passed | Failed |
        |-------|--------|--------|
        | Unit  | 15     | 2      |

        ### Bugs Found
        1. **HIGH** - Webhook doesn't verify signature
           - Risk: Payment confirmation can be faked
           - Fix: Add stripe.webhooks.constructEvent()

        2. **MEDIUM** - No idempotency on checkout
           - Risk: Duplicate charges possible
           - Fix: Add idempotencyKey

        ### Coverage Gaps
        - No tests for failed payment scenarios
        - Missing refund flow tests

You: /review src/payments/

Claude: [reviewer activates + code-review skill loads]

        ## Code Review

        ### Security Issues
        - **CRITICAL** - API key in client bundle
          Line: src/payments/checkout.ts:5
          Fix: Move to server-side API route

        ### Performance
        - ✅ No N+1 queries
        - ⚠️ Consider caching product prices

        ### What's Good
        - Clean error handling
        - Types are accurate

You: /document

Claude: [technical-writer activates + documentation skill loads]

        Updated CHANGELOG.md:

        ## [Unreleased]

        ### Added
        - Stripe payment integration
        - Checkout flow with success/cancel pages
        - Webhook endpoint for payment confirmation

        Updated README.md:
        - Added STRIPE_SECRET_KEY to environment variables
        - Added payment setup instructions
```

---

## Directory Structure

```
~/.claude/
├── commands/           # Slash commands
│   ├── explore.md
│   ├── create-plan.md
│   ├── execute.md
│   ├── review.md
│   ├── qa.md
│   ├── document.md
│   └── ...
│
├── agents/             # Subagents
│   ├── architect.md
│   ├── developer.md
│   ├── reviewer.md      ← has skills: code-review
│   ├── qa-engineer.md   ← has skills: testing
│   ├── technical-writer.md ← has skills: documentation
│   ├── mentor.md
│   └── niche/
│       ├── mongodb-saas-architect.md
│       └── stack-debugger-updater.md
│
└── skills/             # Knowledge libraries
    ├── code-review/
    │   ├── SKILL.md
    │   └── references/
    │       ├── security.md
    │       └── performance.md
    ├── testing/
    │   ├── SKILL.md
    │   └── references/
    │       ├── patterns.md
    │       └── bug-hunting.md
    └── documentation/
        ├── SKILL.md
        └── references/
            ├── changelog.md
            └── style.md
```

---

## Customizing

### Add a Slash Command

Create `~/.claude/commands/my-command.md`:

```markdown
---
description: What it does (shows in /help)
allowed-tools: Bash, Read, Edit
---

Your prompt here...
```

### Add a Subagent

Create `~/.claude/agents/my-agent.md`:

```markdown
---
name: my-agent
description: When to use this agent
tools: Bash, Read, Grep
model: sonnet
skills: my-skill  # optional
---

Your persona description...
```

### Add a Skill

Create `~/.claude/skills/my-skill/SKILL.md`:

```markdown
---
name: my-skill
description: When to use this knowledge
version: 1.0.0
---

# My Skill

Core knowledge here...

## References

See [detailed guide](references/guide.md) for more.
```

---

## Contributing

PRs welcome! Ideas:

- New slash commands
- New subagents (DevOps, Security, UX, etc.)
- New skills with reference material
- Improvements to prompts

---

## Credits

Workflow inspired by [Zevi Arnovitz's AI Development Workflow](https://x.com/zaborwitz).

## License

MIT — use however you want.

---

**Questions?** Open an issue or DM [@theprodfather](https://x.com/theprodfather)
