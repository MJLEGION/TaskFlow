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
const { router: metricsRoutes, trackMetrics } = require('./routes/metrics');
// const usersRoutes = require('./routes/users'); // Uncomment if you have a users route

// Apply metrics tracking middleware globally
app.use(trackMetrics);

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/', metricsRoutes); // Metrics at root level for Prometheus scraping
// app.use('/api/users', usersRoutes); // Uncomment if you have a users route

// Enhanced Health Check Endpoint with monitoring
app.get('/health', (req, res) => {
  const healthData = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Backend server is healthy and operational.',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    monitoring: {
      applicationInsights: !!(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
    }
  };

  // Log health check for monitoring
  if (appInsights.defaultClient) {
    appInsights.defaultClient.trackEvent({
      name: 'HealthCheck',
      properties: {
        status: healthData.status,
        uptime: healthData.uptime,
        environment: healthData.environment
      }
    });
  }

  res.status(200).json(healthData);
});

// API Health endpoint for detailed monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({
    api: 'TaskFlow Backend API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      tasks: '/api/tasks',
      health: '/health'
    }
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
