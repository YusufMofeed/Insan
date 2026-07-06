# INSAN

> Version: 1.0

> Document: PROJECT_PRINCIPLES.md

> Status: CORE RULESET (DO NOT VIOLATE)

---

# System Philosophy

Insan is not a data system.

It is a human memory preservation platform.

Every technical decision must serve one purpose:
preserving human dignity through structured storytelling.

---

# Core Principles

## 1. Human First

Every design, feature, and API must prioritize the human story over the data structure.

Data exists to serve meaning, not the opposite.

---

## 2. Respect by Design

All content must be displayed in a respectful, calm, and minimal manner.

No aggressive UI.
No sensational presentation.
No gamification.

---

## 3. Truth and Verification

No information is considered valid unless its verification status is defined.

Each piece of content must have one of:

- Verified
- Pending
- Rejected

Unverified content must be clearly labeled.

---

## 4. Simplicity Over Complexity

If a feature can be implemented in a simpler way without losing value, choose the simpler design.

Avoid over-engineering.

---

## 5. Extendability First

The system must be designed so that future features can be added without rewriting core components.

---

## 6. Separation of Concerns

Business logic must never exist in:

- Controllers
- UI components

It must exist in:

- Services
- Domain layer

---

## 7. No Direct Entity Exposure

Database entities must never be exposed directly through API responses.

DTOs must always be used.

---

## 8. Performance Awareness

Every endpoint must be designed with scalability in mind.

Avoid:

- N+1 queries
- unnecessary data loading
- large unpaginated responses

---

## 9. Secure by Default

All endpoints must assume:

- Unauthorized access is possible
- Input is untrusted
- Data must be validated

---

## 10. Content Integrity

User-generated content must pass moderation before being publicly visible.

---

## 11. Feature Discipline

No feature is allowed unless it:

- Serves the core vision
- Adds clear user value
- Does not increase system complexity unnecessarily

---

## 12. Minimal UI Principle

UI must not distract from content.

Design priority:

Content > Structure > Style > Effects

---

## 13. Consistent Naming

All naming must follow domain language:

- Journey (not Profile)
- Voices (not Testimonials)
- Memories (not Gallery)
- Life Events (not Timeline entries)

---

## 14. AI Usage Constraint

AI tools (Claude, Codex) are allowed only for:

- Code generation per task
- Boilerplate creation
- Refactoring
- Documentation support

They are NOT allowed to:

- Decide system architecture
- Change domain model
- Add new features without approval

---

## 15. Single Source of Truth

The `/docs` directory is the ONLY source of truth.

No assumptions are allowed outside documented specifications.

---

# Enforcement Rule

Any generated code or feature that violates this document is considered INVALID and must be refactored before acceptance.

---

# Final Statement

Insan is a system built to preserve human memory with dignity.

Technical excellence is required, but never at the cost of meaning.