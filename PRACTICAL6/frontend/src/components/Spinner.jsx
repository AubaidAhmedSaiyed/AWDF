import React from 'react';

function Spinner({ message = 'Loading...' }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(56, 189, 248, 0.2)',
        borderLeftColor: '#38bdf8',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        margin: '0 auto 0.75rem'
      }}></div>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{message}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Spinner;
