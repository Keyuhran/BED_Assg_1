const User = require("../models/User");

async function login(req, res) {

    const username = req.body.username;
    const password = req.body.password;
    try {
    const user = await User.login(username, password);

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
