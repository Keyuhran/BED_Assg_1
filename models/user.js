const sql = require("mssql");
const dbConfig = require("../dbConfig");

class User {
  constructor(id, name, email, passwordHash, postalcode, streetname, blockno, unitno, phoneno) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.postalcode = postalcode;
    this.streetname = streetname;
    this.blockno = blockno;
    this.unitno = unitno;
    this.phoneno = phoneno;
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

    // Implement password hashing comparison here (explained earlier)
    /*if (/* compare password with hashed password */ {
      //return new User(
        //user.id,
        //user.name,
        //user.email,
        //user.passwordHash,
        //user.postalcode,
        //user.streetname,
        //user.blockno,
        //user.unitno,
        //user.phoneno
      //);
    //} else {
      //return null; // Invalid password
    //}
  }
}
}
module.exports = User;
