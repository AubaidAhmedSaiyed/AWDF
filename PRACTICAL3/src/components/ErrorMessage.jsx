import React from 'react';

/**
 * ErrorMessage Component
 * Displays error details and includes a Retry button (Supplementary problem)
 */
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-title">⚠️ Failed to Load Data</div>
      <p className="error-message">
        {message || 'An unexpected error occurred while communicating with the REST API.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="action-btn">
          🔄 Retry Request
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
