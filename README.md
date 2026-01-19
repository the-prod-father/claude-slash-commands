# Claude Code Slash Commands

A collection of slash commands for [Claude Code](https://claude.ai/code) that create a structured AI development workflow.

These commands are checkpoints in a development process—from exploration to implementation to review.

## The Workflow

```
/explore → /create-plan → /execute → /review → /document
```

1. **Explore** - Understand the problem before writing code
2. **Create Plan** - Generate a tracked execution plan
3. **Execute** - Implement step by step
4. **Review** - Comprehensive code review
5. **Document** - Update docs after changes

Plus utility commands for specific situations.

## Commands

| Command | Description |
|---------|-------------|
| `/explore` | Understand the problem before writing any code |
| `/create-plan` | Generate a markdown execution plan with status tracking |
| `/execute` | Implement the plan step by step |
| `/review` | Code review with security, performance, and maintainability focus |
| `/peer-review` | Evaluate findings from another AI model's code review |
| `/create-issue` | Capture bugs/features fast while mid-development |
| `/document` | Update documentation after code changes |
| `/learning-opportunity` | Shift AI into teaching mode for deeper understanding |
| `/deslop` | Remove AI-generated code slop from your branch |

## Installation

### Personal Commands (all your projects)

Copy the commands to your personal Claude commands directory:

```bash
mkdir -p ~/.claude/commands
cp commands/*.md ~/.claude/commands/
```

### Project Commands (shared with team)

Copy to your project's `.claude/commands/` directory:

```bash
mkdir -p .claude/commands
cp commands/*.md .claude/commands/
```

## Usage

Once installed, use any command by typing it in Claude Code:

```
/explore
```

Commands with arguments:

```
/deslop main
/review src/components/
```

View all available commands:

```
/help
```

## Customization

Each command is a markdown file. Edit them to match your workflow:

- Change the frontmatter (`description`, `allowed-tools`, etc.)
- Modify the prompt content
- Add project-specific instructions

See [Claude Code docs](https://docs.anthropic.com/en/docs/claude-code) for full slash command syntax.

## Credits

Based on [Zevi's AI Development Workflow](https://x.com/zaborwitz).

## License

MIT - Use however you want.
