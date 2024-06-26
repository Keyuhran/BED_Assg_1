const express = require("express");
const sql = require("mssql");
const dbConfig = require("./javascript/dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const usersController = require("./controllers/Controller");

const app = express();
const port = 3000;

const staticMiddleware = express.static("public");
// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware


app.post("/users", usersController.createUser); 
app.get("/users", usersController.getAllUsers); 
app.get("/users/:id", usersController.getUserById);
app.put("/users/:id", usersController.updateUser); 
app.delete("/users/:id", usersController.deleteUser); 
app.get("/users/search", usersController.searchUsers);
app.get("/users/with-books", usersController.getUsersWithBooks);



app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});



