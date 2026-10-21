const Task = require('../models/Task');
const cache = require('../config/cache');

// Step 3: GET /tasks with in-memory caching check
const getTasks = async (req, res, next) => {
  try {
    const bypassCache = req.query.nocache === 'true';

    if (!bypassCache) {
      const cached = cache.get('all_tasks');
      if (cached) {
        console.log('[CACHE] HIT - Returning tasks from in-memory cache');
        return res.status(200).json({ source: 'cache', data: cached });
      }
    }

    console.log('[CACHE] MISS - Querying MongoDB database');
    const tasks = await Task.find();

    if (!bypassCache) {
      cache.set('all_tasks', tasks);
      console.log('[CACHE] SET - Stored tasks in cache for 60s');
    }

    res.status(200).json({ source: 'database', data: tasks });
  } catch (err) {
    next(err);
  }
};

// Step 4: POST /tasks - Invalidate cache on write
const createTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.create({
      title,
      description: description || '',
      completed: completed || false
    });

    // Invalidate cache
    cache.del('all_tasks');
    console.log("[CACHE] INVALIDATED - 'all_tasks' key removed on POST");

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    next(err);
  }
};

// Step 4: PUT /tasks/:id - Invalidate cache on write
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Invalidate cache
    cache.del('all_tasks');
    console.log("[CACHE] INVALIDATED - 'all_tasks' key removed on PUT");

    res.status(200).json({ message: 'Task updated', task });
  } catch (err) {
    next(err);
  }
};

// Step 4: DELETE /tasks/:id - Invalidate cache on write
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Invalidate cache
    cache.del('all_tasks');
    console.log("[CACHE] INVALIDATED - 'all_tasks' key removed on DELETE");

    res.status(200).json({ message: 'Task deleted', task });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
