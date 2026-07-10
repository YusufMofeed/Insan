// Journeys Feed page. frontend/docs/04-pages-specification.md Section 3
// (Journeys Feed Page). Returns this page's own content only — MainLayout
// (Navbar/Footer) is composed around it by routes.js, not by this file.
//
// No API calls, no authentication, no services (frontend/docs/03-project-
// structure.md Section 8: pages talk to services/api, never fetch()
// directly — there is nothing to call yet). Journeys are static mock data
// for now, shaped like the backend's real JourneyResponse (id, fullName,
// city, occupation, biography, createdAt — see backend/Insan.API/DTOs/
// JourneyDtos.cs) so wiring real data in later is a drop-in replacement,
// not a restructure.
//
// One exception: the real JourneyResponse has no "creator" field today —
// there is no `/users/me`-style lookup, and the backend doesn't return who
// created a Journey. `creatorName` below is included because the card spec
// requires creator info; it's mock-only until the backend adds that field.

import { createCard } from "../components/Card.js";
import { createLoadingContainer } from "../components/Loading.js";
import { createEmptyState } from "../components/EmptyState.js";
import { createErrorState } from "../components/ErrorState.js";
import { formatDate } from "../utils/formatDate.js";

const MOCK_JOURNEYS = [
  {
    id: "1",
    title: "Ahmad Al-Sayed",
    shortDescription: "A civil engineer from Aleppo, remembered for rebuilding homes for families who had lost everything.",
    creatorName: "Sara Al-Sayed",
    createdAt: "2026-02-14T10:00:00Z",
  },
  {
    id: "2",
    title: "Layla Hassan",
    shortDescription: "A schoolteacher from Homs who spent two decades teaching children to read and write.",
    creatorName: "Omar Hassan",
    createdAt: "2026-03-02T10:00:00Z",
  },
  {
    id: "3",
    title: "Youssef Khalil",
    shortDescription: "A fisherman from Latakia, known across his village for his generosity and quiet humor.",
    creatorName: "Mariam Khalil",
    createdAt: "2026-04-18T10:00:00Z",
  },
  {
    id: "4",
    title: "Rana Ibrahim",
    shortDescription: "A nurse from Damascus who cared for her neighbors long before it became her profession.",
    creatorName: "Fadi Ibrahim",
    createdAt: "2026-05-27T10:00:00Z",
  },
];

function createJourneysHeader() {
  const header = document.createElement("header");
  header.className = "journeys-page__header";

  const title = document.createElement("h1");
  title.id = "journeys-title";
  title.className = "journeys-page__title";
  title.textContent = "Journeys";

  const description = document.createElement("p");
  description.className = "journeys-page__description";
  description.textContent = "Explore the life stories preserved on Insan.";

  header.append(title, description);
  return header;
}

function createJourneyCard(journey) {
  const content = document.createElement("div");
  content.className = "journey-card__content";

  const description = document.createElement("p");
  description.className = "journey-card__description";
  description.textContent = journey.shortDescription;

  const meta = document.createElement("p");
  meta.className = "journey-card__meta";
  meta.textContent = `Added by ${journey.creatorName} · ${formatDate(journey.createdAt)}`;

  content.append(description, meta);

  const viewLink = document.createElement("a");
  viewLink.className = "btn btn--secondary";
  viewLink.href = `/journeys/${journey.id}`;
  viewLink.textContent = "View Journey";

  return createCard({
    title: journey.title,
    content,
    actions: [viewLink],
    interactive: true,
  });
}

function createJourneysGrid(journeys) {
  const grid = document.createElement("div");
  grid.className = "grid journeys-page__grid";
  journeys.forEach((journey) => grid.appendChild(createJourneyCard(journey)));
  return grid;
}

/**
 * Renders the Journeys list for a given state — "loading", an Error, or a
 * (possibly empty) array of journeys. Once the API layer exists, a future
 * caller passes whatever state a real request is actually in; this page
 * currently only ever calls it with the mock array below (Section 4: no
 * API calls yet), but the loading/empty/error branches are already wired
 * to their respective components so that swap is a data change, not a
 * structural one.
 */
function createJourneysState(state) {
  if (state === "loading") {
    return createLoadingContainer({ message: "Loading journeys…" });
  }

  if (state instanceof Error) {
    return createErrorState({ message: state.message });
  }

  if (state.length === 0) {
    return createEmptyState({
      title: "No journeys yet",
      description: "Journeys will appear here once they're added to Insan.",
    });
  }

  return createJourneysGrid(state);
}

export function createJourneysPage() {
  const section = document.createElement("section");
  section.className = "section journeys-page";
  section.setAttribute("aria-labelledby", "journeys-title");

  const container = document.createElement("div");
  container.className = "container";
  container.append(createJourneysHeader(), createJourneysState(MOCK_JOURNEYS));

  section.appendChild(container);
  return section;
}
