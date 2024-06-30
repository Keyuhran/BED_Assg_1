const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const userController = require("./controllers/userController");
const snackController = require("./controllers/snackController");
const cartController = require("./controllers/cartController");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.post("/users", userController.createUser);
app.post("/snacks", snackController.createSnack);
app.post('/cart/add', cartController.addToCart);
app.get("/users/email", userController.retrieveUser);
app.get("/snacks", snackController.retrieveSnacks);
app.get('/snacks/:country', snackController.getSnacksByCountry);
app.get("/riders", userController.retrieveRider)
app.delete("/users/email", userController.deleteUser)

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