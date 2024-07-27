const Snack = require("../models/snack");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Adjust the destination as needed

async function createSnack(req, res) {
  const { snackName, snackDescription, snackPrice, ingredients, country } = req.body;
  let imagePath = null;

  if (req.file) {
    imagePath = req.file.path; // Assuming you have some logic to save the file and get its path
  }

  // Log the received values
  console.log('Received values:', { snackName, snackDescription, snackPrice, ingredients, imagePath, country });

  if (!country) {
    console.error('Country is undefined');
    return res.status(400).send('Country is required');
  }

  try {
    // Fetch the highest snackId for the given country
    const maxSnackId = await Snack.getMaxSnackIdByCountry(country);
    let newSnackId;

    if (maxSnackId) {
      // Increment the highest snackId by 1
      const currentMaxIdNumber = parseInt(maxSnackId.slice(2));
      newSnackId = `${country}${String(currentMaxIdNumber + 1).padStart(3, '0')}`;
    } else {
      // If no snacks exist for this country, start with '001'
      newSnackId = `${country}001`;
    }

    console.log('Generated snackId:', newSnackId); // Debugging line

    const newSnack = await Snack.createSnack(newSnackId, snackName, snackDescription, snackPrice, ingredients, imagePath, country);

    if (newSnack) {
      res.status(201).send("Snack created successfully!");
    } else {
      res.status(400).send("Error adding snack");
    }
  } catch (error) {
    console.error("Error creating snack:", error);
    res.status(500).send("Internal server error");
  }
}

async function retrieveSnacks(req, res) {
  try {
    const snacks = await Snack.retrieveSnacks();

    if (snacks) {
      console.log('Snack details in controller:', snacks); // Debugging line
      res.json(snacks);
    } else {
      res.status(404).send("Snacks not found");
    }
  } catch (error) {
    console.error("Error retrieving snacks:", error);
    res.status(500).send("Error retrieving data");
  }
}

async function getSnacksByCountry(req, res) {
  const country = req.params.country;
  console.log(country); // Debugging line to log the country parameter

  try {
    const snacks = await Snack.getSnacksByCountry(country);
    if (snacks && snacks.length > 0) {
      res.json(snacks);
    } else {
      res.status(404).send("Snacks not found");
    }
  } catch (error) {
    console.error("Error retrieving snacks by country:", error);
    res.status(500).send("Error retrieving snacks");
  }
}

async function updateSnack(req, res) {
  const snackId = req.params.snackId;
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
    console.error("Error updating snack:", error);
    res.status(500).send("Internal server error");
  }
}

const getSnackByCountryAndId = async (req, res) => {
  const { country, snackId } = req.params;
  
  try {
    const snack = await Snack.getSnackByCountryAndId(country, snackId);
    if (!snack) {
      return res.status(404).json({ error: 'Snack not found' });
    }
    res.json(snack);
  } catch (error) {
    console.error('Error fetching snack:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function deleteSnack(req, res) {
  const snackId = req.params.snackId;

  try {
    const success = await Snack.deleteSnack(snackId);
    if (success) {
      res.status(200).send("Snack deleted successfully");
    } else {
      res.status(404).send("Snack not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting Snack");
  }
}

module.exports = {
  createSnack,
  retrieveSnacks,
  getSnacksByCountry,
  updateSnack,
  getSnackByCountryAndId,
  deleteSnack
};
