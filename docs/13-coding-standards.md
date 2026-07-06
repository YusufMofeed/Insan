# INSAN

Version: 1.0

Document: 13-coding-standards.md

Status: Approved

---

# Overview

This document defines coding standards for the Insan backend (ASP.NET Core).

All developers and AI tools must strictly follow these rules.

---

# 1. General Code Style

- Use PascalCase for classes and methods
- Use camelCase for variables
- Use meaningful names only
- Avoid abbreviations

---

# 2. Clean Code Principles

- One function = one responsibility
- Functions must be short and readable
- Avoid deep nesting (max 3 levels)

---

# 3. Architecture Rules

- Controllers must NOT contain business logic
- Business logic must exist in Services
- Data access must be in Repositories

---

# 4. DTO Rules

- Never expose database entities directly
- Always use DTOs for API responses
- Separate Request DTOs and Response DTOs

---

# 5. Async Rules

- All database calls must be async
- Use async/await consistently

---

# 6. Error Handling

- Use centralized exception handling middleware
- Never return raw exceptions to client

---

# 7. Naming Conventions

- Entity: Journey, Voice, Memory
- Service: JourneyService
- Repository: JourneyRepository
- Controller: JourneyController

---

# 8. Validation

- Validate all inputs at API layer
- Reject invalid requests early

---

# Core Principle

Code must be readable by humans first, machines second.