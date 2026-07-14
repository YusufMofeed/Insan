// Edit Journey page. frontend/docs/04-pages-specification.md doesn't have
// a dedicated "Edit Journey" page spec — this page mirrors
// CreateJourneyPage.js's form structure against the backend's
// UpdateJourneyRequest DTO (backend/Insan.API/DTOs/JourneyDtos.cs — same
// fields as CreateJourneyRequest minus createdBy). frontend/docs/06-page-
// implementation-rules.md applies as usual: page content only —
// MainLayout (Navbar/Footer) is composed around it by routes.js (06
// Section 3).
//
// Integrated with the real backend: GET /api/journeys/{id} to prefill the
// form, PUT /api/journeys/{id} to save — both via journeyService (06
// Section 4). The PUT endpoint is Admin-only server-side
// ([Authorize(Roles = "Admin")]); the route is currently only
// authenticated-user-gated, not role-gated — same known gap noted on
// AdminJourneysPage.js and 05-api-integration.md Section 15.
//
// The initial fetch has its own Loading/Error+retry state, since the
// form has nothing meaningful to show until it resolves — a page
// depending on remote data must support these states regardless of
// whether that data is a collection or a single record (06 Section 6).
//
// Simple required-field validation (Full Name, City, Occupation,
// Biography) runs client-side before the request is sent — the backend
// itself still does none, so this is a UX convenience only, per
// 05-api-integration.md Section 17. The submit button is disabled while
// the save request is in flight, to prevent a double-click from firing
// two PUT requests.

import { createInput } from "../components/Input.js";
import { createButton } from "../components/Button.js";
import { createLoadingContainer } from "../components/Loading.js";
import { createErrorState } from "../components/ErrorState.js";
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

function toDateInputValue(isoDate) {
  // Extracted directly from the ISO string, not via Date parsing — a
  // date-only value re-formatted through a Date object risks shifting by
  // a day depending on the viewer's local timezone vs. the UTC midnight
  // the backend sends.
  return isoDate ? isoDate.slice(0, 10) : "";
}

function createEditForm(journey, journeyId, router) {
  const form = document.createElement("form");
  form.className = "edit-journey__form";

  const fullNameInput = createInput({ label: "Full Name", name: "fullName", type: "text", value: journey.fullName });
  const nicknameInput = createInput({ label: "Nickname", name: "nickname", type: "text", value: journey.nickname || "" });
  const birthDateInput = createInput({
    label: "Birth Date",
    name: "birthDate",
    type: "date",
    value: toDateInputValue(journey.birthDate),
  });
  const martyrdomDateInput = createInput({
    label: "Martyrdom Date",
    name: "martyrdomDate",
    type: "date",
    value: toDateInputValue(journey.martyrdomDate),
  });
  const cityInput = createInput({ label: "City", name: "city", type: "text", value: journey.city });
  const occupationInput = createInput({ label: "Occupation", name: "occupation", type: "text", value: journey.occupation });
  const biographyInput = createInput({ label: "Biography", name: "biography", type: "text", value: journey.biography });

  const errorMessage = document.createElement("p");
  errorMessage.className = "edit-journey__error";
  errorMessage.setAttribute("role", "alert");
  errorMessage.hidden = true;

  const submitButton = createButton({ label: "Save Changes", variant: "primary", type: "submit" });
  submitButton.classList.add("edit-journey__submit");

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
    };

    const validationError = validateRequiredFields(payload);
    if (validationError) {
      errorMessage.textContent = validationError;
      errorMessage.hidden = false;
      submitButton.disabled = false;
      return;
    }

    try {
      const updated = await journeyService.updateJourney(journeyId, payload);
      router.navigate(`/journeys/${updated.id}`);
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

  return form;
}

function loadJourneyForEdit(container, journeyId, router) {
  container.replaceChildren(createLoadingContainer({ message: "Loading journey…" }));

  journeyService
    .getJourneyById(journeyId)
    .then((journey) => {
      container.replaceChildren(createEditForm(journey, journeyId, router));
    })
    .catch((error) => {
      container.replaceChildren(
        createErrorState({
          message: error.message,
          onRetry: () => loadJourneyForEdit(container, journeyId, router),
        })
      );
    });
}

/**
 * @param {string} journeyId
 * @param {import("../router/Router.js").Router} router
 */
export function createEditJourneyPage(journeyId, router) {
  const section = document.createElement("section");
  section.className = "section edit-journey";
  section.setAttribute("aria-labelledby", "edit-journey-title");

  const container = document.createElement("div");
  container.className = "container edit-journey__container";

  const title = document.createElement("h1");
  title.id = "edit-journey-title";
  title.className = "edit-journey__title";
  title.textContent = "Edit Journey";

  const description = document.createElement("p");
  description.className = "edit-journey__description";
  description.textContent = "Update the details of this life journey.";

  const formContainer = document.createElement("div");

  container.append(title, description, formContainer);
  section.appendChild(container);

  loadJourneyForEdit(formContainer, journeyId, router);

  return section;
}
