const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Body parser & CORS middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/tasks', taskRoutes);

// Health check / API Info endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Practical 5: MongoDB & Mongoose Task API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'RouteNotFound',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Global Error Handler Middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Practical 5: MongoDB Integration & Schema Design   `);
  console.log(` Server running on: http://localhost:${PORT}        `);
  console.log(` Health check:     http://localhost:${PORT}/api/health `);
  console.log(` Tasks API:        http://localhost:${PORT}/tasks      `);
  console.log(`====================================================`);
});

module.exports = { app, server };
