const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class Rider {
  constructor(riderId, email, joinDate) {
    this.riderId = riderId;
    this.email = email;
    this.joinDate = joinDate;
  }

  static async retrieveRiders() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT
    Riders.riderId,
    Users.email,
    Users.name,
    Users.address,
    Users.unitNo,
    Users.postalCode,
    Users.country,
    Users.phoneNo,
    Users.userBday,
    Users.imagePath,
    Users.role,
    Riders.joinDate
    FROM
    Riders
    INNER JOIN
    Users ON Riders.email = Users.email;
`;

    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      console.log("No riders to retrieve");
      return null;
    }

    return result.recordset;
  }

  static async createRider(riderId, email, joinDate, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath) {
    const connection = await sql.connect(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlQuery = `
      Insert into Users
      Values(@Email, @Password, @Name, @Address, @UnitNo, @PostalCode, @Country, @PhoneNo, @UserBday, @ImagePath, 'rider')

      Insert into Riders
      Values(@RiderId, @Email, @JoinDate)
    `;

    const request = connection.request();
    request.input("RiderId", sql.VarChar, riderId);
    request.input("Email", sql.VarChar, email);
    request.input("JoinDate", sql.Date, joinDate);
    request.input("Password", sql.VarChar, hashedPassword);
    request.input("Name", sql.VarChar, name);
    request.input("Address", sql.VarChar, address);
    request.input("UnitNo", sql.VarChar, unitNo);
    request.input("PostalCode", sql.VarChar, postalCode);
    request.input("Country", sql.VarChar, country);
    request.input("PhoneNo", sql.VarChar, phoneNo);
    request.input("UserBday", sql.Date, userBday);
    request.input("ImagePath", sql.VarChar, imagePath);

    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1; // Check if 1 row was inserted (success)
  }

  static async retrieveRider(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT
    Riders.riderId,
    Users.email,
    Users.name,
    Users.address,
    Users.unitNo,
    Users.postalCode,
    Users.country,
    Users.phoneNo,
    Users.userBday,
    Users.imagePath,
    Users.role,
    Riders.joinDate
    FROM
    Riders
    INNER JOIN
    Users ON Riders.email = Users.email
	where Riders.email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Rider not found
    }

    const rider = result.recordset[0];
    return rider;
  } 

  static async updateRider(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `Update Cart
    set email  = @Email, SnackId =  @SnackId, Quantity = @Quantity
    where email = @Email;
    Update Admins
    set admindId = @AdminId, email = @Email,  department = @Department, branch = @Branch, position = @Position, joinDate = @JoinDate
    where email = @Email;
    Update Riders
    set riderId = @RiderId, email = @Email, joinDate = @JoinDate
    where email = @Email;
    Update Users
    set email = @Email, password = @Password, name = @Name, address = @Address, unitNo = @unitNo, postalCode = @PostalCode, country = @Country, phoneNo = @PhoneNo, userBday = @UserBday, imagePath =  @ImagePath, role = @Role
    where email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Rider not found
    }

    const rider = result.recordset[0];
    return rider;
  } 

  static async deleteRider(email) {
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
}

module.exports = Rider;
