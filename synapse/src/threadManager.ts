import { promises as fs } from 'fs';
import { CreateThreadInput, Thread } from './models/thread.js';
import { writeFile, readFile, FQ_THREADS_FILE_PATH } from './filesystem.js';

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
    const threadsFile = await readFile(FQ_THREADS_FILE_PATH);
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

    await writeFile(FQ_THREADS_FILE_PATH, JSON.stringify(createThreadsFileInput, null, 2));
    return thread.id;
}

function findNextId(threads: Thread[]): number {
    if (threads.length === 0) {
        return 1;
    }
    return Math.max(...threads.map(thread => thread.id)) + 1;
}