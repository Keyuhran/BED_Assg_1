module.exports = {

  user: "Kieran", // Replace with your SQL Server login username
  password: "Trystan88", // Replace with your SQL Server login password
  server: "localhost",
  database: "bedassg",
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};

