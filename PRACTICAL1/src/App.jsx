import React, { useState } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('about');

  // Student Profile Data passed via props
  const studentData = {
    name: 'Aarav Sharma',
    title: 'Computer Science & Engineering Student | Aspiring Full Stack Developer',
    themeColor: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
    bio: 'Enthusiastic web developer specializing in modern JavaScript frameworks, responsive user interfaces, and scalable RESTful backend services. Passionate about clean code, UI/UX design, and component-driven architecture.',
    department: 'B.Tech Information Technology / Computer Engineering',
    university: 'Charotar University of Science and Technology (CHARUSAT)',
    skills: [
      'React.js',
      'JavaScript (ES6+)',
      'Vite',
      'HTML5 & CSS3',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Git & GitHub',
      'REST APIs'
    ],
    email: 'aarav.sharma@example.edu',
    github: 'https://github.com/aaravsharma'
  };

  return (
    <div className="app-container">
      {/* 1. Header with props: name, title, themeColor */}
      <Header
        name={studentData.name}
        title={studentData.title}
        themeColor={studentData.themeColor}
      />

      {/* 2. NavBar with active section highlight */}
      <NavBar
        activeSection={activeSection}
        onSelectSection={(id) => setActiveSection(id)}
      />

      {/* 3. About section */}
      <About
        bio={studentData.bio}
        department={studentData.department}
        university={studentData.university}
      />

      {/* 4. Skills section receiving skillList array prop */}
      <Skills skillList={studentData.skills} />

      {/* 5. Projects section (Post Laboratory / Assignment component) */}
      <Projects />

      {/* 6. Footer section */}
      <Footer
        email={studentData.email}
        github={studentData.github}
        studentName={studentData.name}
      />
    </div>
  );
}

export default App;
