// Link the table to teamsTable
var teamsTable = document.querySelector('#teamsTable');

// Link a function to button
const myButton1 = document.getElementById('TeamnameSort');
myButton1.addEventListener('click', sortByFirstName);

const myButton2 = document.getElementById('lastNameSort');
myButton2.addEventListener('click', sortByLastName);

//filling the table
function fillTable(Team, player1, player2) {
    for (let i = 0; i < teams.length; i++) {
        let row = teamsTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        
        cell1.innerHTML = teams[i].teamId;
        cell2.innerHTML = teams[i].player1;
        cell3.innerHTML = teams[i].player2;
    }
}

//clearing the table
function clearTable() {
    //clear the table rows, except the first row:
    while (teamsTable.rows.length > 1 ) {
        teamsTable.deleteRow(1);
    }
}

//init teams table when page is loaded
async function initTeamsTable() {
    //getting the teams
    const response = await fetch("/api/get_teams_list");
    const teams = await response.json();
    console.log(teams);
    fillTable(teams)
}

//sort teams by first name - short way - NOT PERSISTENT
async function sortByTeamName() {
    try {
        console.log("CLIENT: Team name sort button pressed");

        // Getting the teams
        const response = await fetch("/api/get_teams_list");
        const teamsList = await response.json();

        // Sort algorithm by first name
        const teamsListSorted = teamsList.sort((a, b) =>
            a.firstName.localeCompare(b.firstName)
        );

        console.log("CLIENT: Sorted by first name");

        // Clear the existing rows in the table
        clearTable();
        // Refill the table
        fillTable(teamsListSorted);
    } catch (error) {
        console.error("CLIENT: Error sorting by first name:", error);
    }
}

//sort teams by last name - longer way - PERSISTENT
async function sortByLastName(){
    console.log("CLIENT: Second button pressed");
    //getting teams
    const response = await fetch("/api/get_teams_list");
    const teamsList = await response.json();

   // Bubblesort algorithm by last name
   const length = teamsList.length;
   for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
          // Compare adjacent elements based on the specified key
          if (teamsList[j]["lname"] > teamsList[j + 1]["lname"]) {
            // Swap the elements if they are in the wrong order
            const temp = teamsList[j];
            teamsList[j] = teamsList[j + 1];
            teamsList[j + 1] = temp;
          }
        }
      }
     console.log(teamsList);

     // Clear the existing rows in the table
     clearTable();
     // Refill the table
     fillTable(teamsList);
     
    // Sending the list to the server
    const post = await fetch("/api/set_team_list", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({teams: teamsList }),
    });
}

// Initialize the team table
initteamsTable();
