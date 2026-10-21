import React from 'react';

function Home() {
  return (
    <div className="card-box">
      <div className="page-header">
        <h1>Welcome to My Engineering Portfolio</h1>
        <p>A reactive single page application engineered with React Router v6 and useState hooks.</p>
      </div>

      <div style={{ marginTop: '1.5rem', lineHeight: '1.8' }}>
        <h3 style={{ color: '#38bdf8', marginBottom: '0.5rem' }}>About This Practical</h3>
        <p>
          This application demonstrates client-side routing (Single Page Application - SPA) architecture.
          When clicking navigation links, React Router intercepts browser history updates and swaps route views dynamically without triggering a traditional HTTP GET roundtrip or full-page blank flash.
        </p>

        <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <strong>Client-Side Routing</strong>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.85 }}>Instantaneous view swaps with <code>react-router-dom</code>.</p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
            <strong>Reactive State</strong>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.85 }}>Real-time updates via <code>useState</code> hooks.</p>
          </div>
          <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <strong>Theme Switching</strong>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', opacity: 0.85 }}>Global state-driven Dark / Light mode toggle.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
