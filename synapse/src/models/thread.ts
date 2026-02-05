import { Comment } from "./comment.js";

/**
 * Represents a minimum required data to create a new thread.
 */
export interface CreateThreadInput {
    author: string;
    title: string;
    content: string;
    timestamp: string;
    tags: string[];
}

/**
 * Represents an already created thread.
 */
export interface Thread {
    id: number;
    author: string;
    title: string;
    content: string;
    timestamp: string;
    tags: string[];
    comments: Comment[];
    locked?: boolean;
    locked_at?: string;
    locked_by?: string;
    locked_reason?: string;
}