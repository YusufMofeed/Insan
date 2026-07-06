# Insan

> كل إنسان قصة... وهذه إحدى القصص.
> *Every human has a story. Every story deserves to be remembered.*

Insan is a Clean Architecture ASP.NET Core backend for a digital archive that documents and preserves the personal stories — the "Journey" — of the martyrs of Gaza: their lives, relationships, achievements, dreams, and the testimonies of the people who knew them.

This repository contains the **backend API only**. There is no frontend/UI in this repository yet.

---

## Vision

Rather than reducing people to statistics, Insan aims to document every individual as a unique human being — their life, dreams, achievements, relationships, and memories — in a structured, respectful, and verifiable archive that families, communities, researchers, and future generations can rely on.

Every piece of user-submitted content passes through a moderation workflow before it becomes public, and the system is designed to present information calmly and factually rather than sensationally.

## Features

Implemented so far:

- **Journey records** — the core entity of the system (a person's biography: name, city, occupation, biography, birth/martyrdom dates), with paginated listing, search, and filtering by city/occupation.
- **Voice submissions (testimonies)** — community members can submit a testimony tied to a Journey. Every submission starts as `Pending` and must be explicitly `Approved` or `Rejected` by a Moderator or Admin before it becomes visible; only approved voices are returned by the public listing endpoint by default.
- **JWT authentication** with role-based authorization (`Visitor`, `User`, `Moderator`, `Admin`).
- **Soft delete** for Journeys and Voices (records are archived, not destroyed).
- **Interactive API documentation** via Swagger/OpenAPI, including JWT bearer support for testing protected endpoints directly from the browser.

Not yet implemented (see [Roadmap](#roadmap)):

- Life Events, Memories, Stories, Achievements, Dreams, and Skills modules (these are designed in `/docs` but have no code yet).
- A registration endpoint (users must currently be seeded directly).
- Refresh tokens (JWTs are short-lived and non-renewable for now).
- EF Core migrations (the schema is fully modeled via `IEntityTypeConfiguration`, but no migration has been generated yet).
- Automated tests.

## Tech Stack

- **.NET 9** / ASP.NET Core Web API
- **PostgreSQL**, via **Entity Framework Core 9** (Npgsql provider)
- **JWT Bearer Authentication** (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- **BCrypt** for password hashing (`BCrypt.Net-Next`)
- **Swashbuckle** for Swagger/OpenAPI generation and UI

## Technologies Used

| Package | Purpose |
|---|---|
| `Microsoft.EntityFrameworkCore` / `Microsoft.EntityFrameworkCore.Relational` | ORM core |
| `Npgsql.EntityFrameworkCore.PostgreSQL` | PostgreSQL provider for EF Core |
| `Microsoft.EntityFrameworkCore.Tools` | Design-time tooling (migrations, scaffolding) |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | JWT bearer authentication middleware |
| `BCrypt.Net-Next` | Password hashing and verification |
| `Swashbuckle.AspNetCore` | Swagger/OpenAPI generation and UI |
| `Microsoft.AspNetCore.OpenApi` | ASP.NET Core's built-in OpenAPI document support |

## Architecture

Insan follows a simplified **Clean Architecture** with four layers and a strict, one-directional dependency rule: everything depends inward on **Domain**, and nothing in Domain depends on anything else.

```
Insan.API              → Presentation layer: controllers, request/response DTOs, Swagger, DI composition root
      ↓ depends on
Insan.Application      → Use cases: services, repository/unit-of-work interfaces, application DTOs
      ↓ depends on
Insan.Infrastructure    → EF Core DbContext, entity configurations, repository implementations, JWT signing
      ↓ depends on
Insan.Domain           → Entities, enums, and business invariants — no framework dependencies at all
```

Key rules enforced throughout the codebase:

- Controllers contain no business logic — they map DTOs, call a service, and translate the result into an HTTP response.
- The API layer never returns Domain entities directly; every response is mapped to a dedicated DTO.
- All database access goes through the repository pattern; `ApplicationDbContext` is only ever used inside `Insan.Infrastructure`.
- All writes go through a `IUnitOfWork.SaveChangesAsync()` call, kept explicit in the Application layer rather than hidden inside repositories.

## Folder Structure

```
Insan/
├── Insan.Domain/
│   ├── Common/          # BaseEntity
│   ├── Entities/         # Journey, User, Voice
│   └── Enums/            # UserRole, VoiceStatus
│
├── Insan.Application/
│   ├── DTOs/             # LoginRequest, LoginResponse
│   ├── Interfaces/       # Repository, IUnitOfWork, IUserContext, IJwtTokenGenerator contracts
│   └── Services/         # AuthService, JourneyService, VoiceService
│
├── Insan.Infrastructure/
│   ├── Authentication/   # JwtTokenService
│   ├── Persistence/
│   │   ├── Configurations/  # EF Core IEntityTypeConfiguration classes
│   │   └── Repositories/    # BaseRepository<T> + concrete repositories
│   └── DependencyInjection.cs
│
├── Insan.API/
│   ├── Controllers/      # AuthController, JourneysController, VoicesController
│   ├── DTOs/              # Request/response models for the API layer
│   ├── UserContext.cs     # IUserContext implementation, reads claims from HttpContext
│   └── Program.cs
│
└── docs/                  # Product & architecture specification (source of truth for planned features)
```

## Authentication

Authentication is JWT-based:

1. `POST /api/auth/login` verifies the submitted email/password (BCrypt) against the `Users` table and, on success, issues a signed JWT containing the user's ID (`sub`) and role.
2. Protected endpoints are annotated with `[Authorize]` or `[Authorize(Roles = "...")]` and validated by the standard ASP.NET Core JWT bearer middleware.
3. `IUserContext` (defined in `Insan.Application`, implemented in `Insan.API`) exposes the current caller's `UserId`, `Role`, and `IsAuthenticated` status to the Application layer **without leaking any ASP.NET Core types across the boundary**. `VoiceService` already reads the acting user through this abstraction.

**Current limitation:** Journey creation still accepts `createdBy` as an explicit request field rather than deriving it from the token — this is a known, temporary gap and is tracked in the [Roadmap](#roadmap).

### Roles

| Role | Description |
|---|---|
| `Visitor` | Unauthenticated / public access |
| `User` | Registered user — can submit Voices |
| `Moderator` | Can approve or reject Voices |
| `Admin` | Full control, including Journey management |

## Current Progress

| Layer | Status |
|---|---|
| Domain | `Journey`, `User`, `Voice` entities; `UserRole`, `VoiceStatus` enums |
| Application | `JourneyService`, `VoiceService`, `AuthService`; repository & `IUnitOfWork` interfaces; `IUserContext` |
| Infrastructure | `ApplicationDbContext`, EF Core configurations, generic + entity-specific repositories, `UnitOfWork`, `JwtTokenService` |
| API | `JourneysController`, `VoicesController`, `AuthController`; Swagger with JWT support; role-based authorization |
| Database | PostgreSQL schema fully modeled in code — **no migration generated yet** |
| Tests | None yet |

## Roadmap

- [ ] Generate and apply the first EF Core migration
- [ ] Implement remaining Domain modules: `LifeEvent`, `Memory`, `Story`, `Achievement`, `Dream`, `Skill`
- [ ] User registration endpoint and `UserService`
- [ ] Migrate `Journey` creation to derive the acting user from `IUserContext` instead of a request field
- [ ] Refresh tokens
- [ ] Automated test suite (unit + integration)
- [ ] External media storage integration (e.g. Cloudinary) for images
- [ ] CI pipeline

## Getting Started

### Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- A running PostgreSQL instance

### Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd Insan

# 2. Restore dependencies
dotnet restore

# 3. Configure secrets (see Configuration below)
cd Insan.API
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=insan_dev;Username=<user>;Password=<password>"
dotnet user-secrets set "Jwt:Issuer" "Insan"
dotnet user-secrets set "Jwt:Audience" "InsanClients"
dotnet user-secrets set "Jwt:Key" "<a long, random signing secret>"

# 4. Run the API
dotnet run --project Insan.API
```

Once running, open `https://localhost:<port>/swagger` (see `Insan.API/Properties/launchSettings.json` for the configured ports) to explore and test the API interactively.

> No database migration exists yet in this repository — the schema will need to be created (e.g. via `dotnet ef migrations add InitialCreate` once the EF Core CLI tooling is set up for this project) before any data can be persisted.

## Configuration

Configuration follows the standard ASP.NET Core precedence: `appsettings.json` → `appsettings.{Environment}.json` → User Secrets (Development) → environment variables → command-line arguments.

**No secrets are committed to this repository.** `appsettings.Development.json` intentionally ships with empty placeholder values; real values must be supplied via `dotnet user-secrets` locally, or via environment variables in any other environment.

| Key | Description |
|---|---|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string |
| `Jwt:Issuer` | JWT issuer |
| `Jwt:Audience` | JWT audience |
| `Jwt:Key` | JWT signing secret (HMAC-SHA256) |
| `Jwt:ExpiryMinutes` | Token lifetime in minutes |

In production, set these via environment variables using the double-underscore convention, e.g. `ConnectionStrings__DefaultConnection`, `Jwt__Key`.

## License

*License to be determined.* This project does not yet include a `LICENSE` file — one should be added before any public release.
