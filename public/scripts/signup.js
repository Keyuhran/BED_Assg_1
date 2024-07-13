const signupForm = document.getElementById('signup-form');
const backToLoginBtn = document.getElementById('back-to-login-btn');

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
  const isRider = document.getElementById('isRider').value;

  try {
    const response = await fetch('/users/createUser', { // Correct endpoint
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
        name,
        isRider
      })
    });

    const data = await response.json();

    if (response.ok) {
      // Handle successful user creation
      alert("User created successfully!"); 
      window.location.href = 'index.html'; // Redirect to login page
    } else {
      // Handle potential errors
      alert(data.message || "Error creating user. Please try again."); 
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again."); 
  }
});

// Event listener for "Back to Login" button
backToLoginBtn.addEventListener('click', () => {
  window.location.href = 'index.html'; // Redirect to login page
});
