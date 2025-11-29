document.addEventListener('DOMContentLoaded', () => {
  const makeTeamButton = document.getElementById('makeTeam');
  const teamForm = document.getElementById('team-form');
  const refreshTeamMateList = document.getElementById('refresh-team-list');
  const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Nieuwe team form data
    const formData = {
      teamName: document.getElementById('teamName')?.value,
      secondFirstName: document.getElementById('secondFirstName')?.value,
      secondLastName: document.getElementById('secondLastName')?.value,
      secondEmail: document.getElementById('secondEmail')?.value,
      secondDateOfBirth: document.getElementById('secondDateOfBirth')?.value
    };

    // Controleer op nulls
    if (!formData.teamName || !formData.secondFirstName || !formData.secondLastName ||
        !formData.secondEmail || !formData.secondDateOfBirth) {
      console.error('Alle velden moeten ingevuld zijn!');
      return;
    }

    try {
      const response = await fetch('/api/new_team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Response new team:', data);

      if (response.ok && data.success) {
        // Redirect naar mijnTeam pagina
        window.location.href = '/mijnTeam';
      } else {
        const msgContainer = document.getElementById('message-container');
        if (msgContainer) {
          msgContainer.innerHTML = `<div class="alert alert-danger">${data.message || 'Er is iets misgegaan.'}</div>`;
        }
      }
    } catch (err) {
      console.error('Error bij maken team:', err);
    }
  });
}

});

// ---- Fetch spelerslijst ----
async function getPlayerList() {
  const response = await fetch("/api/get_player_list");
  return await response.json();
}

// ---- Dropdown vullen ----
async function fillDropdown() {
  try {
    const dropdown = document.getElementById('playersDropdown');
    if (!dropdown) return;

    const players = await getPlayerList();

    // Clear bestaande opties (behalve de eerste)
    while (dropdown.options.length > 1) {
      dropdown.remove(1);
    }

    // Voeg nieuwe spelers toe
    players.forEach(player => {
      const option = document.createElement('option');
      option.value = player._id || player.email;
      option.textContent = `${player.firstName} ${player.lastName}`;
      dropdown.appendChild(option);
    });
  } catch (err) {
    console.error('Error filling dropdown:', err);
  }
}
