const Cart = require("../models/cart");
const jwt = require("jsonwebtoken");
const sql = require("mssql");
const dbConfig = require("../dbConfig");
const orderController = require("./orderController");
const secretKey = process.env.secretKey;

async function getSnackPrice(snackId) {
  try {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = "SELECT snackPrice FROM Snacks WHERE snackId = @SnackId";
    const request = connection.request();
    request.input("SnackId", sql.VarChar, snackId);
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0].snackPrice;
  } catch (error) {
    console.error("Error fetching snack price:", error.message, error.stack);
    return null;
  }
}

async function addToCart(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;
    const { snackId, quantity } = req.body;

    console.log("Adding to cart for user:", email);

    if (!email || !snackId || !quantity) {
      return res.status(400).json({ message: "Snack ID and quantity are required" });
    }

    const success = await Cart.addToCart(email, snackId, quantity);
    if (success) {
      res.status(201).json({ message: "Snack added to cart successfully" });
    } else {
      res.status(400).json({ message: "Error adding snack" });
    }
  } catch (error) {
    console.error("Error adding to cart:", error.message, error.stack); // Log the error details
    res.status(500).json({ message: "Internal server error" });
  }
}


async function getCartContents(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token

    const cartContents = await Cart.getCartContents(email);
    if (cartContents) {
      res.json(cartContents);
    } else {
      res.status(404).send("Cart is empty");
    }
  } catch (error) {
    console.error("Error fetching cart contents:", error.message, error.stack);
    res.status(500).send("Internal server error");
  }
}

async function removeFromCart(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token
    const snackId = req.body.snackId;

    console.log("Removing from cart for user:", email);

    if (!email || !snackId) {
      return res.status(400).send("Snack ID is required");
    }

    const success = await Cart.removeFromCart(email, snackId);
    if (success) {
      res.status(200).send("Snack removed from cart successfully");
    } else {
      res.status(400).send("Error removing snack");
    }
  } catch (error) {
    console.error("Error removing from cart:", error.message, error.stack);
    res.status(500).send("Internal server error");
  }
}

async function updateQuantity(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email; // Get email from the decoded token
    const snackId = req.body.snackId;
    const quantity = req.body.quantity;

    console.log("Updating quantity for user:", email);

    if (!email || !snackId || quantity < 1) {
      return res.status(400).send("Valid snack ID and quantity are required");
    }

    const snackPrice = await getSnackPrice(snackId); // Function to get the snack price from the database
    const success = await Cart.updateQuantity(email, snackId, quantity, snackPrice);
    if (success) {
      res.status(200).send("Quantity updated successfully");
    } else {
      res.status(400).send("Error updating quantity");
    }
  } catch (error) {
    console.error("Error updating quantity:", error.message, error.stack);
    res.status(500).send("Internal server error");
  }
}

async function orderNow(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const email = decoded.email;

    const cartContents = await Cart.getCartContents(email);
    if (!cartContents) {
      return res.status(400).send("Cart is empty");
    }

    const orderItems = cartContents.map((item) => ({
      snackId: item.snackId,
      quantity: parseInt(item.quantity), // Ensure quantity is an integer
    }));

    req.body.orderItems = orderItems;
    await orderController.createOrder(req, res);
  } catch (error) {
    console.error("Error creating order:", error.message, error.stack);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  addToCart,
  getCartContents,
  removeFromCart,
  updateQuantity,
  orderNow,
};
