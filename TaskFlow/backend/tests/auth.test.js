 const request = require('supertest');
        const app = require('../app'); // Assuming your express app is exported from app.js
        const { pool } = require('../config/database'); // To clean up the database

        // We will test the /api/auth routes
        describe('Auth Routes', () => {
          // Clean up the database after all tests in this file have run
          afterAll(async () => {
            // Clean up the user we created
            await pool.query("DELETE FROM users WHERE email = 'testuser@example.com'");
            // Close the database connection pool
            await pool.end();
          });

          // Test for user registration
          describe('POST /api/auth/register', () => {
            it('should register a new user and return 201 status', async () => {
              const response = await request(app)
                .post('/api/auth/register')
                .send({
                  username: 'testuser',
                  email: 'testuser@example.com',
                  password: 'password123',
                });
              
              // Check the response
              expect(response.statusCode).toBe(201);
              expect(response.body.success).toBe(true);
              expect(response.body.message).toBe('User registered successfully');
              expect(response.body.data).toHaveProperty('token');
            });

            it('should not register a user with a duplicate email and return 409 status', async () => {
              const response = await request(app)
                .post('/api/auth/register')
                .send({
                  username: 'anotheruser',
                  email: 'testuser@example.com', // Same email
                  password: 'password123',
                });

              // Check the response
              expect(response.statusCode).toBe(409);
              expect(response.body.success).toBe(false);
              expect(response.body.message).toBe('User with this email already exists');
            });
          });
        });
        