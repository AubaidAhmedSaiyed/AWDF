import React from 'react';

/**
 * RepoList Component
 * Renders repositories with name, html_url, and star count badges
 */
function RepoList({ repos }) {
  if (!repos || repos.length === 0) {
    return (
      <div className="empty-state">
        <h3>No repositories found</h3>
        <p style={{ marginTop: '0.5rem' }}>Try adjusting your search query above.</p>
      </div>
    );
  }

  return (
    <div className="repo-grid">
      {repos.map((repo) => (
        <div key={repo.id} className="repo-card">
          <div>
            <div className="repo-header">
              <span className="repo-name">{repo.name}</span>
              {/* Star count display (Supplementary Problem) */}
              <span className="star-badge">
                ⭐ {repo.stargazers_count || 0}
              </span>
            </div>
            <p className="repo-desc">
              {repo.description || 'No description provided.'}
            </p>
          </div>

          <div className="repo-meta">
            <span className="repo-lang">
              {repo.language ? `🔹 ${repo.language}` : '🔹 Other'}
            </span>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 600 }}
            >
              View on GitHub →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RepoList;
