import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks on mount
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create task (POST /tasks)
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const newTask = await createTask({ title, description, completed: false });
      setTasks((prev) => [...prev, newTask]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(`Failed to create task: ${err.message}`);
    }
  };

  // Update task completion (PUT /tasks/:id)
  const handleToggle = async (id, currentStatus) => {
    try {
      const updated = await updateTask(id, { completed: !currentStatus });
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch (err) {
      setError(`Failed to update task: ${err.message}`);
    }
  };

  // Delete task (DELETE /tasks/:id)
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(`Failed to delete task: ${err.message}`);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Practical 6: Task Management Full Stack App</h1>
        <p>React Frontend + Express Backend + MongoDB</p>
      </header>

      {/* Task Creation Form */}
      <div className="card">
        <h2>Add Task</h2>
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Task</button>
        </form>
      </div>

      {/* Loading & Error States */}
      {loading && <p>Loading tasks from database...</p>}
      {error && <p style={{ color: '#ef4444' }}>Error: {error}</p>}

      {/* Task List */}
      <div className="card">
        <h2>Task List ({tasks.length})</h2>
        {tasks.length === 0 && !loading ? (
          <p>No tasks yet. Create one above!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggle(task._id, task.completed)}
                  />
                  <div>
                    <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                      {task.title}
                    </strong>
                    {task.description && <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{task.description}</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(task._id)} className="btn btn-danger">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
