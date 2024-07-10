const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Cart {
    constructor(email, snackId, quantity) {
        this.email = email;
        this.snackId = snackId;
        this.quantity = quantity;
    }

    static async checkForCart(email){
        const connection = await sql.connect(dbConfig);
        console.log(email);

        const sqlQuery = `Select * FROM Cart where Email = @email`;
        const request = connection.request();
        request.input("email", email);

        const result = await request.query(sqlQuery);
        connection.close();
        console.log(result);

        if (result.recordset.length === 0) {
            return null; // Cart not found
          }
        
          return result.recordset.map(
            (cart) => new Cart(
              cart.Email,
              cart.SnackId,
              cart.Quantity,
            )
          );
    }

    static async addToCart(email,snackId,quantity){
        const connection = await sql.connect(dbConfig);
        console.log(email, snackId, quantity);

        const sqlQuery = `INSERT INTO Cart (Email, SnackId, Quantity)
  VALUES (@email, @snackId, @quantity)`;
        const request = connection.request();
        request.input("email", email);
        request.input("snackId", snackId);
        request.input("quantity", quantity);

        const result = await request.query(sqlQuery);
        connection.close();
        console.log(result);

        return result.rowsAffected[0] === 1;
    }
}
module.exports = Cart;
