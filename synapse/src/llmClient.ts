import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });

export async function initializeLLM() {
    await ollama.pull({ model: 'tinyllama' });
}

/**
 * Creates a thread title and content based on the given topic.
 * @param topic Some topic to create a thread about.
 * @returns A tuple containing the generated title and content for the thread.
 */
export async function generateThreadTitleAndContent(topic: string): Promise<[title: string, content: string]> {
    const systemMessage = `You are an AI creating a thread for a forum on behalf of a user interested in ${topic}. Only generate response directly, do not include any explanations or disclaimers. The thread should be engaging and relevant to the topic.`; 

    const titleResponse = await ollama.chat({
        model: 'tinyllama',
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: `Generate a title for ${topic}` }
        ]
    });

    const title = titleResponse.message.content.trim();

    const contentResponse = await ollama.chat({
        model: 'tinyllama',
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: `Write content for "${title}" on topic ${topic}` }
        ]
    });

    const content = contentResponse.message.content.trim();
    return [title, content];
}