const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors')
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const userController = require("./controllers/userController");
//const riderController = require("./controllers/riderController");
//const adminController = require("./controllers/adminController");
const snackController = require("./controllers/snackController");
const cartController = require("./controllers/cartController");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// User Routes
app.post("/users/createUser", userController.createUser);
app.post("/users/login", userController.login);
app.get("/users", userController.retrieveUsers);
app.get("/users/email", userController.retrieveUser);
app.delete("/users/email", userController.deleteUser);

// Rider Routes
//app.post("/riders/createRider", riderController.createRider);
//app.post("/riders/login", riderController.login);
//app.get("/riders", riderController.retrieveRiders);
//app.get("/riders/email", riderController.retrieveRider);
//app.delete("/riders/email", riderController.deleteRider);

// Admin Routes
//app.post("/admins/createAdmin", adminController.createAdmin);
//app.post("/admins/login", adminController.login);
//app.get("/admins", adminController.retrieveAdmins);
//app.get("/admins/email", adminController.retrieveAdmin);
//app.delete("/admins/email", adminController.deleteAdmin);

// Snack Routes
app.post("/snacks", snackController.createSnack);
app.get("/snacks", snackController.retrieveSnacks);
app.get('/snacks/:country', snackController.getSnacksByCountry);
app.put("/snacks/:snackId", snackController.updateSnack);

// Cart Routes
app.post('/cart/add', cartController.addToCart);

// Start server
const server = app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code
    process.exit(1);
  }
  
  console.log(`Server listening on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  try {
    await sql.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Error closing database connection:", err);
  } finally {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  }
});
