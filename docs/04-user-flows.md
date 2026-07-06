# INSAN

Version: 1.0

Document: 04-user-flows.md

Status: Approved

---

# Overview

This document defines the main user interaction flows within the Insan platform.

Each flow represents a complete journey of how users interact with the system from entry to outcome.

---

# 1. Public Journey Browsing Flow

## Actor: Visitor

### Flow Description

A visitor accesses the platform to explore human journeys.

### Steps

1. User opens homepage
2. System displays featured journeys
3. User uses search bar or filters
4. System returns list of journeys
5. User selects a journey
6. System displays "Journey Page"
7. User explores:
   - Biography
   - Life Events
   - Memories
   - Voices
   - Stories
8. User may share the journey link

### Outcome

Visitor gains access to complete human story without authentication.

---

# 2. Search Flow

## Actor: Visitor / Registered User

### Steps

1. User enters search query
2. System processes query
3. System searches:
   - Name
   - City
   - Occupation
4. System returns ranked results
5. User selects a result
6. System opens Journey Page

### Outcome

User finds a specific human journey quickly and efficiently.

---

# 3. View Journey Flow

## Actor: Visitor / Registered User

### Steps

1. User opens Journey Page
2. System loads:
   - Basic Info (In Brief section)
   - Biography
   - Life Events
   - Dreams
   - Skills
   - Achievements
   - Stories
   - Voices
   - Memories (Images)
3. User scrolls through sections
4. User may interact with:
   - Share button
   - External links

### Outcome

User fully experiences the life story of a person in structured format.

---

# 4. User Registration Flow

## Actor: New User

### Steps

1. User clicks Register
2. User enters:
   - Full Name
   - Email
   - Password
3. System validates input
4. System creates user account
5. System returns JWT token
6. User is logged in

### Outcome

User becomes authenticated and can contribute content.

---

# 5. Login Flow

## Actor: Registered User

### Steps

1. User enters email and password
2. System validates credentials
3. System generates JWT token
4. User is authenticated
5. User accesses platform features

### Outcome

User gains access to contribution features.

---

# 6. Submit Voice (Testimony / Memory)

## Actor: Registered User

### Steps

1. User opens Journey Page
2. User clicks "Add Voice"
3. User enters:
   - Name (optional)
   - Relationship
   - Content
4. User submits form
5. System stores voice as:
   - Status = Pending
6. Moderator is notified (future enhancement)

### Outcome

Content is stored but not publicly visible until approved.

---

# 7. Moderation Flow

## Actor: Moderator

### Steps

1. Moderator opens dashboard
2. System displays pending submissions
3. Moderator selects a submission
4. Moderator reviews content
5. Moderator chooses:
   - Approve → content becomes public
   - Reject → content hidden
6. System updates status

### Outcome

Only verified respectful content becomes visible.

---

# 8. Create Journey Flow

## Actor: Admin

### Steps

1. Admin opens dashboard
2. Admin clicks "Create Journey"
3. Admin enters:
   - Personal Info
   - Biography
   - Initial Life Events
4. System validates data
5. System saves Journey
6. Journey becomes publicly visible

### Outcome

A new human journey is created in the system.

---

# 9. Edit Journey Flow

## Actor: Admin

### Steps

1. Admin selects journey
2. Admin edits fields
3. System validates changes
4. System updates database
5. Changes reflected immediately

### Outcome

Journey data remains up-to-date and accurate.

---

# 10. Delete Journey Flow

## Actor: Admin

### Steps

1. Admin selects journey
2. Admin confirms deletion
3. System removes or archives data
4. Related data is handled safely

### Outcome

Journey is removed from public view.

---

# 11. Sharing Flow

## Actor: Visitor / User

### Steps

1. User opens Journey Page
2. User clicks "Share"
3. System generates:
   - URL
   - Open Graph preview
4. User shares link externally

### Outcome

Journey becomes shareable across platforms.

---

# Core Principle

Every flow must be:

- Simple
- Traceable
- Respectful
- Deterministic

No hidden logic is allowed outside defined flows.