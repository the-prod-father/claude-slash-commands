# Changelog Format Guide

## Categories

Use these categories in this order:

### Added
New features or capabilities.
```markdown
### Added
- User authentication with OAuth support
- Dark mode toggle in settings
- Export to CSV functionality
```

### Changed
Changes to existing functionality.
```markdown
### Changed
- Improved search performance by 50%
- Updated dashboard layout for better mobile experience
- Renamed `getUserData` to `fetchUser` for consistency
```

### Deprecated
Features that will be removed in future versions.
```markdown
### Deprecated
- `legacyAuth()` - Use `authenticate()` instead
- XML export format - Will be removed in v3.0
```

### Removed
Features that were removed.
```markdown
### Removed
- Legacy API endpoints (/api/v1/*)
- Internet Explorer support
```

### Fixed
Bug fixes.
```markdown
### Fixed
- Login form not validating email format
- Memory leak in image processor
- Crash when uploading files > 10MB
```

### Security
Security-related changes.
```markdown
### Security
- Updated dependencies to patch CVE-2024-1234
- Added rate limiting to login endpoint
- Fixed XSS vulnerability in comment rendering
```

## Writing Good Entries

### Be Specific
```markdown
# BAD
- Fixed bug

# GOOD
- Fixed crash when saving empty form (#234)
```

### Be User-Focused
```markdown
# BAD
- Refactored UserService class

# GOOD
- Improved login speed by 40%
```

### Include References
```markdown
# GOOD
- Added OAuth support (#123)
- Fixed memory leak (reported by @user)
- Security patch for CVE-2024-5678
```

### Group Related Changes
```markdown
### Added
- User profile page
  - Avatar upload
  - Bio editing
  - Social links
```

## Version Numbering

Follow [Semantic Versioning](https://semver.org):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

## Example Complete Changelog

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- French language support (#456)

## [2.1.0] - 2024-02-01

### Added
- Bulk export functionality (#445)
- Keyboard shortcuts for common actions (#448)

### Changed
- Redesigned settings page for better organization

### Fixed
- Date picker showing wrong month on first open (#450)

## [2.0.0] - 2024-01-15

### Added
- Complete redesign with new UI framework
- Real-time collaboration features
- Plugin system for extensions

### Changed
- **BREAKING**: API endpoints now require authentication
- **BREAKING**: Renamed `config.json` to `config.yaml`

### Removed
- **BREAKING**: Removed deprecated v1 API
- Legacy theme support

### Security
- Implemented Content Security Policy headers

## [1.5.2] - 2024-01-01

### Fixed
- Critical security fix for file upload vulnerability
- Session not persisting after browser restart

### Security
- Patched dependency vulnerabilities (npm audit fix)
```
