import { useParams } from 'react-router-dom';
import { useThread } from '../hooks/useThread';
import PageHeader from './PageHeader';
import ThreadCard from './ThreadCard';
import CommentCard from './CommentCard';
import LoadingSpinner from './LoadingSpinner';
import './ThreadComments.css';

function ThreadComments() {
  const { threadId } = useParams<{ threadId: string }>();
  const { thread, loading, error } = useThread(threadId);

  if (loading) {
    return (
      <div className="app">
        <LoadingSpinner message="Loading thread..." />
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="app">
        <PageHeader showBackLink />
        <main className="threads-container">
          <p className="error-message">
            {error?.message || 'Thread not found.'}
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <PageHeader title={thread.title} showBackLink />
      
      <main className="threads-container">
        {/* Thread starter - highlighted */}
        <ThreadCard thread={thread} isStarter />

        {/* Comments section */}
        <div className="comments-section">
          <h3 className="comments-header">
            💬 {thread.comments.length} {thread.comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
          
          {thread.comments.length === 0 ? (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="comments-list">
              {thread.comments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ThreadComments;
