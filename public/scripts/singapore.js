document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/Snacks/Singapore')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText} (status code: ${response.status})`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched snacks:', data);
            const snacksContainer = document.getElementById('snacks-container');
            if (data.length === 0) {
                snacksContainer.innerHTML = '<p>No snacks available for Singapore.</p>';
            } else {
                snacksContainer.innerHTML = ''; 
                data.forEach(snack => {
                    const snackDiv = document.createElement('div');
                    snackDiv.classList.add('snack');
                    snackDiv.innerHTML = `
                        <img src="${snack.imagePath && snack.imagePath !== 'NULL' ? snack.imagePath : 'placeholder.png'}" alt="${snack.snackName}">
                        <p>Snack ID: ${snack.snackId}</p>
                        <p>Snack Name: ${snack.snackName}</p>
                        <p>Description: ${snack.snackDescription}</p>
                        <p>Price: $${snack.snackPrice}</p>
                        <p>Ingredients: ${snack.ingredients}</p>
                        <p>Country: ${snack.country}</p>
                        <button class="add-to-cart" data-snack-id="${snack.snackId}" data-snack-name="${snack.snackName}">Add to Cart</button>
                    `;
                    snacksContainer.appendChild(snackDiv);
                });

                // Add event listeners to "Add to Cart" buttons
                const addToCartButtons = document.querySelectorAll('.add-to-cart');
                addToCartButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const snackId = button.getAttribute('data-snack-id');
                        const snackName = button.getAttribute('data-snack-name');
                        alert(`Added ${snackName} to cart!`);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching snacks:', error);
            document.getElementById('snacks-container').innerHTML = '<p>Error loading snacks.</p>';
        });
});
