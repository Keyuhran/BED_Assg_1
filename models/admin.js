const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class Admin {
  constructor(adminId, email, department, branch, position, joinDate) {
    this.adminId = adminId;
    this.email = email;
    this.department = department;
    this.branch = branch;
    this.position = position;
    this.joinDate = joinDate;
  }

  static async retrieveAdmins() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT
    Admins.adminId,
    Users.email,
    Users.name,
    Admins.department,
    Admins.branch,
    Admins.position,
    Users.address,
    Users.unitNo,
    Users.postalCode,
    Users.country,
    Users.phoneNo,
    Users.userBday,
    Users.imagePath,
    Users.role,
    Admins.joinDate
    FROM
    Admins
    INNER JOIN
    Users ON Admins.email = Users.email;
`;

    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      console.log("No admins to retrieve");
      return null;
    }

    return result.recordset.map(
      (admin) => new Admin(
        admin.riderId,
        admin.email,
        admin.name,
        admin.department,
        admin.branch,
        admin.position,
        admin.address,
        admin.unitNo,
        admin.postalCode,
        admin.country,
        admin.phoneNo,
        admin.userBday,
        admin.imagePath,
        admin.role,
        admin.joinDate
      )
    );
  }

  static async createAdmin(adminId, email, department, branch, position, joinDate, password, name, address, unitNo, postalCode, country, phoneNo, userBday, imagePath) {
    const connection = await sql.connect(dbConfig);
    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlQuery = `
      Insert into Users
      Values(@Email, @Password, @Name, @Address, @UnitNo, @PostalCode, @Country, @PhoneNo, @UserBday, @ImagePath, 'admin')

      Insert into Admins
      Values(@AdminId, @Email, @Department, @Branch, @Position, @JoinDate)
    `;

    const request = connection.request();
    request.input("AdminId", sql.VarChar, adminId);
    request.input("Email", sql.VarChar, email);
    request.input("Department", sql.VarChar, department);
    request.input("Branch", sql.VarChar, branch);
    request.input("Position", sql.VarChar, position);
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

  static async retrieveAdmin(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT
    Admins.adminId,
    Users.email,
    Users.name,
    Admins.department,
    Admins.branch,
    Admins.position,
    Users.address,
    Users.unitNo,
    Users.postalCode,
    Users.country,
    Users.phoneNo,
    Users.userBday,
    Users.imagePath,
    Users.role,
    Admins.joinDate
    FROM
    Admins
    INNER JOIN
    Users ON Admins.email = Users.email;
	where Admins.email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Admin not found
    }

    const admin = result.recordset[0];
    return admin;
  } 

  static async updateAdminEmail(newEmail, oldEmail) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
    BEGIN TRANSACTION;

    -- Disable the constraint
    ALTER TABLE Admins NOCHECK CONSTRAINT FK__Admins__email__2057CCD0;

    -- Update email in Users table
    UPDATE Users
    SET email = @NewEmail
    WHERE email = @OldEmail;

    -- Update email in Admins table
    UPDATE Admins
    SET email = @NewEmail
    WHERE email = @OldEmail;

    -- Re-enable the constraint
    ALTER TABLE Admins WITH CHECK CHECK CONSTRAINT FK__Admins__email__2057CCD0;

    COMMIT TRANSACTION;`;

    const request = connection.request();
    request.input("NewEmail", sql.VarChar, newEmail);
    request.input("OldEmail", sql.VarChar, oldEmail);

    const result = await request.query(sqlQuery);
    connection.close();

    console.log("Update results:", result);
    return result.rowsAffected[1] === 1;
  } 

  static async deleteAdmin(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `
      DELETE FROM Admins WHERE email = @Email;
      DELETE FROM Users WHERE email = @Email`;

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    console.log("Delete results:", result); //To see result
    return result.rowsAffected[1] === 1; // Check if a row was deleted
  }
}

module.exports = Admin;
