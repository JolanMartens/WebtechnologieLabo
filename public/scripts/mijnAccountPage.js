
// Display user info
function showMyAccount() {
    const user = getCurrentUser();
    if (user) {document.getElementById('user-info').innerHTML = `
               <p><strong>Voornaam:</strong> ${user.firstName}</p>
               <p><strong>Familienaam:</strong> ${user.lastName}</p>
               <p><strong>Email:</strong> ${user.email}</p>
           `;}
}
showMyAccount();