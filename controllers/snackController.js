const Snack = require("../models/Snack");
const bcrypt = require("bcryptjs");


async function createSnack(req, res) {
  const snackId = req.body.snackId;
  console.log(req.body);
  const snackName = req.body.snackName;
  const snackDescription = req.body.snackDescription;
  const snackPrice = req.body.snackPrice;
  const ingredients = req.body.ingredients;
  const imagePath = req.body.imagePath;
  const country = req.body.country;

  try {
    const newSnack = await Snack.createSnack(snackId, snackName, snackDescription, snackPrice, ingredients, imagePath, country);

    if (newSnack) {
      res.status(201).send("Snack created successfully!");
    } else {
      res.status(400).send("Error creating user");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}


async function retrieveSnacks(req, res) {

  try {
    const snacks = await Snack.retrieveSnacks();

    if (snacks) {
      console.log('Snack details in controller:', snacks); // Added for debugging

      res.json(snacks);
    } else {
      res.status(404).send("Snacks not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
}

async function deleteUser(req, res) {
  const email = req.query.email;

  try {
    const user = await User.retrieveUser(email);
    console.log("Attempting to delete user:", user.name);
    const success = await User.deleteUser(email);

    if (success) {
      res.status(204).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
}

module.exports = {
  createSnack,
  retrieveSnacks,
  deleteUser
};
