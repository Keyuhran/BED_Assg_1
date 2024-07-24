document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token"); // Retrieve token from local storage

  fetch("http://localhost:3000/cart", {
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
          console.log("Item image path:", item.imagePath); // Log the image path for debugging
          const cartItemDiv = document.createElement("div");
          cartItemDiv.classList.add("cart-item");
          cartItemDiv.innerHTML = `
            <div style="display: flex; align-items: center;">
              <div>
                <p>Snack ID: ${item.snackIds}</p>
                <p>Snack Name: ${item.snackName}</p>
                <p>Quantity: <button class="decrement-btn" data-snack-id="${
                  item.snackIds
                }">-</button> <span class="quantity">${item.quantity}</span> <button class="increment-btn" data-snack-id="${
                item.snackIds
              }">+</button></p>
                <p>Price: $<span class="price">${item.snackPrice.toFixed(2)}</span></p>
                <p>Total Cost: $<span class="total-cost">${item.totalCost.toFixed(
                  2
                )}</span></p>
                <button class="remove-from-cart-btn" data-snack-id="${
                  item.snackIds
                }">Remove</button>
              </div>
              <div>
                <img src="${item.imagePath && item.imagePath !== 'NULL' ? item.imagePath : 'placeholder.png'}" alt="${item.snackName}" style="max-width: 150px; margin-left: 20px;">
              </div>
            </div>
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
              const response = await fetch("http://localhost:3000/cart/update", {
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
              const price = parseFloat(priceElement.textContent);
              const totalCostElement = cartItemDiv.querySelector(".total-cost");
              totalCostElement.textContent = (newQuantity * price).toFixed(2);
              updateTotalPrice();
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
              const response = await fetch("http://localhost:3000/cart/update", {
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
              const price = parseFloat(priceElement.textContent);
              const totalCostElement = cartItemDiv.querySelector(".total-cost");
              totalCostElement.textContent = (newQuantity * price).toFixed(2);
              updateTotalPrice();
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
              const response = await fetch("http://localhost:3000/cart/remove", {
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
              updateTotalPrice();
            } catch (error) {
              console.error("Error removing from cart:", error);
            }
          });
        });

        updateTotalPrice();
      }
    })
    .catch((error) => {
      console.error("Error fetching cart contents:", error);
      document.getElementById("cart-container").innerHTML =
        "<p>Error loading cart contents.</p>";
    });

  document.querySelector(".checkout-button").addEventListener("click", () => {
    const cartContainer = document.getElementById("cart-container");
    if (cartContainer.innerHTML === "<p>Your cart is empty.</p>") {
      alert("No items in cart");
    } else {
      showOverlay();
    }
  });

  document.getElementById("orderNowButton").addEventListener("click", async () => {
    const creditCardNumber = document.getElementById("creditCardNumber").value;
    const cvv = document.getElementById("cvv").value;
    const expiryDate = document.getElementById("expiryDate").value;

    if (validateCardDetails(creditCardNumber, cvv, expiryDate)) {
      try {
        const cartItems = [...document.querySelectorAll(".cart-item")].map(item => {
          return {
            snackId: item.querySelector(".decrement-btn").dataset.snackId,
            quantity: parseInt(item.querySelector(".quantity").textContent)
          };
        });

        const response = await fetch("http://localhost:3000/order/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ orderItems: cartItems })
        });

        if (!response.ok) {
          throw new Error(`Error creating order: ${response.statusText}`);
        }

        alert("Order placed successfully!");
        window.location.href = "order.html";
      } catch (error) {
        console.error("Error placing order:", error);
        alert("Failed to place order.");
      }
    } else {
      alert("Card entered incorrectly.");
    }
  });

  document.getElementById("cancelButton").addEventListener("click", hideOverlay);

  function showOverlay() {
    document.getElementById("checkoutOverlay").style.visibility = "visible";
  }

  function hideOverlay() {
    document.getElementById("checkoutOverlay").style.visibility = "hidden";
  }

  function validateCardDetails(creditCardNumber, cvv, expiryDate) {
    const cardNumberRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

    return (
      cardNumberRegex.test(creditCardNumber) &&
      cvvRegex.test(cvv) &&
      expiryDateRegex.test(expiryDate)
    );
  }

  function updateTotalPrice() {
    const totalPriceElement = document.getElementById("total-price");
    const totalCostElements = document.querySelectorAll(".total-cost");
    let totalPrice = 0;
    totalCostElements.forEach((element) => {
      totalPrice += parseFloat(element.textContent);
    });
    totalPriceElement.textContent = totalPrice.toFixed(2);
  }
});
