const Cart = require("../models/cart");
const sql = require("mssql");

async function addToCart(req, res) {
  const email = req.body.email;
  const snackId = req.body.snackId;
  const quantity = req.body.quantity;
  console.log("I love brawl stars:", email);

  try {
    const success = await Cart.addToCart(email, snackId, quantity);
    if (success) {
      res.status(201).send("Snack added to cart successfully");
    }
    else {
      res.status(400).send("Error adding snack");
    }
  } catch (error) {
      console.error(error);
      res.status(404).send("Snacks not found");
  }
}

module.exports = {
  addToCart
};