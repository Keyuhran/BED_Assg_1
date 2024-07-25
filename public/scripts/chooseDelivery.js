// scripts/chooseDelivery.js

// Example function to handle "Choose" button click
document.querySelectorAll('.choose-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const deliveryItem = e.target.closest('.delivery-item');
        alert(`You have chosen: ${deliveryItem.querySelector('h2').innerText}`);
    });
});
