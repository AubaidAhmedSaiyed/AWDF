const Task = require('../models/Task');

// GET /tasks - Protected route: Retrieve all tasks
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// POST /tasks - Protected route: Create a task for authenticated user
const createTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.create({
      title,
      description: description || '',
      completed: completed || false,
      user: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /tasks/:id - Protected route: Delete task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    res.status(200).json({ message: 'Task deleted successfully', task });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask
};
