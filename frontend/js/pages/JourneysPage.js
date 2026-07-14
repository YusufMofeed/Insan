// Journeys Feed page. frontend/docs/04-pages-specification.md Section 3
// (Journeys Feed Page) and frontend/docs/06-page-implementation-rules.md.
// Returns this page's own content only — MainLayout (Navbar/Footer) is
// composed around it by routes.js, not by this file.
//
// Integrated with the real backend: GET /api/journeys, via
// journeyService (06 Section 4: Page → Service layer → apiClient →
// Backend API — this page never imports journeyApi.js or apiClient
// directly).
//
// The real JourneyResponse has no "creator" field (confirmed against
// backend/Insan.API/DTOs/JourneyDtos.cs) — the previous mock version of
// this page showed a fabricated creatorName; now that real data is wired
// in, each card shows the fields that actually exist instead (occupation,
// city, a biography excerpt).
//
// Pagination: GET /api/journeys returns { data, totalCount, page,
// pageSize } (05-api-integration.md Section 9), but this task only wires
// the first page of results — a Pagination control is a separate,
// not-yet-requested feature. journeyService.getJourneys(params) already
// accepts page/pageSize/search/city/occupation, so wiring one later is a
// call-site change, not a restructure.

import { createCard } from "../components/Card.js";
import { createLoadingContainer } from "../components/Loading.js";
import { createEmptyState } from "../components/EmptyState.js";
import { createErrorState } from "../components/ErrorState.js";
import { formatDate } from "../utils/formatDate.js";
import { journeyService } from "../services/journeyService.js";

function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text || "";
  }
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

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
  description.textContent = truncate(journey.biography, 140);

  const meta = document.createElement("p");
  meta.className = "journey-card__meta";
  const metaParts = [journey.occupation, journey.city].filter(Boolean);
  metaParts.push(formatDate(journey.createdAt));
  meta.textContent = metaParts.join(" · ");

  content.append(description, meta);

  const viewLink = document.createElement("a");
  viewLink.className = "btn btn--secondary";
  viewLink.href = `/journeys/${journey.id}`;
  viewLink.textContent = "View Journey";

  return createCard({
    title: journey.fullName,
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
 * Fetches journeys and renders the result into `contentContainer` — the
 * page's own element, updated in place once the request settles (06
 * Section 2: direct DOM manipulation is fine on elements the page itself
 * created). Called again by the ErrorState's retry action, so a failed
 * request isn't a dead end.
 */
function loadJourneys(contentContainer) {
  contentContainer.replaceChildren(createLoadingContainer({ message: "Loading journeys…" }));

  journeyService
    .getJourneys()
    .then((response) => {
      const journeys = response.data;

      if (journeys.length === 0) {
        contentContainer.replaceChildren(
          createEmptyState({
            title: "No journeys yet",
            description: "Journeys will appear here once they're added to Insan.",
          })
        );
        return;
      }

      contentContainer.replaceChildren(createJourneysGrid(journeys));
    })
    .catch((error) => {
      contentContainer.replaceChildren(
        createErrorState({
          message: error.message,
          onRetry: () => loadJourneys(contentContainer),
        })
      );
    });
}

export function createJourneysPage() {
  const section = document.createElement("section");
  section.className = "section journeys-page";
  section.setAttribute("aria-labelledby", "journeys-title");

  const container = document.createElement("div");
  container.className = "container";

  const content = document.createElement("div");
  content.className = "journeys-page__content";

  container.append(createJourneysHeader(), content);
  section.appendChild(container);

  loadJourneys(content);

  return section;
}
