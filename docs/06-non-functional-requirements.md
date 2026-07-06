# INSAN

Version: 1.0

Document: 06-non-functional-requirements.md

Status: Approved

---

# Overview

This document defines the non-functional requirements of the Insan platform.

These requirements describe how the system should behave in terms of performance, security, scalability, and reliability.

---

# 1. Performance Requirements

## NFR-1: Response Time

- API responses should not exceed 500ms for standard queries under normal load
- Search operations should be optimized for fast retrieval

---

## NFR-2: Pagination

- Large datasets (journeys, voices, memories) must support pagination
- Default page size should be defined (e.g., 10–20 items)

---

## NFR-3: Efficient Queries

- Avoid unnecessary database calls
- Use indexing for frequently searched fields:
  - Name
  - City
  - Occupation

---

# 2. Scalability Requirements

## NFR-4: Horizontal Growth Ready

- System architecture should allow scaling backend services independently
- Database design should support future growth in data volume

---

## NFR-5: Modular Design

- Each module (Journeys, Voices, Memories) should be independent
- Future features must not require rewriting core modules

---

# 3. Security Requirements

## NFR-6: Authentication Security

- Use JWT for authentication
- Tokens must expire after a defined period
- Passwords must be hashed using a secure algorithm (e.g., bcrypt)

---

## NFR-7: Authorization

- Role-based access control (RBAC) must be enforced
- Endpoints must validate user roles before execution

---

## NFR-8: Input Validation

- All user inputs must be validated on server side
- Prevent SQL Injection and XSS attacks
- Reject malformed or malicious requests

---

## NFR-9: Data Protection

- Sensitive data (passwords, tokens) must never be exposed in API responses
- System must not expose internal database structure

---

# 4. Reliability Requirements

## NFR-10: System Stability

- System should handle invalid inputs without crashing
- All exceptions must be handled gracefully

---

## NFR-11: Logging

- System must log:
  - Errors
  - Authentication attempts
  - Moderation actions
- Logs should be structured for debugging

---

# 5. Maintainability Requirements

## NFR-12: Clean Code

- Code must follow SOLID principles
- Business logic must be separated from controllers

---

## NFR-13: Readability

- All functions must be readable and self-explanatory
- Naming must follow domain language (Journey, Voices, Memories)

---

## NFR-14: Documentation

- All APIs must be documented using Swagger/OpenAPI
- Code must include basic comments where necessary

---

# 6. Availability Requirements

## NFR-15: System Availability

- System should aim for 99% uptime during deployment phase
- Downtime should be minimal and controlled

---

# 7. Data Requirements

## NFR-16: Data Integrity

- No orphan records should exist in the database
- Relationships must be enforced via foreign keys

---

## NFR-17: Backup Readiness (Future)

- System should be designed to support future backup strategies

---

# 8. UX Performance Requirements

## NFR-18: Fast Perceived Loading

- Pages should load progressively
- Skeleton loading states are recommended

---

## NFR-19: Mobile Responsiveness

- UI must be responsive across devices
- Mobile-first design is preferred

---

# Core Principle

Non-functional requirements are not optional.

They define the quality of the system, not its features.