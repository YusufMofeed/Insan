// Landing page. frontend/docs/04-pages-specification.md Section 2.
// Returns this page's own content only — MainLayout (Navbar/Footer) is
// composed around it by routes.js, not by this file. No API calls, no
// authentication, no business logic — this page uses static content.

import { createCard } from "../components/Card.js";

function createHeroSection() {
  const hero = document.createElement("section");
  hero.className = "hero section";
  hero.setAttribute("aria-labelledby", "hero-title");

  const container = document.createElement("div");
  container.className = "container hero__container";

  const title = document.createElement("h1");
  title.id = "hero-title";
  title.className = "hero__title";
  title.textContent = "Preserving human stories and memories";

  const description = document.createElement("p");
  description.className = "hero__description";
  description.textContent =
    "Insan documents the journeys, voices, memories, and stories of the people who came before us — so they are remembered with dignity, not reduced to statistics.";

  const cta = document.createElement("a");
  cta.className = "btn btn--primary hero__cta";
  cta.href = "/journeys";
  cta.textContent = "Explore Journeys";

  container.append(title, description, cta);
  hero.appendChild(container);

  return hero;
}

function createExplanationSection() {
  const section = document.createElement("section");
  section.className = "section explanation";
  section.setAttribute("aria-labelledby", "explanation-title");

  const container = document.createElement("div");
  container.className = "container";

  const heading = document.createElement("h2");
  heading.id = "explanation-title";
  heading.className = "explanation__heading";
  heading.textContent = "What Insan preserves";

  const grid = document.createElement("div");
  grid.className = "grid explanation__grid";

  const items = [
    { title: "Journeys", content: "The complete life record of a person, told with care." },
    { title: "Voices", content: "Testimonies from the people who knew them, shared and moderated with respect." },
    { title: "Memories", content: "Photographs and moments that keep a person present." },
  ];

  items.forEach(({ title, content }) => {
    grid.appendChild(createCard({ title, content }));
  });

  container.append(heading, grid);
  section.appendChild(container);

  return section;
}

function createCallToActionSection() {
  const section = document.createElement("section");
  section.className = "section cta-section";
  section.setAttribute("aria-labelledby", "cta-title");

  const container = document.createElement("div");
  container.className = "container cta-section__container";

  const heading = document.createElement("h2");
  heading.id = "cta-title";
  heading.textContent = "Every human has a story";

  const description = document.createElement("p");
  description.textContent = "Begin exploring the journeys preserved on Insan.";

  const cta = document.createElement("a");
  cta.className = "btn btn--primary";
  cta.href = "/journeys";
  cta.textContent = "Browse Journeys";

  container.append(heading, description, cta);
  section.appendChild(container);

  return section;
}

export function createHomePage() {
  const page = document.createElement("div");
  page.className = "home-page";
  page.append(createHeroSection(), createExplanationSection(), createCallToActionSection());
  return page;
}
