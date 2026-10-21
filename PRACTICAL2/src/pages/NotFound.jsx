import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 404 Not Found Component
 * Supplementary problem: Custom error page for unmapped routes
 */
function NotFound() {
  return (
    <div className="card-box" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
      <h1 style={{ fontSize: '4.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>404</h1>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ maxWidth: '480px', margin: '0 auto 2rem', opacity: 0.8 }}>
        The route you are trying to navigate to does not exist in our React Router configuration.
      </p>
      <Link to="/" className="toggle-button" style={{ display: 'inline-block', textDecoration: 'none' }}>
        ← Return to Safe Harbor (Home)
      </Link>
    </div>
  );
}

export default NotFound;
