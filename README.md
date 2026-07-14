# Insan

A human-centered platform for preserving human stories — "Journeys" — through structured life events, testimonies, media, and written narratives. This repository is a monorepo containing the complete ASP.NET Core backend and a vanilla-JS frontend SPA.

---

## 📖 Project Overview

Insan documents **Journeys** (individual life records) and the content attached to them:

- **Life Events** — chronological milestones in a Journey.
- **Voices** — community-submitted testimonies, subject to a Pending → Approved/Rejected moderation workflow.
- **Memories** — media references (images) tied to a Journey.
- **Stories** — longer written narratives about a Journey.

The API is secured with JWT authentication and role-based authorization (`Visitor`, `User`, `Moderator`, `Admin`). The frontend is a no-framework, no-build-tool single-page app that consumes this API directly.

### Repository layout

```
Insan/
├── backend/     → The ASP.NET Core solution (Insan.sln + all four projects)
├── frontend/    → Vanilla JS SPA — no frameworks, no build tools, no npm
└── docs/        → Product & architecture specification
```

---

## 🏗️ Architecture

### Backend — Clean Architecture

Four layers, one-directional dependency rule — everything depends inward on **Domain**, and Domain depends on nothing else.

```
Insan.API              → Controllers, request/response DTOs, middleware, DI composition root (Program.cs)
      ↓ depends on
Insan.Application      → Services, repository/unit-of-work interfaces, DTOs (Auth flows only)
      ↓ depends on
Insan.Infrastructure    → EF Core DbContext, migrations, repository implementations, JWT signing, Serilog wiring
      ↓ depends on
Insan.Domain            → Entities, enums, business invariants — no framework dependencies at all
```

- **Domain** — `User`, `Journey`, `Voice`, `Memory`, `Story`, `LifeEvent` entities and their enums (`UserRole`, `VoiceStatus`, `MemoryType`). No framework references.
- **Application** — orchestration only: services depend on repository interfaces and `IUnitOfWork`, never on EF Core or ASP.NET Core types.
- **Infrastructure** — `ApplicationDbContext`, EF Core entity configurations and migrations, repository implementations, JWT token generation, database bootstrap.
- **API** — controllers, DTOs, Swagger, and the middleware pipeline (exception handling, correlation ID, request logging, CORS, health checks).

Controllers never return Domain entities directly — every response is mapped to a dedicated DTO. All database access goes through the repository pattern; `ApplicationDbContext` is only ever used inside `Insan.Infrastructure`.

### Frontend — Vanilla JS SPA

No React/Vue/Angular, no bundler, no npm packages. ES modules loaded directly by the browser, client-side routing via the History API, and small factory functions (`createXPage()`, `createXComponent()`) that build and return plain DOM nodes.

```
frontend/js/
├── app/         → App bootstrap and route registration
├── router/      → Minimal client-side router (path matching incl. wildcards, popstate)
├── pages/       → One file per page (Home, Login, Register, Journeys, Journey Details, Profile, Create/Edit Journey, Admin Dashboard, Admin Journeys)
├── components/  → Reusable UI (Button, Input, Card, Table, Badge, Modal, ConfirmDialog, Toast, Loading, EmptyState, ErrorState, Navbar)
├── layouts/     → MainLayout (Navbar + content + Footer), AuthLayout
├── auth/        → authState, authService, tokenStorage, route guards (requireAuth, requireRole, publicOnly)
├── api/         → One thin module per backend resource (journeyApi, voiceApi, memoryApi, storyApi, lifeEventApi), all funneled through apiClient
├── services/    → Page-facing service layer sitting above the api/ modules
├── config/      → Runtime API base URL resolution (dev vs. production, no build-time env vars)
└── utils/       → Small helpers (formatDate)
```

Pages talk to `services/`, never to `api/` or `fetch()` directly — see `frontend/docs/06-page-implementation-rules.md` for the enforced layering.

---

## ✨ Features

### Backend
- **Authentication** — registration (`POST /api/auth/register`) and login (`POST /api/auth/login`), issuing JWTs.
- **JWT + role-based authorization** — `[Authorize(Roles = ...)]` on every write endpoint, enforced via standard ASP.NET Core JWT bearer middleware.
- **CRUD modules**: Journeys (Admin-only writes, public reads), Voices (authenticated submission, Moderator/Admin moderation), Memories (authenticated upload, Admin-only delete), Stories (authenticated submission, Admin-only delete), LifeEvents (authenticated creation, Admin-only update/delete).
- **Development CORS** — a named policy scoped to `http://localhost:5501` only, applied exclusively when `ASPNETCORE_ENVIRONMENT=Development`; never `AllowAnyOrigin`.
- **Global exception handling middleware** — every error response follows a standard `{ success, message, code }` shape; no stack traces are ever returned to the client.
- **Structured logging** via Serilog, with a correlation-ID middleware.
- **Health checks** — liveness (`/health/live`) and readiness (`/health/ready`, checks database connectivity), plus a combined `/health`.
- **Docker support** and a **CI pipeline** (GitHub Actions: restore, build, test, Docker build validation).

