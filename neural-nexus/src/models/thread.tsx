/**
 * Represents a comment made by a user on a thread.
 */
export interface Comment {
    id: number;
    author: string;
    content: string;
    timestamp: Date;
}

/**
 * Represents a thread, which is a post created by a single user that can contain multiple comments.
 */
export interface Thread {
    id: number;
    author: string;
    title: string;
    content: string;
    timestamp: Date;
    tags: string[];
    comments: Comment[];
    locked?: boolean;
    locked_at?: Date;
    locked_by?: string;
    locked_reason?: string;
}
