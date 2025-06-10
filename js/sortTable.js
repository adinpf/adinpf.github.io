const UP_ARROW = "▲";
const DOWN_ARROW = "▼";
const UP_DOWN_ARROW = "↕";
const ARROW_REGEX = new RegExp(
  `\\s*(${UP_ARROW}|${DOWN_ARROW}|${UP_DOWN_ARROW})$`
);

function getBaseHeaderText(headerText) {
  return headerText.replace(ARROW_REGEX, "").trim();
}

function sortTable(columnIndex) {
  const table = document.getElementById("appleTable");
  if (!table) {
    console.error("Table with ID 'appleTable' not found.");
    return;
  }
  const tbody = table.tBodies[0];
  if (!tbody) {
    console.error("Table body (tbody) not found.");
    return;
  }
  const rows = Array.from(tbody.rows);
  const headerCells = Array.from(table.tHead.rows[0].cells);
  const activeHeaderCell = headerCells[columnIndex];

  // sort direction (toggle asc/desc)
  let currentDirection =
    activeHeaderCell.getAttribute("data-sort-direction") || "desc";
  let newDirection = currentDirection === "asc" ? "desc" : "asc";
  activeHeaderCell.setAttribute("data-sort-direction", newDirection);

  // reset direction and arrows for other headers
  headerCells.forEach((th, index) => {
    const baseText = getBaseHeaderText(th.textContent);
    if (index !== columnIndex) {
      th.removeAttribute("data-sort-direction");
      th.textContent = `${baseText} ${UP_DOWN_ARROW}`;
    }
  });

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    const numA = parseFloat(cellA);
    const numB = parseFloat(cellB);

    let comparison = 0;
    if (!isNaN(numA) && !isNaN(numB)) {
      comparison = numA - numB;
    } else {
      comparison = cellA.toLowerCase().localeCompare(cellB.toLowerCase());
    }

    return newDirection === "asc" ? comparison : -comparison;
  });

  // update active header indicator
  const activeBaseText = getBaseHeaderText(activeHeaderCell.textContent);
  activeHeaderCell.textContent = `${activeBaseText} ${
    newDirection === "asc" ? UP_ARROW : DOWN_ARROW
  }`;

  // re-append sorted rows to the table body
  tbody.innerHTML = ""; // clear existing rows
  rows.forEach((row) => tbody.appendChild(row));
}
