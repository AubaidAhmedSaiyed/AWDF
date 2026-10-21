import React, { useState } from 'react';

function Projects() {
  const [filter, setFilter] = useState('All');

  const projectData = [
    { id: 1, title: 'Task Flow API', category: 'Backend', tech: 'Node.js, Express, MongoDB', desc: 'Robust RESTful API with token validation and in-memory caching.' },
    { id: 2, title: 'Portfolio SPA', category: 'Frontend', tech: 'React, React Router, Vite', desc: 'Fast client-side single page app with controlled components and theme state.' },
    { id: 3, title: 'Distributed Microservices', category: 'FullStack', tech: 'Docker, Express, React', desc: 'Containerized multi-tier stack orchestrated via Docker Compose.' },
    { id: 4, title: 'AI Assistant Interface', category: 'AI', tech: 'React, Gemini API, Express', desc: 'AI-assisted task management with graceful degradation handling.' }
  ];

  const filteredProjects = filter === 'All'
    ? projectData
    : projectData.filter(p => p.category === filter);

  return (
    <div className="card-box">
      <div className="page-header">
        <h1>Projects Showcase</h1>
        <p>Explore engineering deliverables built across modern web stacks.</p>
      </div>

      {/* Interactive category filter using useState */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Frontend', 'Backend', 'FullStack', 'AI'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="toggle-button"
            style={{
              background: filter === cat ? '#3b82f6' : '#475569',
              padding: '0.35rem 0.85rem'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {filteredProjects.map(project => (
          <div
            key={project.id}
            style={{
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(15, 23, 42, 0.4)'
            }}
          >
            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#3b82f6', color: 'white', fontWeight: 600 }}>
              {project.category}
            </span>
            <h3 style={{ marginTop: '0.75rem', marginBottom: '0.35rem' }}>{project.title}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.85, marginBottom: '0.75rem' }}>{project.desc}</p>
            <p style={{ fontSize: '0.8rem', color: '#38bdf8' }}><strong>Tech:</strong> {project.tech}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
