document.addEventListener('DOMContentLoaded', () => {
  const makeTeamButton = document.getElementById('makeTeam');
  const teamForm = document.getElementById('team-form');
  const refreshTeamMateList = document.getElementById('refresh-team-list');
  const registerForm = document.getElementById('registerForm');

  // ---- Registratie form submission ----
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // voorkom standaard submit

      // Form data ophalen
      const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        dateOfBirth: document.getElementById('dateOfBirth').value,
        password: document.getElementById('password').value
      };

      try {
        const response = await fetch('/api/new_player', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Gegevens opslaan in localStorage
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', data.player.email);
          localStorage.setItem('userFirstName', data.player.firstName);
          localStorage.setItem('userLastName', data.player.lastName);
          localStorage.setItem('userId', data.player._id);

          // Redirect naar mijnTeam pagina
          window.location.href = '/mijnTeam';
        } else {
          console.error('Fout bij het aanmaken van speler:', data.message || 'Onbekende fout');
        }
      } catch (error) {
        console.error('Register error:', error);
      }
    });
  }

  // ---- Make new team button logic ----
  if (makeTeamButton && teamForm) {
    makeTeamButton.addEventListener('click', async () => {
      console.log("Make New Team button pressed");
      teamForm.classList.toggle('visually-hidden');
      if (!teamForm.classList.contains('visually-hidden')) {
        await fillDropdown();
      }
    });
  }

  // ---- Refresh dropdown button ----
  if (refreshTeamMateList) {
    refreshTeamMateList.onclick = async () => {
      await fillDropdown();
    };
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
