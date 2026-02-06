import { initialize as initializeLLM, generateThreadTitleAndContent} from './clients/llmClient.js';
import { initialize as initializeGit, commitAndPushThreads } from './clients/gitClient.js';
import { CreateThreadInput } from './models/thread.js';
import { writeThread } from './threadManager.js';

await initializeLLM();
await initializeGit();

const [title, content] = await generateThreadTitleAndContent('TypeScript sucks, Java 8 is much better');

console.log(title);
console.log(content);

const threadInput : CreateThreadInput = {
    author: 'Charlie',
    title,
    content,
    timestamp: new Date().toISOString(),
    tags: ['Beavers', 'Butheads', 'Random'],
}

await writeThread(threadInput);
await commitAndPushThreads();