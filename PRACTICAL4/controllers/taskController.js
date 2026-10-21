/**
 * Task Controller (In-Memory Array Storage for Practical 4)
 */

let tasks = [
  {
    id: 1,
    title: 'Complete Practical 1 & 2',
    description: 'Set up Vite React portfolio and configure routing',
    completed: true,
    createdAt: new Date('2026-10-15T09:00:00Z')
  },
  {
    id: 2,
    title: 'Implement RESTful API in Express',
    description: 'Build CRUD endpoints with request logging and error handling pipeline',
    completed: false,
    createdAt: new Date('2026-10-18T11:30:00Z')
  },
  {
    id: 3,
    title: 'Integrate MongoDB with Mongoose',
    description: 'Prepare schemas, models, and database persistence',
    completed: false,
    createdAt: new Date('2026-10-20T14:00:00Z')
  }
];

let nextId = 4;

// GET /tasks - Retrieve all tasks
const getAllTasks = (req, res) => {
  const { completed } = req.query;
  let result = tasks;

  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    result = result.filter(t => t.completed === isCompleted);
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
};

// GET /tasks/:id - Retrieve single task by id
const getTaskById = (req, res) => {
  const taskId = req.parsedTaskId;
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({
      success: false,
      error: 'TaskNotFound',
      message: `Task with id ${taskId} was not found`
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
};

// POST /tasks - Create a new task
const createTask = (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'ValidationError',
        message: 'Task title is required and cannot be empty'
      });
    }

    const newTask = {
      id: nextId++,
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: typeof completed === 'boolean' ? completed : false,
      createdAt: new Date()
    };

    tasks.push(newTask);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (err) {
    next(err);
  }
};

// PUT /tasks/:id - Update an existing task
const updateTask = (req, res, next) => {
  try {
    const taskId = req.parsedTaskId;
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'TaskNotFound',
        message: `Task with id ${taskId} was not found`
      });
    }

    const { title, description, completed } = req.body;

    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'ValidationError',
          message: 'Task title cannot be empty string'
        });
      }
      tasks[taskIndex].title = title.trim();
    }

    if (description !== undefined) {
      tasks[taskIndex].description = description.trim();
    }

    if (completed !== undefined) {
      tasks[taskIndex].completed = Boolean(completed);
    }

    tasks[taskIndex].updatedAt = new Date();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: tasks[taskIndex]
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /tasks/:id - Delete a task
const deleteTask = (req, res, next) => {
  try {
    const taskId = req.parsedTaskId;
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'TaskNotFound',
        message: `Task with id ${taskId} was not found`
      });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: deletedTask
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
