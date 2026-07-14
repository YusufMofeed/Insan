// Create Journey page. frontend/docs/04-pages-specification.md doesn't
// have a dedicated "Create Journey" page spec — this page is built
// directly against the backend's CreateJourneyRequest DTO
// (backend/Insan.API/DTOs/JourneyDtos.cs). frontend/docs/06-page-
// implementation-rules.md applies as usual: page content only —
// MainLayout (Navbar/Footer) is composed around it by routes.js (06
// Section 3).
//
// Integrated with the real backend: POST /api/journeys, via
// journeyService (06 Section 4: Page → Service layer → apiClient →
// Backend API — this page never imports journeyApi.js or apiClient
// directly). The endpoint is Admin-only server-side
// ([Authorize(Roles = "Admin")]); the route is currently only
// authenticated-user-gated (requireAuth), not role-gated — the same
// known, already-documented gap noted on AdminJourneysPage.js and
// 05-api-integration.md Section 15. A non-Admin User who reaches this
// form and submits gets a 403 surfaced as the normal inline error (the
// backend returns an empty body on 403, so apiClient's generic fallback
// message is what's shown — not a crash).
//
// `createdBy` (Guid) is still required by CreateJourneyRequest — the
// backend's own comment says it's a temporary stand-in for the
// authenticated user's id until the backend reads it from JWT claims,
// but today it genuinely reads it from the request body. It is not a
// form field (a user shouldn't type their own id) — it's read from
// authState.currentUser.id at submit time (06 Section 8 permits a page
// reading authState for exactly this kind of non-display use).
//
// Simple required-field validation (Full Name, City, Occupation,
// Biography) runs client-side before the request is sent — the backend
// itself still does none (confirmed: no [Required]/[StringLength] on the
// DTO), so this is a UX convenience only, per
// 05-api-integration.md Section 17 ("validate inputs client-side as a
// convenience only, never as the actual guarantee of correctness").
// The submit button is disabled while the request is in flight,
// specifically to prevent a double-click from creating two Journeys —
// a real risk for a create action, unlike Login's already-established
// pattern which doesn't need it.
//
// Reuses Input.js and Button.js only — Biography is a long-form field
// that would ideally be a Textarea, but no Textarea component exists
// yet, so it uses the same text Input as every other field here.

import { createInput } from "../components/Input.js";
import { createButton } from "../components/Button.js";
import { authState } from "../auth/authState.js";
import { journeyService } from "../services/journeyService.js";

const REQUIRED_FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "city", label: "City" },
  { key: "occupation", label: "Occupation" },
  { key: "biography", label: "Biography" },
];

function validateRequiredFields(payload) {
  const missing = REQUIRED_FIELDS.filter(({ key }) => !payload[key] || !payload[key].trim()).map(
    ({ label }) => label
  );

  if (missing.length === 0) {
    return null;
  }

  return `${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} required.`;
}

/**
 * @param {import("../router/Router.js").Router} router
 */
export function createCreateJourneyPage(router) {
  const section = document.createElement("section");
  section.className = "section create-journey";
  section.setAttribute("aria-labelledby", "create-journey-title");

  const container = document.createElement("div");
  container.className = "container create-journey__container";

  const title = document.createElement("h1");
  title.id = "create-journey-title";
  title.className = "create-journey__title";
  title.textContent = "Create Journey";

  const description = document.createElement("p");
  description.className = "create-journey__description";
  description.textContent = "Record the life journey of someone to be remembered.";

  const form = document.createElement("form");
  form.className = "create-journey__form";

  const fullNameInput = createInput({ label: "Full Name", name: "fullName", type: "text" });
  const nicknameInput = createInput({ label: "Nickname", name: "nickname", type: "text" });
  const birthDateInput = createInput({ label: "Birth Date", name: "birthDate", type: "date" });
  const martyrdomDateInput = createInput({ label: "Martyrdom Date", name: "martyrdomDate", type: "date" });
  const cityInput = createInput({ label: "City", name: "city", type: "text" });
  const occupationInput = createInput({ label: "Occupation", name: "occupation", type: "text" });
  const biographyInput = createInput({ label: "Biography", name: "biography", type: "text" });

  const errorMessage = document.createElement("p");
  errorMessage.className = "create-journey__error";
  errorMessage.setAttribute("role", "alert");
  errorMessage.hidden = true;

  const submitButton = createButton({ label: "Create Journey", variant: "primary", type: "submit" });
  submitButton.classList.add("create-journey__submit");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMessage.hidden = true;
    submitButton.disabled = true;

    const formData = new FormData(form);
    const payload = {
      fullName: formData.get("fullName"),
      nickname: formData.get("nickname") || null,
      birthDate: formData.get("birthDate") || null,
      martyrdomDate: formData.get("martyrdomDate") || null,
      city: formData.get("city"),
      occupation: formData.get("occupation"),
      biography: formData.get("biography"),
      createdBy: authState.currentUser?.id,
    };

    const validationError = validateRequiredFields(payload);
    if (validationError) {
      errorMessage.textContent = validationError;
      errorMessage.hidden = false;
      submitButton.disabled = false;
      return;
    }

    try {
      const created = await journeyService.createJourney(payload);
      router.navigate(`/journeys/${created.id}`);
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.hidden = false;
      submitButton.disabled = false;
    }
  });

  form.append(
    fullNameInput,
    nicknameInput,
    birthDateInput,
    martyrdomDateInput,
    cityInput,
    occupationInput,
    biographyInput,
    errorMessage,
    submitButton
  );

  container.append(title, description, form);
  section.appendChild(container);
  return section;
}
