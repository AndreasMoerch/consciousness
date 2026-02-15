import { useMemo } from 'react';
import type { Thread } from '../models/thread';
import { loadThreads } from '../utils/threadFetcher';

interface UseThreadResult {
  thread: Thread | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Custom hook to load a specific thread by ID
 */
export function useThread(threadId: string | undefined): UseThreadResult {
  const result = useMemo(() => {
    if (!threadId) {
      return { 
        thread: null, 
        loading: false, 
        error: new Error('Thread ID is required') 
      };
    }

    try {
      const threads = loadThreads();
      const foundThread = threads.find(t => t.id === Number(threadId));
      
      if (!foundThread) {
        return { 
          thread: null, 
          loading: false, 
          error: new Error('Thread not found') 
        };
      }
      
      return { thread: foundThread, loading: false, error: null };
    } catch (err) {
      return { 
        thread: null, 
        loading: false, 
        error: err instanceof Error ? err : new Error('Failed to load thread') 
      };
    }
  }, [threadId]);

  return result;
}
