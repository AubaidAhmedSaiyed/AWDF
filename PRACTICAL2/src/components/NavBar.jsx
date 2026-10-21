import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * NavBar Component using React Router NavLink
 * Prevents full-page reloads and provides theme toggle
 */
function NavBar({ isDark, onToggleTheme }) {
  return (
    <header className="navbar-header">
      <div className="brand-title">Portfolio SPA</div>
      
      <nav className="navbar-nav">
        <NavLink
          to="/"
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
        >
          Projects
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
        >
          Contact
        </NavLink>
      </nav>

      {/* Dark/Light mode toggle button (useState driven) */}
      <button
        onClick={onToggleTheme}
        className="theme-toggle-btn"
        title="Toggle Theme"
        type="button"
      >
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}

export default NavBar;
