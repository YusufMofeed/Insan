// Journey Details page. frontend/docs/04-pages-specification.md Section 3
// (Journey Details Page) and frontend/docs/06-page-implementation-rules.md.
// Returns this page's own content only — MainLayout (Navbar/Footer) is
// composed around it by routes.js (06 Section 3).
//
// No API calls, no authentication, no services (06 Section 4) — every tab
// uses static mock data shaped like the backend's real DTOs (Voice, Memory,
// Story, LifeEvent), so wiring real data in later is a drop-in replacement,
// not a restructure, matching the precedent set by JourneysPage.js.
//
// The route's `:id` param is available to the route handler in routes.js,
// but this page doesn't take it as an argument or use it to select between
// mock profiles — there is exactly one representative mock Journey today,
// since there is no real data source yet to look one up from (06 Section 4).
//
// Tab switching is local page state (06 Section 5): an `activeKey` value
// held in this module's closure, never reflected in the URL or the Router.

import { createCard } from "../components/Card.js";
import { createLoadingContainer } from "../components/Loading.js";
import { createEmptyState } from "../components/EmptyState.js";
import { createErrorState } from "../components/ErrorState.js";
import { formatDate } from "../utils/formatDate.js";

const MOCK_JOURNEY = {
  fullName: "Ahmad Al-Sayed",
  nickname: "Abu Khalid",
  city: "Aleppo",
  occupation: "Civil Engineer",
  birthDate: "1985-03-12T00:00:00Z",
  martyrdomDate: "2016-09-04T00:00:00Z",
  biography:
    "Ahmad spent his career rebuilding homes for families who had lost everything, and was known across his neighborhood for never turning away someone in need.",
};

const MOCK_VOICES = [
  {
    id: "v1",
    authorName: "Sara Al-Sayed",
    relationship: "Sister",
    content: "He always made time for us, no matter how busy work got.",
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "v2",
    authorName: "Khalid Rahman",
    relationship: "Colleague",
    content: "The most patient engineer I ever worked alongside.",
    createdAt: "2026-02-03T00:00:00Z",
  },
];

const MOCK_MEMORIES = [
  { id: "m1", caption: "At the community center opening, 2014", createdAt: "2014-06-01T00:00:00Z" },
  { id: "m2", caption: "Family gathering, spring 2015", createdAt: "2015-04-20T00:00:00Z" },
  { id: "m3", caption: "On site, final housing project", createdAt: "2016-05-15T00:00:00Z" },
];

const MOCK_STORIES = [
  {
    id: "s1",
    title: "The Winter Rebuild",
    authorName: "Sara Al-Sayed",
    content:
      "In the winter of 2014, Ahmad organized a team of volunteers to rebuild twelve homes before the cold set in — working through the night more than once.",
  },
];

// Deliberately empty — exercises the Life Events tab's Empty-state branch
// in a real render, so all four states (06 Section 6) aren't just present
// in the code but actually verified live, not only the populated ones.
const MOCK_LIFE_EVENTS = [];

/**
 * Renders a tab's content for a given state — "loading", an Error, or a
 * (possibly empty) array. Every tab already knows how to handle all four
 * states even though this page only ever calls it with mock arrays (06
 * Section 4: no API calls yet) — swapping in a real request later is a
 * data change, not a structural one, matching JourneysPage's pattern.
 */
