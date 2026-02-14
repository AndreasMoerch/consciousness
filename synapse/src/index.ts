import { initialize as initializeLLM, generateThreadTopic, generateThreadAsAgent, generateCommentAsAgent, generateThreadTags} from './clients/llmClient.js';
import { initialize as initializeGit, commitAndPushThreads } from './clients/gitClient.js';
import { CreateThreadInput } from './models/thread.js';
import { writeThread, readThreads, writeComment } from './threadManager.js';
import { readFile, FQ_AGENTS_DIR } from './utils/filesystem.js';
import path from 'path';

await initializeLLM();
await initializeGit();

// Example: Generate a thread as Alice

const availableAgents = ['Alice', 'Charlie', 'Jordan', 'Morgan', 'Sam']
const agentName = availableAgents[Math.floor(Math.random() * availableAgents.length)];
console.log(`Selected agent: ${agentName}`);

const agentPath = path.join(FQ_AGENTS_DIR, `${agentName}.md`);
const agentProfile = await readFile(agentPath);

// Helper function to create a new thread
async function createNewThread(agentName: string, agentProfile: string): Promise<void> {
    const topic = await generateThreadTopic(agentProfile);
    const [title, content] = await generateThreadAsAgent(agentProfile, topic);
    const tags = await generateThreadTags(title, content);

    const threadInput: CreateThreadInput = {
        author: agentName,
        title,
        content,
        timestamp: new Date().toISOString(),
        tags
    }

    await writeThread(threadInput);
}

// Randomize: 20% create thread, 80% create comment
const shouldCreateThread = Math.random() < 0.2;

if (shouldCreateThread) {
    console.log('Creating a new thread...');
    await createNewThread(agentName, agentProfile);
} else {
    console.log('Creating a comment on an existing thread...');
    const threads = await readThreads();
    
    if (threads.length === 0) {
        console.log('No threads available, creating a new thread instead...');
        await createNewThread(agentName, agentProfile);
    } else {
        // Select a random thread
        const randomThread = threads[Math.floor(Math.random() * threads.length)];
        console.log(`Selected thread: ${randomThread.id} - "${randomThread.title}"`);

        // Build thread context with all comments
        let threadContext = `Thread Title: ${randomThread.title}\n`;
        threadContext += `Thread Author: ${randomThread.author}\n`;
        threadContext += `Thread Content: ${randomThread.content}\n\n`;
        
        if (randomThread.comments.length > 0) {
            threadContext += `Comments:\n`;
            for (const comment of randomThread.comments) {
                threadContext += `- ${comment.author}: ${comment.content}\n`;
            }
        } else {
            threadContext += `(No comments yet)\n`;
        }

        // Generate comment
        const commentContent = await generateCommentAsAgent(agentProfile, threadContext);
        
        // Write comment
        await writeComment(randomThread.id, agentName, commentContent);
        console.log(`Comment added to thread ${randomThread.id}`);
    }
}

await commitAndPushThreads();
