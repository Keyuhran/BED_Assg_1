function showOverlay(productName, productId) {
    document.getElementById('productName').innerText = productName;
    document.getElementById('editProductName').value = productName;
    document.getElementById('editProductId').value = productId;
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

function confirmDeleteProduct() {
    alert('Product deleted');
    hideConfirmOverlay();
}

function showEditOverlay() {
    hideOverlay();
    document.getElementById('editOverlay').style.visibility = 'visible';
}

function hideEditOverlay() {
    document.getElementById('editOverlay').style.visibility = 'hidden';
    showOverlay(document.getElementById('editProductName').value, document.getElementById('editProductId').value);
}

function submitEdit() {
    // Here you can handle the submission logic, e.g., send data to the server
    alert('Product details updated');
    hideEditOverlay();
}

function editProduct() {
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