require('dotenv').config()
const Rider = require("../models/rider");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const { email, password } = req.body; 
    console.log("Login attempt with email:", email); 

    const rider = await Rider.retrieveRider(email);
    console.log(rider);
    if (!rider) {
      console.log("User not found for email:", email);
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, rider.password);

    if (isMatch) {
      const payload = {
        email: rider.email,
        role: rider.role
      };

      const token = jwt.sign(payload, process.env.secretKey, { expiresIn: "1h" }); 

      console.log("Login successful for email:", email); 
      res.json({ message: "Login successful!", token, email: rider.email, role: rider.role }); 
    } else {
      console.log("Password does not match for email:", email);
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error logging in");
  }
}

async function createRider(req, res) {
  const { riderId, email, joinDate, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath} = req.body;

  try {
    const newUser = await Rider.createRider(riderId, email, joinDate, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath);
    if (newUser) {
      res.status(201).json({ message: "Rider created successfully!" });
    } else {
      res.status(400).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


async function retrieveRider(req, res) {
  const email = req.query.email;

  try {
    const rider = await Rider.retrieveRider(email);
    if (rider) {
      res.json({
        riderId: rider.riderId,
        email: rider.email,
        name: rider.name,
        address: rider.address,
        unitNo: rider.unitNo,
        postalCode: rider.postalCode,
        country: rider.country,
        phoneNo: rider.phoneNo,
        userBday: rider.userBday,
        imagePath: rider.imagePath,
        role: rider.role,
        joinDate: rider.joinDate,
      });
    } else {
      res.status(404).send("Rider not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
}

async function retrieveRiders(req, res) {

  try {
    const riders = await Rider.retrieveRiders();

    if (riders) {
      console.log('Rider details in controller:', riders); // Added for debugging

      res.json(riders);
    } else {
      res.status(404).send("Riders not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
  }
}

async function updateRiderEmail(req, res) {
  const {newEmail, oldEmail} = req.body;

  try{
    const rider = await Rider.retrieveRider(oldEmail);
    console.log("Attempting to update rider:", rider.name);
    const success = await Rider.updateRiderEmail(newEmail, oldEmail);
    if (success) {
      res.status(200).send("Rider updated successfully");
    } else {
      res.status(404),send("Rider not found");
    }
  } catch (error){
    console.error(error);
    res.status(500).send("Error updating rider");
  }
}

async function deleteRider(req, res) {
  const email = req.query.email;

  try {
    const rider = await Rider.retrieveRider(email);
    console.log("Attempting to delete rider:", rider.name);
    console.log(rider.name);
    const success = await Rider.deleteRider(email);
    if (success) {
      res.status(200).send("Rider deleted successfully");
    } else {
      res.status(404).send("Rider not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting rider");
  }
}

module.exports = {
  login,
  retrieveRiders,
  createRider,
  updateRiderEmail,
  retrieveRider,
  deleteRider
};
