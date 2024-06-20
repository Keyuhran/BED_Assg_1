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
