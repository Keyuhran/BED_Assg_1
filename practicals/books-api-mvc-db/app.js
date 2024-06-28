const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const booksController = require("./controllers/booksController");
const usersController = require("./controllers/usersController");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes (Books)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/books", booksController.getAllBooks);
app.get("/books/:id", booksController.getBookById);


// Routes (User)
app.post("/users", usersController.createUser); // Create user
app.get("/users", usersController.getAllUsers); // Get all users
app.get("/users/search", usersController.searchUsers); // Search user
app.get("/users/with-books", usersController.getUsersWithBooks); // Get User with books
app.get("/users/:id", usersController.getUserById); // Get user by ID
app.put("/users/:id", usersController.updateUser); // Update user
app.delete("/users/:id", usersController.deleteUser); // Delete user

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
