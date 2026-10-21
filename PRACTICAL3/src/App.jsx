import React from 'react';
import Projects from './components/Projects';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="header-banner">
        <h1>Practical 3: GitHub API Data Explorer</h1>
        <p>Demonstrating asynchronous data fetching, loading spinners, and error boundary handling</p>
      </header>

      <main>
        <Projects />
      </main>
    </div>
  );
}

export default App;
