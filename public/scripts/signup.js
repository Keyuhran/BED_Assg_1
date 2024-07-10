const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const email = document.getElementById('newemail').value;
  const password = document.getElementById('setpassword').value;
  const postalcode = document.getElementById('setpostal').value;
  const streetname = document.getElementById('setstreet').value;
  const blockno = document.getElementById('setblock').value;
  const unitno = document.getElementById('setunit').value;
  const phoneno = document.getElementById('setnumber').value;
  const name = document.getElementById('setname').value;

  try {
    const response = await fetch('/api/createUser', { // Replace '/api/createUser' with your actual endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        postalcode,
        streetname,
        blockno,
        unitno,
        phoneno,
        name
      })
    });

    const data = await response.json();

    if (data.message === 'User created successfully!') {
      // Handle successful user creation (redirect, send confirmation email, etc.)
      alert("User created successfully!"); // Replace with appropriate redirection or message
    } else {
      // Handle potential errors (e.g., email already exists, etc.)
      alert(data.message || "Error creating user. Please try again."); // Use specific error message from response if available
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again."); // Generic error message for user
  }
});
