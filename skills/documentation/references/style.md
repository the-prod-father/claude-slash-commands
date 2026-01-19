# Documentation Style Guide

## Voice and Tone

### Be Direct
```markdown
# BAD
You might want to consider configuring the timeout setting.

# GOOD
Configure the timeout in `config.js`.
```

### Use Active Voice
```markdown
# BAD
The data is validated by the server.

# GOOD
The server validates the data.
```

### Use Present Tense
```markdown
# BAD
The function will return an array.

# GOOD
The function returns an array.
```

### Avoid Filler Words
Remove: basically, simply, just, very, really, actually, quite

```markdown
# BAD
Just simply run the install command.

# GOOD
Run the install command.
```

## Formatting

### Headings
- Use sentence case: "Getting started" not "Getting Started"
- Keep short: 3-5 words
- Use H2 for main sections, H3 for subsections

### Code
- Inline code for: file names, function names, variables, commands
- Code blocks for: multi-line code, terminal commands, configuration

```markdown
Use `npm install` to install dependencies.

To configure the app:

```javascript
const config = {
  port: 3000,
  debug: true
};
```
```

### Lists
- Use bullets for unordered items
- Use numbers for sequential steps
- Keep items parallel in structure

```markdown
# BAD
- Installing dependencies
- You should configure the settings
- Run the tests

# GOOD
- Install dependencies
- Configure settings
- Run tests
```

### Tables
Use for structured data with multiple attributes:

```markdown
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| port | number | 3000 | Server port |
| debug | boolean | false | Enable debug logs |
```

## Structure

### Put Important Info First
Lead with what users need most:

```markdown
# Install

npm install my-package

# Usage

const pkg = require('my-package');
pkg.doThing();

# API Reference
[details...]
```

### Use Progressive Disclosure
Start simple, add complexity:

```markdown
## Quick Start
Minimum viable setup.

## Configuration
Common options.

## Advanced Usage
Edge cases and power features.

## API Reference
Complete details.
```

### Include Examples
Every non-obvious feature needs an example:

```markdown
## Authentication

Pass your API key in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.example.com/data
```
```

## Common Patterns

### Installation Section
```markdown
## Installation

```bash
npm install package-name
```

Or with yarn:

```bash
yarn add package-name
```
```

### Configuration Section
```markdown
## Configuration

Create a `config.js` file:

```javascript
module.exports = {
  apiKey: process.env.API_KEY,
  timeout: 5000,
};
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| API_KEY | Yes | Your API key |
| DEBUG | No | Enable debug mode |
```

### Troubleshooting Section
```markdown
## Troubleshooting

### Error: "Connection refused"

**Cause:** The server isn't running or is on a different port.

**Solution:**
1. Check the server is running: `npm run server`
2. Verify the port in `config.js` matches

### Error: "Invalid token"

**Cause:** The API key is missing or incorrect.

**Solution:**
1. Check `.env` contains `API_KEY`
2. Regenerate your key at dashboard.example.com
```

## What Makes Good Documentation

✅ **Accurate** - Matches actual behavior
✅ **Complete** - Covers common use cases
✅ **Current** - Updated with code changes
✅ **Findable** - Good headings and structure
✅ **Testable** - Examples that work

❌ **Avoid**
- Documenting internal implementation
- Promising future features
- Outdated screenshots
- Broken links
- Untested examples
