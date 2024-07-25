const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Order {
  // ... other methods ...

  static async getOrdersByEmail(email) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        SELECT o.orderId, o.snackId, o.quantity, o.dateAdded, o.status, 
               u.address, u.unitNo, u.postalCode, u.country, 
               s.snackName, s.imagePath
        FROM Orders o
        JOIN Users u ON o.email = u.email
        JOIN Snacks s ON o.snackId = s.snackId
        WHERE o.email = @Email
      `;
      const request = pool.request();
      request.input("Email", sql.VarChar, email);
      const result = await request.query(sqlQuery);
      pool.close();

      if (result.recordset.length === 0) {
        return null; // No orders found
      }

      return result.recordset.map((order) => ({
        orderId: order.orderId,
        snackName: order.snackName,
        snackId: order.snackId,
        quantity: order.quantity,
        address: `${order.address}, ${order.unitNo}, ${order.postalCode}, ${order.country}`,
        dateAdded: order.dateAdded,
        status: order.status,
        imagePath: order.imagePath,
      }));
    } catch (error) {
      console.error("Error fetching orders by email:", error);
      throw error;
    }
  }
}

module.exports = Order;
