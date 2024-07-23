require('dotenv').config()

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  try {
    const { email, password } = req.body; 
    console.log("Login attempt with email:", email); 

    const user = await User.retrieveUser(email);
    console.log(user);
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const payload = {
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(payload, process.env.secretKey, { expiresIn: "1h" }); 

      console.log("Login successful for email:", email); 
      res.json({ message: "Login successful!", token, email: user.email, role: user.role }); 
    } else {
      console.log("Password does not match for email:", email);
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Error logging in");
  }
}

async function retrieveUsers(req, res) {
  try {
    const users = await User.retrieveUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
}

async function createUser(req, res) {
  const { email, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.createUser(email, hashedPassword, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath, role);

    if (newUser) {
      res.status(201).json({ message: "User created successfully!" });
    } else {
      res.status(400).json({ message: "Error creating user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function updateUser(req, res) {
  const email = req.params.email;
  const { password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await User.updateUser(email, hashedPassword, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath, role);

    if (!updated) {
      throw new Error("User not found or could not be updated");
    }

    res.status(200).send("User updated successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function retrieveUser(req, res) {
  const email = req.query.email;

  try {
    const user = await User.retrieveUser(email);

    if (!user) {
      throw new Error("User not found");
    }

    res.json({
      email: user.email,
      password: user.password,
      name: user.name,
      address: user.address,
      unitNo: user.unitNo,
      postalCode: user.postalCode,
      country: user.country,
      phoneNo: user.phoneNo,
      userBday: user.userBday,
      imagePath: user.imagePath,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(404).send("User not found");
  }
}

async function retrieveRider(req, res) {

  try {
    const users = await User.retrieveRider();

    if (users) {
      console.log('Rider details in controller:', users); // Added for debugging

      res.json(users);
    } else {
      res.status(404).send("Riders not found");
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
    console.log(user.name);
    const success = await User.deleteUser(email);
    if (success) {
      res.status(200).send("User deleted successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
}


module.exports = {
  login,
  retrieveUsers,
  createUser,
  retrieveUser,
  retrieveRider,
  updateUser,
  deleteUser
};
