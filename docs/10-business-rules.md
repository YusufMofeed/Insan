# INSAN

Version: 1.0

Document: 10-business-rules.md

Status: Approved

---

# Overview

This document defines the business rules of the Insan platform.

These rules govern how data is created, processed, moderated, and displayed.

They ensure consistency across the entire system.

---

# 1. Core Entity Rule

## BR-1: Journey is the Root Entity

- Every record in the system must be linked to a Journey
- No standalone data is allowed without a Journey reference
- Deleting a Journey affects all dependent data

---

# 2. Content Visibility Rules

## BR-2: Moderation Requirement

- Voices (testimonies) are NOT publicly visible by default
- Only "Approved" voices are visible to users
- Pending and Rejected content must be hidden from public API

---

## BR-3: Public Content

The following are publicly visible without authentication:

- Journeys (read-only)
- Approved Voices
- Memories
- Stories

---

# 3. Data Creation Rules

## BR-4: Journey Creation

- Only Admin can create Journeys
- All Journey data must include required identity fields
- Partial or empty journeys are not allowed

---

## BR-5: Voice Submission

- Only registered users can submit voices
- Voices must always start with status = Pending
- System must prevent empty submissions

---

# 4. Update Rules

## BR-6: Controlled Updates

- Only Admin can modify Journey core data
- Users cannot directly modify existing Voices or Memories
- Updates must preserve historical integrity

---

# 5. Deletion Rules

## BR-7: Soft Delete Strategy

- Journeys should be soft deleted (archived)
- Voices may be soft deleted for moderation reasons
- Memories may be hard deleted if required by Admin

---

# 6. Search Rules

## BR-8: Search Scope

- Search applies only to:
  - Full Name
  - City
  - Occupation

- Search must not include hidden or rejected content

---

# 7. Media Rules

## BR-9: Media Storage

- All media must be stored externally
- Only URLs are saved in the database
- No binary data allowed in system storage

---

# 8. Authentication Rules

## BR-10: Access Control

- Visitors can only read public data
- Registered users can submit content
- Moderators can approve or reject content
- Admin has full control

---

# 9. Data Integrity Rules

## BR-11: Referential Integrity

- Every Voice, Memory, Story must reference a valid Journey
- Orphan records are not allowed

---

## BR-12: Consistency Rule

- Approved content cannot be edited into pending state
- Status changes must follow strict workflow

---

# 10. Moderation Rules

## BR-13: Approval Workflow

Voice lifecycle:

Pending → Approved OR Rejected

- No direct publishing allowed
- Only moderators can change status

---

# 11. Naming Rules

## BR-14: Domain Language Enforcement

The system must consistently use:

- Journey (not Profile)
- Voices (not Testimonials)
- Memories (not Gallery)
- Life Events (not Timeline entries)

---

# 12. API Behavior Rules

## BR-15: Response Consistency

- All API responses must follow standard format
- Errors must never expose internal system details

---

# 13. Pagination Rules

## BR-16: List Control

- All list endpoints must support pagination
- Default page size must be enforced

---

# 14. Security Rules

## BR-17: Input Safety

- All inputs must be validated
- Malicious or malformed data must be rejected

---

## BR-18: Token Security

- JWT tokens must expire
- Tokens must not be stored in plain text anywhere

---

# 15. System Behavior Rules

## BR-19: Fail-Safe Behavior

- System must not crash on invalid input
- Errors must be handled gracefully

---

## BR-20: Read-Only Public Access

- Public users can never modify data
- Only authorized roles can perform write operations

---

# Core Principle

If a behavior is not explicitly defined in these rules, the system must NOT assume it.