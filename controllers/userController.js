const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = "ilovehaziq2?$%"; // secret key for jwt token



async function login(req, res) {
  try {
    const { email, password } = req.body; // Get data from request body (POST)

    const user = await User.login(email, password);

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      const payload = {
        email: user.email,
        isRider: user.isRider, // Include additional user data if needed
      };

      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" }); // Set expiry time

      res.json({ message: "Login successful!", token }); 
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
}





async function createUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const postalcode = req.body.postalcode;
  const streetname = req.body.streetname;
  const blockno = req.body.blockno;
  const unitno = req.body.unitno;
  const phoneno = req.body.phoneno;
  const name = req.body.name;
  const isRider = req.body.isRider;

  try {
    const hashedPassword = await User.hashPassword(password);
    const newUser = await User.createUser(email, hashedPassword, postalcode, streetname, blockno, unitno, phoneno, name, isRider);

    if (newUser) {
      res.status(201).send("User created successfully!");
    } else {
      res.status(400).send("Error creating user");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function retrieveUser(req, res) {
  const email = req.query.email;

  try {
    const user = await User.retrieveUser(email);

    if (user) {
      console.log('User details in controller:', user); // Added for debugging

      res.json({
        email: user.email,
        passwordHash: user.passwordHash,
        postalcode: user.postalcode,
        streetname: user.streetname,
        blockno: user.blockno,
        unitno: user.unitno,
        phoneno: user.phoneno,
        name: user.name,
        isRider: user.isRider
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving data");
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
  createUser,
  retrieveUser,
  retrieveRider,
  deleteUser
};
