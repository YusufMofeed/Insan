# INSAN

> Version: 1.1
> Document: 04-pages-specification.md
> Status: Approved

---

# Overview

This document defines every frontend page, its responsibility, and the API interactions it requires. It is the product specification reference for implementation — layouts, components, and user flows are defined here; markup and code are not.

Every page and component referenced here must be built using the component vocabulary defined in `02-ui-design-system.md` and the file organization defined in `03-project-structure.md`. This document does not redefine either.

## A note on API accuracy

Every endpoint referenced below was checked against the current backend implementation. Two pages in this specification (Search, Admin Dashboard) reference endpoints that **do not exist yet** on the backend — these are flagged explicitly where they occur, so implementation isn't blocked by a false assumption. Everywhere else, the endpoint, HTTP verb, and required role match the backend exactly as implemented today.

---

# 1. General Rules

- Every page must have a clear purpose — if a page's purpose can't be stated in one sentence, it needs to be split or reconsidered.
- Pages must reuse existing components from the design system (`02-ui-design-system.md`) — no page introduces a one-off visual pattern.
- Every page that loads data must handle all four of:
  - **Loading state** — skeleton loader or spinner, per `02-ui-design-system.md` Section 15.
  - **Empty state** — shown when a request succeeds but returns nothing.
  - **Error state** — shown when a request fails, in plain language, per `02-ui-design-system.md` Section 15.
  - **Success state** — the normal, populated view.

The frontend does not implement business rules. Every access restriction, validation rule, and workflow constraint noted below already exists on the backend — the frontend reflects it, it does not enforce it independently (per `01-frontend-principles.md` Section 1).

---

# 2. Public Pages

## Landing Page

**Purpose:** Introduce the Insan platform.

**Audience:** Visitors (unauthenticated).

**Sections:**

- Hero section
- Platform explanation
- Featured journeys
- Call to action
- Footer

**Components:** Navbar (public), Hero section, Journey cards, Footer.

**API:** No dedicated "featured journeys" endpoint currently exists. Until one is added, the Featured Journeys section can be populated from `GET /api/journeys` (e.g. the first page of results) rather than a purpose-built endpoint.

**Design:** Simple, emotional introduction. Human-focused, per `02-ui-design-system.md` Section 1 — this page carries the platform's tone more than any other.

---

## Login Page

**Purpose:** Authenticate existing users.

**Fields:** Email, Password.

**Components:** Form, Input fields, Button, Error message (Alert).

**API:** `POST /api/auth/login`

**Access:** Unauthenticated visitors only — an already-authenticated user is redirected to `/journeys` instead of seeing this page (`05-api-integration.md` Section 15, `publicOnly` guard).

**States:**

- Loading — button enters its loading state (`02-ui-design-system.md` Section 8) while the request is in flight.
- Invalid credentials — the backend returns `401`; shown as a form-level error, not a field-level one (the backend does not indicate which field was wrong), displayed inline on the page — no redirect on failure.
- Success — the returned JWT is stored via the `auth/` module (`03-project-structure.md`), and the user is redirected: to the `?redirect=` path that sent them to `/login` if a route guard put them there (`05-api-integration.md` Section 15), otherwise to `/journeys`.

---

## Register Page

**Purpose:** Create a new account.

**Fields:** Full name, Email, Password.

**API:** `POST /api/auth/register`

**Access:** Unauthenticated visitors only — same `publicOnly` guard as the Login page (`05-api-integration.md` Section 15).

**Rules:**

- Show validation errors returned by the backend (`400`, field-level) as well as basic client-side validation before submission (required fields, minimum password length) per `01-frontend-principles.md` Section 1.
- Duplicate email returns `409` from the backend — shown as a specific, actionable error ("An account with this email already exists").
- No automatic login — the backend does not issue a token on registration.
- Redirect to the Login page after success.

---

## Search Page

**Purpose:** Find journeys and content.

**Components:** Search input, Filters, Result cards.

**API:** **No `GET /search` endpoint exists on the backend today.** `GET /api/journeys` supports `search`, `city`, and `occupation` query parameters, which cover journey search; there is currently no unified search across Voices/Memories/Stories. Until a dedicated search endpoint is added, this page should be implemented against `GET /api/journeys`'s query parameters and treated as "Journey Search" rather than platform-wide search — or deferred until the backend adds the endpoint.

