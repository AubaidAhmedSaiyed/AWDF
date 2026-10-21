const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Step 1: Install and configure CORS on Express backend
app.use(cors({
  origin: '*', // Allow requests from React dev server (http://localhost:5173)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Practical 6: Full Stack MERN Task Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Task REST Routes
app.use('/tasks', taskRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Practical 6 Backend running on http://localhost:${PORT}`);
  console.log(` Tasks Endpoint: http://localhost:${PORT}/tasks     `);
  console.log(` Health Check:   http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

module.exports = { app, server };
