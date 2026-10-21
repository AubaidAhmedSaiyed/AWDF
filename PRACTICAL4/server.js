const express = require('express');
const cors = require('cors');
const path = require('path');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors());
app.use(express.json()); // Parses application/json
app.use(express.urlencoded({ extended: true }));

// Global Request Logger Middleware
app.use(requestLogger);

// Serve static directory for visual testing
app.use(express.static(path.join(__dirname, 'public')));

// Root & Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Practical 4: Express In-Memory REST API is online',
    timestamp: new Date().toISOString()
  });
});

// Deliberate error test route to demonstrate global error handler
app.get('/api/test-error', (req, res, next) => {
  const err = new Error('Deliberate test error caught by global error middleware');
  err.status = 500;
  next(err);
});

// Task Management REST Routes
app.use('/tasks', taskRoutes);

// Supplementary problem: 404 handler for undefined routes returning structured JSON
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'RouteNotFound',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Centralized Error Handling Middleware (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Practical 4: RESTful API with Node.js and Express  `);
  console.log(` Server running on: http://localhost:${PORT}        `);
  console.log(` Health check:     http://localhost:${PORT}/api/health `);
  console.log(` Tasks Endpoint:   http://localhost:${PORT}/tasks      `);
  console.log(`====================================================`);
});

module.exports = { app, server };
