import React from 'react';

/**
 * Skills Component
 * Accepts skillList array via props and renders them dynamically
 */
function Skills({ skillList }) {
  return (
    <section className="section-card" id="skills">
      <h2>🛠️ Technical Skills</h2>
      <ul className="skills-grid">
        {skillList && skillList.map((s) => (
          <li key={s} className="skill-pill">
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;
