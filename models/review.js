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
        DELETE FROM Reviews where email = @Email
        `;

        const request = connection.request();
        request.input("Email", sql.VarChar, email);

        const result = await request.query(sqlQuery);
        connection.close();

        console.log("Delete results:", result);     //To see result
        return result.rowsAffected[0] === 1;    // Check if a row was deleted
    }

    static async retrieveReview(reviewId){
        const connection = await sql.connect(dbConfig);
        const sqlQuery =`
        Select * from Reviews
        Where reviewId = @ReviewId
        `;

        const  request = connection.request();
        request.input("ReviewId", sql.VarChar, reviewId);

        const result = await request.query(sqlQuery);
        connection.close();

        if (result.recordset.length === 0) {
            return null; // Review not found
        }

        console.log("Review results:", result);
        const review = result.recordset[0];
        return review;
    }

    static async retrieveReviews(riderId){
        const connection = await sql.connect(dbConfig);
        const sqlQuery =`
        Select * from Reviews
        Where riderId = @RiderId
        `;

        const request = connection.request();
        request.input("RiderId", sql.VarChar, riderId);

        const result = await request.query(sqlQuery);
        connection.close();

        if (result.recordset.length === 0) {
            return null; // Reviews not found
        }

        console.log("Review results:", result);
        return result.recordset.map(
            (review) => new Review(
                review.email,
                review.name,
                review.message,
                review.riderId,
            )
        );
    }

    static async updateReview(message, reviewId){
        const connection = await sql.connect(dbConfig);
        const sqlQuery =`
        Update Reviews
        SET message = @Message
        Where reviewId = @ReviewId;
        `;

        const request = connection.request();
        request.input("Message", sql.Text, message);
        request.input("ReviewId", sql.Int, reviewId);

        const result = await request.query(sqlQuery);
        connection.close();

        console.log("Update results:", result);
        return result.rowsAffected[0] === 1;
    }
}

module.exports = Review;
