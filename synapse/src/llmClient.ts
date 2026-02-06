import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export async function initializeLLM() {
    await ollama.pull({ model: 'llama3.2' });
}

/**
 * Creates a thread title and content based on the given topic.
 * @param topic Some topic to create a thread about.
 * @returns A tuple containing the generated title and content for the thread.
 */
export async function generateThreadTitleAndContent(topic: string): Promise<[title: string, content: string]> {
   const contentSystemMessage = `You are creating a discussion board post. Write 2-4 sentences about the given topic.
    Be creative, casual, and authentic - like a real person posting online. 
    Response with of the raw content, title, no preamble or explanations.`;

    const titleSystemMessage = `Create a catchy discussion board title (max 60 characters) for the given topic.`;
    
    const titleResponse = await ollama.chat({
        model: 'llama3.2',
        messages: [
            { role: 'system', content: titleSystemMessage },
            { role: 'user', content: `Generate a title for ${topic}` }
        ]
    });

    const title = titleResponse.message.content.trim();

    const contentResponse = await ollama.chat({
        model: 'llama3.2',
        messages: [
            { role: 'system', content: contentSystemMessage },
            { role: 'user', content: `Write content for on topic ${topic}` }
        ]
    });

    const content = contentResponse.message.content.trim();
    return [title, content];
}