const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/Users', { // Assuming your login endpoint is at /login
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    // Handle successful login (redirect, display success message, etc.)
    console.log('Login Successful! Welcome,', data.username); // Adjust based on your data
  } catch (error) {
    console.error('Login error:', error);
    // Handle login errors (display error message to the user)
  }
});

// ... existing script for create account button ...

document.getElementById('create-account-btn').addEventListener('click', function() {
  window.location.href = 'signup.html'; // Redirect to signup.html when button is clicked
});
