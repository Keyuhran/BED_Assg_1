const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('public/scripts/dbConfig'); // Adjust the path as per your directory structure

// Example route for handling GET requests to /api/snacks
router.get('/', async (req, res) => {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query('SELECT * FROM Snacks'); // Adjust SQL query as per your schema
        res.json(result.recordset);
    } catch (err) {
        console.error('Error fetching snacks:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Example route for handling POST requests to /api/snacks
router.post('/', async (req, res) => {
    const { name, description, price, ingredients, imagePath } = req.body;
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('price', sql.Decimal, price)
            .input('ingredients', sql.NVarChar, ingredients)
            .input('imagePath', sql.NVarChar, imagePath)
            .query('INSERT INTO Snacks (Name, Description, Price, Ingredients, ImagePath) VALUES (@name, @description, @price, @ingredients, @imagePath); SELECT SCOPE_IDENTITY() AS Id'); // Adjust SQL query as per your schema

        res.json({ id: result.recordset[0].Id });
    } catch (err) {
        console.error('Error adding snack:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

