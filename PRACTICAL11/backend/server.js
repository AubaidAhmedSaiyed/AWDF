const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Practical 11 Backend in Docker' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[DOCKER BACKEND] Running on port ${PORT}`);
});
