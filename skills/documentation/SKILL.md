---
name: documentation
description: Use when updating documentation, writing changelogs, or creating technical docs. Provides doc standards and templates.
version: 1.0.0
---

# Documentation Skill

Knowledge for writing and maintaining technical documentation. Read the code before trusting existing docs.

## Core Principle

**Documentation should match reality, not aspirations.**

Always verify against actual code before updating docs.

## Documentation Types

### README.md
```markdown
# Project Name

One-line description of what this does.

## Quick Start

Minimum steps to get running:

1. Install: `npm install`
2. Configure: Copy `.env.example` to `.env`
3. Run: `npm run dev`

## Features

- Feature 1 - brief description
- Feature 2 - brief description

## Documentation

- [API Reference](docs/api.md)
- [Configuration](docs/config.md)
- [Contributing](CONTRIBUTING.md)

## License

MIT
```

### CHANGELOG.md

Follow [Keep a Changelog](https://keepachangelog.com) format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- New feature X for doing Y (#123)

### Changed
- Updated Z to handle edge case (#124)

### Fixed
- Bug where A caused B (#125)

### Security
- Patched vulnerability in dependency C

### Removed
- Deprecated feature Q

## [1.2.0] - 2024-01-15

### Added
- User authentication with OAuth
- Password reset flow

### Fixed
- Session timeout not redirecting to login
```

### API Documentation
```markdown
## Create User

Creates a new user account.

**Endpoint:** `POST /api/users`

**Headers:**
| Header | Required | Description |
|--------|----------|-------------|
| Authorization | Yes | Bearer token |
| Content-Type | Yes | application/json |

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

**Response:** `201 Created`
```json
{
  "id": "usr_123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Errors:**
| Code | Description |
|------|-------------|
| 400 | Invalid request body |
| 409 | Email already exists |
| 401 | Unauthorized |
```

## Documentation Style Guide

### Principles

1. **Concise** - Brevity over completeness
2. **Practical** - Examples over theory
3. **Accurate** - Verified against code
4. **Scannable** - Headers, bullets, tables
5. **Current** - No outdated information

### Writing Rules

- Use present tense ("Returns" not "Will return")
- Use active voice ("The function returns" not "The value is returned by")
- Use second person sparingly ("You can configure..." is OK)
- Be direct (no "basically", "simply", "just")
- Include code examples for anything non-obvious

### What to Include

- ✅ How to install/setup
- ✅ How to use (with examples)
- ✅ Configuration options
- ✅ Common problems and solutions
- ✅ API reference for public interfaces

### What to Skip

- ❌ Implementation details that may change
- ❌ Obvious code comments
- ❌ Internal architecture (unless for contributors)
- ❌ Future plans (use issues/roadmap instead)

## Update Process

1. **Check git diff** - What files changed?
2. **Read the code** - Understand actual behavior
3. **Compare to docs** - What's now wrong or missing?
4. **Update minimally** - Only what's necessary
5. **Verify accuracy** - Does the doc match the code?

## Detailed References

- [Changelog Format](references/changelog.md) - Full changelog guidelines
- [Style Guide](references/style.md) - Writing style rules
