// Route guard helpers. frontend/docs/05-api-integration.md Section 15.
// The router (js/router/Router.js) has no concept of a "protected route" —
// it only knows add(path, handler). Guarding is applied where routes are
// registered (js/app/routes.js), by wrapping a route's real handler with
// one of these. Both reuse authState (Section 13) as the single source of
// truth for "is there a valid session right now" — no separate check is
// invented here.

import { authState } from "./authState.js";

function isSafeRedirectTarget(value) {
  // Only ever navigate to a same-app path — never let an attacker-supplied
  // ?redirect= value send a freshly-authenticated user off-site.
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
}

/**
 * Wrap a route handler so it only renders for an authenticated user. An
 * unauthenticated visitor is redirected to /login, with the path they
 * tried to reach preserved as ?redirect=<path> so login can send them
 * back afterward.
 *
 * @param {import("../router/Router.js").Router} router
 * @param {(context: { params: Object }) => (Node | void)} handler
 */
export function requireAuth(router, handler) {
  return (context) => {
    if (!authState.isAuthenticated) {
      const destination = window.location.pathname + window.location.search;
      router.navigate(`/login?redirect=${destination}`);
      return;
    }
    return handler(context);
  };
}

/**
 * Wrap a route handler so it only renders for a visitor who is NOT
 * authenticated (e.g. /login, /register) — an already-authenticated user
 * is sent to /journeys instead of seeing the auth form again.
 *
 * @param {import("../router/Router.js").Router} router
 * @param {(context: { params: Object }) => (Node | void)} handler
 */
export function publicOnly(router, handler) {
  return (context) => {
    if (authState.isAuthenticated) {
      router.navigate("/journeys");
      return;
    }
    return handler(context);
  };
}

/**
 * Resolve where to send the user right after a successful login: the
 * ?redirect= path that brought them to /login, if present and safe,
 * otherwise /journeys.
 * @returns {string}
 */
export function resolvePostLoginRedirect() {
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  return isSafeRedirectTarget(redirect) ? redirect : "/journeys";
}
