// controllers/orderController.js

const Order = require("../models/order");
const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;

async function createOrder(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token
    const orderItems = req.body.orderItems;
    const orderId = generateUniqueOrderId(); // Function to generate a unique orderId
    const dateAdded = new Date();

    for (const item of orderItems) {
      const { snackId, quantity } = item;
      await Order.createOrder(orderId, email, snackId, quantity.toString(), dateAdded); // Ensure quantity is a string
    }

    res.status(201).send("Order created successfully");
  } catch (error) {
    console.error("Error creating order:", error.message, error.stack); // Log the error details
    res.status(500).send("Internal server error");
  }
}

function generateUniqueOrderId() {
  return 'order-' + Math.random().toString(36).substr(2, 9);
}

module.exports = {
  createOrder,
};
