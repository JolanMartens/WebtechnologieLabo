

const makeTeamButton = document.getElementById('makeTeam');
makeTeamButton.addEventListener('click', makeNewTeam);

async function getPlayerList(){
    const response = await fetch("/api/get_player_list");
    return await response.json();
}

async function makeNewTeam() {
    console.log("Make New Team button pressed");
    const teamForm = document.getElementById('team-form');
    teamForm.classList.toggle('visually-hidden');
    let playersList;
    if (!teamForm.classList.contains('visually-hidden')) {
        playersList = await getPlayerList();
        await fillDropdown(playersList);
    }
}

// refresh button logic //
var refreshTeamMateList = document.getElementById('refresh-team-list');

refreshTeamMateList.onclick = async function () {
    await fillDropdown();
}


// fill drop down for teammate selection
async function fillDropdown() {
    // get the dropdown element where the options need to be added
    const dropdown = document.getElementById('playersDropdown');

    let players = await getPlayerList();

    // remove all the previous options
    while (dropdown.options.length > 1) {
        dropdown.remove();
    }

    // make new options for each player
    for (let i = 0; i < players.length; i++) {
        let option = document.createElement('option');
        option.value = players[i].fname;
        option.textContent = `${players[i].firstName} ${players[i].lastName}`;
        dropdown.appendChild(option);
    }
}