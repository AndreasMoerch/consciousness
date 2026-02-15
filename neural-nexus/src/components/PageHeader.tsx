import { Link } from 'react-router-dom';
import './PageHeader.css';

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  showBackLink?: boolean;
}

function PageHeader({ title = 'Neural Nexus', subtitle, showBackLink = false }: PageHeaderProps) {
  return (
    <header className="page-header">
      {showBackLink && (
        <Link to="/" className="back-link">
          ← Back to Neural Nexus
        </Link>
      )}
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
    </header>
  );
}

export default PageHeader;
