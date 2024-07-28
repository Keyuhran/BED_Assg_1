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
  document.getElementById('country').textContent = userData.country || 'N/A';
  document.getElementById('phoneno').textContent = userData.phoneNo || 'N/A';
  document.getElementById('dob').textContent = formatDate(userData.userBday) || 'N/A';
  document.getElementById('role').textContent = userData.role || 'N/A';
  document.getElementById('unitno').textContent = userData.unitNo || 'N/A';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

document.getElementById('edit-profile-btn').addEventListener('click', function() {
  window.location.href = 'AccountEditor.html'; // Redirect to edit profile page
});

document.getElementById('logout-btn')?.addEventListener('click', function() {
  localStorage.removeItem('userEmail');
  window.location.href = 'index.html'; // Redirect to login page
});

document.getElementById('Delete-profile-btn').addEventListener('click', async function() {
  const confirmation = confirm("Are you sure you want to delete your profile? This action cannot be undone.");
  
  if (confirmation) {
      const currentUser = localStorage.getItem("userEmail");
      
      try {
          const response = await fetch(`/users/email?email=${currentUser}`, {
              method: 'DELETE'
          });

          if (!response.ok) {
              throw new Error(`Failed to delete user: ${response.status}`);
          }

          alert("Profile deleted successfully.");
          localStorage.removeItem('userEmail');
          window.location.href = 'index.html'; // Redirect to login page
      } catch (error) {
          console.error('Error deleting user:', error);
          alert("An error occurred while trying to delete your profile. Please try again.");
      }
  }
});
