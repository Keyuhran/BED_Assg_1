document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/snacks/Cambodia')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            const snacksContainer = document.getElementById('snacks-container');
            if (data.length === 0) {
                snacksContainer.innerHTML = '<p>No snacks available.</p>';
            } else {
                snacksContainer.innerHTML = '';
                data.forEach(snack => {
                    const snackDiv = document.createElement('div');
                    snackDiv.classList.add('snack');
                    snackDiv.dataset.snackId = snack.snackId;
                    snackDiv.dataset.country = snack.country;
                    snackDiv.innerHTML = `
                        <img src="${snack.imagePath}" alt="${snack.snackName}">
                        <p>${snack.snackName}</p>
                        <p>$${snack.snackPrice}</p>
                    `;
                    snackDiv.addEventListener('click', () => {
                        console.log('Snack clicked:', snackDiv.dataset.snackId); // Debugging line
                        const snackId = snackDiv.dataset.snackId;
                        const country = snackDiv.dataset.country;
                        fetchSnackDetails(country, snackId); // Fetch and display details on click
                    });
                    snacksContainer.appendChild(snackDiv);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching snacks:', error);
            document.getElementById('snacks-container').innerHTML = '<p>Error loading snacks.</p>';
        });

    // Close button functionality
    document.getElementById('close-details').addEventListener('click', () => {
        document.getElementById('snack-details-modal').style.display = 'none';
    });
});

async function fetchSnackDetails(country, snackId) {
    try {
        const response = await fetch(`http://localhost:3000/snacks/${country}/${snackId}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        const snack = await response.json();
        console.log('Fetched snack details:', snack); // Debugging line
        displaySnackDetails(snack);
    } catch (error) {
        console.error('Error fetching snack details:', error);
        document.getElementById('snack-details').innerHTML = '<p>Error loading snack details.</p>';
    }
}

function displaySnackDetails(snack) {
    document.getElementById('snack-name').textContent = snack.snackName;
    document.getElementById('snack-image').src = snack.imagePath;
    document.getElementById('snack-description').textContent = snack.snackDescription;
    document.getElementById('snack-price').textContent = `Price: $${snack.snackPrice}`;
    document.getElementById('snack-ingredients').textContent = `Ingredients: ${snack.ingredients}`;
    document.getElementById('snack-country').textContent = `Country: ${snack.country}`;

    // Remove previous add to cart button if it exists
    const existingButton = document.getElementById('add-to-cart-button');
    if (existingButton) {
        existingButton.remove();
    }

    const addToCartButton = document.createElement('button');
    addToCartButton.id = 'add-to-cart-button';
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.addEventListener('click', () => {
        addToCart(snack.snackId, 1); // Add the snack to the cart with a quantity of 1
    });

    const modalContent = document.querySelector('.modal-content');
    modalContent.appendChild(addToCartButton);

    document.getElementById('snack-details-modal').style.display = 'block';
}

function addToCart(snackId, quantity) {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ snackId, quantity })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Item added to cart:', data);
        alert('Item added to cart');
    })
    .catch(error => {
        console.error('Error adding item to cart:', error);
        alert('Error adding item to cart');
    });
}