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

        const sqlQuery = `SELECT * FROM Cart WHERE Email = @Email`;
        const request = connection.request();
        request.input("Email", sql.VarChar, email);

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

    static async addToCart(email, snackId, quantity) {
        const connection = await sql.connect(dbConfig);
        console.log(email, snackId, quantity);

        const sqlQuery = `
          MERGE Cart AS target
          USING (VALUES (@Email, @SnackId, @Quantity)) AS source (Email, SnackId, Quantity)
          ON (target.Email = source.Email AND target.SnackId = source.SnackId)
          WHEN MATCHED THEN 
              UPDATE SET target.Quantity = target.Quantity + source.Quantity
          WHEN NOT MATCHED THEN
              INSERT (Email, SnackId, Quantity) 
              VALUES (source.Email, source.SnackId, source.Quantity);
        `;

        const request = connection.request();
        request.input("Email", sql.VarChar, email);
        request.input("SnackId", sql.VarChar, snackId);
        request.input("Quantity", sql.Int, quantity);

        const result = await request.query(sqlQuery);
        connection.close();
        console.log(result);

        return result.rowsAffected[0] === 1;
    }
}

module.exports = Cart;
