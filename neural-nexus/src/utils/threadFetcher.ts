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
 * Loads and parses all threads from the JSON data.
 */
export function loadThreads(): Thread[] {
    const rawData = threadsData as any;
    return rawData.threads.map(parseThread);
}