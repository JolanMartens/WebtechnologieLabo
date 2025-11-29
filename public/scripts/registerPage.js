const registerForm = document.querySelector('form[action="/api/new_player"]');

if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // prevent default form submission bcs initializing localStorage first on client side

        // Get values from form
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userEmail', data.player.email);
                localStorage.setItem('userFirstName', data.player.firstName);
                localStorage.setItem('userLastName', data.player.lastName);
                localStorage.setItem('userId', data.player._id);

                window.location.href = '/';
            } else {
                console.error('error bij het maken van speler');
            }
        } catch (error) {
            console.error('Register error:', error);
        }
    });
}

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