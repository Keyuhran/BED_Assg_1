const Order = require("../models/order");
const Cart = require("../models/cart");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const secretKey = process.env.secretKey;

async function createOrder(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token
    const orderItems = req.body.orderItems;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).send("No items in the order.");
    }

    const connection = await sql.connect(dbConfig);
    const userQuery = `
      SELECT name, address, unitNo, postalCode, country, phoneNo
      FROM Users
      WHERE email = @Email
    `;
    const userRequest = connection.request();
    userRequest.input("Email", sql.VarChar, email);
    const userResult = await userRequest.query(userQuery);
    connection.close();

    if (userResult.recordset.length === 0) {
      return res.status(400).send("User not found.");
    }

    const { name, address, unitNo, postalCode, country, phoneNo } = userResult.recordset[0];
    const orderId = uuidv4();
    const dateAdded = new Date().toISOString();
    const status = "Pending";

    for (const item of orderItems) {
      const { snackId, quantity } = item;
      await Order.createOrder(orderId, email, snackId, quantity, dateAdded, name, address, unitNo, postalCode, country, phoneNo);
    }

    res.status(201).send("Order created successfully");
  } catch (error) {
    console.error("Error creating order:", error.message, error.stack); // Log the error details
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  createOrder,
};
