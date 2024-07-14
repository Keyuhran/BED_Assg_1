document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
});

function fetchUsers() {
    fetch("http://localhost:3000/users")
        .then(response => response.json())
        .then(users => {
            const userTableBody = document.getElementById("userTableBody");
            userTableBody.innerHTML = ""; // Clear existing table rows

            users.forEach(user => {
                const row = document.createElement("tr");
                row.onclick = () => showOverlay(user.Name, user.email);

                row.innerHTML = `
                    <td>${user.Name}</td>
                    <td>${user.email}</td>
                    <td>${user.Streetname}, ${user.Blockno}, ${user.Unitno}</td>
                    <td>${user.Postalcode}</td>
                    <td>${user.Phoneno}</td>
                `;

                userTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error fetching users:", error));
}

function showOverlay(accountName, accountId) {
    document.getElementById('accountName').innerText = accountName;
    document.getElementById('editAccountName').value = accountName;
    document.getElementById('editAccountId').value = accountId;
    document.getElementById('overlay').style.visibility = 'visible';
}

function hideOverlay() {
    document.getElementById('overlay').style.visibility = 'hidden';
}

function showDeleteConfirm() {
    hideOverlay();
    document.getElementById('confirmOverlay').style.visibility = 'visible';
}

function hideConfirmOverlay() {
    document.getElementById('confirmOverlay').style.visibility = 'hidden';
}

function confirmDeleteAccount() {
    alert('Account deleted');
    hideConfirmOverlay();
}

function showEditOverlay() {
    hideOverlay();
    document.getElementById('editOverlay').style.visibility = 'visible';
}

function hideEditOverlay() {
    document.getElementById('editOverlay').style.visibility = 'hidden';
    showOverlay(document.getElementById('editAccountName').value, document.getElementById('editAccountId').value);
}

function submitEdit() {
    // Here you can handle the submission logic, e.g., send data to the server
    alert('Account details updated');
    hideEditOverlay();
}

function editAccount() {
    showEditOverlay();
}

// Hide overlays on clicking outside
document.getElementById('overlay').addEventListener('click', function(event) {
    if (event.target === this) {
        hideOverlay();
    }
});

document.getElementById('confirmOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        hideConfirmOverlay();
    }
});

document.getElementById('editOverlay').addEventListener('click', function(event) {
    if (event.target === this) {
        hideEditOverlay();
    }
});
