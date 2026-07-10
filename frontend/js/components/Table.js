// Reusable Table component. No corresponding section exists in
// frontend/docs/02-ui-design-system.md today — flagged in this
// implementation's report rather than assumed; styling reuses only
// already-defined tokens (colors, spacing, radius, typography), per
// Section 20, so nothing here waits on that gap being filled.
//
// Pure factory: takes columns + rows as data and returns a Node — it does
// not fetch data, and does not know about loading/empty/error states
// (those stay owned by the page via Loading/EmptyState/ErrorState, per
// frontend/docs/06-page-implementation-rules.md Section 6/7). Sorting,
// pagination, and filtering are out of scope until a real, API-integrated
// admin page actually needs them.

function appendCellContent(cell, value) {
  if (value instanceof Node) {
    cell.appendChild(value);
  } else if (value !== undefined && value !== null) {
    cell.textContent = String(value);
  }
}

/**
 * @param {Object} options
 * @param {{ key: string, label: string, render?: (row: Object) => (string|Node) }[]} options.columns
 * @param {Object[]} [options.rows]
 * @param {(row: Object) => Node[]} [options.rowActions] - optional per-row action buttons/links, rendered in a trailing "Actions" column
 * @param {string} [options.caption] - accessible table caption; omitted if not given
 * @returns {HTMLDivElement}
 */
export function createTable({ columns = [], rows = [], rowActions, caption = "" } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = "table-wrapper";

  const table = document.createElement("table");
  table.className = "table";

  if (caption) {
    const captionEl = document.createElement("caption");
    captionEl.className = "table__caption";
    captionEl.textContent = caption;
    table.appendChild(captionEl);
  }

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");

  columns.forEach((column) => {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = column.label;
    headRow.appendChild(th);
  });

  if (typeof rowActions === "function") {
    const actionsHeader = document.createElement("th");
    actionsHeader.scope = "col";
    actionsHeader.textContent = "Actions";
    headRow.appendChild(actionsHeader);
  }

  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  rows.forEach((row) => {
    const tr = document.createElement("tr");

    columns.forEach((column) => {
      const td = document.createElement("td");
      const value = typeof column.render === "function" ? column.render(row) : row[column.key];
      appendCellContent(td, value);
      tr.appendChild(td);
    });

    if (typeof rowActions === "function") {
      const actionsCell = document.createElement("td");
      actionsCell.className = "table__actions";
      rowActions(row).forEach((action) => actionsCell.appendChild(action));
      tr.appendChild(actionsCell);
    }

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  wrapper.appendChild(table);
  return wrapper;
}
