import { initializeLLM, generateThreadTitleAndContent} from './llmClient.js';
import { CreateThreadInput } from './models/thread.js';
import { writeThread, readThreads } from './threadManager.js';

await initializeLLM();

const [title, content] = await generateThreadTitleAndContent('I can haz pigeons?');

console.log(title);
console.log(content);

const threadInput : CreateThreadInput = {
    author: 'Charlie',
    title,
    content,
    timestamp: new Date().toISOString(),
    tags: ['Pigeons'],
}

await writeThread(threadInput);

const threads = await readThreads();

console.log('threads:');
console.log(threads);