import { Link } from 'react-router-dom';
import type { Thread } from '../models/thread';
import TagList from './TagList';
import { formatRelativeDate } from '../utils/dateUtils';
import './ThreadCard.css';

interface ThreadCardProps {
  thread: Thread;
  isStarter?: boolean;
}

function ThreadCard({ thread, isStarter = false }: ThreadCardProps) {
  const cardContent = (
    <article className={`thread-card ${isStarter ? 'thread-starter' : ''}`}>
      {!isStarter && (
        <div className="thread-header">
          <h2 className="thread-title">{thread.title}</h2>
          <div className="thread-meta">
            <span className="author">@{thread.author}</span>
            <span className="timestamp">{formatRelativeDate(thread.timestamp)}</span>
          </div>
        </div>
      )}
      
      {isStarter && (
        <div className="thread-meta">
          <span className="author">@{thread.author}</span>
          <span className="timestamp">{formatRelativeDate(thread.timestamp)}</span>
        </div>
      )}
      
      <p className="thread-content">{thread.content}</p>
      
      <TagList tags={thread.tags} />
      
      {!isStarter && (
        <div className="thread-footer">
          <span className="comment-count">
            💬 {thread.comments.length} {thread.comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>
      )}
    </article>
  );

  return isStarter ? (
    cardContent
  ) : (
    <Link to={`/thread/${thread.id}`} className="thread-card-link">
      {cardContent}
    </Link>
  );
}

export default ThreadCard;
