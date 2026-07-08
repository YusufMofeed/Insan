# INSAN

> Version: 1.1
> Document: 03-project-structure.md
> Status: Approved

---

# Overview

This document defines how the Insan frontend codebase must be organized. It is mandatory for all future frontend development — no file is created, and no folder is introduced, outside the structure defined here without first updating this document.

This document defines architecture and organization rules only. It contains no implementation and generates no files.

---

# 1. Purpose

This structure exists to:

- Keep the code maintainable as the frontend grows.
- Avoid duplicated logic — one place owns each responsibility.
- Separate responsibilities — markup, styling, API communication, and UI behavior never mix in the same file.
- Allow future migration to a framework if needed (Section 11), without rewriting the backend contract or the overall mental model of the app.
- Make collaboration easier — anyone can predict where a given piece of logic lives without having to ask.

---

# 2. Root Structure

```
frontend/
│
├── index.html
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   └── pages/
│
├── js/
│   ├── app.js
│   ├── app/
│   ├── router/
│   ├── api/
│   ├── auth/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── utils/
│
├── pages/
│
└── docs/
```

## Folder Responsibilities

- **`index.html`** — the application's single top-level entry file (e.g. landing/redirect point). It is minimal by design; it does not contain page-specific markup.
- **`assets/`** — all static media, split by type:
  - `images/` — photography and illustrative imagery.
  - `icons/` — icon assets, kept visually consistent (Section 10).
  - `fonts/` — locally-hosted font files for the approved typefaces only (Section 10 and `02-ui-design-system.md`).
- **`css/`** — all stylesheets, organized by scope (Section 4).
- **`js/`** — all JavaScript, organized by architectural layer (Section 5).
- **`pages/`** — HTML entry points, one per route/view (Section 3). This is distinct from `js/pages/`, which holds the *JavaScript* that drives each of these HTML pages — the HTML structure and its behavior are deliberately kept in separate files, connected only by each page loading its corresponding script as an ES module.
- **`docs/`** — frontend architecture and rules documentation, starting with `01-frontend-principles.md`, `02-ui-design-system.md`, and this file.

---

# 3. HTML Pages Structure

Each page in `pages/` should:

- Have minimal HTML — only the structural markup needed for that view.
- Load required CSS — its global stylesheets plus its own page-specific stylesheet from `css/pages/`, if one exists.
- Load JavaScript modules — its corresponding script from `js/pages/`, loaded as an ES module.
- Avoid duplicated layouts — shared structural pieces (navbar, footer, page shell) are not copy-pasted between pages; they are assembled consistently by shared components/scripts referenced the same way on every page.

## Examples by Category

- **Authentication pages** — e.g. login, register. Minimal, focused, no navigation clutter, matching `02-ui-design-system.md`'s "minimal interactions" principle.
- **Public pages** — e.g. Journey listing, Journey detail. Accessible without authentication, optimized for readability (Section 2 of the design system).
- **User pages** — e.g. submitting a Voice, a user's own profile. Require an authenticated state (Section on `auth/` below).
- **Admin pages** — e.g. Journey management. Require an authenticated state with the appropriate role; the frontend only reflects role-based access already enforced by the backend (per `01-frontend-principles.md` Section 1) — it does not decide authorization on its own. **Current status:** the `/admin/*` route guard today only checks authentication, not role — a User can currently reach the route itself, even though the Navbar only links to it for Admins. Role-based route authorization is planned but not yet implemented (`05-api-integration.md` Section 15).

---

# 4. CSS Organization

| File / Folder | Responsibility |
|---|---|
| `variables.css` | Colors, typography, spacing, shadows, radius — every design token from `02-ui-design-system.md`, and nothing else. |
| `reset.css` | Browser normalization only. No project-specific styling. |
| `base.css` | Global HTML element styles (body, headings, links, lists) at their default appearance. |
| `layout.css` | Containers, grids, and page-level layout structures shared across pages. |
| `components.css` | Reusable UI components (buttons, cards, forms, navigation, feedback components — per `02-ui-design-system.md`). |
| `pages/` | Page-specific styles only — rules that apply to exactly one page and nowhere else. |

