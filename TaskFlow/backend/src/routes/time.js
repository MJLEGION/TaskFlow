const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, getClient } = require('../config/database');
const { authenticateToken, checkResourceOwnership } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation middleware
const timeEntryValidation = [
  body('task_id')
    .isInt({ min: 1 })
    .withMessage('Valid task ID is required'),
  body('start_time')
    .isISO8601()
    .withMessage('Valid start time is required'),
  body('end_time')
    .optional()
    .isISO8601()
    .withMessage('End time must be a valid ISO8601 date'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description must not exceed 500 characters'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Middleware to check if user owns the task
const checkTaskOwnership = async (req, res, next) => {
  try {
    const taskId = req.body.task_id || req.query.task_id;
    const userId = req.user.id;

    if (!taskId) {
      return next();
    }

    const result = await query(`
      SELECT p.user_id 
      FROM tasks t 
      JOIN projects p ON t.project_id = p.id 
      WHERE t.id = $1
    `, [taskId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
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
    console.error('Task ownership check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify task ownership',
    });
  }
};

// @route   GET /api/time
// @desc    Get time entries for the user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const taskId = req.query.task_id;
    const projectId = req.query.project_id;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT 
        te.*,
        t.title as task_title,
        p.name as project_name,
        p.color as project_color
      FROM time_entries te
      JOIN tasks t ON te.task_id = t.id
      JOIN projects p ON t.project_id = p.id
      WHERE te.user_id = $1
    `;
    
    const queryParams = [userId];
    let paramCount = 1;

    if (taskId) {
      paramCount++;
      queryText += ` AND te.task_id = $${paramCount}`;
      queryParams.push(taskId);
    }

    if (projectId) {
      paramCount++;
      queryText += ` AND t.project_id = $${paramCount}`;
      queryParams.push(projectId);
    }

    if (startDate) {
      paramCount++;
      queryText += ` AND te.start_time >= $${paramCount}`;
      queryParams.push(startDate);
    }

    if (endDate) {
      paramCount++;
      queryText += ` AND te.start_time <= $${paramCount}`;
      queryParams.push(endDate);
    }

    queryText += `
      ORDER BY te.start_time DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const timeEntriesResult = await query(queryText, queryParams);

    // Get total count and summary stats
    let countQuery = `
      SELECT 
        COUNT(*) as total_entries,
        COALESCE(SUM(te.duration), 0) as total_duration
      FROM time_entries te
      JOIN tasks t ON te.task_id = t.id
      JOIN projects p ON t.project_id = p.id
      WHERE te.user_id = $1
    `;

    const countParams = [userId];
    let countParamCount = 1;

    if (taskId) {
      countParamCount++;
      countQuery += ` AND te.task_id = $${countParamCount}`;
      countParams.push(taskId);
    }

    if (projectId) {
      countParamCount++;
      countQuery += ` AND t.project_id = $${countParamCount}`;
      countParams.push(projectId);
    }

    if (startDate) {
      countParamCount++;
      countQuery += ` AND te.start_time >= $${countParamCount}`;
      countParams.push(startDate);
    }

    if (endDate) {
      countParamCount++;
      countQuery += ` AND te.start_time <= $${countParamCount}`;
      countParams.push(endDate);
    }

    const countResult = await query(countQuery, countParams);
    const totalEntries = parseInt(countResult.rows[0].total_entries);
    const totalDuration = parseInt(countResult.rows[0].total_duration);
    const totalPages = Math.ceil(totalEntries / limit);

    res.json({
      success: true,
      data: {
        timeEntries: timeEntriesResult.rows,
        summary: {
          totalEntries,
          totalDuration,
          totalHours: Math.round((totalDuration / 3600) * 100) / 100,
        },
        pagination: {
          currentPage: page,
          totalPages,
          totalEntries,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get time entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time entries',
    });
  }
});

// @route   GET /api/time/active
// @desc    Get active time entry for the user
// @access  Private
router.get('/active', async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await query(`
      SELECT 
        te.*,
        t.title as task_title,
        p.name as project_name,
        p.id as project_id,
        p.color as project_color
      FROM time_entries te
      JOIN tasks t ON te.task_id = t.id
      JOIN projects p ON t.project_id = p.id
      WHERE te.user_id = $1 AND te.end_time IS NULL
      ORDER BY te.start_time DESC
      LIMIT 1
    `, [userId]);

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        data: null, // No active timer
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });

  } catch (error) {
    console.error('Get active time entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active time entry',
    });
  }
});

