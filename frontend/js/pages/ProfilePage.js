// Profile page. frontend/docs/04-pages-specification.md Section 8 (Profile
// Page) and frontend/docs/06-page-implementation-rules.md. Returns this
// page's own content only — MainLayout (Navbar/Footer) is composed around
// it by routes.js (06 Section 3). Access is already restricted to
// authenticated users by the `requireAuth` guard wrapping this route in
// routes.js (06 Section 10) — this page does not check authentication
// itself.
//
// Integrated with the real backend: GET /api/users/me for the header
// (avatar, name, email, role, member-since), via userService (06 Section
// 4: Page → Service layer → apiClient → Backend API; this page never
// imports userApi.js or apiClient directly). Contributions still has no
// backend endpoint, so that section remains mock data only.

import { createCard } from "../components/Card.js";
import { createLoadingContainer } from "../components/Loading.js";
import { createEmptyState } from "../components/EmptyState.js";
import { createErrorState } from "../components/ErrorState.js";
import { formatDate } from "../utils/formatDate.js";
import { userService } from "../services/userService.js";

const MOCK_CONTRIBUTIONS = [
  { id: "c1", label: "Journeys", count: 2 },
  { id: "c2", label: "Voices", count: 5 },
  { id: "c3", label: "Memories", count: 8 },
  { id: "c4", label: "Stories", count: 1 },
];

/**
 * Renders the Contributions section for a given state — "loading", an
 * Error, or a (possibly empty) array. This page only ever calls it with
 * the mock array below (06 Section 4: no API calls yet), but the
 * loading/empty/error branches are already wired to their respective
 * components, matching JourneysPage.js and JourneyDetailsPage.js.
 */
function createContributionsState(state) {
  if (state === "loading") {
    return createLoadingContainer({ message: "Loading contributions…" });
  }

  if (state instanceof Error) {
    return createErrorState({ message: state.message });
  }

  if (state.length === 0) {
    return createEmptyState({
      title: "No contributions yet",
      description: "Journeys, Voices, Memories, and Stories you add will be counted here.",
    });
  }

  return createContributionsGrid(state);
}

function createContributionCard(contribution) {
  const count = document.createElement("p");
  count.className = "contribution-card__count";
  count.textContent = String(contribution.count);

  return createCard({ title: contribution.label, content: count });
}

function createContributionsGrid(contributions) {
  const grid = document.createElement("div");
  grid.className = "grid profile-page__contributions-grid";
  contributions.forEach((contribution) => grid.appendChild(createContributionCard(contribution)));
  return grid;
}

function createAvatar(fullName) {
  const avatar = document.createElement("div");
  avatar.className = "profile-page__avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = fullName.charAt(0);
  return avatar;
}

function createProfileHeader(user) {
  const header = document.createElement("header");
  header.className = "profile-page__header";
  header.appendChild(createAvatar(user.fullName));

  const info = document.createElement("div");
  info.className = "profile-page__info";

  const name = document.createElement("h1");
  name.id = "profile-title";
  name.className = "profile-page__name";
  name.textContent = user.fullName;

  const role = document.createElement("span");
  role.className = "profile-page__role";
  role.textContent = user.role;

  const email = document.createElement("p");
  email.className = "profile-page__email";
  email.textContent = user.email;

  const memberSince = document.createElement("p");
  memberSince.className = "profile-page__meta";
  memberSince.textContent = `Member since ${formatDate(user.createdAt)}`;

  info.append(name, role, email, memberSince);
  header.appendChild(info);
  return header;
}

function loadProfileHeader(container) {
  container.replaceChildren(createLoadingContainer({ message: "Loading profile…" }));

  userService
    .getCurrentUser()
    .then((user) => {
      container.replaceChildren(createProfileHeader(user));
    })
    .catch((error) => {
      container.replaceChildren(
        createErrorState({
          message: error.message,
          onRetry: () => loadProfileHeader(container),
        })
      );
    });
}

export function createProfilePage() {
  const section = document.createElement("section");
  section.className = "section profile-page";
  section.setAttribute("aria-labelledby", "profile-title");

  const container = document.createElement("div");
  container.className = "container";

  const headerContainer = document.createElement("div");
  loadProfileHeader(headerContainer);

  const contributionsHeading = document.createElement("h2");
  contributionsHeading.className = "profile-page__section-heading";
  contributionsHeading.textContent = "Contributions";

  container.append(headerContainer, contributionsHeading, createContributionsState(MOCK_CONTRIBUTIONS));

  section.appendChild(container);
  return section;
}
