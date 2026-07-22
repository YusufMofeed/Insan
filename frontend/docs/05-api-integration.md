# INSAN

> Version: 1.2
> Document: 05-api-integration.md
> Status: Approved

---

# Overview

This document defines how the frontend communicates with the Insan backend API. It is the mandatory reference for all API-related frontend code.

This document defines architecture and rules only — no implementation code.

Every rule below has been checked against the backend as it is actually implemented today. Where the backend's real behavior differs from what might otherwise be assumed, it is called out explicitly rather than glossed over. Every recommendation is also checked against `01-frontend-principles.md`'s constraints (no frameworks, no build tools, no npm packages) — nothing here assumes tooling the project doesn't have.

---

# 1. Purpose

The frontend consumes the ASP.NET Core Web API. It does not reimplement any part of it.

The frontend is responsible for: sending requests, displaying responses, and handling client-side states (loading, empty, error, success).

The frontend is **not** responsible for: business rules, authorization decisions, database logic, or security validation.

The backend remains the source of truth. Every rule in this document exists to keep that boundary intact — including the two newer sections on route guards (Section 15) and environment configuration (Section 16), which are easy places to accidentally reintroduce logic the frontend shouldn't own.

---

# 2. API Base URL Configuration

The API URL must be centralized in a single constant, e.g. `API_BASE_URL`, defined in one place and imported everywhere it's needed — never hardcoded inside a page or an individual `api/` module.

This constant's *value* is environment-dependent (a local backend during development, the deployed backend in production); how that value is determined per environment is defined in full in Section 16. This section only establishes that there must be exactly one place the URL is defined, regardless of how its value is resolved.

---

# 3. apiClient Architecture

All HTTP communication is funneled through one central module — the **apiClient** — plus a thin `api/` layer of resource-specific modules built on top of it:

```
js/
└── api/
    ├── apiClient.js      (the centralized request wrapper)
    ├── authApi.js
    ├── journeyApi.js
    ├── voiceApi.js
    ├── memoryApi.js
    ├── storyApi.js
    └── lifeEventApi.js
```

This mirrors `03-project-structure.md` Section 5, with `apiClient.js` named explicitly as the module every other `api/` file depends on.

## The apiClient's responsibilities

- Adding the base URL (Section 2).
- Adding standard headers (`Content-Type`, etc.).
- Attaching the Authorization header when required (Section 5).
- Executing the request via `fetch`/`async`-`await` (per `01-frontend-principles.md` Section 3 — no other HTTP client).
- Parsing the JSON response.
- Routing every response through global error handling (Section 6) before the caller ever sees it.

## The resource `api/` modules' responsibilities

Each module (e.g. `voiceApi.js`) only calls the apiClient with the specific endpoint, method, and body for its resource — it does not talk to `fetch` directly, does not touch the DOM, and does not contain UI logic. It returns whatever the apiClient hands back (already-parsed data or a normalized error, per Section 8).

**No page should ever call `fetch()` directly, and no page should ever call the apiClient directly** — pages go through `services/` and `api/` (the layering is defined fully in Section 21).

---

# 4. JWT Storage Strategy

**Token location:** `localStorage`, for MVP.

## Rules

- Never expose the token in the UI (not in the DOM, not in a visible attribute).
- Never log the token (not to `console`, not in error messages sent anywhere).
- Store the token and its expiry together, so expiry can be checked without a network round-trip (Section 10).
- Only one thing owns reading and writing this storage key: the auth service (`js/auth/`, per `03-project-structure.md`). No other module — not `api/`, not a page, not a component — reads or writes the token directly. This keeps the storage strategy replaceable later (Section 20) without hunting down every call site.

---

# 5. Attaching the Authorization Header

The apiClient attaches the header, not the caller:

```
Authorization: Bearer {token}
```

## Rules

