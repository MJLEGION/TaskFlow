const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Verify JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist
    const userResult = await query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Add user info to request object
    req.user = {
      id: decoded.userId,
      username: userResult.rows[0].username,
      email: userResult.rows[0].email,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Verify password reset token
const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired reset token');
  }
};

// Generate password reset token
const generateResetToken = (userId) => {
  return jwt.sign(
    { userId, type: 'password_reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // Reset tokens expire in 1 hour
  );
};

// Optional authentication (for public endpoints that can show more info if user is logged in)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userResult = await query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length > 0) {
      req.user = {
        id: decoded.userId,
        username: userResult.rows[0].username,
        email: userResult.rows[0].email,
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // For optional auth, we don't return an error, just set user to null
    req.user = null;
    next();
  }
};

// Check if user owns resource middleware
const checkResourceOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.id;

      let queryText;
      let params;

      switch (resourceType) {
        case 'project':
          queryText = 'SELECT user_id FROM projects WHERE id = $1';
          params = [resourceId];
          break;
        case 'task':
          queryText = `
            SELECT p.user_id 
            FROM tasks t 
            JOIN projects p ON t.project_id = p.id 
            WHERE t.id = $1
          `;
          params = [resourceId];
          break;
        case 'time_entry':
          queryText = 'SELECT user_id FROM time_entries WHERE id = $1';
          params = [resourceId];
          break;
        case 'goal':
          queryText = 'SELECT user_id FROM goals WHERE id = $1';
          params = [resourceId];
          break;
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid resource type',
          });
      }

      const result = await query(queryText, params);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} not found`,
        });
      }

      if (result.rows[0].user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied',
        });
      }

      next();
    } catch (error) {
      console.error('Resource ownership check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify resource ownership',
      });
    }
  };
};

module.exports = {
  authenticateToken,
  generateToken,
  generateResetToken,
  verifyResetToken,
  optionalAuth,
  checkResourceOwnership,
};