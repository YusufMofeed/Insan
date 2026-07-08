// Reusable Navbar component. frontend/docs/02-ui-design-system.md Section 11,
// frontend/docs/04-pages-specification.md Section 10.
//
// This component owns no routing and no authentication state — it only
// renders whatever `links` and `actions` it is given, and toggles the
// mobile menu open/closed (pure UI interaction). Deciding *which* links
// belong to a public vs. an authenticated navbar is the caller's job
// (the `auth/` service, per frontend/docs/03-project-structure.md), e.g.:
//
//   // Public:
//   createNavbar({
//     links: [{ label: "Home", href: "/" }, { label: "Journeys", href: "/journeys" }],
//     actions: [createButton({ label: "Login", variant: "primary" })],
//   });
//
//   // Authenticated (placeholder — real wiring happens on the page/service
//   // layer later, not inside this component):
//   createNavbar({
//     links: [{ label: "Home", href: "/" }, { label: "Journeys", href: "/journeys" }],
//     actions: [createButton({ label: "Logout", variant: "ghost" })],
//   });

let navbarIdCounter = 0;

/**
 * @param {Object} options
 * @param {string} [options.brand]
 * @param {{label: string, href?: string}[]} [options.links]
 * @param {Node[]} [options.actions]
 * @returns {HTMLElement}
 */
export function createNavbar({ brand = "Insan", links = [], actions = [] } = {}) {
  navbarIdCounter += 1;
  const menuId = `navbar-menu-${navbarIdCounter}`;

  const nav = document.createElement("nav");
  nav.className = "navbar";

  const inner = document.createElement("div");
  inner.className = "navbar__inner container";

  const brandLink = document.createElement("a");
  brandLink.className = "navbar__brand";
  brandLink.href = "/";
  brandLink.textContent = brand;
  inner.appendChild(brandLink);

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "navbar__toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", menuId);
  toggle.setAttribute("aria-label", "Toggle navigation menu");
  toggle.textContent = "☰";
  inner.appendChild(toggle);

  const menu = document.createElement("div");
  menu.className = "navbar__menu";
  menu.id = menuId;

  const linksList = document.createElement("ul");
  linksList.className = "navbar__links";
  links.forEach(({ label, href = "#" }) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.className = "navbar__link";
    link.href = href;
    link.textContent = label;
    item.appendChild(link);
    linksList.appendChild(item);
  });
  menu.appendChild(linksList);

  if (actions.length > 0) {
    const actionsWrapper = document.createElement("div");
    actionsWrapper.className = "navbar__actions";
    actions.forEach((action) => actionsWrapper.appendChild(action));
    menu.appendChild(actionsWrapper);
  }

  inner.appendChild(menu);
  nav.appendChild(inner);

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("navbar__menu--open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  return nav;
}
