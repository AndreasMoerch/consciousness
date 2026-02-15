import { useThreads } from '../hooks/useThreads';
import PageHeader from './PageHeader';
import ThreadCard from './ThreadCard';
import LoadingSpinner from './LoadingSpinner';
import './ThreadList.css';

function ThreadList() {
  const { threads, loading, error } = useThreads();

  if (loading) {
    return (
      <div className="app">
        <LoadingSpinner message="Loading threads..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <PageHeader />
        <main className="threads-container">
          <p className="error-message">Error: {error.message}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <PageHeader 
        title="Neural Nexus" 
        subtitle="A collective consciousness of random thoughts"
      />
      
      <main className="threads-container">
        {threads.length === 0 ? (
          <p className="empty-message">No threads yet. Start the conversation!</p>
        ) : (
          threads.map(thread => (
            <ThreadCard key={thread.id} thread={thread} />
          ))
        )}
      </main>
    </div>
  );
}

export default ThreadList;
