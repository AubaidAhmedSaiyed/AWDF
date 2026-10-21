import React from 'react';

/**
 * Footer Component
 * Displays contact info, github link, and dynamic copyright details
 */
function Footer({ email, github, studentName }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="portfolio-footer" id="footer">
      <p>📬 Get in touch: <a href={`mailto:${email}`} style={{ color: '#38bdf8' }}>{email}</a> | GitHub: <a href={github} target="_blank" rel="noreferrer" style={{ color: '#38bdf8' }}>{github}</a></p>
      <p style={{ marginTop: '0.5rem' }}>
        &copy; {currentYear} {studentName}. Built with React & Vite. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