**States:** Empty results, Loading, Error — per Section 1.

---

# 3. Journey Pages

## Journeys Feed Page

**Purpose:** Display public journeys.

**Components:** Navbar, Search (query params, per above), Journey cards, Pagination.

**API:** `GET /api/journeys` — supports `page`, `pageSize`, `search`, `city`, `occupation`; response includes `data`, `totalCount`, `page`, `pageSize`, driving the Pagination component directly.

**Card contains:** Title/name, creator, location if available, summary (Biography excerpt).

---

## Journey Details Page

**Purpose:** The main profile page of a Journey. This is the core page of the platform.

**Layout — Header:** Profile image/avatar, person information, basic details (name, city, occupation, dates).

**Sections:**

1. Overview
2. Voices
3. Memories
4. Stories
5. Life Timeline

**Components:** Journey header, Tabs/navigation, Voice cards, Memory gallery, Story cards, Timeline.

**API:**

- `GET /api/journeys/{id}` — Journey header/overview. Note: the response currently returns only the Journey's own fields (name, city, occupation, biography, dates) — it does **not** include nested `voices`/`memories`/`stories`/`lifeEvents` arrays, so each section below is populated by its own separate call, not by this one.
- `GET /api/journeys/{id}/voices` — Voices section (public listing returns only approved Voices by default).
- `GET /api/journeys/{id}/memories` — Memories section.
- `GET /api/journeys/{id}/stories` — Stories section.
- `GET /api/journeys/{id}/lifeevents` — Life Timeline section.

Each section loads and handles its own loading/empty/error state independently — a failure in one section (e.g. Memories) must not block the others from rendering.

---

# 4. Voice Pages

## Add Voice Page

**Purpose:** Allow authenticated users to add a Voice (testimony) to a Journey.

**Access:** User, Admin, Moderator.

**Fields:** Author name, Relationship, Content.

**API:** `POST /api/voices` (flat endpoint — the target Journey's ID is submitted in the request body, not the URL).

**States:**

- Pending message — on success, the UI communicates that the Voice was submitted and is pending moderation (it will not appear publicly yet), per the platform's moderation workflow.
- Success.
- Error.

---

## Voice Moderation Page

**Purpose:** Moderators review submitted Voices.

**Access:** Moderator, Admin.

**Actions:** Approve, Reject.

**API:** `POST /api/voices/{id}/approve`, `POST /api/voices/{id}/reject`

This page needs a way to list Pending Voices to act on; the public `GET /api/journeys/{id}/voices` endpoint returns only approved Voices by default, so a moderation-scoped listing view is a backend dependency to confirm before implementation — flagged here rather than assumed.

---

# 5. Memory Pages

## Memory Gallery

**Purpose:** Display a Journey's Memories.

**Layout:** Grid gallery, per `02-ui-design-system.md` Section 5/14.

**Components:** Image cards, Caption, Date.

**API:** `GET /api/journeys/{id}/memories`

---

## Add Memory Page

**Access:** User, Admin, Moderator.

**Fields:** Image (URL), Caption.

**API:** `POST /api/journeys/{id}/memories`

Note: the backend currently accepts a Memory as a `url` + `caption` pair — there is no file-upload endpoint. Until one exists, this page collects an image URL rather than an uploaded file.

---

# 6. Story Pages

## Stories Section

**Purpose:** Display written Stories.

**Components:** Story cards, Preview.

**API:** `GET /api/journeys/{id}/stories`

---

## Add Story Page

**Access:** User, Admin, Moderator.

**Fields:** Title, Content, Author name.

**API:** `POST /api/journeys/{id}/stories`

---

# 7. Life Events Pages

## Timeline View

**Purpose:** Display important events chronologically.

**Components:** Timeline, Event cards, Images.

**API:** `GET /api/journeys/{id}/lifeevents` (ordered by `DisplayOrder`, ascending, as returned by the backend).

---

## Add/Edit Event Page

**Fields:** Title, Description, Event date, Display order, Image (URL).

**API and access differ by action — the backend enforces two different rules here, not one:**

- **Add** — `POST /api/journeys/{id}/lifeevents`. Access: **User, Admin, Moderator.**
- **Edit** — `PUT /api/lifeevents/{id}`. Access: **Admin only.**

This page should either present Add and Edit as the same form with different submit behavior gated by the current user's role (hiding/disabling Edit for non-Admins on events they didn't create), or be split into two access-gated views — but it must not apply a single "Admin only" gate to both actions, which would incorrectly block Users and Moderators from adding events.

