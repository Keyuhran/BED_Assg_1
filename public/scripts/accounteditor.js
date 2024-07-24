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
  
  
  const updateBtn = document.getElementById("update-btn");
  updateBtn.addEventListener("click", updateAccount);
  
  async function updateAccount() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const unitNo = document.getElementById("unitNo").value;
    const postalCode = document.getElementById("postalCode").value;
    const country = document.getElementById("country").value;
    const phoneNo = document.getElementById("phoneNo").value;
    const userBday = document.getElementById("userBday").value;
    const role = document.getElementById("role").value;
  
    try {
      const response = await fetch("/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address, unitNo, postalCode, country, phoneNo, userBday, role }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      const result= await response.json();
      console.log("User updated:", result);
      alert("Account details updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating account details. Please try again.");
    }
  }
  
  async function retrieveUser(email) {
    const response = await fetch(`/users/email?email=${email}`);
    const data = await response.json();
    return data.user;
  }