import simpleGit from 'simple-git';
import { FQ_REPO_ROOT_DIR } from '../filesystem.js';

const git = simpleGit(FQ_REPO_ROOT_DIR);

export async function initialize() {
    git.addConfig('user.name', 'Synapse Bot');
    git.addConfig('user.email', 'github-actions[bot]@users.noreply.github.com');
}

/**
 * Commits and pushes changes to threads.json file.
 * Implementation note: Assumes that git is already initialized and have the correct permissions per GitHub Actions workflow setup.
 */
export async function commitAndPushThreads(): Promise<void> {
    try {
        const dataThreadsPath = 'data/threads.json';

        // Check if there are changes to threads.json
        const status = await git.status();
        
        const threadsJsonChanged = status.files.some(file => file.path === dataThreadsPath);
        
        if (!threadsJsonChanged) {
            console.log('No changes to commit in data/threads.json');
            return;
        }
       
        await git.add(dataThreadsPath);
        
        const timestamp = new Date().toISOString();
        const commitMsg = `Bot: Update threads: ${timestamp}`;
        await git.commit(commitMsg);
    
        await git.push('origin', 'main');
        console.log('Successfully committed and pushed threads.json');
    } catch (error) {
        console.error('Error committing and pushing threads:', error);
        throw error;
    }
}