## Rules

- No page styles inside global files (`variables.css`, `reset.css`, `base.css`, `layout.css`, `components.css`) — if a rule only applies to one page, it belongs in `css/pages/`.
- No duplicate component styles — if a style is needed on more than one page, it is promoted to `components.css` (or `layout.css` if it's structural), not copied into each page's file.

---

# 5. JavaScript Architecture

## `app.js`

The application's single entry point (loaded as the page's only top-level `<script type="module">`). Its only job is calling `initApp()` from `app/App.js` below — no initialization logic lives in this file itself.

## `app/`

- **`App.js`** — owns application startup, in a fixed order: restore authentication state (`authState.initialize()`, per `auth/` below) **before** starting the router (`router.start()`), then register routes. This ordering matters — a page reload must know whether a valid session exists before the first route renders, or route guards and the Navbar would briefly (or until the next login) treat a logged-in user as logged-out.
- **`routes.js`** — the single place routes are registered. This is also where route guards are applied (see `auth/` below) — a route's real handler is wrapped with `requireAuth(...)` or `publicOnly(...)` at registration time, not inside the page itself.

## `router/`

- **`Router.js`** — URL matching and rendering only; it has no concept of authentication or a "protected route." Supports:
  - Static segments (`/journeys`).
  - Named param segments (`/journeys/:id`).
  - A trailing wildcard segment (`/admin/*`) — matches the base path itself and any path nested beneath it (e.g. `/admin`, `/admin/journeys`, `/admin/journeys/42`), so one route registration covers an entire section without registering each nested page individually.

## `api/`

Contains API communication modules — one module per backend resource, mirroring the backend's own controllers:

- `authApi.js`
- `journeyApi.js`
- `voiceApi.js`
- `memoryApi.js`
- `storyApi.js`
- `lifeEventApi.js`

### Rules

- Only communicate with the backend.
- No DOM manipulation.
- No UI logic.

## `auth/`

Responsible for:

- Authentication state (`authState.js`) — `isAuthenticated`, `currentUser` (decoded from the JWT), `initialize()`, `login()`, `logout()`.
- JWT handling and storage (`tokenStorage.js`) — the only place JWT storage/retrieval logic is allowed to live (per `01-frontend-principles.md` Section 8).
- Login/register/logout network calls (`authService.js`).
- Route guards (`routeGuards.js`) — `requireAuth(router, handler)`, `publicOnly(router, handler)`, and `resolvePostLoginRedirect()`. Written once here and reused by every protected or public-only route in `app/routes.js`, per `05-api-integration.md` Section 15.
- Deciding which Navbar links/actions apply to the current auth state and role (`navigation.js`) — `components/Navbar.js` stays a pure renderer of whatever links/actions it's given (Section 6 below); deciding what those are belongs here, not in the component or the layout that renders it.

## `layouts/`

Shared page shells composed from `components/` and `auth/` — never page-specific markup:

- **`MainLayout.js`** — Navbar + page content + Footer. Renders whatever `auth/navigation.js` returns for the Navbar; it does not decide auth state itself.
- **`AuthLayout.js`** — the minimal centered-card shell for Login/Register (no Navbar/Footer, per `04-pages-specification.md`).
- **`Footer.js`**.

## `components/`

Reusable UI components, for example:

- Navbar
- Card
- Modal
- Toast
- Loader
- Pagination

Components must be independent — a component does not reach into another component's internals, and does not assume which page it is used on.

## `pages/`

Page-specific JavaScript, one file per page in the root `pages/` folder, for example:

- `login.js`
- `journeys.js`
- `profile.js`
- `dashboard.js`

Responsible for:

- Loading data (via `api/` and `services/`).
- Connecting API responses with UI rendering (via `components/`).

A page script orchestrates; it does not itself implement API calls or reusable UI — it calls into the layers that do.

## `services/`

Shared application services, for example:

