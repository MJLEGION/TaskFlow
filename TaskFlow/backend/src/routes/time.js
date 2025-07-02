const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const auth = require('../middleware/auth');

const router = express.Router();

// Get time entries for a task
router.get('/task/:taskId', auth, async (req, res) => {
  try {
    // Verify task belongs to user
    const taskCheck = await pool.query(`
      SELECT t.id FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1 AND p.user_id = $2
    `, [req.params.taskId, req.user.id]);

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const result = await pool.query(
      'SELECT * FROM time_entries WHERE task_id = $1 ORDER BY start_time DESC',
      [req.params.taskId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get time entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get time summary for user
router.get('/summary', auth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    let dateFilter = '';
    switch (period) {
      case 'today':
        dateFilter = "AND DATE(te.start_time) = CURRENT_DATE";
        break;
      case 'week':
        dateFilter = "AND te.start_time >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "AND te.start_time >= CURRENT_DATE - INTERVAL '30 days'";
        break;
      default:
        dateFilter = "AND te.start_time >= CURRENT_DATE - INTERVAL '7 days'";
    }

    const result = await pool.query(`
      SELECT 
        p.name as project_name,
        p.color as project_color,
        t.title as task_title,
        SUM(te.duration_minutes) as total_minutes,
        COUNT(te.id) as session_count
      FROM time_entries te
      JOIN tasks t ON te.task_id = t.id
      JOIN projects p ON t.project_id = p.id
      WHERE p.user_id = $1 ${dateFilter}
      GROUP BY p.id, p.name, p.color, t.id, t.title
      ORDER BY total_minutes DESC
    `, [req.user.id]);

    const totalMinutes = result.rows.reduce((sum, row) => sum + parseInt(row.total_minutes), 0);

    res.json({
      summary: result.rows,
      totalMinutes,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100
    });
  } catch (error) {
    console.error('Get time summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start time tracking
router.post('/start', [
  auth,
  body('task_id').isInt().withMessage('Valid task ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { task_id } = req.body;

    // Verify task belongs to user
    const taskCheck = await pool.query(`
      SELECT t.id FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1 AND p.user_id = $2
    `, [task_id, req.user.id]);

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if there's already an active timer
    const activeTimer = await pool.query(
      'SELECT id FROM time_entries WHERE task_id IN (SELECT id FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE user_id = $1)) AND end_time IS NULL',
      [req.user.id]
    );

    if (activeTimer.rows.length > 0) {
      return res.status(400).json({ message: 'You already have an active timer running' });
    }

    const result = await pool.query(
      'INSERT INTO time_entries (task_id, start_time) VALUES ($1, CURRENT_TIMESTAMP) RETURNING *',
      [task_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Start timer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Stop time tracking
router.post('/stop/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      UPDATE time_entries 
      SET end_time = CURRENT_TIMESTAMP,
          duration_minutes = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - start_time)) / 60
      WHERE id = $1 
        AND task_id IN (
          SELECT t.id FROM tasks t
          JOIN projects p ON t.project_id = p.id
          WHERE p.user_id = $2
        )
        AND end_time IS NULL
      RETURNING *
    `, [req.params.id, req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Active timer not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Stop timer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active timer
router.get('/active', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT te.*, t.title as task_title, p.name as project_name
      FROM time_entries te
      JOIN tasks t ON te.task_id = t.id
      JOIN projects p ON t.project_id = p.id
      WHERE p.user_id = $1 AND te.end_time IS NULL
      ORDER BY te.start_time DESC
      LIMIT 1
    `, [req.user.id]);

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error('Get active timer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add manual time entry
router.post('/manual', [
  auth,
  body('task_id').isInt().withMessage('Valid task ID is required'),
  body('duration_minutes').isInt({ min: 1 }).withMessage('Duration must be at least 1 minute'),
  body('description').optional().isLength({ max: 255 }).withMessage('Description too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { task_id, duration_minutes, description, date } = req.body;

    // Verify task belongs to user
    const taskCheck = await pool.query(`
      SELECT t.id FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1 AND p.user_id = $2
    `, [task_id, req.user.id]);

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const entryDate = date ? new Date(date) : new Date();
    const startTime = new Date(entryDate);
    const endTime = new Date(startTime.getTime() + (duration_minutes * 60000));

    const result = await pool.query(
      'INSERT INTO time_entries (task_id, start_time, end_time, duration_minutes, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [task_id, startTime, endTime, duration_minutes, description || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add manual time entry error:', error);
    res.status(500).json({ message: 'Server error' });
  };