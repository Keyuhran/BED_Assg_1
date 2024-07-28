document.addEventListener('DOMContentLoaded', () => {
    loadSnacks();
});

function loadSnacks() {
    fetch('http://localhost:3000/snacks')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('product-table-body');
            tableBody.innerHTML = ''; // Clear existing rows
            data.forEach(snack => {
                const row = document.createElement('tr');
                row.id = `product-${snack.snackId}`;

                row.innerHTML = `
                    <td>${snack.snackName}</td>
                    <td>${snack.snackId}</td>
                    <td>${snack.snackDescription}</td>
                    <td>${snack.country}</td>
                    <td>${snack.snackPrice}</td>
                    <td>${snack.ingredients}</td>
                    <td>
                        <button class="edit" onclick="showEditProductOverlay('${snack.snackId}', '${snack.snackName}', '${snack.snackDescription}', '${snack.country}', '${snack.snackPrice}', '${snack.ingredients}', '${snack.imagePath}')">Edit</button>
                        <button class="delete" onclick="deleteProduct('${snack.snackId}')">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            populateCountryDropdown('newCountry');
            populateCountryDropdown('editCountry');
        })
        .catch(error => console.error('Error fetching snacks:', error));
}

function populateCountryDropdown(dropdownId) {
    const countries = [
        'Malaysia', 'Singapore', 'Brunei', 'Cambodia', 'Myanmar', 
        'Laos', 'Vietnam', 'Philippines', 'Thailand', 'Indonesia', 'Timor-Leste'
    ];
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = ''; // Clear existing options
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

function showEditProductOverlay(snackId, snackName, snackDescription, country, snackPrice, ingredients, imagePath) {
    document.getElementById('editProductId').value = snackId;
    document.getElementById('editProductName').value = snackName;
    document.getElementById('editDetails').value = snackDescription;
    document.getElementById('editCountry').value = country;
    document.getElementById('editPrice').value = snackPrice;
    document.getElementById('editIngredients').value = ingredients;
    document.getElementById('editImagePath').value = imagePath;
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
    const newImagePath = document.getElementById('newImagePath').value;

    if (!newProductName || !newCountry || !newDetails || !newPrice || !newIngredients || !newImagePath) {
        alert('Please fill out all fields.');
        return;
    }

    const snackData = {
        snackName: newProductName,
        snackDescription: newDetails,
        snackPrice: newPrice,
        ingredients: newIngredients,
        country: newCountry,
        imagePath: newImagePath
    };

    try {
        const response = await fetch('http://localhost:3000/snacks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(snackData)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }

        const data = await response.json();
        alert(data.message);
        hideNewProductOverlay();
        loadSnacks(); // Reload snacks after adding a new product
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
    const editImagePath = document.getElementById('editImagePath').value;

    if (!editProductId || !editProductName || !editCountry || !editDetails || !editPrice || !editIngredients || !editImagePath) {
        alert('Please fill out all fields.');
        return;
    }

    const snackData = {
        snackName: editProductName,
        snackDescription: editDetails,
        snackPrice: editPrice,
        ingredients: editIngredients,
        country: editCountry,
        imagePath: editImagePath
    };

    try {
        const response = await fetch(`http://localhost:3000/snacks/${editProductId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(snackData)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }

        const data = await response.json();
        alert(data.message);
        hideEditProductOverlay();
        loadSnacks(); // Reload snacks after updating a product
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

            // Remove the deleted product row from the DOM
            const productRow = document.getElementById(`product-${snackId}`);
            if (productRow) {
                productRow.remove();
            }

            // Optionally reload snacks if you want to ensure the list is refreshed
            loadSnacks();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}
