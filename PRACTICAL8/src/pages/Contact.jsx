import React, { useState } from 'react';

function Contact() {
  const [message, setMessage] = useState('');

  return (
    <div className="card">
      <h1>Contact Page (Lazy Loaded Chunk)</h1>
      <p>Loaded as a separate async JavaScript chunk.</p>
      <div style={{ marginTop: '1rem' }}>
        <textarea
          rows="3"
          placeholder="Type feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', background: '#0f172a', color: 'white', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
}

export default Contact;
