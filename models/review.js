const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Review {
    constructor(reviewId, email, name, message, riderId) {
        this.reviewId = reviewId;
        this.email = email;
        this.name = name;
        this.message = message;
        this.riderId = riderId;
    }

    static async addReview(email, name, message, riderId){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
        Insert into Reviews
        Values(@Email, @Name, @Message, @RiderId)
        `;

        const request = connection.request;
        request.input("Email", sql.VarChar, email);
        request.input("Name", sql.VarChar, name);
        request.input("Message", sql.Text, message);
        request.input("RiderId", sql.VarChar, riderId);

        const result = await request.query(sqlQuery);
        connection.close();

        return result.rowsAffected[0] === 1; // Check if 1 row was inserted (success)
    }

    static async delReview(email){
        const connection = await sql.connect(dbConfig);
        const sqlQuery = `
        DELETE FROM Reviews where email = 
        `
    }
}

module.exports = Review;
