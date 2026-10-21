import React, { useState, useEffect, useCallback } from 'react';
import Spinner from './Spinner';
import ErrorMessage from './ErrorMessage';
import RepoList from './RepoList';

/**
 * Projects Component
 * Handles asynchronous REST API consumption, loading & error states,
 * dynamic search filtering, and error handling.
 */
function Projects() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [username, setUsername] = useState('facebook');

  // Fetch function memoized with useCallback
  const fetchRepos = useCallback(async (userToFetch = username) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.github.com/users/${userToFetch}/repos?per_page=12&sort=updated`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${userToFetch}" not found (HTTP 404).`);
        } else if (response.status === 403) {
          throw new Error('GitHub API rate limit exceeded (HTTP 403). Please try again shortly.');
        } else {
          throw new Error(`API request failed with HTTP status ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected API response format received.');
      }
      setRepos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  // useEffect triggers fetch on initial component mount
  useEffect(() => {
    fetchRepos(username);
  }, [fetchRepos]);

  // Supplementary problem: Search / filter by repository name
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Control Panel */}
      <div className="controls-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <strong>Active Target:</strong> <code style={{ color: '#38bdf8' }}>github.com/{username}</code>
          </div>
          {/* Quick buttons to demo normal flow vs error flow */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => { setUsername('facebook'); fetchRepos('facebook'); }}
              className="action-btn secondary"
              type="button"
            >
              Load 'facebook'
            </button>
            <button
              onClick={() => { setUsername('google'); fetchRepos('google'); }}
              className="action-btn secondary"
              type="button"
            >
              Load 'google'
            </button>
            <button
              onClick={() => { setUsername('non-existent-user-xyz-999'); fetchRepos('non-existent-user-xyz-999'); }}
              className="action-btn danger"
              type="button"
              title="Test error handling with an invalid user"
            >
              ⚠️ Simulate Error
            </button>
          </div>
        </div>

        {/* Search input (Supplementary problem) */}
        <div className="search-row">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search repositories by name in real time..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => fetchRepos(username)} className="action-btn" type="button">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Conditional Rendering Pipeline */}
      {loading && <Spinner message={`Fetching repositories for "${username}"...`} />}

      {!loading && error && (
        <ErrorMessage message={error} onRetry={() => fetchRepos(username)} />
      )}

      {!loading && !error && (
        <>
          <div style={{ marginBottom: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
            Showing <strong>{filteredRepos.length}</strong> of {repos.length} repositories
          </div>
          <RepoList repos={filteredRepos} />
        </>
      )}
    </div>
  );
}

export default Projects;
