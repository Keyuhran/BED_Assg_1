const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");


class User {
  constructor(email, hashedPassword, postalcode, streetname, blockno, unitno, phoneno, name, isRider) {
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.postalcode = postalcode;
    this.streetname = streetname;
    this.blockno = blockno;
    this.unitno = unitno;
    this.phoneno = phoneno;
    this.name = name;
    this.isRider = isRider;
  }

  static async login(email, password) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE email = @email`; // Parameterized query

    const request = connection.request();
    request.input("email", email);
    request.input("password", password);


    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // User not found
    }

    const user = result.recordset[0];
}


                                                                                      
static async createUser(email, passwordHash, postalcode, streetname, blockno, unitno, phoneno, name) {
  const connection = await sql.connect(dbConfig);

  const sqlQuery = `
  INSERT INTO Users (email, passwordHash, postalcode, streetname, blockno, unitno, phoneno, name)
  VALUES (@email, @passwordHash, @postalcode, @streetname, @blockno, @unitno, @phoneno, @name)
`;

  const request = connection.request();
  request.input("email", email);
  request.input("passwordHash", passwordHash);
  request.input("postalcode", postalcode);
  request.input("streetname", streetname);
  request.input("blockno", blockno);
  request.input("unitno", unitno);
  request.input("phoneno", phoneno);
  request.input("name", name);

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
  const sqlQuery = `SELECT * FROM Users WHERE email = @email`; // Parameterized query
  const request = connection.request();

  request.input("email", email);


  const result = await request.query(sqlQuery);
  connection.close();

  return result.recordset[0]
  ? new User(
      result.recordset[0].email,
      result.recordset[0].hashedPassword,
      result.recordset[0].postalcode,
      result.recordset[0].streetname,
      result.recordset[0].blockno,
      result.recordset[0].unitno,
      result.recordset[0].phoneno,
      result.recordset[0].name,
      result.recordset[0].isRider
    )
  : null;
}
}
module.exports = User;
