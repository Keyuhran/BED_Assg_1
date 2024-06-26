const Book = require("../models/book.js");

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving books");
  }
};

const getBookById = async (req, res) => {
  const bookId = parseInt(req.params.id);
  try {
    const book = await Book.getBookById(bookId);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving book");
  }
};

const updateBookAvail = async (req, res) => {
  const Id = req.params.id;
  const availability = req.body;

  try {
      const result = await book.updateBookAvail(Id, availability);
      res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  updateBookAvail
};