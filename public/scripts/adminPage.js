document.addEventListener('DOMContentLoaded', () => {
    getPlayerList();

    document.getElementById('searchInput').addEventListener('keyup', filterTable);

    document.getElementById('saveChangesBtn').addEventListener('click', savePlayerChanges);
});

let allPlayers = [];

async function getPlayerList() {
    const response = await fetch('/api/get_player_list');
    allPlayers = await response.json();
    console.log(allPlayers);
    renderTable(allPlayers);
}

function renderTable(players) {
    const table = document.getElementById('playersTable');
    table.innerHTML = '';

    players.forEach(player => {
        const tr = document.createElement('tr');

        const team = player.teamId
            ? `<span class="text-success">${player.teamName}</span>`
            : '<span class="text-warning">Geen team</span>';

        tr.innerHTML = `
            <td>${player.firstName} ${player.lastName}</td>
            <td>${player.email}</td>
            <td>${team}</td>
            <td>
                <button class="btn btn-sm btn-primary me-2" onclick="openEditModal('${player._id}')">
                    <i class="fa fa-edit"></i> Bijwerken
                </button>
                <button class="btn btn-sm btn-danger" onclick="deletePlayer('${player._id}')">
                    <i class="fa fa-trash"></i> Verwijder
                </button>
            </td>
        `;
        table.appendChild(tr);
    });
}


async function deletePlayer(id) {
    const response = await fetch(`/api/admin/delete_player/${id}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    if (result.success) {
        getPlayerList();
    } else {
        console.log("error in deletePlayer" + result.error);
    }

}

function openEditModal(id) {
    const player = allPlayers.find(p => p._id === id);
    if (!player) return;

    // fill in the modal
    document.getElementById('editId').value = player._id;
    document.getElementById('editFirstName').value = player.firstName;
    document.getElementById('editLastName').value = player.lastName;
    document.getElementById('editEmail').value = player.email;
    document.getElementById('editTeam').value = player.teamId;

    // show modal
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
    fillModalTeamsDropdown(player.teamId);

}

async function savePlayerChanges() {
    const id = document.getElementById('editId').value;
    const newTeamId = document.getElementById('editTeam').value;

    const data = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
        teamId: newTeamId === 'null' ? null : newTeamId,
    };

    try {
        const response = await fetch(`/api/admin/update_player/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const modalEl = document.getElementById('editModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            await getPlayerList();
        } else {
            console.log('error in savePlayerChanges');
        }
    } catch (error) {
        console.log("error in savePlayerChanges: " + error);
    }
}

function filterTable() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allPlayers.filter(player =>
        player.email.toLowerCase().includes(term)
    );
    renderTable(filtered);
}


document.addEventListener('DOMContentLoaded', () => {
    loadTeams();  
});

async function loadTeams() {
    try {
        const response = await fetch('/api/get_teams_with_players');
        const teams = await response.json();
        console.log('Teams loaded:', teams); // debug
        renderTeamScores(teams);
    } catch (error) {
        console.error('Error loading teams:', error);
    }
}

function renderTeamScores(teams) {
    const table = document.getElementById('teamScoreTable');
    table.innerHTML = '';

    teams.forEach(team => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${team.teamName}</td>
            <td>${team.score}</td>
            <td>
                <button class="btn btn-sm btn-success add-score" data-id="${team._id}" data-p="-1">-1</button>
                <button class="btn btn-sm btn-primary add-score" data-id="${team._id}" data-p="1">+1</button>
                <button class="btn btn-sm btn-warning add-score" data-id="${team._id}" data-p="3">+3</button>
                <button class="btn btn-sm btn-danger" onclick="deleteTeam('${team._id}')">
                    <i class="fa fa-trash"></i> Verwijder
                </button>

            </td>
        `;

        table.appendChild(tr);
    });
}

async function fillModalTeamsDropdown(teamId) {
    try {
        const dropdown = document.getElementById('editTeam');
        if (!dropdown) return;

        const response = await fetch("/api/get_teams_with_players");
        const teams = await response.json();

        while (dropdown.options.length > 1) {
            dropdown.remove(1);
        }

        teams.forEach(team => {
            const teamIdString = team._id.toString();
            const notFull = team.players.length < 2;
            const isCurrentTeam = teamId === teamIdString;

            if (notFull || isCurrentTeam) {
                const option = document.createElement('option');
                option.value = team._id;

                if ((isCurrentTeam && !notFull) || isCurrentTeam) {
                    option.textContent = `${team.teamName} (Huidig)`;
                } else {
                    option.textContent = `${team.teamName}`;
                }

                if (isCurrentTeam) {
                    option.selected = true;
                }

                dropdown.appendChild(option);
            }

        });
    } catch (err) {
        console.error('Error filling dropdown:', err);
    }
}

async function deleteTeam(id) {
    const response = await fetch(`/api/admin/delete_team/${id}`, {
        method: 'DELETE'
    });
    const result = await response.json();
    if (result.success) {
        loadTeams();
    } else {
        console.log("error in deleteTeam" + result.error);
    }

}

app.delete('/api/admin/delete_team/:id', async (req, res) => {
    try {
        const teamId = req.params.id;
        const db = await getDatabase();

        // Remove teamId from all players in that team
        await db.collection('players').updateMany(
            { teamId: new ObjectId(teamId) },
            { $set: { teamId: null, role: 'member' } }
        );

        // Delete the team
        const result = await db.collection('teams').deleteOne({ _id: new ObjectId(teamId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        res.json({ success: true, message: 'Team deleted' });
    } catch (error) {
        console.error('Error deleting team:', error);
        res.status(500).json({ success: false, message: 'Failed to delete team', error: error.message });
    }
});


document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("add-score")) {
        const teamId = e.target.getAttribute("data-id");
        const points = parseInt(e.target.getAttribute("data-p"));

        await fetch(`/api/teams/${teamId}/add_score`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ points })
        });

        loadTeams(); // refresh score table
    }
});

