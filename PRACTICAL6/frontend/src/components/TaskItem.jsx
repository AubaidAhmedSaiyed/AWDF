import React, { useState } from 'react';

/**
 * TaskItem Component
 * Renders individual task row with toggle status and delete trigger
 */
function TaskItem({ task, onToggleStatus, onRequestDelete, isBusy }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) return;
    await onToggleStatus(task._id, { title: editTitle.trim() });
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : 'pending'}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleStatus(task._id, { completed: !task.completed })}
          disabled={isBusy}
          style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
        />

        <div style={{ flex: 1 }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <input
                type="text"
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ padding: '0.35rem 0.6rem' }}
              />
              <button onClick={handleSaveEdit} className="btn btn-success" style={{ padding: '0.35rem 0.75rem' }}>
                Save
              </button>
              <button onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem' }}>
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className={`task-title ${task.completed ? 'done' : ''}`}>
                  {task.title}
                </span>
                <span className={`badge badge-${task.priority || 'medium'}`}>
                  {task.priority || 'medium'}
                </span>
              </div>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="task-actions">
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            disabled={isBusy}
          >
            ✏️ Edit
          </button>
        )}
        <button
          onClick={() => onRequestDelete(task)}
          className="btn btn-danger"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          disabled={isBusy}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
