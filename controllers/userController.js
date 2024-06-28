const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function login(req, res) {

    const email = req.body.email;
    const password = req.body.password;
    try {
    const user = await User.login(email, password);

    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    // Handle successful login (redirect, session creation, etc.)
    res.json(user); // This might expose sensitive user data, adjust based on your needs
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
};



async function createUser(req, res) {

    const email = req.body.email;
    const password = req.body.password;
    const postalcode = req.body.postalcode
    const streetname = req.body.postalcode
    const blockno = req.body.blockno
    const unitno = req.body.unitno
    const phoneno = req.body.phoneno
    const name = req.body.name
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.createUser(email, hashedPassword, postalcode, streetname, blockno, unitno, phoneno, name);
    
        if (newUser) {
          // Handle successful user creation (redirect, send confirmation email, etc.)
          res.status(201).send("User created successfully!"); // 201 Created status code
        } else {
          // Handle potential errors (e.g., email already exists, etc.)
          res.status(400).send("Error creating user");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
      }
    }

module.exports = {
    login,
    createUser
}
