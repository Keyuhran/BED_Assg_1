const User = require("../models/User");
const bcrypt = require("bcryptjs");

async function login(req, res) {

  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.login(email, password); // Call the User.login function

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // **Corrected Line:** Verify password using bcrypt.compare
    const isMatch = await bcrypt.compare(password, user.hashedPassword);

    if (isMatch == true)  {
      // Login successful (generate session, JWT, etc.)
      // Consider what user data to expose in the response (avoid sensitive passwords)
      res.json({ message: "Login successful!" });
    } else {
      res.status(401).send("Invalid email or password");
    }
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
        const hashedPassword = await User.hashPassword(password);
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
