# INSAN

> Version: 1.0
> Document: 06-page-implementation-rules.md
> Status: Approved

---

# Overview

This document defines the implementation rules for every frontend page, present and future. It does not redefine anything already established in `01-frontend-principles.md`, `02-ui-design-system.md`, `03-project-structure.md`, `04-pages-specification.md`, or `05-api-integration.md` — it exists to make the rules those documents imply explicit and consistent, so every page is built the same way regardless of who builds it or when.

This document defines rules only. It contains no implementation and generates no files.

---

# 1. Page Responsibility

A page file (`js/pages/*.js`) has exactly one job: create and manage its own page content.

A page must:

- Only create and manage its own page content.
- Must not contain Navbar, Footer, or global layout logic — that belongs to `js/layouts/` (`03-project-structure.md` Section 5).
- Must not handle routing — route registration and guarding belong to `js/app/routes.js` (Section 9 below).
- Must not directly call `fetch` or the apiClient — all backend communication goes through the service layer (Section 4 below, `05-api-integration.md` Section 21).
- Must use existing components where possible (Section 7 below) rather than reimplementing UI already covered by `js/components/`.

## Example structure

```
js/pages/
 └── ExamplePage.js
```

A page module exports one factory function (e.g. `createExamplePage()`) that returns the page's content as a `Node` — nothing more. It does not export layout, routing, or state-management concerns; those live in their own layers.

---

# 2. DOM Manipulation Rules

How a page builds its own content is constrained the same way for every page, so the codebase reads as one system rather than one style per author:

- Prefer `document.createElement()` over `innerHTML` — every existing page (`HomePage.js`, `LoginPage.js`, `RegisterPage.js`, `JourneysPage.js`) builds its DOM this way; `innerHTML` is not used anywhere in the frontend today, including for content that looks like plain text, since it also reopens the door to injecting unescaped content (`05-api-integration.md` Section 17).
- Use event listeners (`addEventListener`) instead of inline `onclick`/`onsubmit` HTML attributes — inline handlers mix behavior into markup and cannot be attached to a `Node` built via `createElement` in the first place.
- Avoid direct `document.querySelector()` calls outside the page root when possible — a page should look up elements it created itself (e.g. `form.querySelector(...)` on a form the page just built), not reach into the wider document. Querying the global `document` couples a page to markup it doesn't own (Section 1) and can silently match the wrong element if another page or component happens to use the same selector.
- Pages should return a single root element — one `Node` from the page's factory function, matching Section 1's "content as a `Node`" rule. Everything the page renders is a descendant of that one root, so `MainLayout`/`AuthLayout` (Section 3) and the Router (Section 9) always have exactly one thing to attach or discard.
- Remove event listeners when components are destroyed, if necessary — listeners attached to a page's own root (or its descendants) are discarded automatically when the Router replaces the page on navigation (`Router.js`'s `render()` clears the root element, and detached nodes are garbage-collected along with their listeners). This rule matters only for listeners attached to something outside that root — `window`, `document`, or a shared singleton container such as `Toast`'s (`components/Toast.js`) — which the Router's render cycle does not clean up on its own, so a page must remove those explicitly before it is replaced.

---

# 3. Layout Rules

Two layouts exist, and a page uses exactly one of them:

## Public/application pages — `MainLayout`

- Navbar
- Main content
- Footer

## Authentication pages — `AuthLayout`

- Minimal, focused form experience
- No main navigation

## Rule

Pages receive their layout from `routes.js`, not create layouts internally. A page function returns only its own content; the route registration wraps that content in `createMainLayout({ router, content })` or `createAuthLayout({ ... })` as appropriate. A page must never import and call a layout factory on itself — that decision belongs to routing, matching how every existing page (`HomePage.js`, `LoginPage.js`, `RegisterPage.js`, `JourneysPage.js`) is already wired.

---

# 4. Data Flow Architecture

The expected future architecture, once the service layer exists:

```
Page
 ↓
Service layer
 ↓
apiClient
 ↓
Backend API
```

Pages must not communicate directly with the backend. A page calls a function from `js/services/`; the service calls the relevant `js/api/` module, which calls `apiClient` (`05-api-integration.md` Section 3). No layer is skipped, and no page imports `apiClient` or a `js/api/` module directly.

Until the service layer for a given page's data exists, that page uses mock data inside the page file rather than reaching around this chain (`04-pages-specification.md`, and the precedent set by `JourneysPage.js`).

---

# 5. State Management Rules

Where a piece of state lives is decided by who else needs it, not by convenience:

- Keep state local to the page whenever possible — a page's own in-progress form values, toggle states, or fetched-but-not-yet-shared data are private variables inside that page's module, not exposed elsewhere (`03-project-structure.md` Section 9).
- Avoid global variables — nothing is attached to `window` or a module-level mutable export unless it is one of the specific, deliberate exceptions below. An unrelated page or component reaching into another page's state is exactly the coupling this document exists to prevent.
- Authentication state belongs only to `authState.js` — no page, component, or service holds its own copy of `isAuthenticated` or the current user; they read `authState`'s getters directly. This is the same rule already stated for route guards (Section 10): a page may read `authState.currentUser` to display information, but it never maintains a parallel copy of it.
- Shared application state should live in dedicated service modules (`js/services/`, Section 4) — if two unrelated pages need the same piece of state, that is the signal to introduce a service that owns it, not to promote a page-local variable to global scope (`03-project-structure.md` Section 9).

