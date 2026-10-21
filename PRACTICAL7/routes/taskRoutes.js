const express = require('express');
const router = express.Router();
const { getTasks, createTask, deleteTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { validateTaskInput } = require('../middleware/validateInput');

// Step 6: Apply the auth middleware to all task routes
router.use(auth);

// Step 7: Apply validation middleware to ensure required fields exist
router.get('/', getTasks);
router.post('/', validateTaskInput, createTask);
router.delete('/:id', deleteTask);

module.exports = router;
