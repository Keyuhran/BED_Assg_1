document.addEventListener('DOMContentLoaded', async function() {
    const currentUser = localStorage.getItem("userEmail");
    console.log("Current User:", currentUser);
  
    try {
        const response = await fetch(`/users/${currentUser}`);
        if (!response.ok) {
            throw new Error(`Failed to retrieve user data: ${response.status}`);
        }
        const userData = await response.json();
        console.log("User Data:", userData); // Log user data to ensure it's correct
        displayUserData(userData);
    } catch (error) {
        console.error('Error retrieving user data:', error);
    }
});

async function displayUserData(userData) {
    document.getElementById("name").value = userData.name || '';
    document.getElementById("email").value = userData.email || '';
    document.getElementById("address").value = userData.address || '';
    document.getElementById("unitNo").value = userData.unitNo || '';
    document.getElementById("postalCode").value = userData.postalCode || '';
    document.getElementById("country").value = userData.country || '';
    document.getElementById("phoneNo").value = userData.phoneNo || '';

    // Handle date formatting
    if (userData.userBday) {
        try {
            const userBday = new Date(userData.userBday);
            if (isNaN(userBday.getTime())) {
                throw new Error("Invalid date format");
            }
            const formattedDate = userBday.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            console.log("Formatted Date:", formattedDate); // Log formatted date
            document.getElementById("userBday").value = formattedDate || '';
        } catch (error) {
            console.error("Error formatting date:", error);
        }
    } else {
        document.getElementById("userBday").value = ''; // Handle missing date
    }
    document.getElementById("role").value = userData.role || 'User';
}

document.querySelector(".submit-btn").addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const unitNo = document.getElementById("unitNo").value;
    const postalCode = document.getElementById("postalCode").value;
    const country = document.getElementById("country").value;
    const phoneNo = document.getElementById("phoneNo").value;
    const userBday = document.getElementById("userBday").value; // This should be in YYYY-MM-DD format
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
        alert("Error updating account details. Please try again.");
    }
});

async function retrieveUser(email) {
    const response = await fetch(`/users/email?email=${email}`);
    const data = await response.json();
    return data.user;
}
