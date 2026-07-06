# INSAN

Version: 1.0

Document: 09-api-specification.md

Status: Approved

---

# Overview

This document defines the REST API specification for the Insan platform.

The API is designed as a simple CRUD-based system with authentication and moderation support.

Base URL:
```
/api
```

---

# 1. Authentication APIs

## 1.1 Register User

```
POST /auth/register
```

### Request Body

```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

### Response

```json
{
  "token": "jwt_token"
}
```

---

## 1.2 Login

```
POST /auth/login
```

### Request Body

```json
{
  "email": "string",
  "password": "string"
}
```

### Response

```json
{
  "token": "jwt_token"
}
```

---

# 2. Journey APIs (Core Resource)

## 2.1 Get All Journeys

```
GET /journeys
```

### Query Parameters

- page (default: 1)
- pageSize (default: 10)
- search (optional)
- city (optional)
- occupation (optional)

### Response

```json
{
  "data": [],
  "totalCount": 0,
  "page": 1,
  "pageSize": 10
}
```

---

## 2.2 Get Journey By Id

```
GET /journeys/{id}
```

### Response

```json
{
  "id": "guid",
  "fullName": "string",
  "biography": "string",
  "city": "string",
  "occupation": "string",
  "lifeEvents": [],
  "voices": [],
  "memories": [],
  "stories": [],
  "achievements": [],
  "dreams": [],
  "skills": []
}
```

---

## 2.3 Create Journey

```
POST /journeys
```

### Authorization

Admin only

### Request Body

```json
{
  "fullName": "string",
  "nickname": "string",
  "birthDate": "date",
  "martyrdomDate": "date",
  "city": "string",
  "occupation": "string",
  "biography": "string"
}
```

---

## 2.4 Update Journey

```
PUT /journeys/{id}
```

---

## 2.5 Delete Journey

```
DELETE /journeys/{id}
```

---

# 3. Life Events APIs

## 3.1 Add Life Event

```
POST /journeys/{id}/events
```

---

## 3.2 Get Life Events

```
GET /journeys/{id}/events
```

---

## 3.3 Update Life Event

```
PUT /events/{id}
```

---

## 3.4 Delete Life Event

```
DELETE /events/{id}
```

---

# 4. Voices APIs (Testimonials)

## 4.1 Submit Voice

```
POST /journeys/{id}/voices
```

### Request Body

```json
{
  "authorName": "string",
  "relationship": "string",
  "content": "string"
}
```

### Default Status

Pending

---

## 4.2 Get Voices (Public)

```
GET /journeys/{id}/voices
```

Returns only approved voices.

---

## 4.3 Moderate Voices

```
PUT /voices/{id}/approve
PUT /voices/{id}/reject
```

Moderator only.

---

# 5. Memories APIs (Media)

## 5.1 Upload Memory

```
POST /journeys/{id}/memories
```

### Request Body

```json
{
  "url": "string",
  "caption": "string"
}
```

---

## 5.2 Get Memories

```
GET /journeys/{id}/memories
```

---

# 6. Stories APIs

## 6.1 Add Story

```
POST /journeys/{id}/stories
```

---

## 6.2 Get Stories

```
GET /journeys/{id}/stories
```

---

# 7. Search API

## 7.1 Search Journeys

```
GET /search
```

### Query Parameters

- query (name partial match)
- city
- occupation

### Response

```json
{
  "results": []
}
```

---

# 8. User APIs

## 8.1 Get Current User

```
GET /users/me
```

---

# 9. Admin APIs

## 9.1 Dashboard Summary

```
GET /admin/dashboard
```

Returns basic stats.

---

# 10. Common Rules

## 10.1 Authentication

- JWT required for protected routes
- Roles enforced via middleware

---

## 10.2 Pagination

- All list endpoints must support pagination

---

## 10.3 Error Format

```json
{
  "success": false,
  "message": "string",
  "code": "string"
}
```

---

## 10.4 Success Format

```json
{
  "success": true,
  "data": {}
}
```

---

# Core Principle

This API is intentionally simple.

Each endpoint represents a clear CRUD operation or a direct user interaction.