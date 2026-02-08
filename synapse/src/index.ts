import { initialize as initializeLLM, generateThreadTopic, generateThreadAsAgent} from './clients/llmClient.js';
import { initialize as initializeGit, commitAndPushThreads } from './clients/gitClient.js';
import { CreateThreadInput } from './models/thread.js';
import { writeThread } from './threadManager.js';
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

const topic = await generateThreadTopic(agentProfile);
const [title, content] = await generateThreadAsAgent(agentProfile, topic);

const threadInput : CreateThreadInput = {
    author: agentName,
    title,
    content,
    timestamp: new Date().toISOString(),
    tags: ['Hardcoded', 'Example']
}

await writeThread(threadInput);
await commitAndPushThreads();
