const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Cart {
  constructor(email, snackId, quantity, snackName, snackPrice, imagePath) {
    this.email = email;
    this.snackId = snackId;
    this.quantity = quantity;
    this.snackName = snackName;
    this.snackPrice = snackPrice;
    this.imagePath = imagePath;
  }

  static async checkForCart(email) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `SELECT * FROM Cart WHERE email = @Email`;
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      const result = await request.query(sqlQuery);
      pool.close();

      if (result.recordset.length === 0) {
        return null; // Cart not found
      }

      return result.recordset.map(
        (cart) => new Cart(cart.email, cart.snackId, cart.quantity, cart.snackName, cart.snackPrice, cart.imagePath)
      );
    } catch (error) {
      console.error("Error checking cart:", error);
      throw error;
    }
  }

  static async addToCart(email, snackId, quantity) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        MERGE Cart AS target
        USING (VALUES (@Email, @SnackId, @Quantity)) AS source (Email, SnackId, Quantity)
        ON (target.email = source.email AND target.snackId = source.snackId)
        WHEN MATCHED THEN 
            UPDATE SET target.quantity = target.quantity + source.quantity
        WHEN NOT MATCHED THEN
            INSERT (email, snackId, quantity) 
            VALUES (source.email, source.snackId, source.quantity);
      `;
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      request.input("SnackId", sql.VarChar, snackId);
      request.input("Quantity", sql.Int, quantity);
      const result = await request.query(sqlQuery);
      pool.close();

      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  static async updateQuantity(email, snackId, quantity) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        UPDATE Cart
        SET quantity = @Quantity
        WHERE email = @Email AND snackId = @SnackId
      `;
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      request.input("SnackId", sql.VarChar, snackId);
      request.input("Quantity", sql.Int, quantity);
      const result = await request.query(sqlQuery);
      pool.close();

      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  }

  static async getCartContents(email) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        SELECT c.email, c.snackId, c.quantity, s.snackName, s.snackPrice, s.imagePath 
        FROM Cart c
        JOIN Snacks s ON c.snackId = s.snackId
        WHERE c.email = @Email
      `;
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      const result = await request.query(sqlQuery);
      pool.close();

      if (result.recordset.length === 0) {
        return null; // Cart is empty
      }

      return result.recordset.map(
        (cart) => new Cart(
          cart.email,
          cart.snackId,
          cart.quantity,
          cart.snackName,
          cart.snackPrice,
          cart.imagePath
        )
      );
    } catch (error) {
      console.error("Error fetching cart contents:", error);
      throw error;
    }
  }

  static async removeFromCart(email, snackId) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = 'DELETE FROM Cart WHERE email = @Email AND snackId = @SnackId';
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      request.input("SnackId", sql.VarChar, snackId);
      const result = await request.query(sqlQuery);
      pool.close();

      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }
}

module.exports = Cart;
