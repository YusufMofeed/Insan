# INSAN

Version: 1.0

Document: 08-database-design.md

Status: Approved

---

# Overview

This document defines the database design of the Insan platform.

The design follows a relational model optimized for PostgreSQL / SQL Server and mapped via Entity Framework Core.

---

# 1. Core Design Principles

- Normalize data to reduce duplication
- Use clear foreign key relationships
- Avoid storing computed or derived data
- Store media as URLs only (no binary data)
- Ensure scalability for large datasets

---

# 2. Main Entities

## 2.1 User

Represents system users (Admin, Moderator, Registered User).

### Fields

- Id (GUID)
- FullName
- Email
- PasswordHash
- Role (Enum: Visitor, User, Moderator, Admin)
- CreatedAt

---

## 2.2 Journey (Core Entity)

Represents a human life journey.

### Fields

- Id (GUID)
- FullName
- Nickname (optional)
- BirthDate (optional)
- MartyrdomDate (optional)
- City
- Occupation
- Biography
- CreatedBy (UserId)
- CreatedAt
- UpdatedAt

---

## 2.3 LifeEvent

Represents a milestone in a journey.

### Fields

- Id (GUID)
- JourneyId (FK)
- Title
- Description
- EventDate
- ImageUrl (optional)
- DisplayOrder

---

## 2.4 Voice

Represents a testimony or memory submitted by users.

### Fields

- Id (GUID)
- JourneyId (FK)
- AuthorName
- Relationship
- Content
- Status (Pending / Approved / Rejected)
- CreatedAt

---

## 2.5 Memory

Represents media files (images).

### Fields

- Id (GUID)
- JourneyId (FK)
- Url
- Type (Image)
- Caption
- UploadedAt

---

## 2.6 Story

Represents written stories about a journey.

### Fields

- Id (GUID)
- JourneyId (FK)
- Title
- Content
- AuthorName
- CreatedAt

---

## 2.7 Achievement

Represents accomplishments of a person.

### Fields

- Id (GUID)
- JourneyId (FK)
- Title
- Description

---

## 2.8 Dream

Represents aspirations.

### Fields

- Id (GUID)
- JourneyId (FK)
- Description

---

## 2.9 Skill

Represents skills or abilities.

### Fields

- Id (GUID)
- JourneyId (FK)
- Name

---

## 2.10 AuditLog (Optional but Recommended)

Tracks system actions.

### Fields

- Id (GUID)
- UserId
- Action
- EntityName
- EntityId
- Timestamp

---

# 3. Relationships

## Journey Relations

- Journey 1 → Many LifeEvents
- Journey 1 → Many Voices
- Journey 1 → Many Memories
- Journey 1 → Many Stories
- Journey 1 → Many Achievements
- Journey 1 → Many Dreams
- Journey 1 → Many Skills

---

## User Relations

- User 1 → Many Journeys (CreatedBy)
- User 1 → Many Voices (Author)

---

# 4. Deletion Strategy

## Soft vs Hard Delete

- Journeys: Soft Delete (recommended)
- Voices: Soft Delete (moderation safety)
- Memories: Hard Delete allowed (admin only)

---

# 5. Indexing Strategy

Indexes must be created for:

- Journey.FullName
- Journey.City
- Journey.Occupation
- Voice.Status
- LifeEvent.EventDate

---

# 6. Data Integrity Rules

- No orphan records allowed
- Foreign keys must be enforced
- Cascade delete only where safe (e.g., Journey → LifeEvents)

---

# 7. Storage Rules

- Images stored externally (Cloudinary or equivalent)
- Database stores only URLs
- No file binaries stored in database

---

# 8. Enum Definitions

## Role

- Visitor
- User
- Moderator
- Admin

---

## Voice Status

- Pending
- Approved
- Rejected

---

## Memory Type

- Image (v1 only)

---

# 9. Entity Design Philosophy

- Journey is the root aggregate
- All other entities depend on Journey
- No entity exists independently without a Journey

---

# 10. Future Extensions (Out of Scope for MVP)

- Comments system
- Reactions / likes
- Full-text search engine
- Media video/audio support
- Multi-language support

---

# Core Principle

The database is designed around one concept:

> A Journey is the center of the system, and everything else describes it.