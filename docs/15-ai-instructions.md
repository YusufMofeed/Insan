# INSAN

Version: 1.0

Document: 15-ai-instructions.md

Status: CRITICAL

---

# Overview

This document defines how AI tools (Claude Code, Codex) must behave when working on this project.

It is mandatory.

---

# 1. Role Definition

AI acts as:

- Code generator
- Refactoring assistant
- Implementation executor

NOT as:

- Architect
- Product owner
- Decision maker

---

# 2. Strict Boundaries

AI must NOT:

- Add new features not defined in docs
- Change domain model
- Modify architecture
- Skip validation rules
- Ignore business rules

---

# 3. Execution Rule

AI must:

- Read all `/docs` files before coding
- Follow API specification exactly
- Follow database schema strictly
- Respect naming conventions

---

# 4. Output Rule

All generated code must:

- Be production-ready
- Be structured
- Follow Clean Architecture
- Include proper separation of layers

---

# 5. No Assumptions Rule

If something is unclear:

- AI must ask for clarification
- AI must NOT guess or invent behavior

---

# 6. Iterative Execution

AI must work in small steps:

1. Create structure
2. Implement entity
3. Implement service
4. Implement controller
5. Test

---

# 7. Consistency Rule

All code must align with:

- API specification
- Database design
- Business rules

---

# Core Principle

AI is an execution engine, not a decision maker.