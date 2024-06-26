const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("./models/user"); // Assuming User model is in a separate file

const app = express();

// ... other app configuration (routes, database connection, etc.)

// Replace with your actual secret key (don't store it directly in code)
const secretKey = "IloveHaziq";

function verifyJWT(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded; // Attach decoded user information to the request object
    next();
  });
}

// GET /books (Accessible to members and librarians)
app.get("/books", verifyJWT, async (req, res) => {
  try {
    const books = await User.getAllBooks(); // Assuming User model has a method for this
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// PUT /books/:bookId/availability (Accessible to librarians only)
app.put("/books/:bookId/availability", verifyJWT, async (req, res) => {
  const { bookId } = req.params;
  const newAvailability = req.body.availability; // Assuming availability is sent in the request body

  // Check user role before updating availability
  if (req.user.role !== "librarian") {
    return res.status(403).json({ message: "Forbidden: Only librarians can update availability" });
  }

  try {
    // Update book availability logic using User model or database access (replace with your implementation)
    console.log(`Updating availability for book ${bookId} to ${newAvailability}`);
    res.json({ message: "Availability updated successfully" });
  } catch (error) {
    console.error("Error updating book availability:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


