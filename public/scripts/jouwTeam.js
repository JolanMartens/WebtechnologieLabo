async function showMyTeam() {
  const response = await fetch("/api/get_my_team");
  const myTeam = await response.json();

  if (myTeam.error) {
    document.getElementById('user-info').innerHTML += `<p>${myTeam.error}</p>`;
    return;
  }

  document.getElementById('user-info').innerHTML += `
    <h3>Team: ${myTeam.teamName}</h3>
    <ul>
      ${myTeam.players.map(p => `<li>${p.firstName} ${p.lastName} (${p.email})</li>`).join('')}
    </ul>
  `;
}