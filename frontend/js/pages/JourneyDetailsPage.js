// Journey Details page. frontend/docs/04-pages-specification.md Section 3
// (Journey Details Page) and frontend/docs/06-page-implementation-rules.md.
// Returns this page's own content only — MainLayout (Navbar/Footer) is
// composed around it by routes.js (06 Section 3).
//
// Integrated with the real backend: GET /api/journeys/{id} for the header,
// and GET /api/journeys/{id}/{voices,memories,stories,lifeevents} for each
// tab — all via their respective services (06 Section 4: Page → Service
// layer → apiClient → Backend API; this page never imports an api/ module
// or apiClient directly). "Gallery" has no backend endpoint of its own —
// it's a photo-grid presentation of the same Memories data, sharing that
// tab's cached fetch rather than requesting it twice.
//
// Per 04's explicit rule ("each section loads and handles its own
// loading/empty/error state independently — a failure in one section must
// not block the others from rendering"): each tab fetches lazily, once,
// the first time it's activated (the default tab fetches on page load),
// and caches its result so revisiting a tab doesn't re-fetch. A failed
// fetch clears that tab's cache so its ErrorState's retry tries again.
//
// Tab switching is local page state (06 Section 5): an `activeKey` value
// held in this module's closure, never reflected in the URL or the Router.

import { createCard } from "../components/Card.js";
import { createLoadingContainer } from "../components/Loading.js";
import { createEmptyState } from "../components/EmptyState.js";
import { createErrorState } from "../components/ErrorState.js";
import { formatDate } from "../utils/formatDate.js";
import { journeyService } from "../services/journeyService.js";
import { voiceService } from "../services/voiceService.js";
import { memoryService } from "../services/memoryService.js";
import { storyService } from "../services/storyService.js";
import { lifeEventService } from "../services/lifeEventService.js";

function createCachedLoader(fetchFn) {
  let promise = null;
  return {
    load() {
      if (!promise) {
        promise = fetchFn();
      }
      return promise;
    },
    reset() {
      promise = null;
    },
  };
}

/**
 * Fetches via `loader` and renders the result into `container` — the
 * page's own element, updated in place once the request settles (06
 * Section 2). `isStillRelevant` guards against a stale response landing
 * after the user has already switched to a different tab (the tab panel
 * is a single shared container, reused across tabs).
 */
function renderSectionState(container, loader, isStillRelevant, { renderContent, emptyTitle, emptyDescription }) {
  container.replaceChildren(createLoadingContainer({ message: "Loading…" }));

  loader
    .load()
    .then((items) => {
      if (!isStillRelevant()) {
        return;
      }
      if (items.length === 0) {
        container.replaceChildren(createEmptyState({ title: emptyTitle, description: emptyDescription }));
        return;
      }
      container.replaceChildren(renderContent(items));
    })
    .catch((error) => {
      if (!isStillRelevant()) {
        return;
      }
      loader.reset();
      container.replaceChildren(
        createErrorState({
          message: error.message,
          onRetry: () => renderSectionState(container, loader, isStillRelevant, { renderContent, emptyTitle, emptyDescription }),
        })
      );
    });
}

function createCardGrid(items, createItemCard) {
  const grid = document.createElement("div");
  grid.className = "grid journey-details__grid";
  items.forEach((item) => grid.appendChild(createItemCard(item)));
  return grid;
}

function createVoiceCard(voice) {
  const content = document.createElement("div");
  content.className = "voice-card__content";

  const relationship = document.createElement("p");
  relationship.className = "voice-card__relationship";
  relationship.textContent = voice.relationship;

  const text = document.createElement("p");
  text.className = "voice-card__text";
  text.textContent = voice.content;

  const meta = document.createElement("p");
  meta.className = "voice-card__meta";
  meta.textContent = formatDate(voice.createdAt);

  content.append(relationship, text, meta);
  return createCard({ title: voice.authorName, content });
}

function createMemoryImage(memory) {
  const image = document.createElement("img");
  image.className = "memory-card__image";
  image.src = memory.url;
  image.alt = memory.caption || "";
  image.loading = "lazy";
  return image;
}