// @route   POST /api/time/start
// @desc    Start a new time entry (timer)
// @access  Private
router.post('/start', [
  body('task_id').isInt({ min: 1 }).withMessage('Valid task ID is required'),
  body('start_time').optional().isISO8601().withMessage('Start time must be a valid ISO8601 date'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
], handleValidationErrors, checkTaskOwnership, async (req, res) => {
  const client = await getClient();
  try {
    const { task_id, start_time, description } = req.body;
    const userId = req.user.id;

    await client.query('BEGIN');

    // Ensure no other timer is running for this user
    const existingTimer = await client.query(
      'SELECT id FROM time_entries WHERE user_id = $1 AND end_time IS NULL',
      [userId]
    );

    if (existingTimer.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'An active timer is already running. Stop it before starting a new one.',
        data: { active_timer_id: existingTimer.rows[0].id },
      });
    }

    const newTimeEntry = await client.query(`
      INSERT INTO time_entries (user_id, task_id, start_time, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [userId, task_id, start_time || new Date(), description || null]);

    // Update task status to 'in_progress' if it's 'todo'
    await client.query(`
      UPDATE tasks
      SET status = 'in_progress'
      WHERE id = $1 AND status = 'todo'
    `, [task_id]);

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Timer started successfully',
      data: newTimeEntry.rows[0],
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Start time entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start time entry',
    });
  } finally {
    client.release();
  }
});

// @route   POST /api/time/stop
// @desc    Stop the active timer
// @access  Private
router.post('/stop', [
    body('end_time').optional().isISO8601().withMessage('End time must be a valid ISO8601 date'),
], handleValidationErrors, async (req, res) => {
  try {
    const userId = req.user.id;
    const endTime = req.body.end_time ? new Date(req.body.end_time) : new Date();

    // Find the active timer
    const activeTimerResult = await query(
      'SELECT id, start_time FROM time_entries WHERE user_id = $1 AND end_time IS NULL ORDER BY start_time DESC LIMIT 1',
      [userId]
    );

    if (activeTimerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active timer found to stop',
      });
    }

    const activeTimer = activeTimerResult.rows[0];
    const startTime = new Date(activeTimer.start_time);

    // Calculate duration in seconds
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    if (duration < 0) {
        return res.status(400).json({
            success: false,
            message: 'End time cannot be before start time.'
        });
    }

    // Update the time entry
    const updatedTimeEntry = await query(`
      UPDATE time_entries
      SET end_time = $1, duration = $2
      WHERE id = $3
      RETURNING *
    `, [endTime, duration, activeTimer.id]);

    res.json({
      success: true,
      message: 'Timer stopped successfully',
      data: updatedTimeEntry.rows[0],
    });
  } catch (error) {
    console.error('Stop time entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to stop time entry',
    });
  }
});

// @route   PUT /api/time/:id
// @desc    Update a specific time entry
// @access  Private
router.put('/:id', checkResourceOwnership('time_entry'), [
  body('start_time').optional().isISO8601().withMessage('Start time must be a valid ISO8601 date'),
  body('end_time').optional().isISO8601().withMessage('End time must be a valid ISO8601 date'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description must not exceed 500 characters'),
], handleValidationErrors, async (req, res) => {
  try {
    const timeEntryId = req.params.id;
    const { start_time, end_time, description } = req.body;

    const currentEntryResult = await query('SELECT * FROM time_entries WHERE id = $1', [timeEntryId]);
    if (currentEntryResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Time entry not found' });
    }
    const currentEntry = currentEntryResult.rows[0];
    
    const newStartTime = start_time ? new Date(start_time) : new Date(currentEntry.start_time);
    const newEndTime = end_time ? new Date(end_time) : (currentEntry.end_time ? new Date(currentEntry.end_time) : null);
    
    let newDuration = currentEntry.duration;
    if (newEndTime) {
      newDuration = Math.round((newEndTime.getTime() - newStartTime.getTime()) / 1000);
      if (newDuration < 0) {
        return res.status(400).json({ success: false, message: 'End time cannot be before start time.' });
      }
    } else if (currentEntry.end_time !== null) {
      // If end_time is being cleared, set duration to null
      newDuration = null;
    }

    const updatedTimeEntry = await query(`
      UPDATE time_entries
      SET 
        start_time = $1,
        end_time = $2,
        description = $3,
        duration = $4
      WHERE id = $5
      RETURNING *
    `, [newStartTime, newEndTime, description !== undefined ? description : currentEntry.description, newDuration, timeEntryId]);

    res.json({
      success: true,
      message: 'Time entry updated successfully',
      data: updatedTimeEntry.rows[0],
    });
  } catch (error) {
    console.error('Update time entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update time entry',
    });
  }
});

// @route   DELETE /api/time/:id
// @desc    Delete a time entry
// @access  Private
router.delete('/:id', checkResourceOwnership('time_entry'), async (req, res) => {
  try {
    const timeEntryId = req.params.id;

    const result = await query('DELETE FROM time_entries WHERE id = $1 RETURNING *', [timeEntryId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Time entry not found',
      });
    }

    res.json({
      success: true,
      message: 'Time entry deleted successfully',
    });
  } catch (error) {
    console.error('Delete time entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete time entry',
    });
  }
});

module.exports = router;
