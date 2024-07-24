const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Order {
  constructor(orderId, email, snackId, quantity, dateAdded, dateCompleted, status, name, address, unitNo, postalCode, country, phoneNo) {
    this.orderId = orderId;
    this.email = email;
    this.snackId = snackId;
    this.quantity = quantity;
    this.dateAdded = dateAdded;
    this.dateCompleted = dateCompleted;
    this.status = status;
    this.name = name;
    this.address = address;
    this.unitNo = unitNo;
    this.postalCode = postalCode;
    this.country = country;
    this.phoneNo = phoneNo;
  }

  static async createOrder(orderId, email, snackId, quantity, dateAdded, name, address, unitNo, postalCode, country, phoneNo) {
    try {
      const pool = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO Orders (orderId, email, snackId, quantity, dateAdded, status, name, address, unitNo, postalCode, country, phoneNo)
        VALUES (@OrderId, @Email, @SnackId, @Quantity, @DateAdded, 'Pending', @Name, @Address, @UnitNo, @PostalCode, @Country, @PhoneNo)
      `;
      const request = pool.request();
      request.input("OrderId", sql.VarChar, orderId);
      request.input("Email", sql.VarChar, email);
      request.input("SnackId", sql.VarChar, snackId);
      request.input("Quantity", sql.Int, parseInt(quantity)); // Ensure quantity is treated as an integer
      request.input("DateAdded", sql.DateTime, dateAdded);
      request.input("Name", sql.VarChar, name);
      request.input("Address", sql.VarChar, address);
      request.input("UnitNo", sql.VarChar, unitNo);
      request.input("PostalCode", sql.VarChar, postalCode);
      request.input("Country", sql.VarChar, country);
      request.input("PhoneNo", sql.VarChar, phoneNo);

      await request.query(sqlQuery);
      pool.close();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }
}

module.exports = Order;
