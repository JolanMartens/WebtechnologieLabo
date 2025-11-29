document.addEventListener('DOMContentLoaded', () => {
  const makeTeamButton = document.getElementById('makeTeam');
  const registerForm = document.getElementById('registerForm');

  function showMessage(message, type) {
    const msgContainer = document.getElementById('message-container');
    if (msgContainer) {
      msgContainer.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
    }
  }

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      teamName: document.getElementById('teamName')?.value,
      emailTeammate: document.getElementById('emailTeammate')?.value,
    };

    const msgContainer = document.getElementById('message-container');

    // Controleer op nulls
    if (!formData.teamName || !formData.emailTeammate) {
      console.error('Alle velden moeten ingevuld zijn!');
      return;
    }

    // wissen van mogelijks vorige bericht
    if (msgContainer) msgContainer.innerHTML = '';
    const currentUserId = localStorage.getItem('userId');

    try {
      const response = await fetch('/api/new_team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        'X-User-ID': currentUserId},
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Response new team:', data);

      if (response.ok && data.success) {
        // Redirect naar jouwTeam pagina
        window.location.href = '/jouwTeam';
      } else {
        if (msgContainer) {
          showMessage(data.error || 'Er is iets misgegaan.', 'danger');
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
