// Link the table to playersTable
var playersTable = document.querySelector('#playersTable');

// Link a function to button
const myButton1 = document.getElementById('firstNameSort');
myButton1.addEventListener('click', sortByFirstName);

const myButton2 = document.getElementById('lastNameSort');
myButton2.addEventListener('click', sortByLastName);

//filling the table
function fillTable(players) {
    for (let i = 0; i < players.length; i++) {
        let row = playersTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        
        cell1.innerHTML = players[i].firstName;
        cell2.innerHTML = players[i].lastName;
        cell3.innerHTML = players[i].teamId;
    }
}

//clearing the table
function clearTable() {
    //clear the table rows, except the first row:
    while (playersTable.rows.length > 1 ) {
        playersTable.deleteRow(1);
    }
}

//init players table when page is loaded
async function initplayersTable() {
    //getting the players
    const response = await fetch("/api/get_player_list");
    const players = await response.json();
    console.log(players);
    fillTable(players)
}

//sort players by first name - short way - NOT PERSISTENT
async function sortByFirstName() {
    try {
        console.log("CLIENT: First name sort button pressed");

        // Getting the players
        const response = await fetch("/api/get_player_list");
        const playersList = await response.json();

        // Sort algorithm by first name
        const playersListSorted = playersList.sort((a, b) =>
            a.firstName.localeCompare(b.firstName)
        );

        console.log("CLIENT: Sorted by first name");

        // Clear the existing rows in the table
        clearTable();
        // Refill the table
        fillTable(playersListSorted);
    } catch (error) {
        console.error("CLIENT: Error sorting by first name:", error);
    }
}

//sort players by last name - longer way - PERSISTENT
async function sortByLastName(){
    console.log("CLIENT: Second button pressed");
    //getting the players
    const response = await fetch("/api/get_player_list");
    const playersList = await response.json();

   // Bubblesort algorithm by last name
   const length = playersList.length;
   for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
          // Compare adjacent elements based on the specified key
          if (playersList[j]["lname"] > playersList[j + 1]["lname"]) {
            // Swap the elements if they are in the wrong order
            const temp = playersList[j];
            playersList[j] = playersList[j + 1];
            playersList[j + 1] = temp;
          }
        }
      }
     console.log(playersList);

     // Clear the existing rows in the table
     clearTable();
     // Refill the table
     fillTable(playersList);
     
    // Sending the list to the server
    const post = await fetch("/api/set_player_list", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({players: playersList }),
    });
}

// Initialize the player table
initplayersTable();
