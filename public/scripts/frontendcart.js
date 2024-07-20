document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  fetch("/cart", {
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
    .then((cartContents) => {
      console.log("Cart contents:", cartContents);
      const cartContainer = document.getElementById("cart-container");
      if (cartContents.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      } else {
        cartContainer.innerHTML = "";
        cartContents.forEach((item) => {
          const cartItemDiv = document.createElement("div");
          cartItemDiv.classList.add("cart-item");
          cartItemDiv.innerHTML = `
              <p>Snack ID: ${item.snackId}</p>
              <p>Snack Name: ${item.snackName}</p>
              <p>Quantity: <button class="decrement-btn" data-snack-id="${
                item.snackId
              }">-</button> <span class="quantity">${
            item.quantity
          }</span> <button class="increment-btn" data-snack-id="${
            item.snackId
          }">+</button></p>
              <p>Price: $${item.snackPrice}</p>
              <p>Total Cost: $<span class="total-cost">${item.totalCost.toFixed(
                2
              )}</span></p>
              <button class="remove-from-cart-btn" data-snack-id="${
                item.snackId
              }">Remove</button>
            `;
          cartContainer.appendChild(cartItemDiv);
        });

        document.querySelectorAll(".increment-btn").forEach((button) => {
          button.addEventListener("click", async (event) => {
            const snackId = event.target.getAttribute("data-snack-id");
            const cartItemDiv = event.target.closest(".cart-item");
            const quantityElement = cartItemDiv.querySelector(".quantity");
            const newQuantity = parseInt(quantityElement.textContent) + 1;

            try {
              const response = await fetch("/cart/update", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ snackId, quantity: newQuantity }),
              });

              if (!response.ok) {
                throw new Error(
                  `Error updating quantity: ${response.statusText}`
                );
              }

              quantityElement.textContent = newQuantity;
              const priceElement = cartItemDiv.querySelector(".price");
              const price = parseFloat(
                priceElement.textContent.replace("$", "")
              );
              const totalCostElement = cartItemDiv.querySelector(".total-cost");
              totalCostElement.textContent = (newQuantity * price).toFixed(2);
            } catch (error) {
              console.error("Error updating quantity:", error);
            }
          });
        });

        document.querySelectorAll(".decrement-btn").forEach((button) => {
          button.addEventListener("click", async (event) => {
            const snackId = event.target.getAttribute("data-snack-id");
            const cartItemDiv = event.target.closest(".cart-item");
            const quantityElement = cartItemDiv.querySelector(".quantity");
            const newQuantity = parseInt(quantityElement.textContent) - 1;

            if (newQuantity < 1) return; // Minimum quantity is 1

            try {
              const response = await fetch("/cart/update", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ snackId, quantity: newQuantity }),
              });

              if (!response.ok) {
                throw new Error(
                  `Error updating quantity: ${response.statusText}`
                );
              }

              quantityElement.textContent = newQuantity;
              const priceElement = cartItemDiv.querySelector(".price");
              const price = parseFloat(
                priceElement.textContent.replace("$", "")
              );
              const totalCostElement = cartItemDiv.querySelector(".total-cost");
              totalCostElement.textContent = (newQuantity * price).toFixed(2);
            } catch (error) {
              console.error("Error updating quantity:", error);
            }
          });
        });

        document.querySelectorAll(".remove-from-cart-btn").forEach((button) => {
          button.addEventListener("click", async (event) => {
            const snackId = event.target.getAttribute("data-snack-id");
            const cartItemDiv = event.target.closest(".cart-item");

            try {
              const response = await fetch("/cart/remove", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ snackId }),
              });

              if (!response.ok) {
                throw new Error(
                  `Error removing from cart: ${response.statusText}`
                );
              }

              cartItemDiv.remove();
            } catch (error) {
              console.error("Error removing from cart:", error);
            }
          });
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching cart contents:", error);
      document.getElementById("cart-container").innerHTML =
        "<p>Error loading cart contents.</p>";
    });
});
