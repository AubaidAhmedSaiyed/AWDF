import React, { useState } from 'react';

/**
 * TaskForm Component
 * Supports creating new tasks with title, description, and priority level
 */
function TaskForm({ onCreateTask, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const success = await onCreateTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false
    });

    if (success) {
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">➕ Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              Task Title *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., Complete Practical 6 Integration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              Priority Level
            </label>
            <select
              className="form-control"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', color: '#94a3b8' }}>
            Description (Optional)
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Add specific details or instructions..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !title.trim()}
        >
          {isSubmitting ? 'Saving to MongoDB...' : 'Save Task to Database'}
        </button>
      </form>
    </div>
  );
}

export default TaskForm;