### Frontend
- **Public browsing** — Home, Journeys feed (paginated server-side, first page shown — see Known Limitations), Journey Details with independently-loading tabs (Voices, Memories, Stories, Life Events, Gallery).
- **Authentication** — Register, Login, Logout, JWT stored in `localStorage`, session restored on page load.
- **Route protection** — `requireAuth` (any logged-in user) and `requireRole("Admin", ...)` (Admin only, shows an in-shell permission-denied state rather than a bare redirect for a logged-in non-Admin).
- **Profile page** (mock data — no `/users/me` backend endpoint exists yet).
- **Admin Journey management** — Create, Edit, Delete (with confirmation dialog and toast feedback), backed by the real Admin-only endpoints.
- **Simple required-field validation** on Create/Edit Journey (Full Name, City, Occupation, Biography) — a UX convenience; the backend remains the actual source of truth for correctness.
- **Consistent Loading / Empty / Error(+Retry) states** everywhere data is fetched.

---

## 🧰 Tech Stack

**Backend**
- **.NET 9** / ASP.NET Core Web API
- **PostgreSQL** via **Entity Framework Core 9** (Npgsql provider)
- **JWT Bearer Authentication** (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **BCrypt** (`BCrypt.Net-Next`) for password hashing
- **Serilog** (`Serilog.AspNetCore`, `Serilog.Sinks.Console`)
- **Swashbuckle** for Swagger/OpenAPI
- **Docker** / **Docker Compose**
- **GitHub Actions** for CI

**Frontend**
- **Vanilla JavaScript** (ES Modules) — no framework, no TypeScript
- **No build tools, no bundler, no npm dependencies** — the browser loads the source files as-is
- **History API** for client-side routing
- Plain **CSS** with design tokens (`variables.css`) — no preprocessor, no utility framework

---

## 🚀 Setup

Everything below assumes local development. You need three things running: **PostgreSQL**, the **backend**, and a **static file server** for the frontend.

### 1. Database

**Option A — Docker Compose** (starts Postgres only, or the full stack):
```bash
docker-compose up -d postgres
```

**Option B — a local PostgreSQL install** (e.g. via Homebrew on macOS):
```bash
brew install postgresql@15
brew services start postgresql@15
psql -h localhost -d postgres -c "CREATE ROLE postgres WITH LOGIN SUPERUSER PASSWORD 'postgres';"
psql -h localhost -d postgres -c "CREATE DATABASE insan OWNER postgres;"
```

### 2. Backend

```bash
cd backend/Insan.API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=insan;Username=postgres;Password=postgres"
dotnet user-secrets set "Jwt:Key" "<a long, random signing secret>"
dotnet user-secrets set "Jwt:Issuer" "Insan"
dotnet user-secrets set "Jwt:Audience" "InsanClients"

dotnet run --launch-profile http
```

This applies pending EF Core migrations automatically on startup. The API listens on **`http://localhost:5200`** (per `Properties/launchSettings.json`) and serves Swagger at `/swagger` in Development.

### 3. Frontend

The frontend is static files — any static file server works. From the repository root:

```bash
cd frontend
python3 -m http.server 5501
```

Then open **`http://localhost:5501`** in a browser.

> **Port 5501 matters**: the backend's development CORS policy only allows `http://localhost:5501` as an origin. If you serve the frontend on a different port, API requests will be blocked by the browser. `frontend/js/config/api.js` already points at `http://localhost:5200/api` for any `localhost`/`127.0.0.1` origin, so no frontend configuration is needed — just keep the frontend on port 5501, or update both the frontend's dev port and the backend's CORS origin together if you need a different one.

### Required backend configuration

| Key | Purpose |
|---|---|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string |
| `Jwt:Key` | JWT signing secret (HMAC-SHA256) |
| `Jwt:Issuer` | JWT issuer |
| `Jwt:Audience` | JWT audience |

Supplied locally via **.NET User Secrets** (as above — stored outside the repo, never committed) or, in Docker/other environments, via environment variables using double-underscore nesting (e.g. `Jwt__Key`).

---

## 🗄️ Database

- The schema is managed with EF Core migrations (`backend/Insan.Infrastructure/Persistence/Migrations`), covering all six entities: `User`, `Journey`, `Voice`, `Memory`, `Story`, `LifeEvent`.
- **Migrations are applied automatically on startup** (`Database.MigrateAsync()`), with retry logic to tolerate the database not being reachable yet. This never drops or recreates the database.
- To add a new migration after changing an entity or its configuration (run from the repository root):
  ```bash
  dotnet tool run dotnet-ef migrations add <Name> --project backend/Insan.Infrastructure --startup-project backend/Insan.API --output-dir Persistence/Migrations
  ```

---

## 🔌 API Overview

| Endpoint | Description |
|---|---|
| `POST /api/auth/register` | Create a new user account (default role: `User`) |
| `POST /api/auth/login` | Authenticate and receive a JWT |
| `GET/POST/PUT/DELETE /api/journeys` | Journey CRUD — writes are Admin-only, reads are public |
| `POST /api/voices`, `GET /api/journeys/{id}/voices`, `POST /api/voices/{id}/approve\|reject` | Voice submission and moderation |
| `GET/POST /api/journeys/{id}/memories`, `DELETE /api/memories/{id}` | Memory upload, listing, and removal |
| `GET/POST /api/journeys/{id}/stories`, `DELETE /api/stories/{id}` | Story submission, listing, and removal |
| `GET/POST/PUT/DELETE /api/journeys/{id}/lifeevents`, `.../api/lifeevents/{id}` | LifeEvent CRUD |
| `GET /health`, `/health/live`, `/health/ready` | Health checks |

Full request/response contracts are available via Swagger (`/swagger`) in the Development environment.

**Frontend usage of this API today**: `POST /api/auth/{register,login}`, `GET/POST/PUT/DELETE /api/journeys`, and `GET /api/journeys/{id}/{voices,memories,stories,lifeevents}`. The Voice/Memory/Story/LifeEvent write and moderation endpoints exist on the backend but have no frontend UI yet (see Future Work).

---

## 🔒 Security

- **JWT authentication** — tokens are signed with HMAC-SHA256 and carry the user's ID and role.
- **Role-based authorization** — every write endpoint is annotated with `[Authorize(Roles = ...)]`, mirrored on the frontend by route guards (`requireAuth`, `requireRole`) that are UX-only, never the actual security boundary.
- **Password hashing** — BCrypt (`BCrypt.Net-Next`); passwords are never stored, logged, or returned in plaintext.
- **Development-only CORS** — a single named origin (`http://localhost:5501`), never applied outside `Development`, never `AllowAnyOrigin`. Production CORS (if the frontend and backend are ever served from different origins in production) is not yet configured — see Future Work.
- **No sensitive data exposure** — API responses never include password hashes or JWT contents; secrets are never committed and are supplied only via User Secrets or environment variables.

---

## 📦 Deployment

- **Docker Compose** provisions the API and a PostgreSQL 15 container on a shared bridge network, with a `pg_isready` health check on Postgres gating the API's startup.
- **CI (GitHub Actions)** runs on every push to `main` and every pull request: restores dependencies, builds with warnings treated as errors, runs tests (if any exist), and validates that the Docker image builds. It does not deploy anywhere — CI is build/validation only.
- The frontend has no build step, so "deploying" it is just serving the static files — any static host works, as long as `frontend/js/config/api.js`'s production branch (`/api`, a same-origin relative path) is fronted by a reverse proxy that routes `/api` to the backend.

---

## ⚠️ Known Limitations

- **The MVP currently displays the first page of journeys only.** `GET /api/journeys` supports `page`/`pageSize` query parameters and the frontend's `journeyService.getJourneys(params)` already accepts them, but no Pagination UI has been built yet — anything beyond the first page (10 records by default) is not currently reachable from the UI.
- **No content-contribution UI.** The backend supports submitting Voices, Memories, Stories, and Life Events, and moderating Voices, but the frontend only has read (view) and Admin Journey-management screens — there's no "Add Voice," "Add Memory," "Add Story," "Add Life Event," or moderation page yet.
- **No frontend role-gating on `/admin/*` subpages beyond the ones explicitly built** (`/admin`, `/admin/journeys`) — only those two are wrapped in `requireRole("Admin", ...)` today; any future nested admin page needs the same guard applied explicitly.
- **Profile and Admin Dashboard are mock data** — the backend has no `/users/me` or `/api/admin/dashboard` endpoint yet.
- **No refresh-token flow** — JWTs are short-lived (60 minutes); an expired token requires logging in again.
- **No automated test suite** on either the frontend or backend.
- **Search Page and Settings Page** are described in the product spec but have no backend endpoint to implement them against.
- Logging is console-only, with no external log aggregation, metrics, or distributed tracing.

---

## 🔭 Future Work

- Pagination UI for the Journeys feed and Admin Journeys table.
- Add Voice / Add Memory / Add Story / Add Life Event pages, and a Voice Moderation (Content Moderation) admin section.
- Role-based route guard applied to every nested admin page as it's built, not just the two that exist today.
- A `/users/me` backend endpoint, so the Profile page can show real data instead of mock data.
- A real `/api/admin/dashboard` endpoint (or a composed client-side equivalent) so the Admin Dashboard's statistics aren't hardcoded.
- Production CORS configuration once the frontend and backend have real deployed origins.
- Automated tests (backend unit/integration tests; frontend at least smoke-level).
- Refresh-token support so a session doesn't require re-login every 60 minutes.

---

## 📝 Notes

This is an MVP scope: some entities described in the project's original design docs (e.g. Achievements, Dreams, Skills) are not implemented at all.
