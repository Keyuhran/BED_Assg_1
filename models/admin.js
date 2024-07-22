const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class Admin {
  constructor(adminId, password, name, email, address, unitNo, postalCode, department, branch, position, phoneNo, joinDate) {
    this.adminId = adminId;
    this.password = password;
    this.name = name;
    this.email = email;
    this.address = address;
    this.unitNo = unitNo;
    this.postalCode = postalCode;
    this.department = department;
    this.branch = branch;
    this.position = position;
    this.phoneNo = phoneNo;
    this.joinDate = joinDate;
  }

  static async login(email, password) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Admins WHERE email = @Email`; // Parameterized query
    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Admin not found
    }

    const admin = result.recordset[0];
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return null; // Password does not match
    }

    return new Admin(
      admin.adminId,
      admin.password,
      admin.name,
      admin.email,
      admin.address,
      admin.unitNo,
      admin.postalCode,
      admin.department,
      admin.branch,
      admin.position,
      admin.phoneNo,
      admin.joinDate
    );
  }

  static async retrieveAdmins() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Admins`;

    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      console.log("No admins to retrieve");
      return null;
    }

    return result.recordset.map(
      (admin) => new Admin(
        admin.adminId,
        admin.password,
        admin.name,
        admin.email,
        admin.address,
        admin.unitNo,
        admin.postalCode,
        admin.department,
        admin.branch,
        admin.position,
        admin.phoneNo,
        admin.joinDate
      )
    );
  }

  static async createAdmin(adminId, password, name, email, address, unitNo, postalCode, department, branch, position, phoneNo, joinDate) {
    const connection = await sql.connect(dbConfig);

    const hashedPassword = await bcrypt.hash(password, 10);

    const sqlQuery = `
      INSERT INTO Admins (adminId, password, name, email, address, unitNo, postalCode, department, branch, position, phoneNo, joinDate)
      VALUES (@AdminId, @Password, @Name, @Email, @Address, @UnitNo, @PostalCode, @Department, @Branch, @Position, @PhoneNo, @JoinDate)
    `;

    const request = connection.request();
    request.input("AdminId", sql.VarChar, adminId);
    request.input("Password", sql.VarChar, hashedPassword);
    request.input("Name", sql.VarChar, name);
    request.input("Email", sql.VarChar, email);
    request.input("Address", sql.VarChar, address);
    request.input("UnitNo", sql.VarChar, unitNo);
    request.input("PostalCode", sql.VarChar, postalCode);
    request.input("Department", sql.VarChar, department);
    request.input("Branch", sql.VarChar, branch);
    request.input("Position", sql.VarChar, position);
    request.input("PhoneNo", sql.VarChar, phoneNo);
    request.input("JoinDate", sql.Date, joinDate);

    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1; // Check if 1 row was inserted (success)
  }

  static async retrieveAdmin(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Admins WHERE email = @Email`; // Parameterized query
    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // Admin not found
    }

    const admin = result.recordset[0];
    return new Admin(
      admin.adminId,
      admin.password,
      admin.name,
      admin.email,
      admin.address,
      admin.unitNo,
      admin.postalCode,
      admin.department,
      admin.branch,
      admin.position,
      admin.phoneNo,
      admin.joinDate
    );
  }

  static async deleteAdmin(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM Admins WHERE email = @Email`; // Parameterized query
    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1; // Check if 1 row was deleted (success)
  }
}

module.exports = Admin;
