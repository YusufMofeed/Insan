# INSAN

> Version: 1.1
> Document: 02-ui-design-system.md
> Status: Approved

---

# Overview

This document defines the complete visual identity of the Insan frontend.

It is the mandatory reference for every page, component, and UI element. No page or component may introduce a color, spacing value, radius, shadow, or type size that is not defined here.

This document defines design rules and specifications only. It contains no HTML or CSS implementation — that belongs to the codebase, built strictly according to these rules.

---

# 1. Design Vision

Insan is a human-centered platform for preserving life journeys, memories, voices, stories, and important moments.

The design must communicate:

- **Trust** — the platform is a reliable place to preserve something irreplaceable.
- **Warmth** — human, not clinical.
- **Simplicity** — nothing stands between the visitor and the story.
- **Human connection** — content feels personal, not catalogued.
- **Respect** — calm presentation, never sensational.

The interface should feel similar in simplicity to Instagram, Threads, and Medium — but with its own identity, not a copy of any of them.

Avoid:

- Corporate dashboards
- Excessive animations
- Crowded layouts
- Unnecessary decoration

---

# 2. Design Principles

The UI follows:

- Content first
- Large readable spaces
- Clear hierarchy
- Minimal interactions
- Consistent components
- Mobile-first experience

Every design decision is evaluated against these six principles before anything else, including personal taste.

---

# 3. Color System

All color must be expressed through the CSS variables below. No other color value may appear anywhere in the codebase.

| Variable | Value | Role |
|---|---|---|
| `--color-primary` | `#2563EB` | Primary actions, links, active states, focus ring |
| `--color-primary-hover` | `#1D4ED8` | Hover/pressed state of primary elements |
| `--color-background` | `#F8FAFC` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, panels, modals, navbar |
| `--color-text` | `#111827` | Primary body and heading text |
| `--color-text-secondary` | `#6B7280` | Captions, timestamps, meta text, placeholders |
| `--color-border` | `#E5E7EB` | Dividers, input borders, card borders |
| `--color-success` | `#16A34A` | Approved / success status only |
| `--color-warning` | `#D97706` | Pending / warning status only |
| `--color-danger` | `#DC2626` | Rejected / destructive actions / error status only |

## Usage Rules

- `--color-primary` is the only accent color used for calls to action, links, and active/selected states. `--color-primary-hover` exists solely as its hover/pressed variant — it is never used as a standalone accent.
- `--color-background` and `--color-surface` are the only two backgrounds. `--color-background` is the page canvas; `--color-surface` sits on top of it (cards, modals, the navbar).
- `--color-success`, `--color-warning`, and `--color-danger` are reserved for status communication (e.g. Voice moderation state, form validation, destructive confirmation) — never for decoration, branding, or emphasis.
- **Do not introduce random colors.** If a design need seems to require a color not listed here, it is a sign the design should be reconsidered against the existing palette, not a reason to add one.

---

# 4. Typography

**Primary font:** Inter
**Arabic fallback:** Cairo

Font stack: `'Inter', 'Cairo', -apple-system, BlinkMacSystemFont, sans-serif`

| Role | Size | Weight | Line height |
|---|---|---|---|
| H1 (page title) | 32px | 700 | 1.25 |
| H2 (section title) | 24px | 700 | 1.3 |
| H3 (card/subsection title) | 20px | 600 | 1.35 |
| H4 (minor heading) | 16px | 600 | 1.4 |
| Body | 16px | 400 | 1.6 |
| Caption / meta text | 13px | 400 | 1.5 |
| Button text | 15px | 600 | 1 |

## Rules

- Readable sizes — body text never smaller than 16px; captions never smaller than 13px.
- Good line height — body copy uses generous line height (≥1.5) for long-form reading (Stories, Voices).
- Avoid overly small text. If something feels like it needs to shrink below the caption size to fit, the layout is wrong, not the type scale.
- Headings use the defined weights only — no arbitrary boldness.

---

# 5. Layout System

**Maximum content width:** 1100px

**Spacing scale** (used for all margin, padding, and gap values — no arbitrary spacing is permitted):

