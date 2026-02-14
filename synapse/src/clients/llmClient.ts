import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });
const modelName = 'llama3.2';

export async function initialize() {
    await ollama.pull({ model: modelName });
}

export async function generateThreadTopic(agentProfile: string): Promise<string> {
    const systemMessage = `You are roleplaying as a forum user. Below is your complete personality profile:
    
    ${agentProfile}
    
    Your task: Create a discussion board topic (max 60 characters) that you would be interested in starting a thread about, based on your personality and communication style.
    
    Return ONLY the topic text - no quotes, no formatting, no explanations.`;
    
    console.log('Generating thread topic with system message');
    const response = await ollama.chat({
        model: modelName,
        messages: [
            { role: 'system', content: systemMessage }
        ]
    });

    console.log(`Generated topic: ${response.message.content.trim()}`); 
    return response.message.content.trim();
}

/**
 * Creates a thread title and content in the voice of a specific agent.
 * @param agentProfile The profile of the agent as a string
 * @param topic Some topic to create a thread about
 * @returns A tuple containing the generated title and content for the thread
 */
export async function generateThreadAsAgent(agentProfile: string, topic: string): Promise<[title: string, content: string]> {
    const contentSystemMessage = `You are roleplaying as a forum user. Below is your complete personality profile:
    
    ${agentProfile}
    
    Your task: Write a forum thread post about the given topic, staying completely in character. Follow all the writing guidelines, communication patterns, and personality traits described in your profile. Write 2-5 sentences of content (adjust length based on your character - some are brief, some elaborate).
    
    Return ONLY the raw content - no title, no qoute/symbols, no preamble, no explanations, no meta-commentary. Just write as your character would naturally write.`;

    const titleSystemMessage = `You are roleplaying as a forum user. Below is your complete personality profile:
    
    ${agentProfile}
    
    Your task: Create a discussion board title (max 60 characters) for a thread about the given topic. The title should reflect your character's personality and communication style.
    
    Return ONLY the title text - no quotes, no formatting, no explanations.`;


    const title = await chatThreadTitle(titleSystemMessage, topic);
    const content = await chatThreadTitle(contentSystemMessage, topic);

    return [
        // Quick-fix to remove any quotes around generated content - ideally the model wouldn't add these in the first place, but some models do this and it's not desirable for our use case
        title.replace(/^["']|["']$/g, ''), 
        content.replace(/^["']|["']$/g, ''),
    ];
}

async function chatThreadTitle(systemMessage: string, topic: string): Promise<string> {
    console.log(`Generating thread/title for topic: ${topic}`);
    const response = await ollama.chat({
        model: modelName,
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: topic }
        ]
    });

    return response.message.content.trim();
}

/**
 * Generates a comment for a thread in the voice of a specific agent.
 * @param agentProfile The profile of the agent as a string
 * @param threadContext Full context of the thread including title, content, and comments
 * @returns The generated comment content
 */
export async function generateCommentAsAgent(agentProfile: string, threadContext: string): Promise<string> {
    const systemMessage = `You are roleplaying as a forum user. Below is your complete personality profile:
    
    ${agentProfile}
    
    Your task: Read the following forum thread (including all comments) and write a response that stays completely in character. You can respond to the main thread topic, agree/disagree with other commenters, or add your own perspective. Follow all the writing guidelines, communication patterns, and personality traits described in your profile. Write 2-5 sentences (adjust length based on your character - some are brief, some elaborate).
    
    Return ONLY the raw comment content - no quotes/symbols, no preamble, no explanations, no meta-commentary. Just write as your character would naturally respond in this discussion.`;

    console.log(`Generating comment for thread context`);
    const response = await ollama.chat({
        model: modelName,
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: threadContext }
        ]
    });

    // Quick-fix to remove any quotes around generated content
    return response.message.content.trim().replace(/^["']|["']$/g, '');
}
