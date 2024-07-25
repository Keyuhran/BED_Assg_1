document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  fetch("http://localhost:3000/orders/user", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok: ${response.statusText} (status code: ${response.status})`
        );
      }
      return response.json();
    })
    .then((orders) => {
      console.log("Orders:", orders);
      const orderContainer = document.getElementById("order-container");
      if (orders.length === 0) {
        orderContainer.innerHTML = "<p>You have no orders.</p>";
      } else {
        orderContainer.innerHTML = "";
        orders.forEach((order) => {
          const orderItemDiv = document.createElement("div");
          orderItemDiv.classList.add("order-item");
          orderItemDiv.innerHTML = `
              <div class="details-container">
                <p>Order ID: ${order.orderId}</p>
                <p>Snack Name: ${order.snackName}</p>
                <p>Snack ID: ${order.snackId}</p>
                <p>Quantity: ${order.quantity}</p>
                <p>Address: ${order.address}</p>
                <p>Date Added: ${order.dateAdded}</p>
                <p>Status: ${order.status}</p>
              </div>
              <div class="image-container">
                <img src="${
                  order.imagePath && order.imagePath !== "NULL"
                    ? order.imagePath
                    : "placeholder.png"
                }" alt="${order.snackName}" style="max-width: 150px;">
              </div>
            `;
          orderContainer.appendChild(orderItemDiv);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      document.getElementById("order-container").innerHTML =
        "<p>Error loading orders.</p>";
    });
});
