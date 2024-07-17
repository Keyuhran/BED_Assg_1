const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
  constructor(email, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath, role) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.address = address;
    this.unitNo = unitNo;
    this.postalCode = postalCode;
    this.country = country;
    this.phoneNo = phoneNo;
    this.userBday = userBday;
    this.imagePath = imagePath;
    this.role = role;
  }

  static async retrieveUser(email) {
    const connection = await sql.connect(dbConfig);
    console.log(connection);
    const sqlQuery = `SELECT * FROM Users WHERE email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);
    console.log(email);
    const result = await request.query(sqlQuery);
    connection.close();
    console.log(result);
    if (result.recordset.length === 0) {
      return null; // User not found
    }

    const user = result.recordset[0];
    console.log(user);
    return new User(
      user.email,
      user.password, // Ensure this field exists in the database and is retrieved correctly
      user.name,
      user.address,
      user.unitNo,
      user.postalCode,
      user.country,
      user.phoneNo,
      user.userBday,
      user.imagePath,
      user.role
    );
  }

  static async createUser(email, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath, role) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      INSERT INTO Users (email, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath, role)
      VALUES (@Email, @Password, @Name, @Address, @UnitNo, @PostalCode, @Country, @PhoneNo, @UserBday, @ImagePath, @Role)
    `;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);
    request.input("Password", sql.VarChar, password);
    request.input("Name", sql.VarChar, name);
    request.input("Address", sql.VarChar, address);
    request.input("UnitNo", sql.VarChar, unitNo);
    request.input("PostalCode", sql.VarChar, postalCode);
    request.input("Country", sql.VarChar, country);
    request.input("PhoneNo", sql.VarChar, phoneNo);
    request.input("UserBday", sql.Date, userBday);
    request.input("ImagePath", sql.VarChar, imagePath);
    request.input("Role", sql.VarChar, role);

    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1; // Check if 1 row was inserted (success)
  }

  static async retrieveUsers() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Users`;

    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      console.log("No users to retrieve");
      return null;
    }

    return result.recordset.map(
      (user) => new User(
        user.email,
        user.password,
        user.name,
        user.address,
        user.unitNo,
        user.postalCode,
        user.country,
        user.phoneNo,
        user.userBday,
        user.imagePath,
        user.role
      )
    );
  }

  static async deleteUser(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM Cart WHERE email = @Email;
                      DELETE FROM Riders WHERE email = @Email;
                      DELETE FROM Admins WHERE email = @Email;
                      DELETE FROM Users WHERE email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    console.log("Delete results:", result); //To see result
    return result.rowsAffected[3] === 1; // Check if a row was deleted
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

module.exports = User;
