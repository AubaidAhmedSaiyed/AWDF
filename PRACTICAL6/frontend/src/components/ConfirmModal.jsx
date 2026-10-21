import React from 'react';

/**
 * ConfirmModal Component
 * Supplementary problem: Confirmation modal dialog prior to task deletion
 */
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#f87171' }}>
          {title || 'Confirm Action'}
        </h3>
        <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
