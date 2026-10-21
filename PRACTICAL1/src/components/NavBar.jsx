import React from 'react';

/**
 * NavBar Component
 * Supplementary feature: Navigation bar that highlights the active section
 */
function NavBar({ activeSection, onSelectSection }) {
  const sections = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'footer', label: 'Contact' }
  ];

  return (
    <nav className="navbar">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`nav-link ${activeSection === section.id ? 'active' : ''}`}
          onClick={() => onSelectSection(section.id)}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}

export default NavBar;
