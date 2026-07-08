# INSAN

> Version: 1.0
> Document: 01-frontend-principles.md
> Status: Approved

---

# Overview

This document is the single source of truth for the Insan frontend.

Every future frontend implementation must strictly follow it.

The frontend consumes an already completed ASP.NET Core Web API. It does not define, own, or reimplement any business rule.

---

# 1. Purpose

The frontend is responsible only for:

- UI
- UX
- API communication
- Client-side validation
- Authentication token storage

Business rules must NEVER exist in the frontend.

Any rule that determines what is allowed, who is authorized, or how data is transformed belongs to the backend. The frontend only requests, displays, and submits data.

---

# 2. Core Philosophy

The UI must be:

- Simple
- Minimal
- Clean
- Readable
- Fast
- Responsive
- Accessible

Inspired by modern products like:

- Instagram
- Threads
- Medium

Avoid dashboard-style complexity. Insan documents human stories with dignity and calm — the interface must never compete with the content for attention.

---

# 3. Technologies

Use only:

- HTML5
- CSS3
- Vanilla JavaScript (ES6 Modules)
- Fetch API

No frameworks.

Explicitly prohibited:

- React
- Vue
- Angular
- jQuery
- Bootstrap
- Tailwind
- CSS preprocessors
- TypeScript

Rules:

- No build system.
- No npm packages unless explicitly approved later.

---

# 4. Project Structure

```
frontend/
├── assets/     # Images, fonts, icons, and other static media
├── css/        # Stylesheets
├── js/         # JavaScript modules
├── pages/      # HTML pages (one entry point per route/view)
└── docs/       # Frontend architecture and rules documentation
```

## Folder Responsibilities

- **assets/** — Static media only (images, fonts, icons). No logic, no markup, no styles.
- **css/** — All stylesheets. No JavaScript, no markup.
- **js/** — All JavaScript modules. No inline scripts elsewhere in the project.
- **pages/** — HTML entry points, one per route or view. Pages compose markup and reference `css/` and `js/` files; they do not contain business or API logic inline.
- **docs/** — Frontend-specific documentation, starting with this file.

---

# 5. HTML Rules

- Semantic HTML only.
- Accessibility first.
- No inline styles.
- No inline JavaScript.
- Meaningful class names.
- One responsibility per component.

---

# 6. CSS Rules

- Use CSS Variables.
- Use Flexbox and CSS Grid.
- No `!important` unless unavoidable.
- Mobile First.
- Reusable utility classes only when appropriate.
- Keep selectors shallow.

---

# 7. JavaScript Rules

- Use ES Modules.
- One responsibility per file.
- No global variables.
- Use `async`/`await`.
- Use the Fetch API.
- Separate API logic from UI logic.
- Never duplicate code.

---

# 8. API Communication

- The frontend only consumes the backend API.
- Never implement business rules.
- JWT stored securely.
- Use the `Authorization: Bearer` header.
- Gracefully handle errors.

---

# 9. Responsive Design

Support:

- Desktop
- Tablet
- Mobile

Mobile First.

---

# 10. Performance

- Keep JavaScript lightweight.
- Avoid unnecessary DOM manipulation.
- Lazy-load images when possible.
- Reuse components.

---

# 11. Accessibility

- Keyboard friendly.
- Proper labels.
- ARIA only where necessary.
- Color contrast.
- Visible focus states.

---

# 12. Security

- Never trust client input.
- Never expose secrets.
- Never hardcode API secrets.
- Always sanitize displayed data.

---

# 13. Code Style

- Readable.
- Consistent naming.
- Small functions.
- No duplicated code.
- Comment only when necessary.

---

# 14. Future Expansion

The architecture should allow replacing Vanilla JS with React in the future without changing backend APIs.

Because API logic is kept separate from UI logic (Section 7) and the frontend never owns business rules (Section 1), a future migration only needs to replace the rendering layer — the API contract and data flow remain unchanged.

---

# Core Principle

The frontend presents. The backend decides.

If a piece of logic determines what is true, allowed, or correct, it does not belong in this codebase.
