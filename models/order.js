const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Order {
  static async getOrdersByEmail(email) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        SELECT o.orderId, o.snackId, o.quantity, o.status, 
               u.address, u.unitNo, u.postalCode, u.country, 
               s.snackName, s.imagePath, o.riderId
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

      // Group snacks by orderId
      const ordersMap = {};
      result.recordset.forEach(order => {
        if (!ordersMap[order.orderId]) {
          ordersMap[order.orderId] = {
            orderId: order.orderId,
            address: `${order.address}, ${order.unitNo}, ${order.postalCode}, ${order.country}`,
            status: order.status,
            riderId: order.riderId,
            snacks: []
          };
        }
        ordersMap[order.orderId].snacks.push({
          snackName: order.snackName,
          snackId: order.snackId,
          quantity: order.quantity,
          imagePath: order.imagePath
        });
      });

      return Object.values(ordersMap);
    } catch (error) {
      console.error("Error fetching orders by email:", error);
      throw error;
    }
  }

  static async createOrder(orderId, email, snackId, quantity, name, address, unitNo, postalCode, country, phoneNo) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO Orders (orderId, email, snackId, quantity, status, riderId)
        VALUES (@OrderId, @Email, @SnackId, @Quantity, @Status, NULL)
      `;
      const request = pool.request();
      request.input("OrderId", sql.VarChar, orderId);
      request.input("Email", sql.VarChar, email);
      request.input("SnackId", sql.VarChar, snackId);
      request.input("Quantity", sql.Int, quantity);
      request.input("Status", sql.VarChar, "Pending");

      await request.query(sqlQuery);
      pool.close();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}

module.exports = Order;
