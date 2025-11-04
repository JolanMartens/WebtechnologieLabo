
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userId');

    window.location.href = '/';
}

function getCurrentUser() {
    if (!isLoggedIn()) return null;

    return {
        email: localStorage.getItem('userEmail'),
        firstName: localStorage.getItem('userFirstName'),
        lastName: localStorage.getItem('userLastName'),
        id: localStorage.getItem('userId')
    }
}

function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = '/loginPage.html';
    }
}

function updateNav() {
    // wait for nav to be loaded
    setTimeout(() => {
        const navButtons = document.querySelector('#accountOptions');
        const navLinks = document.querySelector('#navbarFirstPart');

        if (!navButtons) return;

        if (isLoggedIn()) {
            const user = getCurrentUser();

            // replace accountOptions buttons with logout button
            navButtons.innerHTML = `
                <button class="btn btn-outline-warning py-2 px-4" onclick="logout()">
                    Uitloggen
                </button>
            `;

            // make hidden nav options visible for logged in use
            if (navLinks) {
                // find and show the restricted links
                const restrictedLinks = navLinks.querySelectorAll('.nav-link-restricted');
                restrictedLinks.forEach(link => {
                    link.style.display = 'block';
                });
            }
        }else{
            // hide links for not logged-in users
            if (navLinks) {
                const restrictedLinks = navLinks.querySelectorAll('.nav-link-restricted');
                restrictedLinks.forEach(link => {
                    link.style.display = 'none';
                });
            }
        }
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateNav);
} else {
    updateNav();
}