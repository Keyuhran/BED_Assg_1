document.addEventListener('DOMContentLoaded', async function() {
const currentUser = localStorage.getItem("currentuser");

  try {
    const response = await fetch(`/users/email?email=${currentUser}`);

    if (!response.ok) {
        throw new Error(`Failed to retrieve user data: ${response.status}`);
      }

      const userData = await response.json();
      displayUserData(userData);
    // Handle successful login (redirect, display success message, etc.)
  } catch (error) {
    console.error('Error retrieving user data:', error);
}
});

function displayUserData(userData) {
    const usernameElement = document.querySelector('.username');
    const emailElement = document.querySelector('.page-title');
    const addressElement = document.querySelector('.streetname')
    const postalElement = document.querySelector('.postalcode')
    const blocknoElement = document.querySelector('.blockno');
    const unitnoElement = document.querySelector('.unitno');
    const phonenoElement = document.querySelector('.phoneno');
  
    usernameElement.textContent = userData.name;
    emailElement.textContent = userData.email;
    addressElement.textContent = userData.streetname;
    postalElement.textContent = userData.postalcode;
    blocknoElement.textContent = userData.blockno;
    unitnoElement.textContent = userData.unitno;
    phonenoElement.textContent = userData.phoneno;
  }
document.getElementById('create-account-btn').addEventListener('click', function() {
  window.location.href = 'signup.html'; // Redirect to signup.html when button is clicked
})

