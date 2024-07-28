document.addEventListener('DOMContentLoaded', async () => {
    const ordersContainer = document.getElementById('ordersContainer');
    const riderId = localStorage.getItem("riderId");

    // Function to fetch and display past orders
    async function fetchPastOrders() {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
        console.log(riderId);
        try {
            const response = await fetch(`/orders/riderId?riderId=${riderId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                console.error(`Failed to fetch orders with status: ${response.status}`);
                throw new Error(`Failed to fetch orders with status: ${response.status}`);
            }

            const orders = await response.json();
            displayOrders(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }

    // Function to display orders
    function displayOrders(orders) {
        ordersContainer.innerHTML = ''; // Clear existing orders
        orders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item', 'col-md-4', 'mb-4');
            orderItem.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Order #${order.orderId}</h5>
                        <p class="card-text">Name: ${order.name}</p>
                        <p class="card-text">Drop-off: ${order.address}</p>
                        <p class="card-text">PhoneNo: ${order.phoneNo}</p>
                    </div>
                </div>
            `;
            console.log(order.orderId, order.name, order.address);
            ordersContainer.appendChild(orderItem);
        });
    }

    // Fetch past orders on page load
    fetchPastOrders();
});
