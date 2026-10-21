const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Step 2: Ensure listeners are registered at server startup
require('./listeners');

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Tasks API
app.use('/tasks', taskRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Practical 10 Event-Driven API' });
});

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` Practical 10: Event-Driven Background Processing   `);
  console.log(` Server running on http://localhost:${PORT}         `);
  console.log(`====================================================`);
});

module.exports = { app, server };
