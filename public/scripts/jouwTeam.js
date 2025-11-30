async function showMyTeam() {
  const response = await fetch("/api/get_my_team");
  const myTeam = await response.json();

  const teamsTable = document.querySelector('#teamsTable');

  if (myTeam.error) {
    let row = teamsTable.insertRow();
    let cell = row.insertCell(0);
    cell.colSpan = 3;
    cell.innerHTML = myTeam.error;
    return;
  }

  // Add one row with team name and two players
  let row = teamsTable.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);

  cell1.innerHTML = myTeam.teamName;
  cell2.innerHTML = myTeam.players[0] ? `${myTeam.players[0].firstName} ${myTeam.players[0].lastName}` : '—';
  cell3.innerHTML = myTeam.players[1] ? `${myTeam.players[1].firstName} ${myTeam.players[1].lastName}` : '—';
}

showMyTeam();
console.log("jouwTeam.js is geladen");



console.log("jouwTeam.js is geladen");

const btn = document.getElementById("leaveTeamBtn");
console.log("Knop gevonden:", btn);

if (btn) {
    btn.addEventListener("click", async () => {
        try {
            const response = await fetch("/api/leave_team", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            const result = await response.json();
            console.log("Response:", result);

            if (result.success) {
                alert("Je bent uit het team gestapt.");
                window.location.reload();
            } else {
                alert("Kon team niet verlaten: " + result.message);
            }
        } catch (err) {
            console.error("Fout bij fetch:", err);
            alert("Er ging iets mis bij het verlaten van het team.");
        }
    });
}
