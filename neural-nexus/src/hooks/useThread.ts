import { useState, useEffect } from 'react';
import type { Thread } from '../models/thread';
import { loadThreads } from '../utils/threadFetcher';

/**
 * Custom hook to load a specific thread by ID
 */
export function useThread(threadId: string | undefined) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!threadId) {
      setError(new Error('Thread ID is required'));
      setLoading(false);
      return;
    }

    try {
      const threads = loadThreads();
      const foundThread = threads.find(t => t.id === Number(threadId));
      
      if (!foundThread) {
        setError(new Error('Thread not found'));
      }
      
      setThread(foundThread || null);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load thread'));
      setLoading(false);
    }
  }, [threadId]);

  return { thread, loading, error };
}
