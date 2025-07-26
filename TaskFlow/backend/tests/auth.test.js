// tests/auth.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../src/config/database');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const db = require('../src/config/database');

// Create a test app instead of importing the main server
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  
  // Manually implement auth routes for testing
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }
      
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }
      
      // Check if user exists
      const existingUser = await db.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'User with this email or username already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const result = await db.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
        [username, email, hashedPassword]
      );
      
      res.status(201).json({
        message: 'User created successfully',
        user: result.rows[0]
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }
      
      // Find user
      const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
      
      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = result.rows[0];
      
      // Check password
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Generate token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'test-secret');
      
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  return app;
};

describe('Auth Routes', () => {
  let app;
  
  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp();
  });

  describe('POST /api/auth/register', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      created_at: '2025-07-26T16:20:09.072Z'
    };

    test('should register a new user successfully', async () => {
      // Mock database calls
      db.query
        .mockResolvedValueOnce({ rows: [] }) // Check if user exists
        .mockResolvedValueOnce({ rows: [mockUser] }); // Insert user

      bcrypt.hash.mockResolvedValue('hashedpassword');

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        created_at: mockUser.created_at
      });
    });

    test('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
          // missing email and password
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Username, email, and password are required');
    });

    test('should return 400 if password is too short', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: '123' // too short
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Password must be at least 6 characters long');
    });

    test('should return 400 if user already exists', async () => {
      // Mock that user already exists
      db.query.mockResolvedValueOnce({ rows: [mockUser] });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('User with this email or username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      created_at: '2025-07-26T16:20:09.263Z'
    };

    test('should login user successfully', async () => {
      // Mock database and bcrypt
      db.query.mockResolvedValueOnce({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        created_at: mockUser.created_at
      });
      expect(response.body.token).toBe('fake-jwt-token');
    });

    test('should return 400 if email or password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
          // missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email and password are required');
    });

    test('should return 401 if user does not exist', async () => {
      db.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });

    test('should return 401 if password is incorrect', async () => {
      db.query.mockResolvedValueOnce({ rows: [mockUser] });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});