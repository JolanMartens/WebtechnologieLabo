
function isLoggedIn() {
    //return localStorage.getItem('isLoggedIn') === 'true';
    return getCookie('isLoggedIn');
}

// set experationdate to past
function deleteCookie(name) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
}


function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('userLastName');
    localStorage.removeItem('userId');
    document.cookie
    deleteCookie('isLoggedIn');
    deleteCookie('userEmail');
    deleteCookie('userFirstName');
    deleteCookie('userLastName');
    deleteCookie('userId');

    window.location.href = '/';
}

function getCurrentUser() {
    if (!isLoggedIn()) return null;

    return {
        email: getCookie('userEmail'),
        firstName: getCookie('userFirstName'),
        lastName: getCookie('userLastName'),
        id: getCookie('userId')
    }
}

function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = '/loginPage';
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

function getCookie(dataname){
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length == 2) return parts.pop().split(';').shift();
    return null;
}