- Storage service (wraps `localStorage` access).
- Notification service (drives the Toast/Alert components).
- Validation service (shared client-side validation rules, per `01-frontend-principles.md` Section 1 — client-side only, never a substitute for backend validation).

## `utils/`

Small, reusable helpers with no dependencies on the rest of the app, for example:

- Formatters (dates, text truncation).
- Validators (pure functions used by the validation service or forms directly).
- Constants.

---

# 6. Component Rules

Every reusable component should:

- Have one responsibility.
- Receive data as parameters — a component is handed what it needs to render, it does not fetch its own data.
- Avoid direct dependency on global state.
- Be reusable — if a component can only ever be used in exactly one place, it likely doesn't need to be a separate component yet.

---

# 7. Naming Convention

| Category | Convention | Example |
|---|---|---|
| Files | camelCase | `journeyCard.js` |
| Classes | PascalCase | `JourneyCard` |
| Functions | camelCase | `journeyCard()` / `formatDate()` |
| CSS classes | kebab-case | `journey-card` |

Naming is consistent across all three layers for the same concept — a `JourneyCard` class, rendered by `journeyCard.js`, styled by `.journey-card`.

---

# 8. Dependency Rules

Allowed dependency direction:

```
pages
   ↓
services
   ↓
api
```

- `components/` should not call APIs directly — they receive data from the page/service layer that does.
- The `api/` layer should never access the DOM — it only sends requests and returns data.
- `utils/` should have no dependencies — it is called by any layer, but calls nothing itself.
- `auth/` sits alongside `services/` as a specialized service — pages and the `api/` layer may consult it (e.g. to attach the Authorization header, per `01-frontend-principles.md` Section 8), but it does not depend on `pages/` or `components/`.

Dependencies only ever point downward through this chain. A lower layer never imports from a higher one.

---

# 9. State Management

Since Vanilla JS is used, there is no external state library.

Rules:

- Local state lives inside the module that owns it (e.g. a page script holds its own page's state).
- `localStorage` is used only for required persistence (e.g. the JWT, per `auth/`'s responsibility) — not as a general-purpose state store.
- Avoid global mutable state. If two unrelated parts of the app appear to need the same piece of state, that is a sign that a shared service (Section 5) should own it, not that it should become a global variable.

---

# 10. Assets Rules

- **Images** — optimized formats (e.g. compressed JPEG/WebP over unoptimized PNG for photography), meaningful file names describing content, not `IMG_1234.jpg`-style names.
- **Icons** — consistent visual style (stroke width, size grid) across the whole set — icons are not mixed from different styles or sources.
- **Fonts** — only the approved fonts from `02-ui-design-system.md` (Inter, Cairo) — no ad-hoc font additions.

---

# 11. Future Framework Migration

The structure is deliberately organized so that a future migration from Vanilla JS to a framework (e.g. React or Vue) is possible without changing backend contracts.

This works because of the separation already enforced above:

- `api/` is framework-agnostic — it is plain fetch calls returning data, which any framework's data layer can call the same way.
- `components/` receive data as parameters (Section 6) and have no DOM-framework-specific assumptions baked into how they're structured — the same responsibility boundaries map directly onto framework components later.
- Business logic never lives in the frontend at all (per `01-frontend-principles.md`), so there is nothing framework-specific to "port" on that front — only presentation and interaction code.

A migration, when and if it happens, replaces the rendering layer (`components/`, `pages/`, HTML templates) while `api/`, `services/`, and `utils/` carry over with minimal change.

---

# 12. Forbidden Practices

Explicitly prohibited:

- Putting all JS in one file.
- Putting all CSS in one file.
- Inline scripts.
- Duplicated API calls.
- Duplicated components.
- Business logic inside UI files.
- Random folder creation.

---

# 13. Final Rule

Before creating any new file, the developer must know:

- Its responsibility.
- Its layer (Section 5 / Section 8).
- Why it exists.

No unnecessary files. If a new file's purpose can't be stated in one sentence that maps cleanly onto this document, it doesn't get created — this document gets updated first.
