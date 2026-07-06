# INSAN

Version: 1.0

Document: 12-security.md

Status: Approved

---

# Overview

This document defines the security model of the Insan platform.

Security is a core requirement, not an optional layer.

The system must assume all external input is untrusted.

---

# 1. Authentication Security

## 1.1 JWT Authentication

- All authenticated requests must use JWT tokens
- Tokens must be sent via HTTP Authorization header:
  ```
  Authorization: Bearer <token>
  ```

---

## 1.2 Token Expiry

- JWT tokens must have expiration time
- Expired tokens must be rejected immediately

---

## 1.3 Password Storage

- Passwords must NEVER be stored in plain text
- Must be hashed using a secure algorithm (e.g. BCrypt)

---

# 2. Authorization Security

## 2.1 Role-Based Access Control (RBAC)

System roles:

- Visitor
- User
- Moderator
- Admin

---

## 2.2 Access Rules

### Visitor
- Read-only access to public journeys

### User
- Can submit voices only
- Cannot modify core data

### Moderator
- Can approve/reject voices
- Cannot modify journeys

### Admin
- Full system control

---

## 2.3 Endpoint Protection

- Every protected endpoint must validate role
- Unauthorized access must return:
```
401 Unauthorized
```
or
```
403 Forbidden
```

---

# 3. Input Security

## 3.1 Validation

- All inputs must be validated on server side
- Empty or malformed data must be rejected

---

## 3.2 Injection Protection

System must protect against:

- SQL Injection
- XSS (Cross-Site Scripting)
- Command injection

---

# 4. API Security

## 4.1 No Sensitive Data Exposure

API responses must NEVER include:

- PasswordHash
- Internal system errors
- Database structure

---

## 4.2 Standard Error Format

All errors must follow:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

---

# 5. Data Protection

## 5.1 Sensitive Data Handling

- Only necessary data should be stored
- Data must be minimized per request

---

## 5.2 Media Security

- Uploaded files must be validated
- Only allowed file types (images in MVP)
- File size limits must be enforced

---

# 6. Session Security

- JWT is stateless
- No server-side session storage required
- Token tampering must invalidate request

---

# 7. Transport Security

- All communication must use HTTPS in production
- No HTTP allowed for sensitive endpoints

---

# 8. Logging Security

- Logs must NOT contain sensitive data
- Passwords and tokens must never be logged

---

# 9. Moderation Security

- All user-generated content must be treated as unsafe until approved
- Pending content is not visible publicly

---

# 10. File Upload Security

- Validate file type (image only in MVP)
- Prevent executable uploads
- Store files in external secure storage

---

# 11. Rate Limiting (Recommended)

- Limit login attempts
- Limit submission frequency for voices
- Prevent abuse of API endpoints

---

# 12. Error Handling Security

- System errors must not expose internal stack traces
- Only safe messages returned to client

---

# Core Principle

Security is not a feature.

It is a constraint that applies to every part of the system.