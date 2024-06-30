
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../dbConfig');

// Model
class Snack {
    constructor(snackName, snackDescription, snackPrice, ingredients, country, imagePath) {
        this.snackName = snackName;
        this.snackDescription = snackDescription;
        this.snackPrice = snackPrice;
        this.ingredients = ingredients;
        this.country = country;
        this.imagePath = imagePath;
    }

    static async createSnack(snackName, snackDescription, snackPrice, ingredients, country, imagePath) {
        try {
            const pool = await sql.connect(dbConfig);

            let tableName;
            switch (country.toLowerCase()) {
                case 'malaysia':
                    tableName = 'MALAYSIA';
                    break;
                case 'singapore':
                    tableName = 'SINGAPORE';
                    break;
                case 'brunei':
                    tableName = 'BRUNEI';
                    break;
                case 'cambodia':
                    tableName = 'CAMBODIA';
                    break;
                case 'myanmar':
                    tableName = 'MYANMAR';
                    break;
                case 'laos':
                    tableName = 'LAOS';
                    break;
                case 'vietnam':
                    tableName = 'VIETNAM';
                    break;
                case 'philippines':
                    tableName = 'PHILIPPINES';
                    break;
                case 'thailand':
                    tableName = 'THAILAND';
                    break;
                case 'indonesia':
                    tableName = 'INDONESIA';
                    break;
                case 'timor-leste':
                    tableName = 'TIMORLESTE';
                    break;
                default:
                    throw new Error('Invalid country provided');
            }

            const sqlQuery = `
                INSERT INTO ${tableName} (SnackName, SnackDescription, SnackPrice, Ingredients, ImagePath)
                VALUES (@snackName, @snackDescription, @snackPrice, @ingredients, @imagePath)
            `;

            const request = pool.request();
            request.input('snackName', sql.NVarChar, snackName);
            request.input('snackDescription', sql.NVarChar, snackDescription);
            request.input('snackPrice', sql.Decimal, snackPrice);
            request.input('ingredients', sql.NVarChar, ingredients);
            request.input('imagePath', sql.NVarChar, imagePath);

            const result = await request.query(sqlQuery);
            pool.close();

            return result.rowsAffected[0] === 1; 
        } catch (error) {
            console.error('Error adding snack:', error.message);
            throw error; 
        }
    }

    static async fetchAllSnacks(req, res) {
        const { country } = req.query;

        let query;
        if (country) {
            // Validate the country parameter
            const tableName = country.toUpperCase();
            query = `SELECT TOP 3 SnackId AS Id, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath
                     FROM ${tableName}
                     ORDER BY SnackId`;
        } else {
            query = `
                SELECT 'Malaysia' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Malaysia' ORDER BY SnackId) AS rn 
                FROM MALAYSIA 
                UNION ALL 
                SELECT 'Singapore' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Singapore' ORDER BY SnackId) AS rn 
                FROM SINGAPORE 
                UNION ALL 
                SELECT 'Brunei' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Brunei' ORDER BY SnackId) AS rn 
                FROM BRUNEI 
                UNION ALL 
                SELECT 'Cambodia' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Cambodia' ORDER BY SnackId) AS rn 
                FROM CAMBODIA 
                UNION ALL 
                SELECT 'Myanmar' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Myanmar' ORDER BY SnackId) AS rn 
                FROM MYANMAR 
                UNION ALL 
                SELECT 'Laos' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Laos' ORDER BY SnackId) AS rn 
                FROM LAOS 
                UNION ALL 
                SELECT 'Vietnam' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Vietnam' ORDER BY SnackId) AS rn 
                FROM VIETNAM 
                UNION ALL 
                SELECT 'Philippines' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Philippines' ORDER BY SnackId) AS rn 
                FROM PHILIPPINES 
                UNION ALL 
                SELECT 'Thailand' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Thailand' ORDER BY SnackId) AS rn 
                FROM THAILAND 
                UNION ALL 
                SELECT 'Indonesia' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Indonesia' ORDER BY SnackId) AS rn 
                FROM INDONESIA 
                UNION ALL 
                SELECT 'Timor-Leste' AS Country, SnackId, SnackName AS Name, SnackDescription AS Description, SnackPrice AS Price, Ingredients, ImagePath, 
                       ROW_NUMBER() OVER (PARTITION BY 'Timor-Leste' ORDER BY SnackId) AS rn 
                FROM TIMORLESTE 
            ) 
            SELECT Country, SnackId AS Id, Name, Description, Price, Ingredients, ImagePath 
            ) AS RankedSnacks
            WHERE rn <= 3`;
        }

        try {
            const pool = await sql.connect(dbConfig);
            const result = await pool.request().query(query);
            res.json(result.recordset);
        } catch (error) {
            console.error('Error fetching snacks:', error.message);
            res.status(500).json({ error: 'Internal server error (GET)' });
        }
    }
}

// Route for handling GET requests to /snacks
router.get('/', Snack.fetchAllSnacks);

// Route for handling POST requests to create a new snack
router.post('/create', async (req, res) => {
    const { snackName, snackDescription, snackPrice, ingredients, country, imagePath } = req.body;

    try {
        const success = await Snack.createSnack(snackName, snackDescription, snackPrice, ingredients, country, imagePath);

        if (success) {
            res.status(201).json({ message: 'Snack created successfully!' });
        } else {
            res.status(400).json({ message: 'Failed to create snack.' });
        }
    } catch (error) {
        console.error('Error creating snack:', error.message);
        res.status(500).json({ error: 'Internal server error (POST)' });
    }
});

module.exports = router;
