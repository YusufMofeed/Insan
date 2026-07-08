// Reusable Footer. frontend/docs/04-pages-specification.md doesn't define
// footer content beyond "Footer" appearing in the Landing Page's section
// list, so this stays intentionally minimal: platform name, a couple of
// links to routes that already exist, and a copyright line. No routing
// logic — these are plain <a> elements; Router.js's own click interception
// (already built) is what makes them navigate without a full reload, not
// anything in this file.

export function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";

  const container = document.createElement("div");
  container.className = "container footer__container";

  const brand = document.createElement("p");
  brand.className = "footer__brand";
  brand.textContent = "Insan";

  const linksList = document.createElement("ul");
  linksList.className = "footer__links";

  const links = [
    { label: "Home", href: "/" },
    { label: "Journeys", href: "/journeys" },
  ];

  links.forEach(({ label, href }) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    item.appendChild(link);
    linksList.appendChild(item);
  });

  const copyright = document.createElement("p");
  copyright.className = "footer__copyright";
  copyright.textContent = `© ${new Date().getFullYear()} Insan. All rights reserved.`;

  container.append(brand, linksList, copyright);
  footer.appendChild(container);

  return footer;
}
