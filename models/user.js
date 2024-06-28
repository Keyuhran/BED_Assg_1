const sql = require("mssql");
const dbConfig = require("../dbConfig");


class User {
  constructor(email, hashedPassword, postalcode, streetname, blockno, unitno, phoneno, name) {
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.postalcode = postalcode;
    this.streetname = streetname;
    this.blockno = blockno;
    this.unitno = unitno;
    this.phoneno = phoneno;
    this.name = name;
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


  /*Implement password hashing comparison here (explained earlier)
  if ( compare password with hashed password) {
    return new User(
      user.id,
      user.name,
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
  }*/
}
}

module.exports = User;
