const Cart = require("../models/cart");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const secretKey = "ilovehaziq2?$%"; // Ensure this matches the one used in userController.js

async function addToCart(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, secretKey);
  const email = decoded.email; // Get email from the decoded token
  const snackId = req.body.snackId;
  const quantity = req.body.quantity;

  console.log("Adding to cart for user:", email);

  if (!email || !snackId || !quantity) {
    return res.status(400).send('Snack ID and quantity are required');
  }

  try {
    const success = await Cart.addToCart(email, snackId, quantity);
    if (success) {
      res.status(201).send("Snack added to cart successfully");
    } else {
      res.status(400).send("Error adding snack");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  addToCart
};
