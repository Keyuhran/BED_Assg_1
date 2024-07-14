const signupForm = document.getElementById('signup-form');
const backToLoginBtn = document.getElementById('back-to-login-btn');

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const email = document.getElementById('newemail').value;
  const password = document.getElementById('setpassword').value;
  const name = document.getElementById('setname').value;
  const address = document.getElementById('setaddress').value;
  const unitNo = document.getElementById('setunit').value;
  const postalCode = document.getElementById('setpostal').value;
  const country = document.getElementById('setcountry').value;
  const phoneNo = document.getElementById('setnumber').value;
  const userBday = document.getElementById('setbirthday').value;

  const formData = {
    email,
    password,
    name,
    address,
    unitNo,
    postalCode,
    country,
    phoneNo,
    userBday,
    imagePath: null 
  };

  try {
    const response = await fetch('/users/createUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      alert("User created successfully!"); 
      window.location.href = 'index.html'; 
    } else {
      alert(data.message || "Error creating user. Please try again."); 
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again."); 
  }
});

backToLoginBtn.addEventListener('click', () => {
  window.location.href = 'index.html'; 
});
