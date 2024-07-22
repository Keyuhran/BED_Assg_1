const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Cart {
  constructor(email, snackId, quantity, snackName, snackPrice, totalCost) {
    this.email = email;
    this.snackId = snackId;
    this.quantity = quantity;
    this.snackName = snackName;
    this.snackPrice = snackPrice;
    this.totalCost = totalCost;
  }

  static async checkForCart(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Cart WHERE Email = @Email`;
    const request = connection.request();
    request.input("Email", sql.VarChar, email);
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Cart not found
    }

    return result.recordset.map(
      (cart) => new Cart(cart.Email, cart.SnackId, cart.Quantity, cart.SnackName, cart.SnackPrice, cart.TotalCost)
    );
  }

  static async addToCart(email, snackId, quantity, snackPrice) {
    const connection = await sql.connect(dbConfig);
    const totalCost = quantity * snackPrice;
    const sqlQuery = `
      MERGE Cart AS target
      USING (VALUES (@Email, @SnackId, @Quantity, @TotalCost)) AS source (Email, SnackId, Quantity, TotalCost)
      ON (target.Email = source.Email AND target.SnackId = source.SnackId)
      WHEN MATCHED THEN 
          UPDATE SET target.Quantity = target.Quantity + source.Quantity, target.TotalCost = target.Quantity * @SnackPrice
      WHEN NOT MATCHED THEN
          INSERT (Email, SnackId, Quantity, TotalCost) 
          VALUES (source.Email, source.SnackId, source.Quantity, source.TotalCost);
    `;
    const request = connection.request();
    request.input("Email", sql.VarChar, email);
    request.input("SnackId", sql.VarChar, snackId);
    request.input("Quantity", sql.Int, quantity);
    request.input("TotalCost", sql.Decimal(10, 2), totalCost);
    request.input("SnackPrice", sql.Decimal(10, 2), snackPrice);
    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1;
  }

  static async updateQuantity(email, snackId, quantity, snackPrice) {
    const connection = await sql.connect(dbConfig);
    const totalCost = quantity * snackPrice;
    const sqlQuery = `
      UPDATE Cart
      SET Quantity = @Quantity, TotalCost = @TotalCost
      WHERE Email = @Email AND SnackId = @SnackId
    `;
    const request = connection.request();
    request.input("Email", sql.VarChar, email);
    request.input("SnackId", sql.VarChar, snackId);
    request.input("Quantity", sql.Int, quantity);
    request.input("TotalCost", sql.Decimal(10, 2), totalCost);
    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1;
  }

  static async getCartContents(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
      SELECT c.Email, c.SnackId, c.Quantity, s.SnackName, s.SnackPrice, c.TotalCost 
      FROM Cart c
      JOIN Snacks s ON c.SnackId = s.SnackId
      WHERE c.Email = @Email
    `;
    const request = connection.request();
    request.input("Email", sql.VarChar, email);
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Cart is empty
    }

    return result.recordset.map(
      (cart) => new Cart(
        cart.Email,
        cart.SnackId,
        cart.Quantity,
        cart.SnackName,
        cart.SnackPrice,
        cart.TotalCost
      )
    );
  }

  static async removeFromCart(email, snackId) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = 'DELETE FROM Cart WHERE Email = @Email AND SnackId = @SnackId';
    const request = connection.request();
    request.input("Email", sql.VarChar, email);
    request.input("SnackId", sql.VarChar, snackId);
    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1;
  }
}

module.exports = Cart;
