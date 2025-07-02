const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             COUNT(t.id) as task_count,
             COUNT(CASE WHEN t.completed = true THEN 1 END) as completed_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [req.user.id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project
router.post('/', [
  auth,
  body('name').isLength({ min: 1 }).withMessage('Project name is required'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color } = req.body;

    const result = await pool.query(
      'INSERT INTO projects (name, description, color, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description || null, color || '#3B82F6', req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project
router.put('/:id', [
  auth,
  body('name').optional().isLength({ min: 1 }).withMessage('Project name cannot be empty'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color } = req.body;

    const result = await pool.query(
      'UPDATE projects SET name = $1, description = $2, color = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, description, color, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete all time entries for tasks in this project
      await client.query('DELETE FROM time_entries WHERE task_id IN (SELECT id FROM tasks WHERE project_id = $1)', [req.params.id]);
      
      // Delete all tasks in this project
      await client.query('DELETE FROM tasks WHERE project_id = $1', [req.params.id]);
      
      // Delete the project
      const result = await client.query('DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
      
      await client.query('COMMIT');
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;