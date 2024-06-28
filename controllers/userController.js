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

module.exports = {
    login
}
