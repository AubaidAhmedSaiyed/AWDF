const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory tasks for CI/CD test demo
let tasks = [
  { id: 1, title: 'Set up GitHub Actions Workflow', completed: true },
  { id: 2, title: 'Write automated unit and integration tests', completed: true }
];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CI/CD pipeline test service' });
});

// GET /tasks
app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = { id: tasks.length + 1, title, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

module.exports = app;
