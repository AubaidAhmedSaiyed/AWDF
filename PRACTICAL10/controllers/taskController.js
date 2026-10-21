const Task = require('../models/Task');
const taskEvents = require('../events');

// GET /tasks - List all tasks
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// Step 3: POST /tasks - Emit event right after sending response immediately
const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedUser } = req.body;
    const task = await Task.create({
      title,
      description: description || '',
      assignedUser: assignedUser || 'Student'
    });

    const responseTimestamp = new Date().toISOString();
    console.log(`[API] Response sent at ${responseTimestamp}`);

    // Respond immediately to client (HTTP 201)
    res.status(201).json({
      message: 'Task created successfully',
      task,
      apiTimestamp: responseTimestamp
    });

    // Emit event asynchronously for background handling
    taskEvents.emit('task-created', task);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask
};
