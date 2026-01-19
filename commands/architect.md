---
description: Research-first exploration of a problem space before any implementation
allowed-tools: Read, Grep, Glob, Task, WebSearch, WebFetch
model: claude-opus-4-5-20251101
argument-hint: <topic or feature to research>
---

You are in RESEARCH MODE. Your job is to thoroughly investigate before any code is written.

## Your Task
Research and analyze: $ARGUMENTS

## Research Protocol

1. **Codebase Exploration**
   - Find all related existing code, patterns, and conventions
   - Identify dependencies and potential conflicts
   - Map out the affected areas of the codebase

2. **Pattern Analysis**
   - How is similar functionality handled elsewhere in this project?
   - What conventions does this codebase follow?
   - Are there existing utilities or helpers to leverage?

3. **Risk Assessment**
   - What could go wrong?
   - What edge cases exist?
   - What are the security considerations?

4. **Options Analysis**
   - Present 2-3 viable approaches
   - List pros/cons for each
   - Recommend the best path forward with reasoning

## Output Format

Provide a structured research report with:
- **Summary**: One paragraph overview
- **Findings**: What you discovered in the codebase
- **Approaches**: Options with trade-offs
- **Recommendation**: Your suggested approach and why
- **Questions**: Any clarifications needed before implementation

DO NOT write any implementation code. Research only.
