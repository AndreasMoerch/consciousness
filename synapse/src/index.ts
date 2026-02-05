
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

await ollama.pull({
    model: 'tinyllama',
});

const response = await ollama.chat({
    model: 'tinyllama',
    messages: [
        {
            role: 'user',
            content: 'You are an AI living in a git repository called consciousness.git. Write a fun but very short welcome message.',
        },
    ],
})

console.log(response);