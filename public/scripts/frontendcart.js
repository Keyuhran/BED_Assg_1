document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    fetch('/cart', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
        }
        return response.json();
    })
    .then(cartContents => {
        console.log('Cart contents:', cartContents);
        const cartContainer = document.getElementById('cart-container');
        if (cartContents.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cartContainer.innerHTML = ''; 
            cartContents.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <p>Snack ID: ${item.snackId}</p>
                    <p>Snack Name: ${item.snackName}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.snackPrice}</p>
                `;
                cartContainer.appendChild(cartItemDiv);
            });
        }
    })
    .catch(error => {
        console.error('Error fetching cart contents:', error);
        document.getElementById('cart-container').innerHTML = '<p>Error loading cart contents.</p>';
    });
});
