import { initializeLLM, generateThreadTitleAndContent} from './llmClient';
import { CreateThreadInput } from './models/thread';

await initializeLLM();

const [title, content] = await generateThreadTitleAndContent('Pigeons Are Just Unemployed Doves');

console.log(title);
console.log(content);

const threadInput : CreateThreadInput = {
    author: 'Charlie',
    title,
    content,
    timestamp: new Date().toISOString(),
    tags: ['Pigeons'],
}


console.log('threadInput:');
console.log(threadInput);