const Cart = require("../models/cart");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const secretKey = "ilovehaziq2?$%"; // Ensure this matches the one used in userController.js

async function addToCart(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token
    const snackId = req.body.snackId;
    const quantity = req.body.quantity;

    console.log("Adding to cart for user:", email);

    if (!email || !snackId || !quantity) {
      return res.status(400).send('Snack ID and quantity are required');
    }

    const snackPrice = await getSnackPrice(snackId); // Function to get the snack price from the database
    const success = await Cart.addToCart(email, snackId, quantity, snackPrice);
    if (success) {
      res.status(201).send("Snack added to cart successfully");
    } else {
      res.status(400).send("Error adding snack");
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send("Internal server error");
  }
}

async function getSnackPrice(snackId) {
  const connection = await sql.connect(dbConfig);
  const sqlQuery = 'SELECT SnackPrice FROM Snacks WHERE SnackId = @SnackId';
  const request = connection.request();
  request.input("SnackId", sql.VarChar, snackId);
  const result = await request.query(sqlQuery);
  connection.close();
  return result.recordset[0].SnackPrice;
}

async function getCartContents(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token

    const cartContents = await Cart.getCartContents(email);
    if (cartContents) {
      res.json(cartContents);
    } else {
      res.status(404).send("Cart is empty");
    }
  } catch (error) {
    console.error("Error fetching cart contents:", error);
    res.status(500).send("Internal server error");
  }
}

async function removeFromCart(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token
    const snackId = req.body.snackId;

    console.log("Removing from cart for user:", email);

    if (!email || !snackId) {
      return res.status(400).send('Snack ID is required');
    }

    const success = await Cart.removeFromCart(email, snackId);
    if (success) {
      res.status(200).send("Snack removed from cart successfully");
    } else {
      res.status(400).send("Error removing snack");
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).send("Internal server error");
  }
}

async function updateQuantity(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token
    const snackId = req.body.snackId;
    const quantity = req.body.quantity;

    console.log("Updating quantity for user:", email);

    if (!email || !snackId || quantity < 1) {
      return res.status(400).send('Valid snack ID and quantity are required');
    }

    const snackPrice = await getSnackPrice(snackId); // Function to get the snack price from the database
    const success = await Cart.updateQuantity(email, snackId, quantity, snackPrice);
    if (success) {
      res.status(200).send("Quantity updated successfully");
    } else {
      res.status(400).send("Error updating quantity");
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  addToCart,
  getCartContents,
  removeFromCart,
  updateQuantity
};
