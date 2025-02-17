const loginForm = document.getElementById('login-form');
const togglePasswordBtn = document.getElementById('toggle-password');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    console.log("Sending login request for email:", email); // Log before sending request
    const response = await fetch('/users/login', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      console.error(`Login failed with status: ${response.status}`);
      throw new Error(`Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (data.role === 'rider') {
      try {
        const response2 = await fetch(`/riders/email?email=${email}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response2.ok) {
          console.error(`Error retrieving rider with status: ${response2.status}`);
          throw new Error(`Error retrieving rider with status: ${response2.status}`);
        }

        const data2 = await response2.json();
        localStorage.setItem('riderId', data2.riderId);
      } catch (error) {
        console.error('Rider retrieval error:', error);
      }
    }

    // Handle successful login (redirect, display success message, etc.)
    console.log('Login Successful! Welcome,', data.email); // Adjust based on your data
    console.log(data.role);
    alert('Login Successful!'); // You can replace this with a redirection or other logic

    // Store email and JWT in local storage
    localStorage.setItem('userEmail', data.email);
    localStorage.setItem('token', data.token);

    // Redirect based on role
    if (data.role === 'admin') {
      window.location.href = '../adminhomepage.html'; // Redirect to account editor page if admin
    } else if (data.role === 'rider') {
      window.location.href = '../riderHomePage.html'; // Redirect to home page if rider
    } else {
      window.location.href = '../homepage.html'; // Redirect to general home page
    }
  } catch (error) {
    console.error('Login error:', error);
    // Handle login errors (display error message to the user)
    alert('Login failed. Please check your credentials and try again.');
  }
});

document.getElementById('create-account-btn').addEventListener('click', function() {
  window.location.href = 'signup.html'; // Redirect to signup.html when button is clicked
});

togglePasswordBtn.addEventListener('click', () => {
  const passwordField = document.getElementById('password');
  if (passwordField.type === 'password') {
    passwordField.type = 'text';
    togglePasswordBtn.classList.remove('bxs-show');
    togglePasswordBtn.classList.add('bxs-hide');
  } else {
    passwordField.type = 'password';
    togglePasswordBtn.classList.remove('bxs-hide');
    togglePasswordBtn.classList.add('bxs-show');
  }
});
