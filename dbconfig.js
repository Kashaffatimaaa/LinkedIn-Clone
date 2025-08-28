// Import the mssql module
import sql from 'mssql';

// Database configuration
const dbConfig = {
  server: 'DESKTOP-9PNT0UL\\SQLEXPRESS', // Use double backslashes for escaping
  database: 'master', // Replace with your database name
  user: 'sa', // SQL Server username
  password: '12345', // SQL Server password
  options: {
    encrypt: false, // Set to true if using Azure or SSL
    trustServerCertificate: true, // Required for self-signed certificates
  },
};

// Function to connect to the database
async function connectDB() {
  try {
    const pool = await sql.connect(dbConfig); // Connect to the database
    console.log('Connected to SQL Server');
    return pool; // Return the connection pool for reuse
  } catch (err) {
    console.error('Database connection failed:', err);
    throw err; // Throw the error to handle it upstream
  }
}

// Export both the connection function and the mssql module
export { connectDB, sql };
