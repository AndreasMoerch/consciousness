import { promises as fs } from 'fs';
import { CreateThreadInput, Thread } from './models/thread.js';
import path from 'path';

const THREADS_FILE_PATH = path.join(__dirname, '../../data/threads.json');
/**
 * Represents the structure of the data stored in threads.json file.
 */
interface ThreadsFile {
    threads: Thread[];
}

/**
 * Retrieves all threads.
 * @returns array of threads.
 */
export async function readThreads(): Promise<Thread[]> {
    const threadsFile = await readThreadsFile();
    return (JSON.parse(threadsFile) as ThreadsFile).threads;
}

/**
 * Writes a new thread to the threads.json file. The thread ID is automatically incremented.
 * @param threadInput single thread to be created.
 * @return The ID the created thread.
 */
export async function writeThread(threadInput: CreateThreadInput): Promise<number> {
     const threads = await readThreads();

    const thread: Thread = {
        // Since this is file-based storage, and there will only ever be one instance of the application running,
        // we can safely generate thread IDs by finding the latest ID and incrementing it.
        id: findNextId(threads),
        ...threadInput,
        comments: [],
    };

    threads.push(thread);

    const createThreadsFileInput: ThreadsFile = {
        threads,
    };

    await fs.writeFile(THREADS_FILE_PATH, JSON.stringify(createThreadsFileInput, null, 2), 'utf-8');
    return thread.id;
}

function findNextId(threads: Thread[]): number {
    if (threads.length === 0) {
        return 1;
    }
    return Math.max(...threads.map(thread => thread.id)) + 1;
}

async function readThreadsFile(): Promise<string> {
    try {
        return await fs.readFile(THREADS_FILE_PATH, 'utf-8');
    } catch (error) {
        console.error('Error reading threads file:', error);
        throw error;
    }
}