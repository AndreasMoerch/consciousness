import './TagList.css';

interface TagListProps {
  tags: string[];
}

function TagList({ tags }: TagListProps) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className="tag-list">
      {tags.map(tag => (
        <span key={tag} className="tag">
          #{tag}
        </span>
      ))}
    </div>
  );
}

export default TagList;
