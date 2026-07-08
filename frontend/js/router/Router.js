// Reusable client-side Router. frontend/docs/03-project-structure.md.
//
// Owns route registration, URL matching (including :param segments),
// rendering the matched route into the app root, and browser back/forward
// navigation via the History API. It knows nothing about what a "route
// handler" actually does — a handler is any function that receives
// { params } and optionally returns a DOM Node to render. Pages, auth,
// and API logic are the caller's concern entirely.

export class Router {
  #routes = [];
  #rootElement;

  /**
   * @param {Object} options
   * @param {string} [options.rootElementId] - id of the element routes render into.
   */
  constructor({ rootElementId = "app" } = {}) {
    this.#rootElement = document.getElementById(rootElementId);
  }

  /**
   * Register a route.
   * @param {string} path - e.g. "/journeys/:id", or "/admin/*" to also match
   *   any nested path beneath it (a trailing "*" segment only).
   * @param {(context: { params: Object }) => (Node | void)} handler
   */
  add(path, handler) {
    const paramNames = [];
    const segments = path.split("/");
    const isWildcard = segments[segments.length - 1] === "*";
    if (isWildcard) {
      segments.pop();
    }

    const pattern = segments
      .map((segment) => {
        if (segment.startsWith(":")) {
          paramNames.push(segment.slice(1));
          return "([^/]+)";
        }
        return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("/");

    const regexSource = isWildcard ? `^${pattern}(?:/.*)?$` : `^${pattern}$`;

    this.#routes.push({
      path,
      regex: new RegExp(regexSource),
      paramNames,
      handler,
    });
  }

  /**
   * Navigate to a path, pushing a new History entry, then render it.
   * @param {string} path
   */
  navigate(path) {
    if (path !== window.location.pathname) {
      window.history.pushState({}, "", path);
    }
    this.render();
  }

  /**
   * Start the router: renders the current URL, and reacts to browser
   * back/forward (popstate) and in-app link clicks.
   */
  start() {
    window.addEventListener("popstate", () => this.render());
    document.addEventListener("click", (event) => this.#handleLinkClick(event));
    this.render();
  }

  /**
   * Read the current URL, find the matching route, and render it into
   * the app root. No-ops if no route matches or the root element is missing.
   */
  render() {
    if (!this.#rootElement) {
      return;
    }

    const match = this.#matchRoute(window.location.pathname);

    this.#rootElement.replaceChildren();

    if (!match) {
      return;
    }

    const result = match.handler({ params: match.params });

    if (result instanceof Node) {
      this.#rootElement.appendChild(result);
    }
  }

  #matchRoute(pathname) {
    for (const route of this.#routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });
        return { handler: route.handler, params };
      }
    }
    return null;
  }

  #handleLinkClick(event) {
    const link = event.target.closest("a");
    if (!link || link.origin !== window.location.origin) {
      return;
    }
    if (link.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    this.navigate(link.getAttribute("href"));
  }
}
