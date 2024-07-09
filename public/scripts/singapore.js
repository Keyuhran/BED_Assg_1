document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/Snacks/Singapore')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched snacks:', data); // Log fetched data for debugging
        const snacksContainer = document.getElementById('snacks-container');
        if (data.length === 0) {
          snacksContainer.innerHTML = '<p>No snacks available for Singapore.</p>';
        } else {
          snacksContainer.innerHTML = ''; // Clear any existing content
          data.forEach(snack => {
            const snackDiv = document.createElement('div');
            snackDiv.classList.add('snack');
            snackDiv.innerHTML = `
              <img src="${snack.imagePath || 'placeholder.png'}" alt="${snack.snackName}">
              <p>Snack ID: ${snack.snackId}</p>
              <p>Snack Name: ${snack.snackName}</p>
              <p>Description: ${snack.snackDescription}</p>
              <p>Price: $${snack.snackPrice}</p>
              <p>Ingredients: ${snack.ingredients}</p>
              <p>Country: ${snack.country}</p>
            `;
            snacksContainer.appendChild(snackDiv);
          });
        }
      })
      .catch(error => {
        console.error('Error fetching snacks:', error);
        document.getElementById('snacks-container').innerHTML = '<p>Error loading snacks.</p>';
      });
  });
  
  
  
  