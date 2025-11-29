// Link the table
var matchesTable = document.querySelector('#teamsTable'); // your table has id="teamsTable"

// Fill the table with matches
function fillMatchesTable(matches) {
  for (let i = 0; i < matches.length; i++) {
    let row = matchesTable.insertRow();
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);

    // Replace IDs with names if your API returns them, otherwise show IDs
    cell1.innerHTML = matches[i].team1_name || matches[i].team1_id || '—';
    cell2.innerHTML = matches[i].team2_name || matches[i].team2_id || '—';
    cell3.innerHTML = `${matches[i].scoreA ?? 0} - ${matches[i].scoreB ?? 0}`;
  }
}

// Clear the table rows except header
function clearMatchesTable() {
  while (matchesTable.rows.length > 1) {
    matchesTable.deleteRow(1);
  }
}

// Initialize the table
async function initMatchesTable() {
  const response = await fetch("/api/get_matches");
  const matches = await response.json();
  console.log(matches);
  clearMatchesTable();
  fillMatchesTable(matches);
}

// Run on page load
document.addEventListener("DOMContentLoaded", initMatchesTable);

// Optional: add refresh button logic
document.getElementById('refresh').addEventListener('click', initMatchesTable);


/* to reload matches fetch("/api/generate_matches_for_existing", { method: "POST" })
  .then(r => r.json())
  .then(console.log);
  */


async function generateMatches() {
  const res = await fetch("/api/generate_matches_for_existing", {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  const data = await res.json();
  console.log("Matches created:", data.created);
}
