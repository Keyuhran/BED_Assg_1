const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class Rider {
  constructor(riderId, email, password, name, address, unitNo, postalCode, country, phoneNo, joinDate, imagePath) {
    this.riderId = riderId;
    this.email = email;
    this.password = password;
    this.name = name;
    this.address = address;
    this.unitNo = unitNo;
    this.postalCode = postalCode;
    this.country = country;
    this.phoneNo = phoneNo;
    this.joinDate = joinDate;
    this.imagePath = imagePath;
  }

  static async login(email, password) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      SELECT *
      FROM Riders 
      WHERE email = @Email
    `;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Rider not found
    }

    const rider = result.recordset[0];
    const isMatch = await bcrypt.compare(password, rider.password);

    if (!isMatch) {
      return null; // Password does not match
    }

    return { ...rider, isRider: true, isAdmin: false };
  }

  static async retrieveRiders() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT riderId, email, name, address, unitNo, postalCode, country, phoneNo, joinDate FROM Riders`;

    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      console.log("No riders to retrieve");
      return null;
    }

    return result.recordset;
  }

  static async createRider(riderId, email, password, name, address, unitNo, postalCode, country, phoneNo, joinDate, imagePath) {
    const connection = await sql.connect(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlQuery = `
      INSERT INTO Riders (riderId, email, password, name, address, unitNo, postalCode, country, phoneNo, joinDate, imagePath)
      VALUES (@RiderId, @Email, @Password, @Name, @Address, @UnitNo, @PostalCode, @Country, @PhoneNo, @JoinDate, @ImagePath)
    `;

    const request = connection.request();
    request.input("RiderId", sql.VarChar, riderId);
    request.input("Email", sql.VarChar, email);
    request.input("Password", sql.VarChar, hashedPassword);
    request.input("Name", sql.VarChar, name);
    request.input("Address", sql.VarChar, address);
    request.input("UnitNo", sql.VarChar, unitNo);
    request.input("PostalCode", sql.VarChar, postalCode);
    request.input("Country", sql.VarChar, country);
    request.input("PhoneNo", sql.VarChar, phoneNo);
    request.input("JoinDate", sql.Date, joinDate);
    request.input("ImagePath", sql.VarChar, imagePath);

    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1; // Check if 1 row was inserted (success)
  }

  static async retrieveRider(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT riderId, email, name, address, unitNo, postalCode, country, phoneNo, joinDate FROM Riders WHERE email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Rider not found
    }

    const rider = result.recordset[0];
    return { ...rider, isRider: true, isAdmin: false };
  }

  static async deleteRider(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM Riders WHERE email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    console.log("Delete results:", result); //To see result
    return result.rowsAffected[0] === 1; // Check if a row was deleted
  }
}

module.exports = Rider;
