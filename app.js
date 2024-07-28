const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec
const path = require("path");
const bodyParser = require("body-parser");
const cors = require('cors');
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const userController = require("./controllers/userController");
const riderController = require("./controllers/riderController");
const adminController = require("./controllers/adminController");
const snackController = require("./controllers/snackController");
const cartController = require("./controllers/cartController");
const orderController = require("./controllers/orderController");
const feedbackController = require("./controllers/feedbackController");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// User Routes
app.post("/users/createUser", userController.createUser); //(Kieran)
app.post("/users/login", userController.login); //(Kieran)
app.get("/users", userController.retrieveUsers); //(Kieran)
app.get("/users/:email", userController.retrieveUser); //(Kieran)
app.delete("/users/email", userController.deleteUser);//(Haziq)
app.put("/users/:email", userController.updateUser)//(Kieran)


// Rider Routes(Haziq)
app.post("/riders/createRider", riderController.createRider);
app.get("/riders", riderController.retrieveRiders);
app.get("/riders/email", riderController.retrieveRider);
app.delete("/riders/email", riderController.deleteRider);
app.put("/riders/update", riderController.updateRiderEmail);

// Admin Routes(haziq)
app.post("/admins/createAdmin", adminController.createAdmin);
app.get("/admins", adminController.retrieveAdmins);
app.get("/admins/email", adminController.retrieveAdmin);
app.delete("/admins/email", adminController.deleteAdmin); 
app.put("/admins/update", adminController.updateAdminEmail);



// Snack Routes
app.post('/snacks', snackController.createSnack);
app.get('/snacks', snackController.retrieveSnacks);

app.get('/snacks/:country', snackController.getSnacksByCountry); //john
app.get('/snacks/:country/:snackId', snackController.getSnackByCountryAndId);
app.put('/snacks/:snackId', snackController.updateSnack);
app.delete('/snacks/:snackId', snackController.deleteSnack);


// Cart Routes (John)
app.post('/cart/add', cartController.addToCart);
app.get('/cart', cartController.getCartContents);
app.post('/cart/remove', cartController.removeFromCart);
app.post('/cart/update', cartController.updateQuantity);

// Order Routes (John)
app.post("/orders", orderController.createOrder);
app.get("/orders/user", orderController.getUserOrders);

// Feedback Routes (John)
app.post("/feedback", feedbackController.submitFeedback); // Ensure this line is here
app.get("/feedback", feedbackController.getFeedback); 
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
