const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, getClient } = require('../config/database');
const { authenticateToken, checkResourceOwnership } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation middleware
const taskValidation = [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Task title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'completed'])
    .withMessage('Status must be todo, in_progress, or completed'),
  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO8601 date'),
  body('project_id')
    .isInt({ min: 1 })
    .withMessage('Valid project ID is required'),
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

// Middleware to check if user owns the project
const checkProjectOwnership = async (req, res, next) => {
  try {
    const projectId = req.body.project_id || req.query.project_id;
    const userId = req.user.id;

    if (!projectId) {
      return next();
    }

    const result = await query(
      'SELECT user_id FROM projects WHERE id = $1',
      [projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
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
    console.error('Project ownership check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify project ownership',
    });
  }
};

// @route   GET /api/tasks
// @desc    Get tasks (optionally filtered by project)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const projectId = req.query.project_id;
    const status = req.query.status;
    const priority = req.query.priority;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let queryText = `
      SELECT 
        t.*,
        p.name as project_name,
        p.color as project_color,
        COALESCE(SUM(te.duration), 0) as total_time_spent
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN time_entries te ON t.id = te.task_id
      WHERE p.user_id = $1
    `;
    
    const queryParams = [userId];
    let paramCount = 1;

    if (projectId) {
      paramCount++;
      queryText += ` AND t.project_id = $${paramCount}`;
      queryParams.push(projectId);
    }

    if (status) {
      paramCount++;
      queryText += ` AND t.status = $${paramCount}`;
      queryParams.push(status);
    }

    if (priority) {
      paramCount++;
      queryText += ` AND t.priority = $${paramCount}`;
      queryParams.push(priority);
    }

    queryText += `
      GROUP BY t.id, p.name, p.color
      ORDER BY 
        CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END,
        CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 END,
        t.due_date ASC NULLS LAST,
        t.created_at DESC
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);

    const tasksResult = await query(queryText, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT t.id) 
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      WHERE p.user_id = $1
    `;
    const countParams = [userId];
    let countParamCount = 1;

    if (projectId) {
      countParamCount++;
      countQuery += ` AND t.project_id = $${countParamCount}`;
      countParams.push(projectId);
    }

    if (status) {
      countParamCount++;
      countQuery += ` AND t.status = $${countParamCount}`;
      countParams.push(status);
    }

    if (priority) {
      countParamCount++;
      countQuery += ` AND t.priority = $${countParamCount}`;
      countParams.push(priority);
    }

    const countResult = await query(countQuery, countParams);
    const totalTasks = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalTasks / limit);

    res.json({
      success: true,
      data: {
        tasks: tasksResult.rows.map(task => ({
          ...task,
          total_time_spent: parseInt(task.total_time_spent),
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalTasks,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task
// @access  Private
router.get('/:id', checkResourceOwnership('task'), async (req, res) => {
  try {
    const taskId = req.params.id;

    const taskResult = await query(`
      SELECT 
        t.*,
        p.name as project_name,
        p.color as project_color,
        COALESCE(SUM(te.duration), 0) as total_time_spent,
        COUNT(te.id) as time_entries_count
      FROM tasks t
      JOIN projects p ON t.project_id = p.id
      LEFT JOIN time_entries te ON t.id = te.task_id
      WHERE t.id = $1
      GROUP BY t.id, p.name, p.color
    `, [taskId]);

    if (taskResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    const task = taskResult.rows[0];

    res.json({
      success: true,
      data: {
        ...task,
        total_time_spent: parseInt(task.total_time_spent),
        time_entries_count: parseInt(task.time_entries_count),
      },
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task',
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', taskValidation, handleValidationErrors, checkProjectOwnership, async (req, res) => {
  try {
    const { title, description, priority, status, due_date, project_id } = req.body;

    const newTask = await query(`
      INSERT INTO tasks (project_id, title, description, priority, status, due_date) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *
    `, [
      project_id,
      title,
      description || null,
      priority || 'medium',
      status || 'todo',
      due_date || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask.rows[0],
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', checkResourceOwnership('task'), async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, priority, status, due_date } = req.body;

    // Handle task completion
    let completedAt = null;
    if (status === 'completed') {
      // Check if task wasn't already completed
      const currentTask = await query('SELECT status FROM tasks WHERE id = $1', [taskId]);
      if (currentTask.rows[0]?.status !== 'completed') {
        completedAt = new Date();
      }
    }

    const updateFields = [];
    const values = [];
    let paramCount = 0;

    if (title !== undefined) {
      paramCount++;
      updateFields.push(`title = $${paramCount}`);
      values.push(title);
    }

    if (description !== undefined) {
      paramCount++;
      updateFields.push(`description = $${paramCount}`);
      values.push(description);
    }

    if (priority !== undefined) {
      paramCount++;
      updateFields.push(`priority = $${paramCount}`);
      values.push(priority);
    }

    if (status !== undefined) {
      paramCount++;
      updateFields.push(`status = $${paramCount}`);
      values.push(status);
      
      if (completedAt) {
        paramCount++;
        updateFields.push(`completed_at = $${paramCount}`);
        values.push(completedAt);
      } else if (status !== 'completed') {
        paramCount++;
        updateFields.push(`completed_at = $${paramCount}`);
        values.push(null);
      }
    }

    if (due_date !== undefined) {
      paramCount++;
      updateFields.push(`due_date = $${paramCount}`);
      values.push(due_date);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update',
      });
    }

    paramCount++;
    updateFields.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    paramCount++;
    values.push(taskId);

    const queryText = `
      UPDATE tasks 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const updatedTask = await query(queryText, values);

    if (updatedTask.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask.rows[0],
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', checkResourceOwnership('task'), async (req, res) => {
  const client = await getClient();
  
  try {
    const taskId = req.params.id;
    
    await client.query('BEGIN');

    // Delete associated time entries first
    await client.query('DELETE FROM time_entries WHERE task_id = $1', [taskId]);

    // Delete the task
    const result = await client.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
    });
  } finally {
    client.release();
  }
});

module.exports = router;
