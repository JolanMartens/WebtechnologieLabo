

const makeTeamButton = document.getElementById('makeTeam');
makeTeamButton.addEventListener('click', makeNewTeam);

async function getMemberList(){
    const response = await fetch("/api/get_member_list");
    return await response.json();
}

async function makeNewTeam() {
    console.log("Make New Team button pressed");
    const teamForm = document.getElementById('team-form');
    teamForm.classList.toggle('visually-hidden');
    let membersList;
    if (!teamForm.classList.contains('visually-hidden')) {
        membersList = await getMemberList();
        await fillDropdown(membersList);
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
    const dropdown = document.getElementById('membersDropdown');

    let members = await getMemberList();

    // remove all the previous options
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }

    // make new options for each player
    for (let i = 0; i < members.length; i++) {
        let option = document.createElement('option');
        option.value = members[i].fname;
        option.textContent = `${members[i].fname} ${members[i].lname}`;
        dropdown.appendChild(option);
    }
}