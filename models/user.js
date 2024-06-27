const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(id, username, email, passwordHash, postalcode, streetname, blockno, unitno, phoneno) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.postalcode = postalcode;
    this.streetname = streetname;
    this.blockno = blockno;
    this.unitno = unitno;
    this.phoneno = phoneno;
  }

  static async login(username, password) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM Users WHERE username = @username`; // Parameterized query

    const request = connection.request();
    request.input("username", username);

    const result = await request.query(sqlQuery);
    connection.close();

    if (result.recordset.length === 0) {
      return null; // User not found
    }

    const user = result.recordset[0];

    // Implement password hashing comparison here (explained earlier)
    if (/* compare password with hashed password */) {
      return new User(
        user.id,
        user.username,
        user.email,
        user.passwordHash,
        user.postalcode,
        user.streetname,
        user.blockno,
        user.unitno,
        user.phoneno
      );
    } else {
      return null; // Invalid password
    }
  }
}

module.exports = User;
