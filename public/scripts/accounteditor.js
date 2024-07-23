document.addEventListener("DOMContentLoaded", async () => {
    const userEmail = localStorage.getItem("email"); // assuming you store the user's email in local storage
    const user = await retrieveUser(userEmail);
  
    if (user) {
      document.getElementById("name").value = user.name;
      document.getElementById("email").value = user.email;
      document.getElementById("address").value = user.address;
      document.getElementById("unitNo").value = user.unitNo;
      document.getElementById("postalCode").value = user.postalCode;
      document.getElementById("country").value = user.country;
      document.getElementById("phoneNo").value = user.phoneNo;
      document.getElementById("userBday").value = user.userBday;
      document.getElementById("role").value = user.role;
    }
  
    const updateBtn = document.getElementById("update-btn");
    updateBtn.addEventListener("click", updateAccount);
  });
  
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