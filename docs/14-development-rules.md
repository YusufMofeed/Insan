# INSAN

Version: 1.0

Document: 14-development-rules.md

Status: Approved

---

# Overview

This document defines how development must be executed.

It ensures consistency between AI tools and human developers.

---

# 1. Incremental Development

- Build feature by feature
- Never implement multiple modules at once
- Each feature must be testable independently

---

# 2. No Overengineering

- Keep solutions simple
- Avoid premature optimization
- Use CRUD-first approach

---

# 3. AI Collaboration Rule

- Claude/Codex must only implement what is explicitly defined
- No feature invention allowed
- No architectural changes without approval

---

# 4. Testing Rule

- Each endpoint must be testable via Swagger or Postman
- Basic validation tests are required

---

# 5. Commit Discipline

- One feature per commit
- Clear commit messages:
  - "Add Journey CRUD"
  - "Implement Voice moderation"

---

# 6. Dependency Rule

- Avoid unnecessary packages
- Only use required and stable libraries

---

# 7. Debugging Rule

- Use logging instead of console debugging
- Errors must be traceable

---

# Core Principle

Development must be controlled, predictable, and incremental.