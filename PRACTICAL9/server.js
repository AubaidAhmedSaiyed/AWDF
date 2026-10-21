const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Request logger with timestamps
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Tasks API
app.use('/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Practical 9 Caching API is running' });
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Practical 9: In-Memory Caching with node-cache      `);
  console.log(` Server running on http://localhost:${PORT}         `);
  console.log(`====================================================`);
});

module.exports = { app, server };
