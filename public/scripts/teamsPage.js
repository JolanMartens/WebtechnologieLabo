// Link the table to membersTable
var teamsTable = document.querySelector('#teamsTable');

// Link a function to button
const myButton1 = document.getElementById('teamNameSort');
myButton1.addEventListener('click', sortByTeamName);
document.getElementById('refresh').addEventListener('click', initTeamsTable);


//filling the table
function fillTable(teams) {
    for (let i = 0; i < teams.length; i++) {
        let row = teamsTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        
        cell1.innerHTML = teams[i].teamName;
        cell2.innerHTML = teams[i].players[0] ? `${teams[i].players[0].firstName} ${teams[i].players[0].lastName}` : '—';
        cell3.innerHTML = teams[i].players[1] ? `${teams[i].players[1].firstName} ${teams[i].players[1].lastName}` : '—';

    }
}

//clearing the table
function clearTable() {
    //clear the table rows, except the first row(header):
    while (teamsTable.rows.length > 1 ) {
        teamsTable.deleteRow(1);
    }
}

async function initTeamsTable() {
    //getting the members
    const response = await fetch("/api/get_teams_with_players");
    const teams = await response.json();
    console.log(teams);
    fillTable(teams)
}

async function sortByTeamName() {
    console.log("CLIENT:button1");
    const response = await fetch("/api/get_teams_with_players");
    const teamsList = await response.json();

    teamsListSorted = teamsList.sort((a,b) => a.teamName.localeCompare(b.teamName));
    console.log("CLIENT:" + teamsListSorted);
    clearTable();
    fillTable(teamsListSorted);
    
}

initTeamsTable();