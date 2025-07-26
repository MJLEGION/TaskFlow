const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sql = require('mssql'); // Added for Azure SQL
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const projectRoutes = require('./src/routes/projects');
const taskRoutes = require('./src/routes/tasks');
const timeRoutes = require('./src/routes/time');

const app = express();
const PORT = process.env.PORT || 8080;

// ==============================================
// Azure SQL Database Connection Setup
// ==============================================
const sqlConfig = {
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false, // Recommended for production
    connectionTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Database connection middleware
app.use(async (req, res, next) => {
  try {
    req.db = await sql.connect(sqlConfig);
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(503).json({ error: 'Service unavailable - database connection failed' });
  }
});

// ==============================================
// Security Middleware
// ==============================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", process.env.FRONTEND_URL],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https://*.azure.com'],
      connectSrc: ["'self'", process.env.FRONTEND_URL]
    }
  }
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting (more strict in production)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// ==============================================
// Application Middleware
// ==============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// ==============================================
// Routes
// ==============================================
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time', timeRoutes);

// Health check with DB verification
app.get('/api/health', async (req, res) => {
  try {
    const result = await req.db.request().query('SELECT 1');
    res.json({ 
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(503).json({
      status: 'DOWN',
      database: 'disconnected',
      error: err.message
    });
  }
});

// ==============================================
// Error Handling
// ==============================================
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.stack);
  
  // Handle database connection errors specifically
  if (err instanceof sql.ConnectionError) {
    return res.status(503).json({ 
      error: 'Database connection error',
      message: 'Service temporarily unavailable'
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid token'
    });
  }

  // Default error handler
  res.status(err.status || 500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    documentation: process.env.API_DOCS_URL || 'No documentation available'
  });
});

// ==============================================
// Server Startup
// ==============================================
const server = app.listen(PORT, () => {
  console.log(`🚀 TaskFlow Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    sql.close();
    console.log('Server closed. Database connection pool ended.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    sql.close();
    console.log('Server closed. Database connection pool ended.');
    process.exit(0);
  });
});