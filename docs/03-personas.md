# INSAN

> Version: 1.0

> Document: 03-personas.md

> Status: Approved

---

# Overview

This document defines the primary user types (personas) for the Insan platform.

Each persona represents a real interaction pattern with the system and directly influences UI, API design, and permissions.

---

# 1. Visitor (Public User)

## Description

A visitor is any user who accesses the platform without authentication.

This is the most common user type.

---

## Goals

- Browse human journeys
- Read life stories
- Search for individuals
- View memories and voices
- Share journeys with others

---

## Needs

- Fast and simple browsing experience
- Clean and respectful presentation
- Easy search functionality
- No barriers to access

---

## Restrictions

- Cannot create or edit content
- Cannot submit voices or memories
- Cannot access dashboard features

---

## Design Implications

- Home page must be publicly accessible
- Journey pages must be SEO optimized
- Search must be available without login

---

# 2. Registered User

## Description

A registered user is a verified account holder who can contribute content to the platform.

---

## Goals

- Submit voices (stories, testimonies, memories)
- Suggest edits or corrections
- Contribute to preserving journeys
- Share personal memories respectfully

---

## Needs

- Simple content submission forms
- Clear moderation feedback (approved / rejected)
- Transparent contribution history

---

## Restrictions

- Cannot publish content directly
- Cannot modify core journey data
- All submissions require moderation approval

---

## Design Implications

- Submission system must support "Pending Approval" state
- User dashboard (simple) must show submission status

---

# 3. Moderator (Admin Role - Simplified)

## Description

A moderator is responsible for ensuring content quality, accuracy, and respectfulness.

This is a simplified administrative role.

---

## Goals

- Review submitted voices and memories
- Approve or reject content
- Ensure respectful representation of journeys
- Maintain data integrity

---

## Needs

- Simple moderation dashboard
- Clear approve/reject actions
- Visibility of submission context
- Ability to edit minor content issues

---

## Restrictions

- No system configuration access
- No architectural control
- No advanced analytics required

---

## Design Implications

- Moderation queue system is required
- Status workflow must be implemented (Pending → Approved → Rejected)

---

# 4. Administrator (System Owner)

## Description

A minimal privileged role responsible for system management.

In this version, admin capabilities are intentionally limited.

---

## Goals

- Manage users
- Manage journeys (create/update/delete)
- Oversee moderators
- Maintain system stability

---

## Needs

- Simple admin panel
- CRUD access to all core entities
- User role assignment

---

## Restrictions

- No complex CMS functionality
- No business intelligence dashboard in MVP
- No feature toggling system in this version

---

## Design Implications

- Role-based authorization required
- Admin endpoints separated from public API

---

# Cross-Persona Interaction Rules

- Visitors consume content only
- Registered users contribute content
- Moderators validate content
- Admin maintains system structure

---

# Core Principle

Every action in the system must be traceable to a persona and their intent.

No feature should exist without a clearly defined user purpose.