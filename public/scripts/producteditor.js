document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/snacks')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('product-table-body');
            data.forEach(snack => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${snack.snackName}</td>
                    <td>${snack.snackId}</td>
                    <td>${snack.snackDescription}</td>
                    <td>${snack.country}</td>
                    <td>${snack.snackPrice}</td>
                    <td>${snack.ingredients}</td>
                    <td>
                        <button class="edit" onclick="showEditProductOverlay('${snack.snackId}', '${snack.snackName}', '${snack.snackDescription}', '${snack.country}', '${snack.snackPrice}', '${snack.ingredients}')">Edit</button>
                        <button class="delete" onclick="deleteProduct('${snack.snackId}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            populateCountryDropdown('newCountry');
            populateCountryDropdown('editCountry');
        })
        .catch(error => console.error('Error fetching snacks:', error));
});

function populateCountryDropdown(dropdownId) {
    const countries = [
        'Malaysia', 'Singapore', 'Brunei', 'Cambodia', 'Myanmar', 
        'Laos', 'Vietnam', 'Philippines', 'Thailand', 'Indonesia', 'Timor-Leste'
    ];
    const dropdown = document.getElementById(dropdownId);
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.text = country;
        dropdown.appendChild(option);
    });
}

function showNewProductOverlay() {
    document.getElementById('newProductOverlay').style.display = 'flex';
}

function hideNewProductOverlay() {
    document.getElementById('newProductOverlay').style.display = 'none';
}

function showEditProductOverlay(snackId, snackName, snackDescription, country, snackPrice, ingredients) {
    document.getElementById('editProductId').value = snackId;
    document.getElementById('editProductName').value = snackName;
    document.getElementById('editDetails').value = snackDescription;
    document.getElementById('editCountry').value = country;
    document.getElementById('editPrice').value = snackPrice;
    document.getElementById('editIngredients').value = ingredients;
    document.getElementById('editProductOverlay').style.display = 'flex';
}

function hideEditProductOverlay() {
    document.getElementById('editProductOverlay').style.display = 'none';
}

async function addNewProduct() {
    const newProductName = document.getElementById('newProductName').value;
    const newCountry = document.getElementById('newCountry').value;
    const newDetails = document.getElementById('newDetails').value;
    const newIngredients = document.getElementById('newIngredients').value;
    const newPrice = document.getElementById('newPrice').value;
    const newImage = document.getElementById('newImage').files[0];

    if (!newProductName || !newCountry || !newDetails || !newPrice || !newIngredients) {
        alert('Please fill out all fields.');
        return;
    }

    const formData = new FormData();
    formData.append('snackName', newProductName);
    formData.append('snackDescription', newDetails);
    formData.append('snackPrice', newPrice);
    formData.append('ingredients', newIngredients);
    formData.append('country', newCountry);
    if (newImage) {
        formData.append('imagePath', newImage);
    }

    try {
        const response = await fetch('http://localhost:3000/snacks', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }

        const data = await response.json();
        alert(data.message);
        hideNewProductOverlay();
        location.reload(); // Refresh the page to see the new product
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

async function updateProduct() {
    const editProductId = document.getElementById('editProductId').value;
    const editProductName = document.getElementById('editProductName').value;
    const editDetails = document.getElementById('editDetails').value;
    const editCountry = document.getElementById('editCountry').value;
    const editPrice = document.getElementById('editPrice').value;
    const editIngredients = document.getElementById('editIngredients').value;
    const editImage = document.getElementById('editImage').files[0];

    if (!editProductId || !editProductName || !editCountry || !editDetails || !editPrice || !editIngredients) {
        alert('Please fill out all fields.');
        return;
    }

    const formData = new FormData();
    formData.append('snackId', editProductId);
    formData.append('snackName', editProductName);
    formData.append('snackDescription', editDetails);
    formData.append('snackPrice', editPrice);
    formData.append('ingredients', editIngredients);
    formData.append('country', editCountry);
    if (editImage) {
        formData.append('imagePath', editImage);
    }

    try {
        const response = await fetch(`http://localhost:3000/snacks/${editProductId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }

        const data = await response.json();
        alert(data.message);
        hideEditProductOverlay();
        location.reload(); // Refresh the page to see the updated product
    } catch (error) {
        console.error('Error updating product:', error);
    }
}

async function deleteProduct(snackId) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`http://localhost:3000/snacks/${snackId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
            }

            const data = await response.json();
            alert(data.message);
            location.reload(); // Refresh the page to see the updated product list
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}
