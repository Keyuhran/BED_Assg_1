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
  
async function displayUserData(userData) {
    document.getElementById("name").value = userData.name;
    document.getElementById("email").value = userData.email;
    document.getElementById("address").value = userData.address;
    document.getElementById("unitNo").value = userData.unitNo;
    document.getElementById("postalCode").value = userData.postalCode;
    document.getElementById("country").value = userData.country;
    document.getElementById("phoneNo").value = userData.phoneNo;
    const userBday = new Date(userData.userBday).toISOString().split('T')[0];
    document.getElementById("userBday").value = userBday;
    document.getElementById("role").value = userData.role;
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
      const response = await fetch(`/users/${email}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address, unitNo, postalCode, country, phoneNo, userBday, role }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
  
      const result = await response.json();
      console.log("User updated:", result);
      alert("Account details updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Account details updated successfully!");
    }
  }

  
  async function retrieveUser(email) {
    const response = await fetch(`/users/email?email=${email}`);
    const data = await response.json();
    return data.user;
  }