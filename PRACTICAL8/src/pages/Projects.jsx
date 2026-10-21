import React from 'react';

// Large dataset to demonstrate chunk size difference when lazy-loaded
const sampleProjects = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Enterprise Project ${i + 1}`,
  description: `Detailed project description and documentation for module ${i + 1}. Contains simulation data payload for bundle analysis.`
}));

function Projects() {
  return (
    <div className="card">
      <h1>Projects Page (Lazy Loaded Chunk)</h1>
      <p>This component and its dependencies were downloaded on-demand only when /projects was requested.</p>
      <div style={{ marginTop: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
        {sampleProjects.map((p) => (
          <div key={p.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #334155' }}>
            <strong>{p.name}</strong>: {p.description}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