- The apiClient asks the auth service for the current token (Section 4) immediately before sending each request — it does not cache the token itself, so a logout that happens mid-session is respected on the very next request.
- The header is attached **only to requests that need it** — public `GET` endpoints (Journeys list/detail, public Voice/Memory/Story/LifeEvent listings) are called without it. This isn't a security requirement (the backend ignores an absent header on public endpoints), it's a correctness one: sending a stale or expired token on a public request that doesn't need it risks triggering error handling (Section 6) for a request that would otherwise have succeeded.
- Resource `api/` modules don't decide whether their own calls are "protected" or "public" — that's implicit in which endpoint they call and is handled uniformly by the apiClient, not re-decided per call site.

---

# 6. Global Error Handling

Every request's error handling lives in exactly one place: the apiClient (Section 3). No page, component, or resource `api/` module implements its own error-handling logic — they receive an already-normalized result.

## What the apiClient does on every response

1. **Network failure** (request never reached the server) — normalized into a generic "connection" error.
2. **2xx response** — parsed and returned as-is (Section 8 defines the shape callers can expect).
3. **401** — handled specially; see Section 7, not the generic path below.
4. **Any other 4xx/5xx** — parsed using the backend's consistent error shape (`{ success: false, message, code }`, Section 8) and returned as a normalized error object, using `code` for logic and `message` only for display (Section 8).

## What callers do with a normalized error

