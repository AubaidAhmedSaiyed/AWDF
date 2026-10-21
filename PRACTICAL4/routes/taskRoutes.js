const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateTaskId = require('../middleware/validateTaskId');
const requireJsonContent = require('../middleware/contentTypeValidator');

// GET /tasks - List all tasks
router.get('/', taskController.getAllTasks);

// GET /tasks/:id - Retrieve single task (with ID validation middleware)
router.get('/:id', validateTaskId, taskController.getTaskById);

// POST /tasks - Create task (with JSON content type check)
router.post('/', requireJsonContent, taskController.createTask);

// PUT /tasks/:id - Update task (with ID validation and content type check)
router.put('/:id', validateTaskId, requireJsonContent, taskController.updateTask);

// DELETE /tasks/:id - Delete task (with ID validation)
router.delete('/:id', validateTaskId, taskController.deleteTask);

module.exports = router;
