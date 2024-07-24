// models/order.js

const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Order {
  constructor(orderId, email, snackId, quantity, dateAdded, dateCompleted, status) {
    this.orderId = orderId;
    this.email = email;
    this.snackId = snackId;
    this.quantity = quantity;
    this.dateAdded = dateAdded;
    this.dateCompleted = dateCompleted;
    this.status = status;
  }

  static async createOrder(orderId, email, snackId, quantity, dateAdded) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO Orders (orderId, email, snackId, quantity, dateAdded, status)
        VALUES (@OrderId, @Email, @SnackId, @Quantity, @DateAdded, 'Pending')
      `;
      const request = pool.request();
      request.input("OrderId", sql.VarChar, orderId);
      request.input("Email", sql.VarChar, email);
      request.input("SnackId", sql.VarChar, snackId);
      request.input("Quantity", sql.VarChar, quantity); // Ensure quantity is treated as a string
      request.input("DateAdded", sql.DateTime, dateAdded);

      await request.query(sqlQuery);
      pool.close();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}

module.exports = Order;
