// TaskFlow/backend/src/server.js

// Application Insights integration for monitoring
const appInsights = require('applicationinsights');
// Check if connection string or instrumentation key is provided before setting up Application Insights
if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
  appInsights.setup(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    .setAutoDependencyCorrelation(true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true)
    .setAutoCollectExceptions(true)
    .setAutoCollectDependencies(true)
    .setAutoCollectConsole(true)
    .setSendLiveMetrics(true)
    .setUseDiskRetryCaching(true)
    .start();
  console.log('Azure Application Insights initialized.');
}

const express = require('express');
const cors = require('cors'); // Import cors middleware
const dotenv = require('dotenv'); // Import dotenv for environment variables

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Middleware
// Enable CORS for all origins (you might want to restrict this in production)
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Import routes (assuming these files exist in src/routes/)
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');
// const usersRoutes = require('./routes/users'); // Uncomment if you have a users route

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
// app.use('/api/users', usersRoutes); // Uncomment if you have a users route

// Health Check Endpoint
// This endpoint is used to verify that the server is running and responsive.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend server is healthy and operational.'
  });
});

// Catch-all for 404 Not Found errors
// This middleware should be placed after all other routes to catch requests
// that do not match any defined routes.
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404; // Assign a status property to the error object
  next(error); // Pass the error to the next error-handling middleware
});

// Global Error Handling Middleware
// This middleware catches any errors passed from previous middleware or route handlers.
// It sends a standardized error response to the client.
app.use((error, req, res, next) => {
  res.status(error.status || 500); // Use the error's status or default to 500 (Internal Server Error)
  res.json({
    error: {
      message: error.message || 'An unexpected error occurred.',
      status: error.status || 500
    }
  });
});

// Export the Express app instance
// This allows other files (like your test files or the main entry point) to import and use the app
// without immediately starting the server.
module.exports = app;
