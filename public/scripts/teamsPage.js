// Link the table to membersTable
var membersTable = document.querySelector('#membersTable');

// Link a function to button
const myButton1 = document.getElementById('teamNameSort');
myButton1.addEventListener('click', sortByTeamName);

//filling the table
function fillTable(teams) {
    for (let i = 0; i < teams.length; i++) {
        let row = teamsTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        
        cell1.innerHTML = members[i].teamname;
        cell2.innerHTML = members[i].firstplayer;
        cell3.innerHTML = members[i].secondplayer;
    }
}

//clearing the table
function clearTable() {
    //clear the table rows, except the first row(header):
    while (membersTable.rows.length > 1 ) {
        membersTable.deleteRow(1);
    }
}

async function initTeamsTable() {
    //getting the members
    const response = await fetch("/api/get_teams_list");
    const teams = await response.json();
    console.log(teams);
    fillTable(teams)
}

async function sortByTeamName() {
    console.log("CLIENT:button1");
    const response = await fetch("/api/get_teams_list");
    const teamsList = await response.json();

    teamsListSorted = teamsList.sort((a,b) => a.teamname.localeCompare(b.teamname));
    console.log("CLIENT:" + teamsListSorted);
    clearTable();
    fillTable(teamsListSorted);
    
}

initTeamsTable();