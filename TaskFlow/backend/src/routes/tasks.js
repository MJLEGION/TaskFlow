const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    // Verify project belongs to user
    const projectCheck = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.projectId, req.user.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const result = await pool.query(`
      SELECT t.*, 
             COALESCE(SUM(te.duration_minutes), 0) as total_time_minutes
      FROM tasks t
      LEFT JOIN time_entries te ON t.id = te.task_id
      WHERE t.project_id = $1
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `, [req.params.projectId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single task
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, p.user_id,
             COALESCE(SUM(te.duration_minutes), 0) as total_time_minutes
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN time_entries te ON t.id = te.task_id
      WHERE t.id = $1 AND p.user_id = $2
      GROUP BY t.id, p.user_id
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create task
router.post('/', [
  auth,
  body('title').isLength({ min: 1 }).withMessage('Task title is required'),
  body('project_id').isInt().withMessage('Valid project ID is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('due_date').optional().isISO8601().withMessage('Due date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project_id, priority, due_date } = req.body;

    // Verify project belongs to user
    const projectCheck = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [project_id, req.user.id]
    );

    if (projectCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, project_id, priority, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description || null, project_id, priority || 'medium', due_date || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', [
  auth,
  body('title').optional().isLength({ min: 1 }).withMessage('Task title cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('due_date').optional().isISO8601().withMessage('Due date must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, due_date, completed } = req.body;

    const result = await pool.query(`
      UPDATE tasks 
      SET title = $1, description = $2, priority = $3, due_date = $4, completed = $5, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $6 AND project_id IN (SELECT id FROM projects WHERE user_id = $7)
      RETURNING *
    `, [title, description, priority, due_date, completed, req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle task completion
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE tasks 
      SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 AND project_id IN (SELECT id FROM projects WHERE user_id = $2)
      RETURNING *
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Delete all time entries for this task
      await client.query('DELETE FROM time_entries WHERE task_id = $1', [req.params.id]);
      
      // Delete the task
      const result = await client.query(`
        DELETE FROM tasks 
        WHERE id = $1 AND project_id IN (SELECT id FROM projects WHERE user_id = $2)
        RETURNING *
      `, [req.params.id, req.user.id]);
      
      await client.query('COMMIT');
      
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;