---

# 8. User Pages

## Profile Page

**Purpose:** Display the current user's information.

**Access:** Authenticated users only (`requireAuth` guard, `05-api-integration.md` Section 15).

**Components:** Avatar, Name, Contributions.

**API:** There is currently no `GET /users/me` or equivalent "current user" endpoint on the backend. This page's data (beyond what's already in the decoded JWT — user ID and role) is a backend dependency to confirm before implementation.

---

## Settings Page

**Purpose:** User account settings.

**Possible sections:** Personal information, Password management.

Note: no account-update or password-change endpoints currently exist on the backend. This page is a placeholder for future scope, not implementable against the current API.

---

# 9. Admin Pages

## Admin Dashboard

**Purpose:** Platform management overview.

**Access:** Admin, by design — but the current frontend route guard on `/admin/*` only checks authentication, not role (`05-api-integration.md` Section 15). Role-based route authorization is planned, not yet implemented.

**Components:** Statistics cards, Management links.

**API:** **No `GET /api/admin/dashboard` endpoint exists on the backend today.** This page cannot be implemented against real data until that endpoint exists; it can be scaffolded with its Management links (to Journey Management and Content Moderation below, which do have real endpoints) while the statistics cards remain a documented backend dependency.

---

## Journey Management

**Access:** Admin.

Admin can:

- Create Journey — `POST /api/journeys`
- Edit Journey — `PUT /api/journeys/{id}`
- Delete Journey — `DELETE /api/journeys/{id}`

---

## Content Moderation

**Access:** Admin (and Moderator for Voice moderation specifically, per Section 4).

Admin can manage, via the existing per-resource endpoints (there is no single unified "moderation" endpoint):

- **Voices** — approve/reject (Section 4).
- **Memories** — delete (`DELETE /api/memories/{id}`, Admin only).
- **Stories** — delete (`DELETE /api/stories/{id}`, Admin only).
- **Life Events** — edit/delete (`PUT` / `DELETE /api/lifeevents/{id}`, Admin only).

---

# 10. Navigation Structure

**Public navigation:** Home, Journeys, Search, Login.

**Authenticated navigation:** Home, My Profile, Contribute, Logout.

**Admin navigation:** Dashboard, Management sections (Journey Management, Content Moderation).

Each tier is additive — the authenticated navbar extends the public one, and the admin navbar extends the authenticated one, rather than being three unrelated navigation sets (per `02-ui-design-system.md` Section 11).

## Current implementation

The Navbar is built dynamically on every render by `js/auth/navigation.js`, from live authentication state (`authState.isAuthenticated`, `authState.currentUser.role`) rather than being three static, hand-authored variants:

- **Unauthenticated:** Home, Journeys — Login, Register.
- **Authenticated (any role):** Home, Journeys, Profile — Logout.
- **Authenticated, role Admin:** the above, plus an Admin link.

This is the current, working subset of the fuller navigation structure described above — Search and a dedicated Admin Dashboard link are not yet built (Sections 2 and 9) — and will grow toward it as those pages are implemented, not replace it.

---

# 11. Mobile Navigation

Mobile bottom navigation, similar in pattern to modern social apps (Instagram, Threads).

Keep minimal — the same principle as desktop navigation (Section 10), adapted to a compact, thumb-reachable layout rather than a shrunk-down desktop navbar. Content beyond the essential set of destinations belongs in a secondary menu, not the bottom bar itself.

---

# 12. Page Implementation Order

Recommended implementation order:

1. Authentication pages (Login, Register)
2. Main layout / Navbar
3. Journeys Feed page
4. Journey Details page
5. Voice feature (Add Voice, Voice Moderation)
6. Memories (Gallery, Add Memory)
7. Stories (Section, Add Story)
8. Timeline (Life Events view, Add/Edit)
9. Profile
10. Admin pages

This order prioritizes pages with confirmed, working backend endpoints first; Search, Admin Dashboard, Profile, and Settings each carry a noted backend dependency above and should not block earlier work.
