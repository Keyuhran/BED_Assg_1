// routes/snacks.js

const express = require('express');
const router = express.Router();
const Snack = require('../models/snack'); // Adjust path based on your file structure
const snackController = require('../controllers/snackController');

// Route for handling GET requests to /snacks
router.get('/', snackController.fetchAllSnacks);

// Route for handling POST requests to create a new snack
router.post('/', snackController.createSnack);

module.exports = router;
