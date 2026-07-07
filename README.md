# Insan Backend

A Clean Architecture ASP.NET Core backend for documenting and preserving human stories — "Journeys" — through structured life events, testimonies, media, and written narratives.

---

## 📖 Project Overview

Insan is a backend platform for managing **Journeys** (individual life records) and the content attached to them:

- **Life Events** — chronological milestones in a Journey.
- **Voices** — community-submitted testimonies, subject to a Pending → Approved/Rejected moderation workflow.
- **Memories** — media references (images) tied to a Journey.
- **Stories** — longer written narratives about a Journey.

The API is secured with JWT authentication and role-based authorization (`Visitor`, `User`, `Moderator`, `Admin`), and exposes a REST interface for creating, retrieving, and moderating this content.

This repository is structured as a monorepo: `backend/` contains the complete ASP.NET Core solution described below; `frontend/` is reserved for the upcoming UI and has no code yet.

---

## 🏗️ Architecture

### Repository layout

```
Insan/
├── backend/     → The ASP.NET Core solution (Insan.sln + all four projects below)
├── frontend/    → Reserved for the upcoming UI — no code yet
└── docs/        → Product & architecture specification
```

### Layers

Clean Architecture with four layers and a strict, one-directional dependency rule — everything depends inward on **Domain**, and Domain depends on nothing else. All four live under `backend/`.

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
- **API** — controllers, DTOs, Swagger, and the middleware pipeline (exception handling, correlation ID, request logging, health checks).

Controllers never return Domain entities directly — every response is mapped to a dedicated DTO. All database access goes through the repository pattern; `ApplicationDbContext` is only ever used inside `Insan.Infrastructure`.

---

## ✨ Features

- **Authentication** — registration (`POST /api/auth/register`) and login (`POST /api/auth/login`), issuing JWTs.
- **JWT + role-based authorization** — `[Authorize(Roles = ...)]` on every write endpoint, enforced via standard ASP.NET Core JWT bearer middleware.
- **CRUD modules**:
  - Journeys (Admin-only writes, public reads)
  - Voices (authenticated submission, Moderator/Admin moderation)
  - Memories (authenticated upload, Admin-only delete)
  - Stories (authenticated submission, Admin-only delete)
  - LifeEvents (authenticated creation, Admin-only update/delete)
- **Global exception handling middleware** — every error response follows a standard `{ success, message, code }` shape; no stack traces are ever returned to the client.
- **Structured logging** via Serilog, with a correlation-ID middleware that forwards/generates `X-Correlation-Id` and attaches it to the log context for request tracing.
- **Health checks** — separate liveness (`/health/live`) and readiness (`/health/ready`, checks database connectivity) endpoints, plus a combined `/health`.
- **Docker support** — multi-stage Dockerfile and a Docker Compose setup (API + PostgreSQL).
- **CI pipeline** — GitHub Actions: restore, build (warnings treated as errors), test, and Docker build validation.

---

## 🧰 Tech Stack

- **.NET 9** / ASP.NET Core Web API
- **PostgreSQL** via **Entity Framework Core 9** (Npgsql provider)
- **JWT Bearer Authentication** (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **BCrypt** (`BCrypt.Net-Next`) for password hashing
- **Serilog** (`Serilog.AspNetCore`, `Serilog.Sinks.Console`)
- **Swashbuckle** for Swagger/OpenAPI
- **Docker** / **Docker Compose**
- **GitHub Actions** for CI

---

## 🚀 Getting Started

### Run with Docker Compose

```bash
JWT_KEY="<a-long-random-secret>" docker-compose up --build
```

This starts the API and a PostgreSQL 15 container on a shared network. `docker-compose.yml` gates the API's startup on a Postgres health check, and the API automatically applies pending EF Core migrations on boot (see [Database](#-database)). The API listens on port `8080`.

### Run locally

Prerequisites: [.NET 9 SDK](https://dotnet.microsoft.com/download), a running PostgreSQL instance.

```bash
git clone <repository-url>
cd Insan/backend
dotnet restore

cd Insan.API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=insan_dev;Username=<user>;Password=<password>"
dotnet user-secrets set "Jwt:Issuer" "Insan"
dotnet user-secrets set "Jwt:Audience" "InsanClients"
dotnet user-secrets set "Jwt:Key" "<a long, random signing secret>"

dotnet run
```

Open `/swagger` to explore and test the API interactively.

### Required environment variables

| Variable | Purpose |
|---|---|
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string |
| `Jwt__Key` | JWT signing secret (HMAC-SHA256) |
| `Jwt__Issuer` | JWT issuer |
| `Jwt__Audience` | JWT audience |

No secrets are committed to this repository. Locally they're supplied via .NET User Secrets; in Docker/other environments, via environment variables (double-underscore nesting, as above).

---

## 🗄️ Database

- The schema is managed with EF Core migrations (`backend/Insan.Infrastructure/Persistence/Migrations`), covering all six entities: `User`, `Journey`, `Voice`, `Memory`, `Story`, `LifeEvent`.
- **Migrations are applied automatically on startup** (`Database.MigrateAsync()`), with retry logic to tolerate the database not being reachable yet (e.g. a Postgres container still starting up). This never drops or recreates the database.
- To add a new migration after changing an entity or its configuration (run from the repository root — the local `dotnet-ef` tool manifest lives there):
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

---

## 🔒 Security

- **JWT authentication** — tokens are signed with HMAC-SHA256 and carry the user's ID and role.
- **Role-based authorization** — every write endpoint is annotated with `[Authorize(Roles = ...)]` matching the platform's access rules (e.g. Journey writes are Admin-only; Voice moderation is Moderator/Admin-only).
- **Password hashing** — BCrypt (`BCrypt.Net-Next`); passwords are never stored, logged, or returned in plaintext.
- **No sensitive data exposure** — API responses never include password hashes or JWT contents; secrets (JWT key, connection strings) are never committed and are supplied only via User Secrets or environment variables.

---

## 📦 Deployment

- **Docker Compose** provisions the API and a PostgreSQL 15 container on a shared bridge network, with a `pg_isready` health check on Postgres gating the API's startup so migrations don't race a not-yet-ready database.
- **CI (GitHub Actions)** runs on every push to `main` and every pull request: restores dependencies, builds with warnings treated as errors, runs tests (if any exist), and validates that the Docker image builds. It does not deploy anywhere — CI is build/validation only.

---

## 📝 Notes / Limitations

- This is an MVP scope: some entities described in the project's design docs (e.g. Achievements, Dreams, Skills) are not yet implemented.
- JWTs are short-lived with no refresh-token flow — an expired token requires logging in again.
- Logging is currently console-only, with no external log aggregation, metrics, or distributed tracing configured yet.
