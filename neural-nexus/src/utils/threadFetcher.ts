import type { Thread, Comment } from "../models/thread";
import threadsData from '../../../data/content/threads.json';

/**
 * Parses a raw comment object into a typed Comment.
 */
function parseComment(data: any): Comment {
    return {
        id: data.id,
        author: data.author,
        content: data.content,
        timestamp: new Date(data.timestamp),
    };
}

/**
 * Parses a raw thread object into a typed Thread.
 */
function parseThread(data: any): Thread {
    return {
        id: data.id,
        author: data.author,
        title: data.title,
        content: data.content,
        timestamp: new Date(data.timestamp),
        tags: data.tags || [],
        comments: data.comments?.map(parseComment) || [],
        locked: data.locked,
        locked_at: data.locked_at ? new Date(data.locked_at) : undefined,
        locked_by: data.locked_by,
        locked_reason: data.locked_reason
    };
}

/**
 * Gets the latest timestamp for a thread, considering both the thread's own timestamp
 * and all of its comments' timestamps.
 */
function getLatestTimestamp(thread: Thread): Date {
    let latestTimestamp = thread.timestamp;
    
    for (const comment of thread.comments) {
        if (comment.timestamp > latestTimestamp) {
            latestTimestamp = comment.timestamp;
        }
    }
    
    return latestTimestamp;
}

/**
 * Loads and parses all threads from the JSON data.
 * Threads are sorted by the most recent update (either thread timestamp or latest comment timestamp).
 */
export function loadThreads(): Thread[] {
    const rawData = threadsData as any;
    const threads = rawData.threads.map(parseThread);
    
    // Pre-compute latest timestamps to avoid redundant iterations during sort
    type ThreadWithTimestamp = { thread: Thread; latestTimestamp: Date };
    const threadTimestamps: ThreadWithTimestamp[] = threads.map((thread: Thread) => ({
        thread,
        latestTimestamp: getLatestTimestamp(thread)
    }));
    
    // Sort by latest update (descending order - newest first)
    threadTimestamps.sort((a: ThreadWithTimestamp, b: ThreadWithTimestamp) => 
        b.latestTimestamp.getTime() - a.latestTimestamp.getTime()
    );
    
    return threadTimestamps.map((item: ThreadWithTimestamp) => item.thread);
}