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

// Export the configuration object
export default dbConfig;
