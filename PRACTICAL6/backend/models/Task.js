const mongoose = require('mongoose');

// Task Schema as specified in Practical 5 & 6 Problem Definition:
// title (String, required), description (String), completed (Boolean, default false), createdAt (Date, default Date.now)
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
