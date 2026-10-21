import React from 'react';

/**
 * Spinner Component
 * Displayed while asynchronous API request is pending
 */
function Spinner({ message = 'Fetching repositories from GitHub API...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ color: '#94a3b8', fontWeight: 500 }}>{message}</p>
    </div>
  );
}

export default Spinner;
