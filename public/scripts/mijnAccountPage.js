document.addEventListener('DOMContentLoaded', () => {
    showMyAccount();

    document.getElementById('saveChangesBtn').addEventListener('click', savePlayerChanges);
});


// Display user info
function showMyAccount() {
    const user = getCurrentUser();
    if (user) {document.getElementById('user-info').innerHTML = `
               <p><strong>Voornaam:</strong> ${user.firstName}</p>
               <p><strong>Familienaam:</strong> ${user.lastName}</p>
               <p><strong>Email:</strong> ${user.email}</p>
           `;}
}

function openEditModal() {
    const user = getCurrentUser();
    if (!user) return;

    // fill in the modal
    document.getElementById('editId').value = user.id;
    document.getElementById('editFirstName').value = user.firstName;
    document.getElementById('editLastName').value = user.lastName;
    document.getElementById('editEmail').value = user.email;

    // show modal
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    modal.show();
}

async function savePlayerChanges() {
    const id = document.getElementById('editId').value;

    const data = {
        id: id,
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        email: document.getElementById('editEmail').value,
    };

    try {
        const response = await fetch(`/api/update_my_account`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const modalEl = document.getElementById('editModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();

            const currentUser = getCurrentUser();
            if (currentUser) {
                localStorage.setItem('isLoggedIn', 'true');
                document.cookie = `isLoggedIn=true; path=/; max-age=86400`;
                localStorage.setItem('userEmail', data.email);
                document.cookie = `userEmail=${data.email}; path=/; max-age=86400`;
                localStorage.setItem('userFirstName', data.firstName);
                document.cookie = `userFirstName=${data.firstName}; path=/; max-age=86400`;
                localStorage.setItem('userLastName', data.lastName);
                document.cookie = `userLastName=${data.lastName}; path=/; max-age=86400`;
                localStorage.setItem('userId', data.id);
                document.cookie = `userId=${data.id.toString()}; path=/; max-age=86400`;
            }

            showMyAccount();

        } else {
            console.log('error in savePlayerChanges');
        }
    } catch (error) {
        console.log("error in savePlayerChanges: " + error);
    }
}