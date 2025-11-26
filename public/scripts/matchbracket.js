async function loadBracket() {
        const bracketDiv = document.getElementById("bracket-container");

        // Example fetching teams from your backend
        const response = await fetch("/api/teams");
        const teams = await response.json();

        // Generate bracket pairs
        const matches = [];
        for (let i = 0; i < teams.length; i += 2) {
            matches.push({
                team1: teams[i],
                team2: teams[i + 1] || { name: "Bye" }
            });
        }

        // Render HTML
        bracketDiv.innerHTML = matches
            .map(
                m => `
                <div class="bracket-match">
                    <div class="bracket-team">${m.team1.name}</div>
                    <div class="bracket-vs">vs</div>
                    <div class="bracket-team">${m.team2.name}</div>
                </div>`
            )
            .join("");
    }

    loadBracket();