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
                        <div class="snack-details">
                            <p>Snack ID: ${snack.snackId}</p>
                            <p>Snack Name: ${snack.snackName}</p>
                            <p>Description: ${snack.snackDescription}</p>
                            <p>Price: $${snack.snackPrice.toFixed(2)}</p>
                            <p>Ingredients: ${snack.ingredients}</p>
                            <p>Country: ${snack.country}</p>
                        </div>
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
            }
        })
        .catch(error => {
            console.error('Error fetching snacks:', error);
            document.getElementById('snacks-container').innerHTML = '<p>Error loading snacks.</p>';
        });
});
