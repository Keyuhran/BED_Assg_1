const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dbConfig = require('dbConfig'); 
const sql = require('mssql');

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes setup
const snacksRoutes = require('./public/scripts/snacks'); // Adjust path as per your file structure
app.use('/api/snacks', snacksRoutes); // Use the appropriate endpoint

// Initialize database connection
async function startServer() {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to SQL Server database');
    
    // Start the Express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error connecting to SQL Server:', err.message);
  }
}

startServer();