function createTabState(state, { renderContent, emptyTitle, emptyDescription }) {
  if (state === "loading") {
    return createLoadingContainer({ message: "Loading…" });
  }

  if (state instanceof Error) {
    return createErrorState({ message: state.message });
  }

  if (state.length === 0) {
    return createEmptyState({ title: emptyTitle, description: emptyDescription });
  }

  return renderContent(state);
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

function createMemoryImagePlaceholder() {
  const placeholder = document.createElement("div");
  placeholder.className = "memory-card__image";
  placeholder.setAttribute("aria-hidden", "true");
  return placeholder;
}

function createMemoryCard(memory) {
  const content = document.createElement("div");
  content.className = "memory-card__content";

  const caption = document.createElement("p");
  caption.className = "memory-card__caption";
  caption.textContent = memory.caption;

  const date = document.createElement("p");
  date.className = "memory-card__date";
  date.textContent = formatDate(memory.createdAt);

  content.append(createMemoryImagePlaceholder(), caption, date);
  return createCard({ content });
}

function createStoryCard(story) {
  const content = document.createElement("div");
  content.className = "story-card__content";

  const author = document.createElement("p");
  author.className = "story-card__author";
  author.textContent = `By ${story.authorName}`;

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

  const card = createCard({ title: event.title, content: event.description });
  card.classList.add("timeline__card");

  item.append(date, card);
  return item;
}

function createLifeEventsTimeline(events) {
  const list = document.createElement("ol");
  list.className = "timeline";
  events.forEach((event) => list.appendChild(createLifeEventItem(event)));
  return list;
}

function createGalleryTile(memory) {
  const figure = document.createElement("figure");
  figure.className = "gallery-tile";

  const image = document.createElement("div");
  image.className = "gallery-tile__image";
  image.setAttribute("aria-hidden", "true");

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

const TABS = [
  {
    key: "voices",
    label: "Voices",
    render: () =>
      createTabState(MOCK_VOICES, {
        renderContent: (voices) => createCardGrid(voices, createVoiceCard),
        emptyTitle: "No voices yet",
        emptyDescription: "Testimonies shared about this journey will appear here once approved.",
      }),
  },
  {
    key: "memories",
    label: "Memories",
    render: () =>
      createTabState(MOCK_MEMORIES, {
        renderContent: (memories) => createCardGrid(memories, createMemoryCard),
        emptyTitle: "No memories yet",
        emptyDescription: "Photos and moments shared for this journey will appear here.",
      }),
  },
  {
    key: "stories",
    label: "Stories",
    render: () =>
      createTabState(MOCK_STORIES, {
        renderContent: (stories) => createCardGrid(stories, createStoryCard),
        emptyTitle: "No stories yet",
        emptyDescription: "Written stories about this journey will appear here.",
      }),
  },
  {
    key: "life-events",
    label: "Life Events",
    render: () =>
      createTabState(MOCK_LIFE_EVENTS, {
        renderContent: createLifeEventsTimeline,
        emptyTitle: "No life events yet",
        emptyDescription: "This journey's timeline will appear here once events are added.",
      }),
  },
  {
    key: "gallery",
    label: "Gallery",
    render: () =>
      createTabState(MOCK_MEMORIES, {
        renderContent: createGalleryGrid,
        emptyTitle: "No photos yet",
        emptyDescription: "Photos from this journey's memories will appear here.",
      }),
  },
];

function createAvatar(fullName) {
  const avatar = document.createElement("div");
  avatar.className = "journey-header__avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = fullName.charAt(0);
  return avatar;
}

function createJourneyHeader(journey) {
  const header = document.createElement("header");
  header.className = "journey-header";
  header.appendChild(createAvatar(journey.fullName));

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
  header.appendChild(info);
  return header;
}

function createTabsSection() {
  const wrapper = document.createElement("div");
  wrapper.className = "journey-details__tabs-section";

  const tablist = document.createElement("div");
  tablist.className = "journey-details__tablist";
  tablist.setAttribute("role", "tablist");
  tablist.setAttribute("aria-label", "Journey sections");

  const panel = document.createElement("div");
  panel.className = "journey-details__panel";
  panel.setAttribute("role", "tabpanel");

  let activeKey = TABS[0].key;

  function renderPanel() {
    const activeTab = TABS.find((tab) => tab.key === activeKey);
    panel.replaceChildren(activeTab.render());
  }

  const tabButtons = TABS.map((tab) => {
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
        const isActive = TABS[index].key === activeKey;
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

export function createJourneyDetailsPage() {
  const section = document.createElement("section");
  section.className = "section journey-details";
  section.setAttribute("aria-labelledby", "journey-details-title");

  const container = document.createElement("div");
  container.className = "container";
  container.append(createJourneyHeader(MOCK_JOURNEY), createTabsSection());

  section.appendChild(container);
  return section;
}
