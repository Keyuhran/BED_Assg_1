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
    // Implement password hashing using bcrypt (replace with your implementation)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.createUser(email, hashedPassword, postalcode, streetname, blockno, unitno, phoneno, name);

    if (newUser) {
      // Handle successful user creation (redirect, send confirmation email, etc.)
      alert("User created successfully!"); // Replace with appropriate redirection or message
    } else {
      // Handle potential errors (e.g., email already exists, etc.)
      alert("Error creating user. Please try again."); // Replace with specific error message
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again."); // Generic error message for user
  }
});
