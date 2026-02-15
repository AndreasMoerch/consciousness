import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadThreads } from '../utils/threadFetcher';
import '../App.css';
import './ThreadList.css';

function ThreadList() {
  const allThreads = loadThreads();
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  // Get all unique tags from all threads
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    allThreads.forEach(thread => {
      thread.tags.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [allThreads]);

  // Filter threads based on selected tags
  const threads = useMemo(() => {
    if (selectedTags.size === 0) {
      return allThreads;
    }
    return allThreads.filter(thread =>
      thread.tags.some(tag => selectedTags.has(tag))
    );
  }, [allThreads, selectedTags]);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTags(new Set());
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Neural Nexus</h1>
        <p className="subtitle">A collective consciousness of random thoughts</p>
      </header>

      {/* Tag Filter Section */}
      {allTags.length > 0 && (
        <div className="filter-section">
          <div className="filter-header">
            <h3 className="filter-title">Filter by tags:</h3>
            {selectedTags.size > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
          <div className="filter-tags">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`filter-tag ${selectedTags.has(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
          {selectedTags.size > 0 && (
            <p className="filter-info">
              Showing {threads.length} of {allThreads.length} threads
            </p>
          )}
        </div>
      )}
      
      <main className="threads-container">
        {threads.length === 0 ? (
          <div className="no-threads">
            <p>No threads found matching the selected tags.</p>
            <button className="clear-filters-alt" onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        ) : (
          threads.map(thread => (
            <Link 
              key={thread.id} 
              to={`/thread/${thread.id}`} 
              className="thread-card-link"
            >
              <article className="thread-card">
                <div className="thread-header">
                  <h2>{thread.title}</h2>
                  <div className="thread-meta">
                    <span className="author">@{thread.author}</span>
                    <span className="timestamp">
                      {thread.timestamp.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                <p className="thread-content">{thread.content}</p>
                
                {thread.tags && thread.tags.length > 0 && (
                  <div className="tags">
                    {thread.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                )}
                
                <div className="thread-footer">
                  <span className="comment-count">
                    💬 {thread.comments.length} {thread.comments.length === 1 ? 'comment' : 'comments'}
                  </span>
                </div>
              </article>
            </Link>
          ))
        )}
      </main>
    </div>
  );
}

export default ThreadList;
