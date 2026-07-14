// Admin Journeys page (Journey Management). frontend/docs/04-pages-
// specification.md Section 9 (Journey Management) and frontend/docs/06-
// page-implementation-rules.md. Returns this page's own content only —
// MainLayout (Navbar/Footer) is composed around it by routes.js (06
// Section 3). Access is already restricted to authenticated users by the
// `requireAuth` guard wrapping "/admin/journeys" in routes.js (06 Section
// 10); role-based (Admin-only) route authorization is not implemented
// yet — the same known, already-documented gap as "/admin" itself
// (05-api-integration.md Section 15). The three write endpoints wired
// below (POST/PUT/DELETE /api/journeys) are all
// [Authorize(Roles = "Admin")] server-side, so a non-Admin authenticated
// User who reaches this page today would get a normal inline/toast error
// on Delete rather than a crash — but a clear "Admins only" block at the
// route level doesn't exist yet.
//
// Integrated with the real backend: GET /api/journeys for the listing,
// DELETE /api/journeys/{id} for row deletion — both via journeyService
// (06 Section 4). "Edit" is a plain in-app link to /edit-journey/:id,
// which is itself wired to GET/PUT /api/journeys/{id}; "Create Journey"
// links to /create-journey, wired to POST /api/journeys.
//
// Delete confirmation: ConfirmDialog's Confirm button closes the dialog
// synchronously before this page's onConfirm callback runs (see
// ConfirmDialog.js), so there is no in-dialog place left to show a
// failure — Toast is used for both the success and error outcome here,
// per 06 Section 6's explicit allowance for Toast as transient feedback
// outside a page's main content area. On success, the whole list is
// re-fetched rather than optimistically removing the row locally —
// simpler, and guaranteed consistent with the server (DELETE returns 204
// with no body to reconcile against).

import { createTable } from "../components/Table.js";
import { createBadge } from "../components/Badge.js";
import { createButton } from "../components/Button.js";
import { createConfirmDialog } from "../components/ConfirmDialog.js";
import { createLoadingContainer } from "../components/Loading.js";
import { createEmptyState } from "../components/EmptyState.js";
import { createErrorState } from "../components/ErrorState.js";
import { showToast } from "../components/Toast.js";
import { formatDate } from "../utils/formatDate.js";
import { journeyService } from "../services/journeyService.js";

function createRowActions(journey, onDeleted) {
  const editLink = document.createElement("a");
  editLink.className = "btn btn--secondary";
  editLink.href = `/edit-journey/${journey.id}`;
  editLink.textContent = "Edit";

  const deleteDialog = createConfirmDialog({
    title: "Delete Journey",
    message: `Delete "${journey.fullName}"? This cannot be undone.`,
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    confirmVariant: "danger",
    onConfirm: async () => {
      try {
        await journeyService.deleteJourney(journey.id);
        showToast({ message: `"${journey.fullName}" was deleted.`, type: "success" });
        onDeleted();
      } catch (error) {
        showToast({ message: error.message, type: "error" });
      }
    },
  });

  const deleteButton = createButton({
    label: "Delete",
    variant: "danger",
    onClick: () => deleteDialog.open(),
  });

  return [editLink, deleteButton];
}

function createJourneysTable(journeys, onDeleted) {
  return createTable({
    columns: [
      { key: "fullName", label: "Name" },
      { key: "city", label: "City" },
      { key: "occupation", label: "Occupation" },
      { key: "status", label: "Status", render: () => createBadge({ label: "Published", variant: "success" }) },
      { key: "createdAt", label: "Created", render: (row) => formatDate(row.createdAt) },
    ],
    rows: journeys,
    rowActions: (journey) => createRowActions(journey, onDeleted),
  });
}

/**
 * Fetches journeys and renders the result into `container` — the page's
 * own element, updated in place once the request settles (06 Section 2).
 * Passed to itself as the "onDeleted" refresh callback so a successful
 * delete re-fetches the current list rather than mutating it locally.
 */
function loadJourneys(container) {
  container.replaceChildren(createLoadingContainer({ message: "Loading journeys…" }));

  journeyService
    .getJourneys()
    .then((response) => {
      const journeys = response.data;

      if (journeys.length === 0) {
        container.replaceChildren(
          createEmptyState({
            title: "No journeys yet",
            description: "Journeys created on Insan will appear here.",
          })
        );
        return;
      }

      container.replaceChildren(createJourneysTable(journeys, () => loadJourneys(container)));
    })
    .catch((error) => {
      container.replaceChildren(
        createErrorState({
          message: error.message,
          onRetry: () => loadJourneys(container),
        })
      );
    });
}

function createHeader() {
  const header = document.createElement("header");
  header.className = "admin-journeys__header";

  const titleGroup = document.createElement("div");

  const title = document.createElement("h1");
  title.id = "admin-journeys-title";
  title.className = "admin-journeys__title";
  title.textContent = "Journeys";

  const description = document.createElement("p");
  description.className = "admin-journeys__description";
  description.textContent = "Manage the journeys published on Insan.";

  titleGroup.append(title, description);

  const createLink = document.createElement("a");
  createLink.className = "btn btn--primary admin-journeys__create";
  createLink.href = "/create-journey";
  createLink.textContent = "Create Journey";

  header.append(titleGroup, createLink);
  return header;
}

export function createAdminJourneysPage() {
  const section = document.createElement("section");
  section.className = "section admin-journeys";
  section.setAttribute("aria-labelledby", "admin-journeys-title");

  const container = document.createElement("div");
  container.className = "container";

  const content = document.createElement("div");
  container.append(createHeader(), content);
  section.appendChild(container);

  loadJourneys(content);

  return section;
}
