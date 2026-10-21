import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import './App.css';

// Step 3: Convert route imports to lazy imports
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <div className="container">
      <header style={{ marginBottom: '1rem' }}>
        <h2>Practical 8: Lazy Loading & Code Splitting</h2>
        <p style={{ color: '#94a3b8' }}>Route-based code splitting using React.lazy() and Suspense</p>
      </header>

      <NavBar />

      {/* Step 4: Wrap Routes with Suspense and a fallback */}
      <Suspense fallback={<div className="loading-fallback">⚡ Loading page chunk...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
