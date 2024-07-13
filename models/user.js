const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");

class User {
  constructor(Email, passwordHash, Postalcode, Streetname, Blockno, Unitno, Phoneno, Name, isRider, isAdmin) {
    this.email = Email;
    this.passwordHash = passwordHash;
    this.postalcode = Postalcode;
    this.streetname = Streetname;
    this.blockno = Blockno;
    this.unitno = Unitno;
    this.phoneno = Phoneno;
    this.name = Name;
    this.isRider = isRider;
    this.isAdmin = isAdmin;
  }

  static async login(email, password) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE email = @Email`; // Parameterized query

    const request = connection.request();
    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // User not found
    }

    const user = result.recordset[0];
    return new User(
      user.email,
      user.passwordHash,
      user.postalcode,
      user.streetname,
      user.blockno,
      user.unitno,
      user.phoneno,
      user.name,
      user.isRider,
      user.isAdmin
    );
  }

  static async retrieveUsers() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `select * from Users`;

    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      console.log("No users to retrieve");
      return null;
    }
    
    return result.recordset.map(
      (user) => new User(
        user.Email,
        user.passwordHash,
        user.Postalcode,
        user.Streetname,
        user.Blockno,
        user.Unitno,
        user.Phoneno,
        user.Name,
        user.isRider,
        user.isAdmin
      )
    );
  }

  static async createUser(Email, passwordHash, Postalcode, Streetname, Blockno, Unitno, Phoneno, Name, isRider, isAdmin) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      INSERT INTO Users (email, passwordHash, postalcode, streetname, blockno, unitno, phoneno, name, isRider, isAdmin)
      VALUES (@Email, @PasswordHash, @Postalcode, @Streetname, @Blockno, @Unitno, @Phoneno, @Name, @IsRider, @IsAdmin)
    `;

    const request = connection.request();
    request.input("Email", sql.VarChar, Email);
    request.input("PasswordHash", sql.VarChar, passwordHash);
    request.input("Postalcode", sql.Int, Postalcode);
    request.input("Streetname", sql.VarChar, Streetname);
    request.input("Blockno", sql.Int, Blockno);
    request.input("Unitno", sql.Int, Unitno);
    request.input("Phoneno", sql.Int, Phoneno);
    request.input("Name", sql.VarChar, Name);
    request.input("IsRider", sql.Bit, isRider);
    request.input("IsAdmin", sql.Bit, isAdmin);

    const result = await request.query(sqlQuery);
    connection.close();

    return result.rowsAffected[0] === 1; // Check if 1 row was inserted (success)
  }

  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  static async retrieveUser(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Users WHERE email = @Email`; // Parameterized query
    const request = connection.request();

    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // User not found
    }

    const user = result.recordset[0];
    return new User(
      user.Email,
      user.passwordHash,
      user.Postalcode,
      user.Streetname,
      user.Blockno,
      user.Unitno,
      user.Phoneno,
      user.Name,
      user.isRider,
      user.isAdmin
    );
  }

  static async retrieveRider() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM Users WHERE isRider = 1`; // Parameterized query
    const request = connection.request();

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // User not found
    }

    return result.recordset.map(
      (user) => new User(
        user.Email,
        user.passwordHash,
        user.Postalcode,
        user.Streetname,
        user.Blockno,
        user.Unitno,
        user.Phoneno,
        user.Name,
        user.isRider,
        user.isAdmin
      )
    );
  }

  static async deleteUser(email) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `delete from Cart where Email = @email
    delete from Users where Email = @email`;
    const request = connection.request();

    request.input("Email", sql.VarChar, email);

    const result = await request.query(sqlQuery);
    connection.close();

    console.log("Delete results:", result); //To see result
    return result.rowsAffected[1] === 1; // Check if a column was deleted 
  }
}

module.exports = User;
