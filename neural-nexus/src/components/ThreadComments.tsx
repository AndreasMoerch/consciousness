import { useParams, Link } from 'react-router-dom';
import { loadThreads } from '../utils/threadFetcher';
import '../App.css';
import './ThreadComments.css';

function ThreadComments() {
  const { threadId } = useParams<{ threadId: string }>();
  const threads = loadThreads();
  const thread = threads.find(t => t.id === Number(threadId));

  if (!thread) {
    return (
      <div className="app">
        <header className="app-header">
          <Link to="/" className="back-link">← Back to Neural Nexus</Link>
        </header>
        <main className="threads-container">
          <p>Thread not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="back-link">← Back to Neural Nexus</Link>
        <h1>{thread.title}</h1>
      </header>
      
      <main className="threads-container">
        {/* Thread starter - highlighted */}
        <article className="thread-card thread-starter">
          <div className="thread-header">
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
        </article>

        {/* Comments section */}
        <div className="comments-section">
          <h3 className="comments-header">
            💬 {thread.comments.length} {thread.comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
          
          {thread.comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            thread.comments.map(comment => (
              <article key={comment.id} className="comment-card">
                <div className="comment-header">
                  <span className="author">@{comment.author}</span>
                  <span className="timestamp">
                    {comment.timestamp.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <p className="comment-content">{comment.content}</p>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default ThreadComments;
