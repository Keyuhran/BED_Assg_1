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

    return result.recordset.map(
      (rider) => new Rider(
        rider.riderId,
        rider.email,
        rider.name,
        rider.address,
        rider.unitNo,
        rider.postalCode,
        rider.country,
        rider.phoneNo,
        rider.userBday,
        rider.imagePath,
        rider.role,
        rider.joinDate
      )
    );
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

  static async updateRiderEmail(newEmail, oldEmail) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    BEGIN TRANSACTION;

    -- Disable the constraint
    ALTER TABLE Riders NOCHECK CONSTRAINT FK__Riders__email__1D7B6025;

    -- Update email in Users table
    UPDATE Users
    SET email = @NewEmail
    WHERE email = @OldEmail;

    -- Update email in Riders table
    UPDATE Riders
    SET email = @NewEmail
    WHERE email = @OldEmail;

    -- Re-enable the constraint
    ALTER TABLE Riders WITH CHECK CHECK CONSTRAINT FK__Riders__email__1D7B6025;

    COMMIT TRANSACTION;`;

    const request = connection.request();
    request.input("NewEmail", sql.VarChar, newEmail);
    request.input("OldEmail", sql.VarChar, oldEmail);

    const result = await request.query(sqlQuery);
    connection.close();

    console.log("Update results:", result);
    return result.rowsAffected[1] === 1;
  } 

  static async deleteRider(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
      DELETE FROM Riders WHERE email = @Email;
      DELETE FROM Users WHERE email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    console.log("Delete results:", result); //To see result
    return result.rowsAffected[1] === 1; // Check if a row was deleted
  }
}

module.exports = Rider;
