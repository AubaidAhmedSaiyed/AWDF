import React, { useState } from 'react';

/**
 * Contact Component
 * Demonstrates:
 * 1. Controlled form input tied to useState
 * 2. Live character counter (Supplementary problem)
 * 3. Real-time preview of user input
 * 4. Second useState variable toggling UI visibility (Help Tooltip)
 */
function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MAX_CHARS = 250;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="card-box">
      <div className="page-header">
        <h1>Contact & Feedback</h1>
        <p>Demonstrating controlled inputs and UI state management in React.</p>
      </div>

      {/* Visibility Toggle Feature (useState variable #1 for UI toggle) */}
      <div className="tooltip-trigger-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Need assistance with this form?</strong></span>
          <button
            type="button"
            className="toggle-button"
            onClick={() => setShowHelp((prev) => !prev)}
          >
            {showHelp ? 'Hide Form Guide' : 'Show Form Guide'}
          </button>
        </div>

        {showHelp && (
          <div className="help-box">
            💡 <strong>Help Tip:</strong> Every keystroke in the fields below triggers a state update via <code>onChange</code>. React maintains single source of truth within component state without querying DOM values.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
        <div className="form-group">
          <label htmlFor="name-input">Full Name</label>
          <input
            id="name-input"
            type="text"
            className="form-control"
            placeholder="e.g., Aarav Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email-input">Email Address</label>
          <input
            id="email-input"
            type="email"
            className="form-control"
            placeholder="e.g., aarav.sharma@example.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Controlled textarea input tied to useState (variable #2) */}
        <div className="form-group">
          <label htmlFor="message-input">Your Message / Feedback</label>
          <textarea
            id="message-input"
            rows="4"
            className="form-control"
            placeholder="Type your message here to observe real-time state synchronization..."
            value={message}
            maxLength={MAX_CHARS}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          {/* Supplementary problem: Live character count */}
          <div className="live-char-count">
            <span>{message.length}</span> / {MAX_CHARS} characters
          </div>
        </div>

        <button type="submit" className="toggle-button" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
          Send Message
        </button>
      </form>

      {/* Confirmation notification */}
      {submitted && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#10b981', color: 'white', borderRadius: '6px' }}>
          ✅ Thank you, {name || 'visitor'}! Your message has been captured in local state.
        </div>
      )}

      {/* Real-time controlled input preview box */}
      <div className="live-preview-box">
        <h3>⚡ Real-Time Controlled State Preview</h3>
        <p><strong>Name:</strong> {name || <em style={{ opacity: 0.6 }}>Awaiting input...</em>}</p>
        <p><strong>Email:</strong> {email || <em style={{ opacity: 0.6 }}>Awaiting input...</em>}</p>
        <p><strong>Live Message:</strong> {message || <em style={{ opacity: 0.6 }}>Awaiting message text...</em>}</p>
      </div>
    </div>
  );
}

export default Contact;
