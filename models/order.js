const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Order {
  static async createOrder(orderId, email, snackId, quantity, dateAdded, dateCompleted, riderId, status) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO Orders (orderId, email, snackId, quantity, dateAdded, dateCompleted, riderId, status)
        VALUES (@OrderId, @Email, @SnackId, @Quantity, @DateAdded, @DateCompleted, @RiderId, @Status)
      `;
      const request = pool.request();
      request.input("OrderId", sql.VarChar, orderId);
      request.input("Email", sql.VarChar, email);
      request.input("SnackId", sql.VarChar, snackId);
      request.input("Quantity", sql.Int, quantity);
      request.input("DateAdded", sql.DateTime, dateAdded);
      request.input("DateCompleted", sql.DateTime, dateCompleted);
      request.input("RiderId", sql.VarChar, riderId);
      request.input("Status", sql.VarChar, status);
      await request.query(sqlQuery);
      pool.close();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

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
        return null;
      }

      const ordersMap = new Map();

      result.recordset.forEach((order) => {
        if (!ordersMap.has(order.orderId)) {
          ordersMap.set(order.orderId, {
            orderId: order.orderId,
            address: `${order.address}, ${order.unitNo}, ${order.postalCode}, ${order.country}`,
            status: order.status,
            snacks: []
          });
        }

        ordersMap.get(order.orderId).snacks.push({
          snackName: order.snackName,
          quantity: order.quantity,
          imagePath: order.imagePath,
        });
      });

      return Array.from(ordersMap.values());
    } catch (error) {
      console.error("Error fetching orders by email:", error);
      throw error;
    }
  }
}

module.exports = Order;
