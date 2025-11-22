document.addEventListener('DOMContentLoaded', () => {
  const makeTeamButton = document.getElementById('makeTeam');
  const teamForm = document.getElementById('team-form');
  const refreshTeamMateList = document.getElementById('refresh-team-list');

  if (makeTeamButton && teamForm) {
    makeTeamButton.addEventListener('click', async () => {
      console.log("Make New Team button pressed");
      teamForm.classList.toggle('visually-hidden');
      if (!teamForm.classList.contains('visually-hidden')) {
        await fillDropdown();
      }
    });
  }

  if (refreshTeamMateList) {
    refreshTeamMateList.onclick = async () => {
      await fillDropdown();
    };
  }
});

async function getPlayerList() {
  const response = await fetch("/api/get_player_list");
  return await response.json();
}

async function fillDropdown() {
  try {
    const dropdown = document.getElementById('playersDropdown');
    if (!dropdown) return;

    const players = await getPlayerList();

    while (dropdown.options.length > 1) {
      dropdown.remove(1);
    }

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