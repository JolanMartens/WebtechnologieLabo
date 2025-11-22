const loginForm = document.getElementById('login-form');
const messageContainer = document.getElementById('message-container');

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // prevent default form submission

    // get values from form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {

        // make login request
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // convert to  json format
        });

        const data = await response.json(); // get the respons from server

        if (response.ok && data.success) { // when login is succes
            // save the login and player data in localstorage
            // so we keep the login state
            localStorage.setItem('isLoggedIn', 'true');
            document.cookie = `isLoggedIn=true; path=/; max-age=86400`;
            localStorage.setItem('userEmail', data.player.email);
            document.cookie = `userEmail=${data.player.email}; path=/; max-age=86400`;
            localStorage.setItem('userFirstName', data.player.firstName);
            document.cookie = `userFirstName=${data.player.firstName}; path=/; max-age=86400`;
            localStorage.setItem('userLastName', data.player.lastName);
            document.cookie = `userLastName=${data.player.lastName}; path=/; max-age=86400`;
            localStorage.setItem('userId', data.player._id);
            document.cookie = `userId=${data.player._id.toString()}; path=/; max-age=86400`;

            // Show success message
            showMessage('Login succesvol! Je wordt doorgestuurd...', 'success');

            // Redirect to home page after 1 second
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            showMessage(data.error || 'Login mislukt', 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Er is een fout opgetreden. Probeer het opnieuw.', 'danger');
    }
});

// show error message above the form
function showMessage(message, type) {
    messageContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
        </div>
    `;
}