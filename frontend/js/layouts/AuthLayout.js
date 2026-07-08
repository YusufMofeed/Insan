// Shared layout for authentication pages (Login, Register).
// frontend/docs/04-pages-specification.md Section 2: auth pages are
// "minimal, focused, no navigation clutter" — this deliberately does NOT
// use MainLayout (no Navbar/Footer), just a centered card with a link
// back to Home. No API calls, no auth logic, no state — purely structural.

/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string} [options.description]
 * @param {Node} [options.form]
 * @param {Node} [options.footer]
 * @returns {HTMLElement}
 */
export function createAuthLayout({ title, description = "", form, footer } = {}) {
  const page = document.createElement("main");
  page.className = "auth-page";
  page.setAttribute("aria-labelledby", "auth-title");

  const card = document.createElement("div");
  card.className = "auth-card card";

  const brand = document.createElement("a");
  brand.className = "auth-card__brand";
  brand.href = "/";
  brand.textContent = "Insan";
  card.appendChild(brand);

  const titleEl = document.createElement("h1");
  titleEl.id = "auth-title";
  titleEl.className = "auth-card__title";
  titleEl.textContent = title;
  card.appendChild(titleEl);

  if (description) {
    const descriptionEl = document.createElement("p");
    descriptionEl.className = "auth-card__description";
    descriptionEl.textContent = description;
    card.appendChild(descriptionEl);
  }

  if (form instanceof Node) {
    card.appendChild(form);
  }

  if (footer instanceof Node) {
    card.appendChild(footer);
  }

  page.appendChild(card);

  return page;
}
