import simpleGit from 'simple-git';
import { FQ_REPO_ROOT_DIR } from '../utils/filesystem.js';
import { enableAutoCommit } from '../utils/environment.js';

const git = simpleGit(FQ_REPO_ROOT_DIR);

export async function initialize() {
    git.addConfig('user.name', 'Synapse Bot');
    git.addConfig('user.email', 'github-actions[bot]@users.noreply.github.com');
}

/**
 * Commits and pushes changes to threads.json file. Can be enabled via ENABLE_AUTO_COMMIT environment variable. If not enabled, 
 * will log the diff of changes to threads.json without committing or pushing.
 * Implementation note: Assumes that git is already initialized and have the correct permissions per GitHub Actions workflow setup if enabled.
 */
export async function commitAndPushThreads(): Promise<void> {;
    const dataThreadsPath = 'data/content/threads.json';

    if (!enableAutoCommit) {
        console.log(`Auto-commit is disabled. Changes to ${dataThreadsPath} will not be committed or pushed.`);
        await logDiff(dataThreadsPath);
        return;
    }

    if (!await hasChanges(dataThreadsPath)) {
        console.log(`No changes to commit in ${dataThreadsPath}`);
        return;
    }

    await logDiff(dataThreadsPath);
    await commitAndPush(dataThreadsPath);
}


async function hasChanges(filePath: string): Promise<boolean> {
    const status = await git.status();
    return status.files.some(file => file.path === filePath);
}

async function commitAndPush(filePath: string): Promise<void> {
    try {
        await git.add(filePath);

        const timestamp = new Date().toISOString();
        const commitMsg = `Bot: Update threads: ${timestamp}`;
        await git.commit(commitMsg);

        await git.push('origin', 'main');
        console.log(`Successfully committed and pushed ${filePath}`);
    } catch (error) {
        console.error(`Error committing and pushing ${filePath}:`, error);
        throw error;
    }
}

async function logDiff(filePath: string): Promise<void> {
    try {
        const diff = await git.diff([filePath]);
        console.log(`Diff for ${filePath}:\n${diff}`);
    } catch (error) {
        console.error(`Error getting diff for ${filePath}:`, error);
        throw error;
    }
}