Pages and services translate a normalized error into one of the feedback components already defined in `02-ui-design-system.md` — Toast (transient), Alert (persistent/in-context), or inline field messages — never a raw `message` string dumped unstyled onto the page, and never a stack trace (the backend's own error middleware already strips those server-side, but the frontend must not assume every failure path is equally sanitized).

---

# 7. Handling 401 and Automatic Logout

A `401` is handled differently from every other status code, because it means one specific thing: **the credential the request relied on is no longer valid** — expired, malformed, or never present when it should have been.

## The rule

When the apiClient receives a `401` **on a request that included an Authorization header**, it triggers automatic logout:

1. Clear the stored token (Section 4).
2. Clear any in-memory auth state (Section 9).
3. Redirect to `/login`.

This happens once, centrally, in the apiClient — not duplicated in every page that happens to call a protected endpoint.

## The one explicit exception: the login request itself

`POST /api/auth/login` returning `401` means "wrong email or password," not "your session expired" — there is no session yet, and no Authorization header was sent on that request in the first place. This must **not** trigger the automatic-logout flow (there's nothing to log out of, and redirecting the login page to itself would be a confusing loop). It is handled the ordinary way: the Login page shows an error via the normalized error from Section 6, same as any other form failure.

The distinguishing rule is exactly what's stated above — automatic logout applies only when the failed request carried an Authorization header (Section 5). The login endpoint never does, so it can never trigger this path by construction, not by a special case the apiClient has to check for.

## Do not confuse this with 403

`403 Forbidden` means the user **is** authenticated but lacks the required role. This must never trigger logout — that would incorrectly sign out a valid, still-logged-in user for attempting an action their role doesn't permit. A `403` is shown as a permission-denied message (Section 6), full stop.

---

# 8. Response Mapping Conventions

## There is no universal success envelope

Successful responses are **not** wrapped in a generic `{ success: true, data: {...} }` shape. Most endpoints return the resource (or array of resources) directly as the response body. The one exception is `GET /api/journeys`, which wraps its results with pagination metadata: `{ data, totalCount, page, pageSize }` (Section 9) — specific to that endpoint, not a general convention.

## Error responses are consistent

Every error response, across every endpoint, follows the same shape:

```
{ success: false, message, code }
```

Branch on `code` for logic (e.g. distinguishing `CONFLICT` from `INTERNAL_SERVER_ERROR`); `message` is for display only.

## No field-name translation layer exists or is needed

The backend's JSON already uses camelCase field names matching normal JS conventions, so `api/` modules return backend data as-is — there is no mapping/normalization step today. If a mismatch is ever introduced on the backend side, any translation happens inside the relevant `api/` module (the boundary), never inside a page.

---

# 9. Pagination Conventions

Pagination is handled by a reusable Pagination component (`02-ui-design-system.md`): pagination controls and page indicators, driven by whatever `totalCount`/`page`/`pageSize` values the apiClient returns.

## Where pagination actually applies today

Only `GET /api/journeys` returns pagination metadata from the backend. Journey-scoped child lists (Voices, Memories, Stories, Life Events) currently return the **complete, unpaginated** result set for a given Journey. Search results and Admin lists have no backend endpoint at all today (`04-pages-specification.md` Sections 2 and 9). Build the Pagination component generically, but only the Journeys Feed page can actually drive it against real data right now.

---

# 10. File Upload Strategy

## The backend does not support file uploads today

There is no multipart/file-upload endpoint anywhere in the current API. A Memory is created via `POST /api/journeys/{id}/memories` with a plain JSON body containing a `url` string and a `caption` — the frontend collects a URL, it does not upload a file. There is also no profile-image endpoint.

## The strategy for when one exists

Documented now so the architecture doesn't need to change shape later, not because it's usable today:

- Use `FormData` for the request body (a distinct code path in the apiClient from the JSON path used everywhere else — it must not set a `Content-Type: application/json` header, which would break the multipart boundary).
- Validate file type and file size **before** upload, as a UX convenience.
- Never trust client-side validation only — the backend must re-validate whatever it eventually receives.

---

# 11. Loading States

Every API-driven component must support Loading, Success, Empty, and Error states (`04-pages-specification.md` Section 1). Avoid blank screens — a component with no data and no explicit empty/error state is a bug, not an acceptable transitional state.

---

# 12. Authentication Flow

**Registration:** `POST /api/auth/register` → `201 Created` with the new user's basic info (id, name, email, role, createdAt). **No token is issued** — no automatic login.

**Login:** `POST /api/auth/login` → `200 OK` with `{ token, expiresAt }`.

**After successful login:** receive the JWT and its expiry, store authentication state (Section 4, Section 9), then redirect:

- If the user arrived at `/login` via a route guard (Section 15), a `?redirect=<path>` query parameter carries the path they originally tried to reach — `resolvePostLoginRedirect()` reads it and login sends them there.
- Otherwise, login redirects to `/journeys`.

**On failure:** the backend's error message (Section 6, Section 8) is shown inline on the Login page as a form-level error — the same page, no redirect.

**Logout:** remove the stored token, clear user state (the same two steps automatic logout performs in Section 7 — logout is one operation with two triggers, user-initiated or automatic-on-401).

---

# 13. Authentication State

The frontend needs to know, at any point: is the user logged in, what is their role, and is a (non-expired) token available. This is owned entirely by the auth service (`js/auth/`), which exposes login state, logout, and current-user information decoded from the JWT's claims (user ID, role) — the backend has no `/users/me` endpoint today, so nothing beyond ID and role is available (`04-pages-specification.md` Section 8).

## Initialization on app startup

`authState.initialize()` restores state from a previously stored token (Section 4) and must run **before** `router.start()` (`js/app/App.js`) — the very first render, including on a page reload, needs to already know whether a valid session exists. If this ordering were reversed, a reload would render the first route (and the Navbar) as if the user were logged out, however briefly, since nothing would have read the stored token yet.

## Navbar

Which Navbar links/actions render — public, authenticated, or authenticated-plus-Admin — is derived from this same state (`isAuthenticated`, `currentUser.role`), not tracked separately (`js/auth/navigation.js`, `03-project-structure.md` Section 5). The Navbar is rebuilt as part of each route's render, so a login, logout, or role never requires a separate "refresh the navbar" step — the next render already reflects current state.

---

# 14. Authorization Handling (UI-Level)

The frontend may hide actions the current user isn't allowed to perform — e.g. Admin-only buttons, Moderation actions — as a UX convenience.

**Backend authorization is always trusted.** Every write endpoint enforces its own role requirement independently of what the frontend shows or hides. Frontend hiding is only UX, never a security boundary — a hidden button is not a substitute for the backend rejecting the request if it's called anyway.

---

# 15. Route Guard Strategy

Some routes require an authenticated user; some require the visitor to *not* be authenticated. The SPA router (`js/router/Router.js`) has no built-in concept of a "protected route" — it only knows `add(path, handler)` (including an optional trailing wildcard segment, e.g. `/admin/*` — Section 15.1). Route guarding is therefore a convention applied where routes are **registered** (`js/app/routes.js`), by wrapping a route's real handler with a guard helper from `js/auth/routeGuards.js`.

## Implemented guard helpers (`js/auth/routeGuards.js`)

- **`requireAuth(router, handler)`** — if `authState.isAuthenticated` is false, redirects to `/login?redirect=<the path the user tried to reach>` instead of rendering `handler` — the same outcome as Section 7's automatic logout, reusing the identical "not authenticated" handling rather than inventing a second one. The redirect target is later read back by the Login page (Section 12) to send the user to where they were originally headed.
- **`publicOnly(router, handler)`** — the inverse: if `authState.isAuthenticated` is true, redirects to `/journeys` instead of rendering `handler`. Used for pages that only make sense for a logged-out visitor.
- **`resolvePostLoginRedirect()`** — reads the `?redirect=` query parameter, if present and a safe same-app path, and returns it; otherwise returns `/journeys`. Called by the Login page after a successful login (Section 12), not by the guards themselves.

Each helper is written once and reused across every route that needs it, rather than re-implemented per page (`01-frontend-principles.md` Section 7: never duplicate code).

## Current protected routes (require authentication — `requireAuth`)

- `/profile`
- `/create-journey`
- `/admin/*` (see 15.1 and the gap noted below)

## Current public-only routes (require the visitor to be unauthenticated — `publicOnly`)

- `/login`
- `/register`

## 15.1 Wildcard routes

`Router.add()` supports a trailing `*` segment: `router.add("/admin/*", handler)` matches `/admin` itself and any path nested beneath it (`/admin/journeys`, `/admin/journeys/42`, ...). This lets one guarded route registration cover an entire section of the app without registering — and re-guarding — each nested admin page individually as it's built.

## Known gap: `/admin/*` is authentication-only today, not role-gated

`requireAuth` on `/admin/*` confirms the visitor is logged in — it does **not** check that their role is Admin. A regular User who navigates directly to `/admin` (or any `/admin/...` path) today reaches the page; the Navbar simply doesn't *link* there for a non-Admin (Section 13). This is a real, current gap, not a design choice: a role-aware guard — mirroring the 401-vs-403 distinction in Section 7, where an authenticated non-Admin would see a permission-denied state rather than a redirect — is planned as a follow-up but is **not implemented yet**.

## What a route guard is not

A route guard is exactly as trustworthy as any other frontend UI decision (Section 14): it prevents an unauthorized visitor from *seeing* a page's markup render, but it is not what makes `/admin`-only actions actually safe — the backend's own `[Authorize(Roles = "Admin")]` enforcement (already in place) is what does that, regardless of whether the frontend guard is authentication-only (today) or later becomes role-aware. If a route guard were ever the only thing standing between a user and a protected action, that would be a security bug, not a frontend architecture question.

---

# 16. Environment Configuration for Development and Production

The project has no build tools (`01-frontend-principles.md` Section 3) — there is no bundler step to inject environment variables at build time the way a typical framework project would. Configuration has to be resolved **at runtime**, from the same static files served in every environment.

## Implemented strategy: config file override, with runtime detection as the fallback

Both approaches previously discussed here are implemented together, not as alternatives: `frontend/config.js` — loaded via a plain `<script>` tag in `index.html`, before `js/app.js` — sets a single global, `window.__INSAN_CONFIG__.API_BASE_URL`. As committed, this value is empty.

`js/config/api.js` checks that value first. If it's set, it's used verbatim — this is the deploy-time override point for a production (or staging) deployment where the frontend and backend do not share an origin, and hostname-based detection isn't reliable enough to distinguish them. If it's empty (as committed, and therefore in every local development setup), `js/config/api.js` falls back to inspecting `window.location.hostname`: known local-development hostnames (`localhost`, `127.0.0.1`) resolve to the local backend's URL; anything else resolves to the deployed backend's URL via a same-origin relative path (`/api`), assuming a reverse proxy routes it to the backend.

Deploying a real override means editing (or having the deployment process overwrite) `frontend/config.js` with a real `API_BASE_URL` — see `frontend/config.production.example.js` for the shape. This is a deploy-time file edit, not a build step, so it stays within the "no build tools" constraint (Section 1 of `01-frontend-principles.md`).

## Rule regardless of which strategy is used

`API_BASE_URL` is the only environment-dependent value today. If other environment-specific values are ever needed, they are resolved by the same `config.js` / `js/config/api.js` pair — never scattered across multiple files, and never hardcoded per-environment inside a page or component.

---

# 17. Security Rules

**Never:** store passwords, store secrets, expose API keys, trust client-side role checks as a security boundary (Sections 14–15).

**Always:** validate inputs client-side as a UX convenience only, never as the actual guarantee of correctness; escape displayed content (user-generated Voice/Story content and names are rendered as text, never raw HTML); handle expired tokens via the same path as any other `401` (Section 7).

---

# 18. HTTP Status Handling Reference

| Status | Behavior |
|---|---|
| `200 OK` | Display data. |
| `201 Created` | Show success and update the UI with the created resource. |
| `204 No Content` | Confirm the action succeeded (delete, approve, reject) — no body to display. |
| `400 Bad Request` | Display validation errors. |
| `401 Unauthorized` | Automatic logout and redirect to login (Section 7) — except the login request itself. |
| `403 Forbidden` | Show a permission error; never logout (Section 7). |
| `404 Not Found` | Show a missing-content message. |
| `409 Conflict` | Show a duplicate/conflict message. |
| `500` | Show a generic error message. |

## Known gap: not every invalid input currently returns 400

Only `POST /api/auth/register` has field-level validation wired up, reliably producing `400`. Every other write endpoint (Journey, Voice, Memory, Story, LifeEvent creation/updates) validates at the domain level, and a domain validation failure currently surfaces as `500`, because the backend's global error handler does not yet map that failure type to `400`. Until that's fixed on the backend, validate required fields client-side before submitting (Section 17) to avoid triggering this case, and treat an unexpected `500` on a create/update form as a possible validation failure, not only a server fault.

## Known gap: 409 is currently registration-only

`409 Conflict` is only returned by `POST /api/auth/register` (duplicate email) today. No other endpoint currently returns `409`.

---

# 19. Naming Convention

**Functions** describe the action and the resource: `getJourneys()`, `createVoice()`, `deleteMemory()`.

**API files** are named after the resource they cover, per `03-project-structure.md` Section 7: `journeyApi.js`, `authApi.js`, `apiClient.js`.

---

# 20. Future Scalability

The architecture defined in this document should allow, without changing page logic:

- Replacing Fetch with Axios (or any other HTTP client) — all HTTP calls are isolated behind the apiClient (Section 3), not scattered across pages.
- Migrating to React/Vue — `api/` modules return plain data, with no DOM or framework-specific assumptions (`03-project-structure.md` Section 11).
- Adding refresh tokens — all token handling is centralized in the auth service (Section 4, Section 13), not duplicated across pages.

---

# 21. Final Rule

Pages communicate with the backend through exactly one path:

```
Pages
  ↓
Services
  ↓
API Layer (apiClient + resource modules)
  ↓
Backend
```

Never:

```
Pages
  ↓
fetch()
  ↓
Backend
```

If a page is calling `fetch()` directly, or an API module is touching the DOM, the architecture defined in this document and in `03-project-structure.md` has been violated.
