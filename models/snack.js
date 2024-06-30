const sql = require("mssql");
const dbConfig = require("../dbConfig");
const bcrypt = require("bcryptjs");


class Snack {
    constructor(snackId, snackName, snackDescription, snackPrice, ingredients, imagePath, country) {
        this.snackId = snackId,
        this.snackName = snackName;
        this.snackDescription = snackDescription;
        this.snackPrice = snackPrice;
        this.ingredients = ingredients;
        this.imagePath = imagePath;
        this.country = country;
    }

static async createSnack(snackId, snackName, snackDescription, snackPrice, ingredients, imagePath, country) {
  const connection = await sql.connect(dbConfig);
  console.log(snackId,snackName,snackDescription);
  const sqlQuery = `
  INSERT INTO Snacks (SnackId, SnackName, SnackDescription, SnackPrice, Ingredients, ImagePath, Country)
  VALUES (@snackId, @snackName, @snackDescription, @snackPrice, @ingredients, @imagePath, @country)
`;

  const request = connection.request();
  request.input("snackId", snackId);
  request.input("snackName", snackName);
  request.input("snackDescription", snackDescription);
  request.input("snackPrice", snackPrice);
  request.input("ingredients", ingredients);
  request.input("imagePath", imagePath);
  request.input("country", country);

  const result = await request.query(sqlQuery);
  connection.close();

 return result.rowsAffected[0] === 1; // Check if 1 row was inserted (success)

}


static async retrieveSnacks() {
  const connection = await sql.connect(dbConfig);
  const sqlQuery = `SELECT * FROM Snacks`; // Parameterized query
  const request = connection.request();

  const result = await request.query(sqlQuery);
  connection.close();

  if (result.recordset.length === 0) {
    return null; // Snacks not found
  }

  return result.recordset.map(
    (snack) => new Snack(
      snack.SnackId,
      snack.SnackName,
      snack.SnackDescription,
      snack.SnackPrice,
      snack.Ingredients,
      snack.ImagePath,
      snack.Country,
    )
  );
}
}
module.exports = Snack;
