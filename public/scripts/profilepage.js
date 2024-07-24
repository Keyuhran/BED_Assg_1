document.addEventListener('DOMContentLoaded', async function() {
const currentUser = localStorage.getItem("userEmail");
console.log("Current User:", currentUser);

  try {
    const response = await fetch(`/users/${currentUser}`);

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
  const addressElement = document.querySelector('.streetname');
  const postalElement = document.querySelector('.postalcode');
  const blocknoElement = document.querySelector('.blockno');
  const unitnoElement = document.querySelector('.unitno');
  const phonenoElement = document.querySelector('.phoneno');

  usernameElement.textContent = userData.name;
  emailElement.textContent = userData.email;
  addressElement.textContent = userData.address; // Corrected from userData.streetname
  postalElement.textContent = userData.postalCode; // Corrected from userData.postalcode
  blocknoElement.textContent = userData.unitNo; // Corrected from userData.blockno
  unitnoElement.textContent = userData.unitNo; // Corrected from userData.unitno
  phonenoElement.textContent = userData.phoneNo;
}
document.getElementById('create-account-btn').addEventListener('click', function() {
  window.location.href = 'signup.html'; // Redirect to signup.html when button is clicked
})

document.getElementById('edit-profile-btn').addEventListener('click', function() {
  window.location.href = 'AccountEditor.html';
});