function createMemoryCard(memory) {
  const content = document.createElement("div");
  content.className = "memory-card__content";

  const caption = document.createElement("p");
  caption.className = "memory-card__caption";
  caption.textContent = memory.caption;

  const date = document.createElement("p");
  date.className = "memory-card__date";
  date.textContent = formatDate(memory.uploadedAt);

  content.append(createMemoryImage(memory), caption, date);
  return createCard({ content });
}

function createStoryCard(story) {
  const content = document.createElement("div");
  content.className = "story-card__content";

  const author = document.createElement("p");
  author.className = "story-card__author";
  author.textContent = `By ${story.authorName} · ${formatDate(story.createdAt)}`;

  const excerpt = document.createElement("p");
  excerpt.className = "story-card__excerpt";
  excerpt.textContent = story.content;

  content.append(author, excerpt);
  return createCard({ title: story.title, content });
}

function createLifeEventItem(event) {
  const item = document.createElement("li");
  item.className = "timeline__item";

  const date = document.createElement("p");
  date.className = "timeline__date";
  date.textContent = formatDate(event.eventDate);

  const cardContent = document.createElement("div");

  // An event without an image simply omits the image slot, per
  // 02-ui-design-system.md Section 13 — not a placeholder.
  if (event.imageUrl) {
    const image = document.createElement("img");
    image.className = "timeline__image";
    image.src = event.imageUrl;
    image.alt = event.title;
    image.loading = "lazy";
    cardContent.appendChild(image);
  }

  const description = document.createElement("p");
  description.textContent = event.description;
  cardContent.appendChild(description);

  const card = createCard({ title: event.title, content: cardContent });
  card.classList.add("timeline__card");

  item.append(date, card);
  return item;
}

function createLifeEventsTimeline(events) {
  // Ordered by DisplayOrder ascending (04-pages-specification.md Section
  // 3) — sorted client-side as a safety net regardless of the backend's
  // own ordering guarantee.
  const orderedEvents = [...events].sort((a, b) => a.displayOrder - b.displayOrder);

  const list = document.createElement("ol");
  list.className = "timeline";
  orderedEvents.forEach((event) => list.appendChild(createLifeEventItem(event)));
  return list;
}

function createGalleryTile(memory) {
  const figure = document.createElement("figure");
  figure.className = "gallery-tile";

  const image = document.createElement("img");
  image.className = "gallery-tile__image";
  image.src = memory.url;
  image.alt = memory.caption || "";
  image.loading = "lazy";

  const caption = document.createElement("figcaption");
  caption.className = "gallery-tile__caption";
  caption.textContent = memory.caption;

  figure.append(image, caption);
  return figure;
}

function createGalleryGrid(memories) {
  const grid = document.createElement("div");
  grid.className = "grid gallery-grid";
  memories.forEach((memory) => grid.appendChild(createGalleryTile(memory)));
  return grid;
}

function createAvatar(fullName) {
  const avatar = document.createElement("div");
  avatar.className = "journey-header__avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = fullName.charAt(0);
  return avatar;
}

function createJourneyHeaderContent(journey) {
  const wrapper = document.createElement("div");
  wrapper.className = "journey-header";
  wrapper.appendChild(createAvatar(journey.fullName));

  const info = document.createElement("div");
  info.className = "journey-header__info";

  const name = document.createElement("h1");
  name.id = "journey-details-title";
  name.className = "journey-header__name";
  name.textContent = journey.nickname ? `${journey.fullName} (${journey.nickname})` : journey.fullName;

  const meta = document.createElement("p");
  meta.className = "journey-header__meta";
  const dateRange = journey.martyrdomDate
    ? `${formatDate(journey.birthDate)} – ${formatDate(journey.martyrdomDate)}`
    : formatDate(journey.birthDate);
  meta.textContent = `${journey.occupation} · ${journey.city} · ${dateRange}`;

  const bio = document.createElement("p");
  bio.className = "journey-header__bio";
  bio.textContent = journey.biography;

  info.append(name, meta, bio);
  wrapper.appendChild(info);
  return wrapper;
}

