import { useMemo } from 'react';
import type { Thread } from '../models/thread';
import { loadThreads } from '../utils/threadFetcher';

interface UseThreadsResult {
  threads: Thread[];
  error: Error | null;
}

/**
 * Custom hook to load and manage threads data
 */
export function useThreads(): UseThreadsResult {
  const result = useMemo(() => {
    try {
      const data = loadThreads();
      return { threads: data, error: null };
    } catch (err) {
      return { 
        threads: [], 
        error: err instanceof Error ? err : new Error('Failed to load threads') 
      };
    }
  }, []);

  return result;
}
