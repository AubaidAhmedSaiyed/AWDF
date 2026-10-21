import React from 'react';

/**
 * Projects Component
 * Student Assignment: Renders a list of projects with tags and descriptions
 */
function Projects({ projects }) {
  const defaultProjects = [
    {
      id: 1,
      title: 'Online Task Manager',
      description: 'MERN stack task management tool with CRUD operations and user authentication.',
      tags: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Real-Time Chat App',
      description: 'Socket.IO powered messaging room with instant notification delivery.',
      tags: ['WebSockets', 'Express', 'React']
    },
    {
      id: 3,
      title: 'Dev Portfolio Hub',
      description: 'Modern developer portfolio built with Vite, React, and modular components.',
      tags: ['Vite', 'React', 'CSS3']
    }
  ];

  const projectList = projects || defaultProjects;

  return (
    <section className="section-card" id="projects">
      <h2>🚀 Featured Projects</h2>
      <div className="projects-grid">
        {projectList.map((project) => (
          <div key={project.id} className="project-item">
            <div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;
