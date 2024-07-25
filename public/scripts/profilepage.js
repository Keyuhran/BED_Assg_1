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
  } catch (error) {
    console.error('Error retrieving user data:', error);
  }
});

function displayUserData(userData) {
  const usernameElement = document.querySelector('.username');
  const emailElement = document.querySelector('.email');
  const addressElement = document.querySelector('.address');
  const postalElement = document.querySelector('.postalcode');
  const blocknoElement = document.querySelector('.blockno');
  const unitnoElement = document.querySelector('.unitno');
  const phonenoElement = document.querySelector('.phoneno');
  const dobElement = document.querySelector('.dob');
  const roleElement = document.querySelector('.role')

  usernameElement.textContent = userData.name;
  emailElement.textContent = userData.email;
  addressElement.textContent = userData.address;
  postalElement.textContent = userData.postalCode;
  blocknoElement.textContent = userData.blockNo;
  unitnoElement.textContent = userData.unitNo;
  phonenoElement.textContent = userData.phoneNo;
  dobElement.textContent = userData.userBday;
  roleElement.textContent = userData.role;

}

document.getElementById('edit-profile-btn').addEventListener('click', function() {
  window.location.href = 'AccountEditor.html'; // Redirect to edit profile page
});

document.getElementById('logout-btn').addEventListener('click', function() {
  localStorage.removeItem('userEmail');
  window.location.href = 'index.html'; // Redirect to logout page (assuming index.html is your login page)
});
