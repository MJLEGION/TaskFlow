const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Check for important environment variables
if (!process.env.FRONTEND_URL) {
  console.warn('Warning: FRONTEND_URL is not set in environment variables. Using default.');
}

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// CORS middleware - support multiple origins if comma-separated
const allowedOrigins = (process.env.FRONTEND_URL || 'https://taskflow-webapp-legion.azurewebsites.net')
  .split(',')
  .map(origin => origin.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Global rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Per-route rate limiting example for /api/auth/profile
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter limit for auth endpoint
  message: 'Too many requests to auth endpoint, please try again later.'
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'TaskFlow Backend is running!',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mock API endpoints for testing
app.get('/api/auth/profile', authLimiter, (req, res) => {
  res.json({ message: 'Auth endpoint working', user: 'test-user' });
});

app.get('/api/projects', (req, res) => {
  res.json({ 
    message: 'Projects endpoint working', 
    projects: [
      { id: 1, name: 'Sample Project', description: 'This is a test project' }
    ]
  });
});

app.get('/api/tasks', (req, res) => {
  res.json({ 
    message: 'Tasks endpoint working', 
    tasks: [
      { id: 1, title: 'Sample Task', status: 'todo', projectId: 1 }
    ]
  });
});

// Catch all other API routes
app.use('/api/*', (req, res) => {
  res.json({ 
    message: 'API endpoint exists but not fully implemented yet',
    endpoint: req.originalUrl,
    method: req.method
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow Backend API',
    status: 'Running',
    endpoints: [
      'GET /api/health',
      'GET /api/auth/profile',
      'GET /api/projects',
      'GET /api/tasks'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`🚀 TaskFlow Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});