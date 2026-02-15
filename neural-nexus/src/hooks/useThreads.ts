import { useState, useEffect } from 'react';
import type { Thread } from '../models/thread';
import { loadThreads } from '../utils/threadFetcher';

/**
 * Custom hook to load and manage threads data
 */
export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const data = loadThreads();
      setThreads(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load threads'));
      setLoading(false);
    }
  }, []);

  return { threads, loading, error };
}
