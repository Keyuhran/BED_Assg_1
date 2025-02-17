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
const reviewController = require("./controllers/reviewController");

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

// User Routes (kieran)
app.post("/users/createUser", userController.createUser);
app.post("/users/login", userController.login); 
app.get("/users", userController.retrieveUsers); 
app.get("/users/:email", userController.retrieveUser); 
app.delete("/users/email", userController.deleteUser);
app.put("/users/:email", userController.updateUser)


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

// Review Routes(Kieran, Daryl & John)
app.post("/review/add", reviewController.addReview); //Kieran
app.get("/review", reviewController.retrieveReview); //Kieran
app.get("/reviews/riderId", reviewController.retrieveReviews); //Daryl
app.delete("/review/del", reviewController.delReview); //Daryl
app.put("/review/update", reviewController.updateReview); //John

// Snack Routes (daryl)
app.post('/snacks', snackController.createSnack);
app.get('/snacks', snackController.retrieveSnacks);
app.get('/snacks/:country', snackController.getSnacksByCountry); 
app.get('/snacks/:country/:snackId', snackController.getSnackByCountryAndId);
app.put('/snacks/:snackId', snackController.updateSnack);
app.delete('/snacks/:snackId', snackController.deleteSnack);

// Cart Routes (John)
app.post('/cart/add', cartController.addToCart);
app.get('/cart', cartController.getCartContents);
app.post('/cart/remove', cartController.removeFromCart);
app.post('/cart/update', cartController.updateQuantity);

// Order Routes (Haziq & John)
app.post("/orders", orderController.createOrder); //John
app.get("/orders/user", orderController.getUserOrders); //John
app.get("/orders/riderId", orderController.getOrdersByRiders); //Haziq
app.get("/orders/riders", orderController.getAllOrdersForRiders); //Haziq
app.put("/orders/claim", orderController.claimOrder); //Haziq

// Feedback Routes (John)
app.post("/feedback", feedbackController.submitFeedback); // Ensure this line is here
app.get("/feedback", feedbackController.getFeedback); 

// Start server
const server = app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("SouthEats Online!");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code
    process.exit(1);
  }
  
  console.log(`Southeats running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SouthEats going offline");
  try {
    await sql.close();
    console.log("Database connection closed!");
  } catch (err) {
    console.error("Error closing database connection:", err);
  } finally {
    server.close(() => {
      console.log("SouthEats offline!");
      process.exit(0);
    });
  }
});