---

# 6. Page State Handling

Any page depending on remote data must support:

- Loading state
- Error state
- Empty state
- Success state

per `01-frontend-principles.md` and `04-pages-specification.md` Section 1.

## Reuse

- `Loading` component (`createLoadingContainer`, `createSpinner`)
- `ErrorState` component (`createErrorState`)
- `EmptyState` component (`createEmptyState`)
- `Toast` component (`showToast`), when appropriate — for transient success/error feedback outside the page's main content area, not as a replacement for the states above (`05-api-integration.md` Section 6).

A page must not invent its own loading spinner, error message markup, or empty-state placeholder — these four states are always built from the existing components, never duplicated per page.

---

# 7. Component Usage Rules

Prefer existing reusable components:

- Button
- Navbar
- Card
- Input
- Modal
- Toast
- Loading
- EmptyState
- ErrorState
- Table
- Badge
- ConfirmDialog

## Create a new component only when

- It is reused — needed by more than one page or context.
- It has a clear, single responsibility.
- It does not belong only to one page.

If a piece of UI is specific to exactly one page, it stays as a private helper function inside that page's file (e.g. `JourneysPage.js`'s `createJourneyCard()`) — it does not become a new file in `js/components/` until a second page actually needs it (`03-project-structure.md` Section 6).

---

# 8. CSS Rules

Every page has its own stylesheet:

```
css/pages/
 └── page-name.css
```

## Rules

- No inline styles.
- No styles inside JS files.
- Use `variables.css` tokens only — no hardcoded color, spacing, radius, shadow, or type value (`variables.css`, per `02-ui-design-system.md`).
- Avoid duplicate styles — a rule needed on more than one page is promoted to `components.css` or `layout.css`, not copied between page stylesheets (`03-project-structure.md` Section 4).
- Global styles belong in the global CSS files (`variables.css`, `reset.css`, `base.css`, `layout.css`, `components.css`) — never in a page's own stylesheet.

Each new page stylesheet is linked from `index.html` alongside the existing ones (this is a single-page app, so every page's CSS loads up front rather than per-HTML-file).

---

# 9. Routing Rules

Pages:

- Are registered through `routes.js`.
- Must not access Router internals — a page never imports `js/router/Router.js` directly.
- Must not perform navigation by manipulating `window.history` directly.

Navigation should use the existing Router system: an in-app link (`<a href="...">`), which the Router's global click handler already intercepts for SPA navigation, or — when a page genuinely needs to navigate programmatically (e.g. after a form submission) — the `router` instance passed to it via `routes.js`, calling `router.navigate(path)`. A page never calls `window.history.pushState` or reloads the page to change routes.

---

# 10. Authentication Rules

## Protected pages

- Use `requireAuth` through `routes.js`.
- Pages should not manually check tokens.

## Public-only pages

- Use `publicOnly` through `routes.js`.

Authorization decisions belong to the routing/auth layer, not page components (`05-api-integration.md` Section 15). A page never imports `authState` to decide whether to render its own content based on login status — if a page requires or forbids authentication, that is expressed once, at route registration, by wrapping its handler with `requireAuth(router, handler)` or `publicOnly(router, handler)`. A page may still read `authState.currentUser` for *display* purposes (e.g. showing the current user's name) — that is a data read, not an authorization decision, and does not gate whether the page renders at all (Section 5).

---

# 11. Naming Convention

## Pages

`PascalCase.js`

Example: `JourneysPage.js`

## Styles

`kebab-case.css`

Example: `journeys.css`

This is consistent with the component-file convention (`03-project-structure.md` Section 7): the page's file name matches its exported factory function's subject (`JourneysPage.js` → `createJourneysPage()`), and its stylesheet matches the route's name, not the file name, in lowercase kebab-case.

---

# 12. Future Page Implementation Order

1. Journey Details
2. Profile
3. Create Journey
4. Voices
5. Memories
6. Stories
7. Life Events
8. Admin Dashboard

This order follows `04-pages-specification.md` Section 12, prioritizing pages with confirmed, working backend endpoints first.

---

# 13. Final Rule

Before implementing any page, confirm it satisfies every rule in this document: content-only responsibility (Section 1), DOM built with `createElement` and a single root element (Section 2), a layout received from `routes.js` (Section 3), no direct backend calls (Section 4), state kept local or owned by the correct layer (Section 5), all four data states prepared where remote data is involved (Section 6), reuse before creation (Section 7), a dedicated page stylesheet using only design tokens (Section 8), no routing internals touched (Section 9), and authentication handled at the route, not inside the page (Section 10). A page that violates any of these has violated this document and `03-project-structure.md` together, and should not be merged until corrected.
