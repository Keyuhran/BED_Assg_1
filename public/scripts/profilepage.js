localStorage.getItem("currentuser")
loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  localStorage.setItem("currentuser", email)

  try {
    const response = await fetch('/users/login', { // Assuming your login endpoint is at /users/login
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    // Handle successful login (redirect, display success message, etc.)
    alert('Login Successful!'); // You can replace this with a redirection or other logic
    console.log('Login Successful! Welcome,', data.email); // Adjust based on your data
    window.location.href = '../homepage.html'; // Redirect to home page or another page after login
  } catch (error) {
    console.error('Login error:', error);
    // Handle login errors (display error message to the user)
    alert('Login failed. Please check your credentials and try again.');
  }
});

document.getElementById('create-account-btn').addEventListener('click', function() {
  window.location.href = 'signup.html'; // Redirect to signup.html when button is clicked
});
