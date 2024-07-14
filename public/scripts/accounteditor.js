document.addEventListener("DOMContentLoaded", () => {
    fetchUsers();
});

async function fetchUsers() {
    try {
        const response = await fetch("/users"); // Ensure this endpoint is correct
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        const users = await response.json();
        console.log("Fetched users:", users); // Log fetched users
        populateUserTable(users);
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

function populateUserTable(users) {
    const userTableBody = document.getElementById("userTableBody");
    userTableBody.innerHTML = ""; // Clear existing table rows

    users.forEach(user => {
        console.log("Displaying user:", user); // Log each user being displayed
        const row = document.createElement("tr");
        console.log(user.name);
        row.onclick = () => showOverlay(user.name, user.email);

        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.streetname}, ${user.blockno}, ${user.unitno}</td>
            <td>${user.postalcode}</td>
            <td>${user.phoneno}</td>
        `;
        
        userTableBody.appendChild(row);
    });
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
