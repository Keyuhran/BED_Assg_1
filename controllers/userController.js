const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.login(email, password);

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (isMatch) {
      res.json({ message: "Login successful!" });
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

module.exports = {
  login,
  createUser,
  retrieveUser
};
