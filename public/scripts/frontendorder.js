document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

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

          const snacksHTML = order.snacks
            .map(
              (snack) => `
                <div class="snack-details">
                  <div class="snack-info">
                    <p>Snack Name: ${snack.snackName}</p>
                    <p>Quantity: ${snack.quantity}</p>
                  </div>
                  <img src="${snack.imagePath}" alt="${snack.snackName}" />
                </div>
                <hr />
              `
            )
            .join("");

          orderItemDiv.innerHTML = `
            <div class="details-container">
              <p><strong>Order ID:</strong> ${order.orderId}</p>
              <hr />
              ${snacksHTML}
              <p><strong>Address:</strong> ${order.address}</p>
              <p><strong>Status:</strong> ${order.status}</p>
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
