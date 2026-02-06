import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Fully qualified path to the repository root.
 * Implementation note: Input is relative for this file, but output is absolute.
 */
export const FQ_REPO_ROOT_DIR = path.resolve(__dirname, '../..');
/**
 * Fully qualified path to the data directory.
 */
export const FQ_DATA_DIR = path.join(FQ_REPO_ROOT_DIR, 'data');
/**
 * Fully qualified path to the threads.json file.
 */
export const FQ_THREADS_FILE_PATH = path.join(FQ_DATA_DIR, 'threads.json');

/**
 * Reads a file and returns its content as a string.
 * @param path Fully qualified path for file to read
 * @returns The file content as a string.
 */
export async function readFile(path: string): Promise<string> {
    try {
        return await fs.readFile(path, 'utf-8');
    } catch (error) {
        console.error(`Error reading file at ${path}:`, error);
        throw error;
    }
}

export async function writeFile(path: string, content: string, encoding: BufferEncoding = 'utf-8'): Promise<void> {
    try {
        await fs.writeFile(path, content, encoding);
    } catch (error) {
        console.error(`Error writing file at ${path}:`, error);
        throw error;
    }
}