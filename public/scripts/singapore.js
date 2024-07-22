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
                        <button class="add-to-cart-btn" data-snack-id="${snack.snackId}">Add to Cart</button>
                    `;
                    snackDiv.addEventListener('click', () => {
                        const details = snackDiv.querySelector('.snack-details');
                        if (details.style.display === 'none' || details.style.display === '') {
                            details.style.display = 'block';
                        } else {
                            details.style.display = 'none';
                        }
                    });
                    snacksContainer.appendChild(snackDiv);
                });

                document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                    button.addEventListener('click', async (event) => {
                        const snackId = event.target.getAttribute('data-snack-id');
                        const email = localStorage.getItem('userEmail'); // Retrieve email from local storage
                        const quantity = 1; // Assuming adding 1 item at a time

                        try {
                            const response = await fetch('/cart/add', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ email, snackId, quantity })
                            });

                            if (!response.ok) {
                                throw new Error(`Error adding to cart: ${response.statusText}`);
                            }

                            alert('Snack added to cart successfully!');
                        } catch (error) {
                            console.error('Error adding to cart:', error);
                            alert('Failed to add snack to cart.');
                        }
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching snacks:', error);
            document.getElementById('snacks-container').innerHTML = '<p>Error loading snacks.</p>';
        });
});