| Variable | Value |
|---|---|
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-12` | 48px |
| `--space-16` | 64px |

## Containers, Sections, Cards, Grids

- **Container** — centers content and caps it at the 1100px maximum width, with horizontal padding of `--space-4` on mobile and `--space-6` on larger screens.
- **Sections** — vertical rhythm between sections uses `--space-12` or `--space-16`; content within a section uses the smaller values.
- **Cards** — internal padding uses `--space-4` to `--space-6`; see Section 10.
- **Grid layouts** — used for collections (Memories, Journey listings). Column gap and row gap both use the spacing scale, never a custom value. Grids collapse to a single column on mobile (Section 17).

---

# 6. Border Radius

| Variable | Value | Usage |
|---|---|---|
| `--radius-sm` | 8px | Inputs, badges, small controls |
| `--radius-md` | 12px | Buttons, cards |
| `--radius-lg` | 16px | Modals, large media, prominent containers |

Radius values are applied consistently by element type — a button is always `--radius-md`, never a mix.

---

# 7. Shadows

Shadows are minimal and used only to indicate elevation, never for decoration.

| Variable | Usage | Character |
|---|---|---|
| `--shadow-card` | Cards at rest | Very soft, low-opacity, small blur |
| `--shadow-dropdown` | Dropdown menus, popovers | Slightly stronger than card, tight spread |
| `--shadow-modal` | Modals, dialogs | Most prominent, still soft — never harsh |

Avoid heavy shadows. If a shadow is visually loud enough to draw attention on its own, it is too strong.

---

# 8. Buttons

Four button variants exist. No ad-hoc button styles are permitted outside these four.

## Shared specification

- Height: 44px (touch-friendly)
- Padding: `--space-4` horizontal
- Radius: `--radius-md`
- Typography: Button text style (Section 4)
- Disabled state: 50% opacity, no hover/active behavior, `cursor: not-allowed`
- Loading state: label replaced or accompanied by a small inline spinner; button remains the same size (no layout shift); interaction disabled while loading

## Variants

- **Primary** — `--color-primary` background, white text. Hover: `--color-primary-hover` background.
- **Secondary** — `--color-surface` background, `--color-text` text, `--color-border` border. Hover: `--color-background` background.
- **Danger** — `--color-danger` background, white text. Used only for destructive, confirmed actions. Hover: darkened via reduced opacity, not a new color variable.
- **Ghost** — transparent background, `--color-primary` text, no border. Hover: `--color-background` background. Used for low-emphasis actions (e.g. "Cancel").

---

# 9. Forms

## Elements

- **Input** — single-line text entry.
- **Textarea** — multi-line text entry (Stories, Voices, Biography).
- **Select** — fixed-choice entry.
- **Checkbox** — boolean entry.

## States

| State | Treatment |
|---|---|
| Normal | `--color-border` border, `--color-surface` background |
| Focus | Border becomes `--color-primary`, visible focus ring |
| Error | Border becomes `--color-danger`; error message shown below in `--color-danger` |
| Success | Border becomes `--color-success` (used sparingly, e.g. confirmed availability) |
| Disabled | Reduced opacity, `--color-background` fill, no interaction |

## Rules

- Every input has a clear, visible label — placeholder text is never a substitute for a label.
- Errors are specific and helpful ("Email is required" rather than "Invalid input").
- Forms are fully operable via keyboard and screen reader (see Section 19).

---

# 10. Cards

A single reusable card style is used across all content types: Journey cards, Voice cards, Story cards, Memory items, and Life Events. Each content type may adapt internal layout, but the card shell is shared.

- **Padding:** `--space-4` to `--space-6` depending on card density
- **Border:** 1px solid `--color-border`
- **Radius:** `--radius-md`
- **Shadow:** `--shadow-card`
- **Hover behavior:** subtle lift — shadow shifts toward `--shadow-dropdown` and the card offsets slightly upward; transition follows Section 20's timing rules. Non-interactive cards (e.g. inside a read-only timeline) do not use hover behavior.

---

# 11. Navigation

## Variants

- **Public Navbar** — shown to unauthenticated visitors. Contains branding and entry points to browse Journeys and to log in.
- **Authenticated Navbar** — adds account-aware actions (e.g. submit a Voice, access based on role) on top of the public navbar's content.
- **Mobile Navigation** — collapses into a minimal, thumb-reachable pattern (e.g. bottom bar or slide-out menu) rather than shrinking the desktop navbar.

## Rules

- Simple — never more than the essential set of destinations.
- Consistent — the same navigation pattern appears on every page.
- Never overcrowded — if a new item doesn't clearly belong, it doesn't get added.

---

# 12. User Identity Components

- **Avatar** — circular, consistent sizing scale (e.g. small for lists, large for profile header), falls back to initials on a `--color-background` fill when no image exists.
- **Profile header** — avatar, name, and role badge, laid out consistently wherever a user's identity is shown.
- **User badge** — compact inline identity (small avatar + name), used in authorship contexts (e.g. Voice author).
- **Role badge** — small label communicating `Admin` / `Moderator` / `User`, using neutral styling (border + `--color-text-secondary`), never the status colors from Section 3.

---

# 13. Timeline Component

Life Events are presented as a timeline.

- **Timeline structure** — a vertical line connecting ordered event markers, each anchored to a card containing the event's title, description, and optional image. Order follows `DisplayOrder`, per the backend contract.
- **Date display** — dates are shown in a consistent, human-readable format aligned to each marker; when a year alone is meaningful, month/day may be de-emphasized using `--color-text-secondary`.
- **Image handling** — event images follow the Media Components rules (Section 14); an event without an image simply omits the image slot rather than showing a placeholder.
- **Mobile behavior** — the vertical line and markers remain in a single column on all screen sizes (Section 17); spacing tightens using the smaller values of the spacing scale.

---

# 14. Media Components

- **Memory gallery** — a responsive grid of Memory items (Section 5's grid rules).
- **Image cards** — a Memory rendered as an image with its caption, following the shared card shell (Section 10).
- **Voice player card** — presents a Voice's author, relationship, and content in the shared card shell; if audio playback is introduced later, it is added as an enhancement to this same card, not a new component.
- **Story preview** — a truncated view of a Story (title + excerpt) in the shared card shell, linking to the full Story.

## Rules

- Responsive images — images scale to their container and never overflow it.
- Lazy loading — images below the fold are lazy-loaded.
- Empty states — every media collection defines an empty state (see Section 15) rather than rendering nothing.

---

# 15. Feedback Components

- **Toast** — brief, non-blocking confirmation or error, auto-dismissing.
- **Alert** — inline, persistent message within a page or form (e.g. a banner above a form explaining why submission failed).
- **Modal** — blocking dialog for focused tasks or confirmations (uses `--shadow-modal` and `--radius-lg`).
- **Loading spinner** — used for short, indeterminate waits (e.g. button loading state, Section 8).
- **Skeleton loader** — used for initial content loading, mirroring the shape of the content it precedes (e.g. a card-shaped skeleton before Journey cards load).
- **Empty state** — shown when a collection has no items yet; calm and informative, never an error.
- **Error state** — shown when a request fails; explains what happened in plain language and, where applicable, offers a retry action.

---

# 16. Table

**Purpose:** Display tabular administrative data.

**Features:**

- Responsive horizontal scrolling — the table scrolls within its own container on narrow viewports rather than breaking the page layout (Section 17).
- Header row — column labels use `--color-text-secondary`, distinguishing them from body content, consistent with captions/meta text elsewhere (Section 3).
- Empty state support — a table with no rows defers to the shared Empty State (Section 15) rather than rendering a blank grid.
- Optional actions column — a trailing column for row-level actions (e.g. Edit, Delete), aligned to the end of the row.

**Styling:**

- Uses existing spacing, border, and color tokens (Section 3, Section 5) — cell padding from the spacing scale, row dividers in `--color-border`, header text in `--color-text-secondary`.
- No new design tokens introduced.

---

# 17. Responsive Rules

| Breakpoint | Range |
|---|---|
| Mobile | up to 639px |
| Tablet | 640px – 1023px |
| Desktop | 1024px and above |

Design and implementation are Mobile First: base styles target mobile, and rules are added for larger breakpoints as needed — never the reverse.

Components adapt primarily through layout (grid columns collapsing, navigation switching patterns), not through hiding functionality. A feature available on desktop is available on mobile.

---

# 18. RTL Support

The platform supports Arabic.

- **Direction handling** — the document `dir` attribute switches between `ltr` and `rtl` based on the active language; layout must not assume a fixed direction.
- **Text alignment** — text aligns to the start of the reading direction, not hardcoded left or right.
- **Icon positioning** — directional icons (e.g. back/forward arrows, chevrons) mirror with the reading direction; non-directional icons (e.g. a heart, a camera) do not.
- **Layout considerations** — spacing and positioning use logical properties (start/end) rather than physical ones (left/right) wherever the two would differ under RTL.

---

# 19. Accessibility

- **Contrast** — text meets WCAG AA: at least 4.5:1 for body text, 3:1 for large text (18px+ bold or 24px+ regular). The defined color pairs in Section 3 are chosen to satisfy this against their intended backgrounds.
- **Focus states** — every interactive element has a visible focus indicator; focus is never suppressed.
- **Keyboard navigation** — every interaction available via mouse/touch is available via keyboard, in a logical tab order.
- **Screen reader considerations** — semantic landmarks and headings communicate structure; all images have meaningful `alt` text (or are marked decorative); dynamic feedback (toasts, errors) is announced via appropriate ARIA live regions.

---

# 20. Animation Rules

Animations are subtle and purposeful — they clarify a transition, never entertain.

**Allowed:**

- Fade
- Slide
- Hover transitions

**Not allowed:**

- Heavy motion
- Continuous/looping animations

Transitions are short (roughly 150–250ms) and respect the user's `prefers-reduced-motion` setting by disabling non-essential motion when it is set.

---

# 21. Design Consistency Rules

Every new component must:

- Reuse existing variables (color, spacing, radius, shadow, typography) — never introduce a new one without updating this document first.
- Reuse existing spacing values from the defined scale.
- Reuse existing components (buttons, cards, form elements, feedback components) rather than building a one-off equivalent.
- Avoid creating duplicate styles — if two components look almost the same, they should share the same underlying style, not two similar but separately maintained ones.

This document is the single source of truth. If a page needs something this document doesn't define, the document is updated first — implementation never quietly diverges from it.
