const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Snack {
  static async createSnack(snackId, snackName, snackDescription, snackPrice, ingredients, imagePath, country) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `INSERT INTO Snacks (snackId, snackName, snackDescription, snackPrice, ingredients, imagePath, country) 
                        VALUES (@snackId, @snackName, @snackDescription, @snackPrice, @ingredients, @imagePath, @country)`;
      const request = connection.request();
      request.input("snackId", sql.VarChar, snackId);
      request.input("snackName", sql.VarChar, snackName);
      request.input("snackDescription", sql.VarChar, snackDescription);
      request.input("snackPrice", sql.Decimal(10, 2), snackPrice);
      request.input("ingredients", sql.VarChar, ingredients);
      request.input("imagePath", sql.VarChar, imagePath);
      request.input("country", sql.VarChar, country);

      const result = await request.query(sqlQuery);
      connection.close();
      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error("Error creating snack:", error);
      throw error;
    }
  }

  static async retrieveSnacks() {
    try {
      const connection = await sql.connect(dbConfig);
      const result = await connection.query('SELECT * FROM Snacks');
      connection.close();
      return result.recordset;
    } catch (error) {
      console.error("Error retrieving snacks:", error);
      throw error;
    }
  }

  static async getSnacksByCountry(country) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = 'SELECT * FROM Snacks WHERE country = @country';
      const request = connection.request();
      request.input("country", sql.VarChar, country);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.recordset;
    } catch (error) {
      console.error("Error fetching snacks by country:", error);
      throw error;
    }
  }

  static async updateSnack(snackId, snackName, snackDescription, snackPrice, ingredients, imagePath, country) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `UPDATE Snacks SET 
                          snackName = @snackName, 
                          snackDescription = @snackDescription, 
                          snackPrice = @snackPrice, 
                          ingredients = @ingredients, 
                          imagePath = @imagePath, 
                          country = @country
                        WHERE snackId = @snackId`;
      const request = connection.request();
      request.input("snackId", sql.VarChar, snackId);
      request.input("snackName", sql.VarChar, snackName);
      request.input("snackDescription", sql.VarChar, snackDescription);
      request.input("snackPrice", sql.Decimal(10, 2), snackPrice);
      request.input("ingredients", sql.VarChar, ingredients);
      request.input("imagePath", sql.VarChar, imagePath);
      request.input("country", sql.VarChar, country);

      const result = await request.query(sqlQuery);
      connection.close();
      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error("Error updating snack:", error);
      throw error;
    }
  }

  static async getSnackByCountryAndId(country, snackId) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = 'SELECT * FROM Snacks WHERE country = @country AND snackId = @snackId';
      const request = connection.request();
      request.input("country", sql.VarChar, country);
      request.input("snackId", sql.VarChar, snackId);
      const result = await request.query(sqlQuery);
      connection.close();
      return result.recordset[0]; 
    } catch (error) {
      console.error("Error fetching snack by country and ID:", error);
      throw error;
    }
  }
  static async deleteSnack(snackId) {
    try {
      const connection = await sql.connect(dbConfig);
      const sqlQuery = `DELETE FROM Snacks WHERE snackId = @snackId;`;
  
      const request = connection.request();
      request.input("snackId", sql.VarChar, snackId);
  
      const result = await request.query(sqlQuery);
      connection.close();
  
      console.log("Delete results:", result);
  
      // Check if any rows were affected
      return result.rowsAffected && result.rowsAffected.length > 0 && result.rowsAffected[0] > 0;
    } catch (error) {
      console.error("Error deleting snack:", error);
      throw error;
    }
  }
  
}



module.exports = Snack;
