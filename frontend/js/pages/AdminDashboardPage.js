// Admin Dashboard page. frontend/docs/04-pages-specification.md Section 9
// (Admin Dashboard) and frontend/docs/06-page-implementation-rules.md.
// Returns this page's own content only — MainLayout (Navbar/Footer) is
// composed around it by routes.js (06 Section 3). Access is already
// restricted to authenticated users by the `requireAuth` guard wrapping
// "/admin" in routes.js (06 Section 10); role-based (Admin-only) route
// authorization is not implemented yet — a known, already-documented gap
// (05-api-integration.md Section 15) — this page does not add its own
// role check.
//
// No API calls, no services (06 Section 4) — there is no
// `GET /api/admin/dashboard` endpoint on the backend yet
// (04-pages-specification.md Section 9), so both the statistics and the
// Recent Activity table are mock data. Management links (Journey
// Management, Content Moderation) and any CRUD pages are out of scope for
// this task.

import { createCard } from "../components/Card.js";
import { createBadge } from "../components/Badge.js";
import { createTable } from "../components/Table.js";
import { createLoadingContainer } from "../components/Loading.js";
import { createEmptyState } from "../components/EmptyState.js";
import { createErrorState } from "../components/ErrorState.js";
import { formatDate } from "../utils/formatDate.js";

const MOCK_STATS = [
  { id: "journeys", label: "Journeys", count: 128 },
  { id: "voices", label: "Voices", count: 342 },
  { id: "memories", label: "Memories", count: 560 },
  { id: "stories", label: "Stories", count: 74 },
  { id: "life-events", label: "Life Events", count: 210 },
  { id: "users", label: "Users", count: 96 },
];

const MOCK_ACTIVITY = [
  {
    id: "a1",
    type: "Journey",
    description: 'New journey added: "Ahmad Al-Sayed"',
    actor: "Sara Al-Sayed",
    status: "Published",
    createdAt: "2026-07-08T09:30:00Z",
  },
  {
    id: "a2",
    type: "Voice",
    description: 'New voice submitted for "Ahmad Al-Sayed"',
    actor: "Khalid Rahman",
    status: "Pending",
    createdAt: "2026-07-08T11:15:00Z",
  },
  {
    id: "a3",
    type: "Voice",
    description: 'Voice approved for "Layla Hassan"',
    actor: "Admin",
    status: "Approved",
    createdAt: "2026-07-07T16:40:00Z",
  },
  {
    id: "a4",
    type: "Memory",
    description: 'New memory added: "Family gathering, spring 2015"',
    actor: "Omar Hassan",
    status: "Published",
    createdAt: "2026-07-07T14:05:00Z",
  },
  {
    id: "a5",
    type: "Story",
    description: 'New story published: "The Winter Rebuild"',
    actor: "Sara Al-Sayed",
    status: "Published",
    createdAt: "2026-07-06T10:20:00Z",
  },
  {
    id: "a6",
    type: "Life Event",
    description: "Life event added to Youssef Khalil's timeline",
    actor: "Mariam Khalil",
    status: "Published",
    createdAt: "2026-07-05T18:50:00Z",
  },
  {
    id: "a7",
    type: "User",
    description: "New user registered: Nour Haddad",
    actor: "System",
    status: "Active",
    createdAt: "2026-07-04T08:00:00Z",
  },
];

const STATUS_BADGE_VARIANT = {
  Pending: "warning",
  Approved: "success",
  Published: "success",
  Active: "success",
};

/**
 * Renders a section for a given state — "loading", an Error, or a
 * (possibly empty) array — matching the pattern already used by
 * JourneysPage.js, JourneyDetailsPage.js, and ProfilePage.js. Both
 * sections on this page only ever call it with their mock array (06
 * Section 4: no API calls yet), but the loading/empty/error branches are
 * already wired to their respective components.
 */
function createSectionState(state, { renderContent, emptyTitle, emptyDescription }) {
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

function createStatCard(stat) {
  const count = document.createElement("p");
  count.className = "stat-card__count";
  count.textContent = String(stat.count);

  return createCard({ title: stat.label, content: count });
}

function createStatsGrid(stats) {
  const grid = document.createElement("div");
  grid.className = "grid admin-dashboard__stats-grid";
  stats.forEach((stat) => grid.appendChild(createStatCard(stat)));
  return grid;
}

function createActivityTable(activity) {
  return createTable({
    columns: [
      { key: "type", label: "Type", render: (row) => createBadge({ label: row.type, variant: "neutral" }) },
      { key: "description", label: "Description" },
      { key: "actor", label: "By" },
      {
        key: "status",
        label: "Status",
        render: (row) => createBadge({ label: row.status, variant: STATUS_BADGE_VARIANT[row.status] || "neutral" }),
      },
      { key: "createdAt", label: "Date", render: (row) => formatDate(row.createdAt) },
    ],
    rows: activity,
  });
}

export function createAdminDashboardPage() {
  const section = document.createElement("section");
  section.className = "section admin-dashboard";
  section.setAttribute("aria-labelledby", "admin-dashboard-title");

  const container = document.createElement("div");
  container.className = "container";

  const title = document.createElement("h1");
  title.id = "admin-dashboard-title";
  title.className = "admin-dashboard__title";
  title.textContent = "Admin Dashboard";

  const description = document.createElement("p");
  description.className = "admin-dashboard__description";
  description.textContent = "Platform overview and recent activity.";

  const activityHeading = document.createElement("h2");
  activityHeading.className = "admin-dashboard__section-heading";
  activityHeading.textContent = "Recent Activity";

  const statsState = createSectionState(MOCK_STATS, {
    renderContent: createStatsGrid,
    emptyTitle: "No statistics available",
    emptyDescription: "Platform statistics will appear here once available.",
  });

  const activityState = createSectionState(MOCK_ACTIVITY, {
    renderContent: createActivityTable,
    emptyTitle: "No recent activity",
    emptyDescription: "Recent platform activity will appear here.",
  });

  container.append(title, description, statsState, activityHeading, activityState);

  section.appendChild(container);
  return section;
}
