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
  const headerCell = table.tHead.rows[0].cells[columnIndex];

  // sort direction (toggle asc/desc)
  let currentDirection =
    headerCell.getAttribute("data-sort-direction") || "desc";
  let newDirection = currentDirection === "asc" ? "desc" : "asc";
  headerCell.setAttribute("data-sort-direction", newDirection);

  // reset dir for other headers
  Array.from(table.tHead.rows[0].cells).forEach((th) => {
    if (th !== headerCell) {
      th.removeAttribute("data-sort-direction");
      // remove sort indicators from other columns
      th.textContent = th.textContent.replace(/ ▲| ▼/, "");
    }
  });

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    // numeric comparison first
    const numA = parseFloat(cellA);
    const numB = parseFloat(cellB);

    let comparison = 0;
    if (!isNaN(numA) && !isNaN(numB)) {
      comparison = numA - numB;
    } else {
      // string comparison (case-insensitive) fallback
      comparison = cellA.toLowerCase().localeCompare(cellB.toLowerCase());
    }

    return newDirection === "asc" ? comparison : -comparison;
  });

  // update header indicator
  // remove old indicator
  headerCell.textContent = headerCell.textContent.replace(/ ▲| ▼/, "");
  headerCell.textContent += newDirection === "asc" ? " ▲" : " ▼";

  // re-append sorted rows to the table body
  tbody.innerHTML = ""; // Clear existing rows
  rows.forEach((row) => tbody.appendChild(row));
}
