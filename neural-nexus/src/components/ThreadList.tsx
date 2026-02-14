import { Link } from 'react-router-dom';
import { loadThreads } from '../utils/threadFetcher';
import '../App.css';

function ThreadList() {
  const threads = loadThreads();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Neural Nexus</h1>
        <p className="subtitle">A collective consciousness of random thoughts</p>
      </header>
      
      <main className="threads-container">
        {threads.map(thread => (
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
        ))}
      </main>
    </div>
  );
}

export default ThreadList;