function loadJourneyHeader(container, journeyId) {
  container.replaceChildren(createLoadingContainer({ message: "Loading journey…" }));

  journeyService
    .getJourneyById(journeyId)
    .then((journey) => {
      container.replaceChildren(createJourneyHeaderContent(journey));
    })
    .catch((error) => {
      container.replaceChildren(
        createErrorState({
          message: error.message,
          onRetry: () => loadJourneyHeader(container, journeyId),
        })
      );
    });
}

function createTabsSection(journeyId) {
  const wrapper = document.createElement("div");
  wrapper.className = "journey-details__tabs-section";

  const tablist = document.createElement("div");
  tablist.className = "journey-details__tablist";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", "Journey sections");

  const panel = document.createElement("div");
  panel.className = "journey-details__panel";
  panel.setAttribute("role", "tabpanel");

  const voicesLoader = createCachedLoader(() => voiceService.getVoicesByJourney(journeyId));
  const memoriesLoader = createCachedLoader(() => memoryService.getMemoriesByJourney(journeyId));
  const storiesLoader = createCachedLoader(() => storyService.getStoriesByJourney(journeyId));
  const lifeEventsLoader = createCachedLoader(() => lifeEventService.getLifeEventsByJourney(journeyId));

  const tabs = [
    {
      key: "voices",
      label: "Voices",
      loader: voicesLoader,
      renderContent: (voices) => createCardGrid(voices, createVoiceCard),
      emptyTitle: "No voices yet",
      emptyDescription: "Testimonies shared about this journey will appear here once approved.",
    },
    {
      key: "memories",
      label: "Memories",
      loader: memoriesLoader,
      renderContent: (memories) => createCardGrid(memories, createMemoryCard),
      emptyTitle: "No memories yet",
      emptyDescription: "Photos and moments shared for this journey will appear here.",
    },
    {
      key: "stories",
      label: "Stories",
      loader: storiesLoader,
      renderContent: (stories) => createCardGrid(stories, createStoryCard),
      emptyTitle: "No stories yet",
      emptyDescription: "Written stories about this journey will appear here.",
    },
    {
      key: "life-events",
      label: "Life Events",
      loader: lifeEventsLoader,
      renderContent: createLifeEventsTimeline,
      emptyTitle: "No life events yet",
      emptyDescription: "This journey's timeline will appear here once events are added.",
    },
    {
      key: "gallery",
      // Shares memoriesLoader with the Memories tab — same underlying
      // data, so activating either one (in either order) only fetches
      // /memories once.
      label: "Gallery",
      loader: memoriesLoader,
      renderContent: createGalleryGrid,
      emptyTitle: "No photos yet",
      emptyDescription: "Photos from this journey's memories will appear here.",
    },
  ];

  let activeKey = tabs[0].key;

  function renderPanel() {
    const tab = tabs.find((candidate) => candidate.key === activeKey);
    const keyAtRequestTime = activeKey;
    renderSectionState(panel, tab.loader, () => activeKey === keyAtRequestTime, {
      renderContent: tab.renderContent,
      emptyTitle: tab.emptyTitle,
      emptyDescription: tab.emptyDescription,
    });
  }

  const tabButtons = tabs.map((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "journey-details__tab";
    button.textContent = tab.label;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(tab.key === activeKey));

    button.addEventListener("click", () => {
      if (tab.key === activeKey) {
        return;
      }
      activeKey = tab.key;
      tabButtons.forEach((btn, index) => {
        const isActive = tabs[index].key === activeKey;
        btn.classList.toggle("journey-details__tab--active", isActive);
        btn.setAttribute("aria-selected", String(isActive));
      });
      renderPanel();
    });

    return button;
  });

  tabButtons[0].classList.add("journey-details__tab--active");
  tablist.append(...tabButtons);
  renderPanel();

  wrapper.append(tablist, panel);
  return wrapper;
}

/**
 * @param {string} journeyId
 */
export function createJourneyDetailsPage(journeyId) {
  const section = document.createElement("section");
  section.className = "section journey-details";
  section.setAttribute("aria-labelledby", "journey-details-title");

  const container = document.createElement("div");
  container.className = "container";

  const headerContainer = document.createElement("div");
  container.appendChild(headerContainer);
  loadJourneyHeader(headerContainer, journeyId);

  container.appendChild(createTabsSection(journeyId));

  section.appendChild(container);
  return section;
}
