const Snack = require("../models/snack");
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
      res.status(400).send("Error adding snack");
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

const getSnacksByCountry = async (req, res) => {
  const country = req.params.country; // Retrieve the country from the URL parameter
  console.log(country);
  try {
    const snacks = await Snack.getSnacksByCountry(country);
    if (!snacks) {
      return res.status(404).send("Snacks not found");
    }
    res.json(snacks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving snacks");
  }
};

async function updateSnack(req, res) {
  const snackId = req.params.snackId; // Retrieve the snackId from the URL parameter
  const { snackName, snackDescription, snackPrice, ingredients, imagePath, country } = req.body;

  try {
    const updated = await Snack.updateSnack(
      snackId,
      snackName,
      snackDescription,
      snackPrice,
      ingredients,
      imagePath,
      country
    );

    if (updated) {
      res.status(200).send("Snack updated successfully!");
    } else {
      res.status(404).send("Snack not found or could not be updated");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = {
  createSnack,
  retrieveSnacks,
  getSnacksByCountry,
  updateSnack
};
