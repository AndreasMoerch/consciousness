import type { Comment } from '../models/thread';
import { formatRelativeDate } from '../utils/dateUtils';
import './CommentCard.css';

interface CommentCardProps {
  comment: Comment;
}

function CommentCard({ comment }: CommentCardProps) {
  return (
    <article className="comment-card">
      <div className="comment-header">
        <span className="author">@{comment.author}</span>
        <span className="timestamp">{formatRelativeDate(comment.timestamp)}</span>
      </div>
      <p className="comment-content">{comment.content}</p>
    </article>
  );
}

export default CommentCard;
