# INSAN

Version: 1.0

Document: 07-system-architecture.md

Status: Approved

---

# Overview

This document defines the high-level architecture of the Insan platform.

The system follows a simplified Clean Architecture approach designed for maintainability, scalability, and AI-assisted development.

---

# 1. Architecture Style

The system uses a **Simplified Clean Architecture** consisting of 4 main layers:

```
API Layer
Application Layer
Domain Layer
Infrastructure Layer
```

---

# 2. Layer Definitions

## 2.1 API Layer (Presentation Layer)

### Responsibility

- Handles HTTP requests
- Exposes REST endpoints
- Performs request validation
- Returns HTTP responses

### Contains

- Controllers
- DTOs (Request/Response Models)
- Middleware
- Authentication handlers

### Rules

- No business logic allowed
- Must delegate all logic to Application layer

---

## 2.2 Application Layer

### Responsibility

- Contains use cases (business workflows)
- Coordinates between Domain and Infrastructure
- Implements application logic

### Contains

- Services
- Interfaces
- Use Cases
- DTO mapping logic

### Rules

- No direct database access
- Must depend only on Domain layer abstractions

---

## 2.3 Domain Layer

### Responsibility

- Represents core business entities
- Contains business rules
- Independent of frameworks

### Contains

- Entities (Journey, Voice, Memory, User)
- Value Objects
- Domain rules

### Rules

- No dependency on any external library
- Pure C# logic only

---

## 2.4 Infrastructure Layer

### Responsibility

- Handles external systems
- Implements data access
- Manages persistence and storage

### Contains

- Entity Framework Core DbContext
- Repositories
- File storage services (images, media)
- External integrations

### Rules

- Depends on Domain layer
- Contains all database logic

---

# 3. Project Structure

```
backend/
│
├── API/
│   ├── Controllers/
│   ├── DTOs/
│   ├── Middleware/
│   └── Program.cs
│
├── Application/
│   ├── Services/
│   ├── Interfaces/
│   └── UseCases/
│
├── Domain/
│   ├── Entities/
│   ├── ValueObjects/
│   └── Enums/
│
├── Infrastructure/
│   ├── Persistence/
│   │   ├── DbContext/
│   │   └── Configurations/
│   ├── Repositories/
│   └── Storage/
│
└── Shared/
    ├── Constants/
    ├── Exceptions/
    └── Helpers/
```

---

# 4. Data Flow

## Request Flow

```
Client → Controller → Service → Domain → Repository → Database
```

## Response Flow

```
Database → Repository → Service → DTO → Controller → Client
```

---

# 5. Key Design Decisions

## 5.1 DTO Usage

- API must NEVER expose Domain entities directly
- All responses must be mapped to DTOs

---

## 5.2 Dependency Injection

- All services must be injected via interfaces
- No direct instantiation of dependencies

---

## 5.3 Repository Pattern

- All database access must go through repositories
- No DbContext usage outside Infrastructure layer

---

## 5.4 Asynchronous Operations

- All database operations must be async
- System must use async/await consistently

---

# 6. Core Modules Mapping

## Journeys Module

- Domain: Journey Entity
- Application: JourneyService
- Infrastructure: JourneyRepository
- API: JourneyController

---

## Voices Module

- Domain: Voice Entity
- Application: VoiceService
- Infrastructure: VoiceRepository
- API: VoiceController

---

## Memories Module

- Domain: Memory Entity
- Application: MemoryService
- Infrastructure: MemoryRepository
- API: MemoryController

---

# 7. Authentication Architecture

- JWT-based authentication
- Middleware for authorization
- Role-based access control (RBAC)

---

# 8. File Storage

- Media files stored externally (Cloudinary or similar)
- Database stores only file URLs
- No binary storage in database

---

# 9. Error Handling Strategy

- Centralized exception handling middleware
- Standard API error response format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

# 10. Logging Strategy

- Use structured logging (Serilog recommended)
- Log levels:
  - Information
  - Warning
  - Error

---

# 11. Scalability Strategy

- Stateless API design
- Horizontal scaling ready
- Database normalization for consistency

---

# Core Principle

Architecture exists to make the system understandable, not complicated.

Simplicity is a feature, not a limitation.