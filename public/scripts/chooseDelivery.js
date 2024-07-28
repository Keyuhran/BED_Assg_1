document.addEventListener('DOMContentLoaded', async () => {
    const deliveryList = document.getElementById('delivery-list');
    const riderId = localStorage.getItem("riderId");

    // Function to fetch and display available orders
    async function fetchOrders() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        try {
            const response = await fetch('/orders/riders', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                console.error(`Failed to fetch orders with status: ${response.status}`);
                throw new Error(`Failed to fetch orders with status: ${response.status}`);
            }

            const orders = await response.json();
            console.log('Fetched orders:', orders);
            if (Array.isArray(orders)) {
                displayOrders(orders);
            } else {
                console.error('Orders response is not an array:', orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

     // Function to display orders
     function displayOrders(orders) {
        deliveryList.innerHTML = ''; // Clear existing orders
        orders.forEach(order => {
            const deliveryItem = document.createElement('div');
            deliveryItem.classList.add('delivery-item');
            deliveryItem.innerHTML = `
                <h2>Order from: ${order.name}</h2>
                <p>Address: ${order.address}</p>
                <p>Postal Code: ${order.postalCode}</p>
                <p>Snack ID: ${order.snackId}</p>
                <p>Quantity: ${order.quantity}</p>
                <button class="choose-button" data-order-id="${order.orderId}" data-snack-id="${order.snackId}">Choose</button>
            `;
            deliveryList.appendChild(deliveryItem);
        });

        document.querySelectorAll('.choose-button').forEach(button => {
            button.addEventListener('click', async (e) => {
                const deliveryItem = e.target.closest('.delivery-item');
                const orderId = e.target.getAttribute('data-order-id');
                const snackId = e.target.getAttribute('data-snack-id');
                const riderId = localStorage.getItem("riderId");
                console.log(orderId);
                console.log(snackId);
                console.log(riderId);

                try {
                    const response = await fetch('/orders/claim', {
                        method: 'PUT',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify({ orderId, riderId, snackId })
                    });

                    if (response.ok) {
                        alert(`You have successfully claimed the order from: ${deliveryItem.querySelector('h2').innerText}`);
                        fetchOrders(); // Refresh the orders list
                    } else {
                        const errorText = await response.text();
                        console.error('Failed to claim order:', errorText);
                        alert(`Failed to claim order: ${errorText}`);
                    }
                } catch (error) {
                    console.error('Error claiming order:', error);
                    alert('Error claiming order');
                }
            });
        });
    }

    // Fetch orders on page load
    fetchOrders();
});
