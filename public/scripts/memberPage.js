// Link the table to membersTable
var membersTable = document.querySelector('#membersTable');

// Link a function to button
const myButton1 = document.getElementById('firstNameSort');
myButton1.addEventListener('click', sortByFirstName);

const myButton2 = document.getElementById('lastNameSort');
myButton2.addEventListener('click', sortByLastName);

//filling the table
function fillTable(members) {
    for (let i = 0; i < members.length; i++) {
        let row = membersTable.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        
        cell1.innerHTML = members[i].fname;
        cell2.innerHTML = members[i].lname;
        cell3.innerHTML = members[i].company;
    }
}

//clearing the table
function clearTable() {
    //clear the table rows, except the first row:
    while (membersTable.rows.length > 1 ) {
        membersTable.deleteRow(1);
    }
}

//init members table when page is loaded
async function initMembersTable() {
    //getting the members
    const response = await fetch("/api/get_member_list");
    const members = await response.json();
    console.log(members);
    fillTable(members)
}

//sort members by first name - short way - NOT PERSISTENT
async function sortByFirstName(){
    console.log("CLIENT:First button pressed");
    //getting the members
    const response = await fetch("/api/get_member_list");
    const membersList = await response.json();

    // Default Sort algorithm by first name
    membersListSorted = membersList.sort((a, b) => a.fname.localeCompare(b.fname));
    console.log("CLIENT:" + membersListSorted);
    
    // Clear the existing rows in the table
    clearTable();
    // Refill the table
    fillTable(membersListSorted);
}

//sort members by last name - longer way - PERSISTENT
async function sortByLastName(){
    console.log("CLIENT: Second button pressed");
    //getting the members
    const response = await fetch("/api/get_member_list");
    const membersList = await response.json();

   // Bubblesort algorithm by last name
   const length = membersList.length;
   for (let i = 0; i < length - 1; i++) {
        for (let j = 0; j < length - 1 - i; j++) {
          // Compare adjacent elements based on the specified key
          if (membersList[j]["lname"] > membersList[j + 1]["lname"]) {
            // Swap the elements if they are in the wrong order
            const temp = membersList[j];
            membersList[j] = membersList[j + 1];
            membersList[j + 1] = temp;
          }
        }
      }
     console.log(membersList);
     
     // Clear the existing rows in the table
     clearTable();
     // Refill the table
     fillTable(membersList);
     
    // Sending the list to the server
    const post = await fetch("/api/set_member_list", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({members: membersList }),
    });
}
    
// Initialize the member table
initMembersTable();
