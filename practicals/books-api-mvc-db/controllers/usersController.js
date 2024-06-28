const User = require("../models/user.js");

const createUser = async (req, res) => {
    try {
      // Extract user data from the request body
      const { username, email } = req.body;
  
      // Call the User.createUser method to save the new user
      const newUser = await User.createUser({ username, email });
  
      // Upon successful creation, return a success response with the created user data
      res.status(201).json(newUser);
    } catch (error) {
      // Handle potential errors during user creation and return appropriate error responses
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
};
  
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;

    try {
        const result = await User.updateUser(userId, updatedUserData);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await User.deleteUser(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Failed to delete user" });
    }
};

async function searchUsers(req, res) {
    console.log("Hello i am haziq");
    const searchTerm = req.query.searchTerm; // Extract search term from query params
    console.log("Hello im not haziq");
    try {    
        console.log("hello i am haziq");
      const users = await User.searchUsers(searchTerm);
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error searching users" });
    }
};

async function getUsersWithBooks(req, res) {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks,
};