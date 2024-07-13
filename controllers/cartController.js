const Cart = require("../models/cart");
const sql = require("mssql");

async function addToCart(req, res) {
  const email = req.body.email;
  const snackId = req.body.snackId;
  const quantity = req.body.quantity;
  console.log("I love brawl stars:", email);

  if (!email || !snackId || !quantity) {
    return res.status(400).send('Email, Snack ID, and quantity are required');
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
