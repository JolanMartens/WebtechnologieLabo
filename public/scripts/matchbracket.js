document.addEventListener("DOMContentLoaded", () => {
    loadBracket();
});

async function loadBracket() {
  const response = await fetch(`/api/matches`);
  const matches = await response.json();

  // Example: render in console
  matches.forEach(match => {
    console.log(`Round ${match.round_number}, Match ${match.match_number}: 
      Team ${match.team1_id} vs Team ${match.team2_id}`);
  });
}

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
