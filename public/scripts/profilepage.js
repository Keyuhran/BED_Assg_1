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
  document.getElementById('welcome-username').textContent = userData.name || 'N/A';
  document.getElementById('fullname').textContent = userData.name || 'N/A';
  document.getElementById('email').textContent = userData.email || 'N/A';
  document.getElementById('address').textContent = userData.address || 'N/A';
  document.getElementById('postalcode').textContent = userData.postalCode || 'N/A';
  document.getElementById('country').textContent = userData.country || 'N/A'; // Added for new HTML
  document.getElementById('phoneno').textContent = userData.phoneNo || 'N/A';
  document.getElementById('dob').textContent = formatDate(userData.userBday) || 'N/A';
  document.getElementById('role').textContent = userData.role || 'N/A';
  document.getElementById('unitno').textContent = userData.unitNo || 'N/A';   // Added for new HTML
}

// Function to format the date string
function formatDate(dateString) {
  if (!dateString) return 'N/A'; // Check if the dateString is null or undefined
  const date = new Date(dateString);

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  // Return formatted date
  return `${day}/${month}/${year}`;
}

document.getElementById('edit-profile-btn').addEventListener('click', function() {
  window.location.href = 'gig_AccountEditor.html'; // Redirect to edit profile page
});

document.getElementById('logout-btn')?.addEventListener('click', function() {
  localStorage.removeItem('userEmail');
  window.location.href = 'index.html'; // Redirect to login page (assuming index.html is your login page)
});
