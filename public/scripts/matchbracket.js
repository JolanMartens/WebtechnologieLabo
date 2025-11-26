document.addEventListener("DOMContentLoaded", () => {
    loadBracket();
});

async function loadBracket() {
    const bracketDiv = document.getElementById("bracket-container");

    if (!bracketDiv) {
        console.error("Bracket container not found.");
        return;
    }

    try {
        const response = await fetch("/api/get_teams_with_players");   // <-- FIXED
        const teams = await response.json();

        if (!teams.length) {
            bracketDiv.innerHTML = "<p>No teams found.</p>";
            return;
        }

        // Generate match pairs
        const matches = [];
        for (let i = 0; i < teams.length; i += 2) {
            matches.push({
                team1: teams[i],
                team2: teams[i + 1] || { teamName: "Bye" }
            });
        }

        let html = "";
        matches.forEach(m => {
            html += `
                <div class="bracket-match">
                    <div class="bracket-team">${m.team1.teamName}</div>
                    <div class="bracket-vs">vs</div>
                    <div class="bracket-team">${m.team2.teamName}</div>
                </div>
            `;
        });

        bracketDiv.innerHTML = html;

    } catch (e) {
        console.error(e);
        bracketDiv.innerHTML = "<p>Error loading bracket.</p>";
    }
}
