import React from 'react';

/**
 * Header Component
 * Demonstrates props passing (name, title, themeColor) and inline styling
 */
function Header({ name, title, themeColor }) {
  const headerStyle = {
    background: themeColor || 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'
  };

  return (
    <header className="portfolio-header" style={headerStyle} id="header">
      <h1>{name}</h1>
      <p className="subtitle">{title}</p>
    </header>
  );
}

export default Header;
