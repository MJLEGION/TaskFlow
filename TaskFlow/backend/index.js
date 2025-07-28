// TaskFlow/backend/index.js

// Import the Express application instance from server.js
const app = require('./src/server');
const dotenv = require('dotenv'); // Import dotenv for environment variables

// Load environment variables from .env file
dotenv.config();

// Define the port the server will listen on
// It will use the PORT environment variable if available, otherwise default to 8080
const PORT = process.env.PORT || 8080;

// Start the server
// The app.listen() method binds the application to a port on the local machine
// and starts listening for incoming HTTP requests.
app.listen(PORT, () => {
  console.log(`TaskFlow Backend server running on port ${PORT}`);
});

// Optional: Handle unhandled promise rejections (good practice for robustness)
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Optional: Handle uncaught exceptions (good practice for robustness)
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Perform graceful shutdown (e.g., close database connections)
  process.exit(1); // Exit with a failure code
});
