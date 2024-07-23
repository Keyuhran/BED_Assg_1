const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Cart {
  constructor(email, snackIds, quantity, snackName, snackPrice, totalCost, imagePath) {
    this.email = email;
    this.snackIds = snackIds;
    this.quantity = quantity;
    this.snackName = snackName;
    this.snackPrice = snackPrice;
    this.totalCost = totalCost;
    this.imagePath = imagePath; // Add imagePath here
  }

  static async checkForCart(email) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `SELECT * FROM Cart WHERE Email = @Email`;
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      const result = await request.query(sqlQuery);
      pool.close();

      if (result.recordset.length === 0) {
        return null; // Cart not found
      }

      return result.recordset.map(
        (cart) => new Cart(cart.Email, cart.snackIds, cart.Quantity, cart.SnackName, cart.SnackPrice, cart.TotalCost, cart.imagePath)
      );
    } catch (error) {
      console.error("Error checking cart:", error);
      throw error;
    }
  }

  static async addToCart(email, snackIds, quantity, snackPrice) {
    try {
      const pool = await sql.connect(dbConfig);
      const totalCost = quantity * snackPrice;
      const sqlQuery = `
        MERGE Cart AS target
        USING (VALUES (@Email, @SnackIds, @Quantity, @TotalCost)) AS source (Email, SnackIds, Quantity, TotalCost)
        ON (target.Email = source.Email AND target.SnackIds = source.SnackIds)
        WHEN MATCHED THEN 
            UPDATE SET target.Quantity = target.Quantity + source.Quantity, target.TotalCost = target.Quantity * @SnackPrice
        WHEN NOT MATCHED THEN
            INSERT (Email, SnackIds, Quantity, TotalCost) 
            VALUES (source.Email, source.SnackIds, source.Quantity, source.TotalCost);
      `;
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      request.input("SnackIds", sql.VarChar, snackIds);
      request.input("Quantity", sql.Int, quantity);
      request.input("TotalCost", sql.Decimal(10, 2), totalCost);
      request.input("SnackPrice", sql.Decimal(10, 2), snackPrice);
      const result = await request.query(sqlQuery);
      pool.close();

      return result.rowsAffected[0] === 1;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  static async updateQuantity(email, snackIds, quantity, snackPrice) {
    try {
      const pool = await sql.connect(dbConfig);
      const totalCost = quantity * snackPrice;
      const sqlQuery = `
        UPDATE Cart
        SET Quantity = @Quantity, TotalCost = @TotalCost
        WHERE Email = @Email AND SnackIds = @SnackIds
      `;
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      request.input("SnackIds", sql.VarChar, snackIds);
      request.input("Quantity", sql.Int, quantity);
      request.input("TotalCost", sql.Decimal(10, 2), totalCost);
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
        SELECT c.Email, c.SnackIds, c.Quantity, s.SnackName, s.SnackPrice, s.imagePath, c.TotalCost 
        FROM Cart c
        JOIN Snacks s ON c.SnackIds = s.snackId
        WHERE c.Email = @Email
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
          cart.Email,
          cart.SnackIds,
          cart.Quantity,
          cart.SnackName,
          cart.SnackPrice,
          cart.TotalCost,
          cart.imagePath // Add imagePath here
        )
      );
    } catch (error) {
      console.error("Error fetching cart contents:", error);
      throw error;
    }
  }

  static async removeFromCart(email, snackIds) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = 'DELETE FROM Cart WHERE Email = @Email AND SnackIds = @SnackIds';
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      request.input("SnackIds", sql.VarChar, snackIds);
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
