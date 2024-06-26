const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book {
    constructor(id, title, author) {
      this.id = id;
      this.title = title;
      this.author = author;
    }
  
    static async getAllBooks() {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `SELECT * FROM Books;`; // Replace with your actual table name
  
      const request = connection.request();
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.recordset.map(
        (row) => new Book(row.id, row.title, row.author)
      ); // Convert rows to Book objects
    }
  
    static async getBookById(id) {
      const connection = await sql.connect(dbConfig);
  
      const sqlQuery = `SELECT * FROM Books WHERE id = @id`; // Parameterized query
  
      const request = connection.request();
      request.input("id", id);
      const result = await request.query(sqlQuery);
  
      connection.close();
  
      return result.recordset[0]
        ? new Book(
            result.recordset[0].id,
            result.recordset[0].title,
            result.recordset[0].author
          )
        : null; // Handle book not found
    }

    static async updateBookAvail(id, updatedBook) {
      const connection = await sql.connect(dbConfig);
  
      // Define the SQL UPDATE statement with placeholders
      const sqlQuery = `UPDATE Books SET availability = @availability WHERE id = @id;`;
  
      // Prepare the request object
      const request = connection.request();
  
      // Add parameters to the request
      request.input('id', id);
      request.input('availability', updatedBook.availability);
      try {
          // Execute the query
          const result = await request.query(sqlQuery);
          console.log(`User with ID ${id} updated successfully`);
          return result;
      } catch (error) {
          console.error("Error updating book:", error);
          throw error; // Rethrow the error to handle it in the caller function
      } finally {
          // Close the database connection
          connection.close();
      }
  }
  }
  
  module.exports = Book;