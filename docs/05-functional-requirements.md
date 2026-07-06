# INSAN

Version: 1.0

Document: 05-functional-requirements.md

Status: Approved

---

# Overview

This document defines the functional requirements of the Insan platform.

Each requirement is derived from previously defined user flows.

The system is designed as a RESTful CRUD-based API with moderation support.

---

# 1. Authentication Module

## FR-1: User Registration

- System shall allow users to register
- Required fields:
  - Full Name
  - Email
  - Password
- System shall validate email uniqueness
- System shall hash passwords before storage
- System shall return JWT token upon success

---

## FR-2: User Login

- System shall authenticate users using email and password
- System shall return JWT token on success
- System shall reject invalid credentials

---

## FR-3: Role-Based Access

System shall support the following roles:

- Visitor (default)
- User
- Moderator
- Admin

System shall restrict access based on role permissions.

---

# 2. Journey Module (Core Entity)

## FR-4: Create Journey

- Admin shall create a journey
- System shall store:
  - Personal Information
  - Biography
  - Initial Life Events
- System shall validate required fields

---

## FR-5: Read Journeys

- System shall allow public access to journeys
- System shall support:
  - List all journeys
  - Get journey by ID

---

## FR-6: Update Journey

- Admin shall update journey data
- System shall validate input before update
- System shall persist changes immediately

---

## FR-7: Delete Journey

- Admin shall delete or archive journeys
- System shall ensure related data handling

---

# 3. Life Events Module

## FR-8: Add Life Event

- System shall allow adding events to a journey
- Each event includes:
  - Title
  - Description
  - Date
  - Image (optional)
  - Order

---

## FR-9: Retrieve Life Events

- System shall return events ordered by sequence or date

---

## FR-10: Update/Delete Life Events

- Admin shall modify or remove events

---

# 4. Voices Module (Testimonials)

## FR-11: Submit Voice

- Registered users shall submit voices
- Each voice includes:
  - Name (optional)
  - Relationship
  - Content
- Default status: Pending

---

## FR-12: Moderate Voices

- Moderator shall:
  - Approve voice
  - Reject voice
- Only approved voices are public

---

## FR-13: Retrieve Voices

- System shall return only approved voices publicly

---

# 5. Memories Module (Media)

## FR-14: Upload Memory

- Admin shall upload images (and future media types)
- System shall store:
  - URL
  - Type
  - Caption

---

## FR-15: Retrieve Memories

- System shall return all media linked to a journey

---

# 6. Search Module

## FR-16: Search Journeys

- System shall allow search by:
  - Name
  - City
  - Occupation
- System shall return matching results

---

# 7. Sharing Module

## FR-17: Generate Shareable Link

- Each journey shall have a unique URL
- System shall support Open Graph metadata

---

# 8. Moderation Module

## FR-18: Review Submissions

- Moderator shall view pending voices
- Moderator shall approve or reject submissions

---

# 9. System Constraints

## FR-19: Performance

- API responses shall be optimized for fast loading
- Large datasets shall support pagination (future enhancement)

---

## FR-20: Security

- All inputs shall be validated
- Authentication required for protected endpoints
- Passwords shall be hashed

---

## FR-21: Data Integrity

- Deleted journeys shall handle related data safely
- No orphaned records allowed

---

# Core Principle

The system is intentionally designed as a simple CRUD-based architecture with moderation layer.

Complex business logic is avoided in Version 1.