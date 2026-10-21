import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import './App.css';

// Baseline: All routes loaded statically upfront
function App() {
  return (
    <div className="container">
      <header style={{ marginBottom: '1rem' }}>
        <h2>Practical 8: Baseline (No Code Splitting)</h2>
      </header>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default App;
