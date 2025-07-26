const request = require('supertest');
const express = require('express');

// Mock the routes
jest.mock('../src/routes/auth', () => {
  const router = express.Router();
  router.get('/test', (req, res) => res.json({ message: 'auth route works' }));
  return router;
});

jest.mock('../src/routes/projects', () => {
  const router = express.Router();
  router.get('/test', (req, res) => res.json({ message: 'projects route works' }));
  return router;
});

jest.mock('../src/routes/tasks', () => {
  const router = express.Router();
  router.get('/test', (req, res) => res.json({ message: 'tasks route works' }));
  return router;
});

jest.mock('../src/routes/time', () => {
  const router = express.Router();
  router.get('/test', (req, res) => res.json({ message: 'time route works' }));
  return router;
});

// Create a test version of the server
const createTestApp = () => {
  const express = require('express');
  const cors = require('cors');
  const helmet = require('helmet');
  const rateLimit = require('express-rate-limit');

  const authRoutes = require('../src/routes/auth');
  const projectRoutes = require('../src/routes/projects');
  const taskRoutes = require('../src/routes/tasks');
  const timeRoutes = require('../src/routes/time');

  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/time', timeRoutes);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
};

describe('Server Configuration', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('Route Mounting', () => {
    it('should mount auth routes correctly', async () => {
      const response = await request(app)
        .get('/api/auth/test')
        .expect(200);

      expect(response.body.message).toBe('auth route works');
    });

    it('should mount project routes correctly', async () => {
      const response = await request(app)
        .get('/api/projects/test')
        .expect(200);

      expect(response.body.message).toBe('projects route works');
    });

    it('should mount task routes correctly', async () => {
      const response = await request(app)
        .get('/api/tasks/test')
        .expect(200);

      expect(response.body.message).toBe('tasks route works');
    });

    it('should mount time routes correctly', async () => {
      const response = await request(app)
        .get('/api/time/test')
        .expect(200);

      expect(response.body.message).toBe('time route works');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown')
        .expect(404);

      expect(response.body.error).toBe('Route not found');
    });
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/health');

      // Check for helmet security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
    });
  });

  describe('CORS Configuration', () => {
    it('should handle CORS properly', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');

      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
  });
});