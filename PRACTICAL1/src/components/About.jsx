import React from 'react';

/**
 * About Component
 * Renders short bio text and academic background
 */
function About({ bio, department, university }) {
  return (
    <section className="section-card" id="about">
      <h2>👤 About Me</h2>
      <p>{bio}</p>
      <div style={{ marginTop: '1rem', color: '#94a3b8', fontSize: '0.95rem' }}>
        <p><strong>Department:</strong> {department}</p>
        <p><strong>Institution:</strong> {university}</p>
      </div>
    </section>
  );
}

export default About;
