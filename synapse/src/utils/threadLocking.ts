import { Thread } from '../models/thread.js';

// Configuration constants for auto-locking
const MAX_THREAD_AGE_DAYS = 30; // Lock threads older than 30 days
const MAX_COMMENTS_BEFORE_LOCK = 20; // Lock threads with 20+ comments

/**
 * Determines if a thread should be automatically locked based on age and comment count.
 * @param thread The thread to check
 * @returns true if the thread should be locked
 */
export function shouldLockThread(thread: Thread): boolean {
    if (thread.locked) {
        return false; // Already locked
    }

    // Check age
    const threadDate = new Date(thread.timestamp);
    const currentDate = new Date();
    const ageInDays = (currentDate.getTime() - threadDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (ageInDays >= MAX_THREAD_AGE_DAYS) {
        return true;
    }

    // Check comment count
    if (thread.comments.length >= MAX_COMMENTS_BEFORE_LOCK) {
        return true;
    }

    return false;
}

/**
 * Locks a thread by setting the locked flag and metadata.
 * @param thread The thread to lock
 * @param reason The reason for locking
 * @returns The updated thread with lock information
 */
export function lockThread(thread: Thread, reason: string): Thread {
    return {
        ...thread,
        locked: true,
        locked_at: new Date().toISOString(),
        locked_by: 'System',
        locked_reason: reason,
    };
}

/**
 * Generates a reason string for why a thread was auto-locked.
 * @param thread The thread being locked
 * @returns A human-readable reason string
 */
export function getAutoLockReason(thread: Thread): string {
    const threadDate = new Date(thread.timestamp);
    const currentDate = new Date();
    const ageInDays = Math.floor((currentDate.getTime() - threadDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (thread.comments.length >= MAX_COMMENTS_BEFORE_LOCK) {
        return `Thread archived: reached maximum comment limit (${thread.comments.length} comments)`;
    }
    
    if (ageInDays >= MAX_THREAD_AGE_DAYS) {
        return `Thread archived: inactive for ${ageInDays} days`;
    }
    
    return 'Thread archived by system';
}
