const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, getClient } = require('../config/database');
const { authenticateToken, checkResourceOwnership } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation middleware
const projectValidation = [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Project name must be between 1 and 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('color')
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage('Color must be a valid hex color code'),
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

// @route   GET /api/projects
// @desc    Get all projects for the authenticated user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get projects with task counts
    const projectsResult = await query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.color,
        p.created_at,
        p.updated_at,
        COUNT(t.id) as task_count,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.user_id = $1
      GROUP BY p.id, p.name, p.description, p.color, p.created_at, p.updated_at
      ORDER BY p.updated_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    // Get total count for pagination
    const countResult = await query(
      'SELECT COUNT(*) FROM projects WHERE user_id = $1',
      [userId]
    );

    const totalProjects = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalProjects / limit);

    res.json({
      success: true,
      data: {
        projects: projectsResult.rows.map(project => ({
          ...project,
          task_count: parseInt(project.task_count),
          completed_tasks: parseInt(project.completed_tasks),
        })),
        pagination: {
          currentPage: page,
          totalPages,
          totalProjects,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get a specific project
// @access  Private
router.get('/:id', checkResourceOwnership('project'), async (req, res) => {
  try {
    const projectId = req.params.id;

    const projectResult = await query(`
      SELECT 
        p.*,
        COUNT(t.id) as task_count,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN t.due_date < NOW() AND t.status != 'completed' THEN 1 END) as overdue_tasks
      FROM projects p
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE p.id = $1
      GROUP BY p.id
    `, [projectId]);

    if (projectResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const project = projectResult.rows[0];

    res.json({
      success: true,
      data: {
        ...project,
        task_count: parseInt(project.task_count),
        completed_tasks: parseInt(project.completed_tasks),
        in_progress_tasks: parseInt(project.in_progress_tasks),
        overdue_tasks: parseInt(project.overdue_tasks),
      },
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', projectValidation, handleValidationErrors, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const userId = req.user.id;

    const newProject = await query(
      'INSERT INTO projects (user_id, name, description, color) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, description || null, color || '#3B82F6']
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: newProject.rows[0],
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', checkResourceOwnership('project'), projectValidation, handleValidationErrors, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, color } = req.body;

    const updatedProject = await query(
      'UPDATE projects SET name = $1, description = $2, color = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [name, description || null, color || '#3B82F6', projectId]
    );

    if (updatedProject.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject.rows[0],
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', checkResourceOwnership('project'), async (req, res) => {
  const client = await getClient();
  
  try {
    const projectId = req.params.id;
    
    await client.query('BEGIN');

    // Delete associated time entries first
    await client.query(`
      DELETE FROM time_entries 
      WHERE task_id IN (
        SELECT id FROM tasks WHERE project_id = $1
      )
    `, [projectId]);

    // Delete associated tasks
    await client.query('DELETE FROM tasks WHERE project_id = $1', [projectId]);

    // Delete the project
    const result = await client.query('DELETE FROM projects WHERE id = $1 RETURNING *', [projectId]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
    });
  } finally {
    client.release();
  }
});

module.exports = router;
