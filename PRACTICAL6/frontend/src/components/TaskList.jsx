import React from 'react';
import TaskItem from './TaskItem';

/**
 * TaskList Component
 * Displays empty state or maps over tasks collection
 */
function TaskList({ tasks, onToggleStatus, onRequestDelete, busyTaskId }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#94a3b8' }}>
        <p style={{ fontSize: '1.1rem' }}>No tasks found in MongoDB database.</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Create your first task using the form above!</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleStatus={onToggleStatus}
          onRequestDelete={onRequestDelete}
          isBusy={busyTaskId === task._id}
        />
      ))}
    </div>
  );
}

export default TaskList;
