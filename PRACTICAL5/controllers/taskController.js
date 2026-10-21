const Task = require('../models/Task');

// @desc    Get all tasks (with optional filtering by completed & priority)
// @route   GET /tasks
exports.getTasks = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }

    if (req.query.priority) {
      filter.priority = req.query.priority.toLowerCase();
    }

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: 'i' };
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single task by ID
// @route   GET /tasks/:id
exports.getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'NotFoundError',
        message: `Task not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new task
// @route   POST /tasks
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      completed,
      priority
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a task by ID
// @route   PUT /tasks/:id
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    // runValidators: true ensures schema validation runs during update
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, priority },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'NotFoundError',
        message: `Task not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task by ID
// @route   DELETE /tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'NotFoundError',
        message: `Task not found with ID: ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: task._id, title: task.title }
    });
  } catch (err) {
    next(err);
  }
};
