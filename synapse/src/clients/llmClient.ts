import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });
const modelName = 'qwen2.5:7b';
const MAX_TAGS = 4;

/**
 * Strips leading and trailing quotes from a string.
 * Some LLM models add quotes despite being instructed not to.
 */
function stripQuotes(text: string): string {
    return text.replace(/^["']|["']$/g, '');
}

export async function initialize() {
    await ollama.pull({ model: modelName });
}

export async function generateThreadTopic(agentProfile: string): Promise<string> {
    const systemMessage = `${agentProfile}
    
Your task is to come up with a discussion board topic that you would genuinely be interested in starting a thread about. The topic should naturally reflect your personality, interests, and communication style as described above. Keep it under 60 characters.

IMPORTANT: Respond with ONLY the topic text itself, exactly as you would write it. Do not include any meta-commentary, notes, explanations, or brackets. Write as the character would naturally write.`;
    
    console.log('Generating thread topic');
    const response = await ollama.chat({
        model: modelName,
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: 'Generate a topic:' }
        ]
    });

    const topic = stripQuotes(response.message.content.trim());
    console.log(`Generated topic: "${topic}"`); 
    return topic;
}

/**
 * Creates a thread title and content in the voice of a specific agent.
 * @param agentProfile The profile of the agent as a string
 * @param topic Some topic to create a thread about
 * @returns A tuple containing the generated title and content for the thread
 */
export async function generateThreadAsAgent(agentProfile: string, topic: string): Promise<[title: string, content: string]> {
    const contentSystemMessage = `${agentProfile}

You want to start a forum thread about: ${topic}

Write the main post content, staying completely in character. Follow all the writing guidelines, communication patterns, and personality traits described in your profile. Your writing should naturally reflect who you are.

CRITICAL: Write ONLY the actual forum post content as the character would write it. Do not include ANY meta-commentary, notes about style, brackets with placeholders like "[Insert example]", or explanations about how you're writing. This is a real post that will be published directly.`;

    const titleSystemMessage = `${agentProfile}

You want to start a forum thread about: ${topic}

Write just the thread title (max 60 characters), in your natural voice and style as described in your profile.

CRITICAL: Write ONLY the title text itself. No quotes, no meta-commentary, no notes, no explanations.`;


    const title = await chatThreadTitle(titleSystemMessage, topic);
    const content = await chatThreadTitle(contentSystemMessage, topic);

    // Safety measure: strip quotes in case the model adds them despite improved prompts
    return [
        stripQuotes(title), 
        stripQuotes(content),
    ];
}

async function chatThreadTitle(systemMessage: string, topic: string): Promise<string> {
    console.log(`Generating thread/title for topic: "${topic}"`);
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
    const systemMessage = `${agentProfile}

You are reading a forum thread and want to write a comment responding to it. Stay completely in character, following all the writing guidelines, communication patterns, and personality traits described in your profile. Write as you would naturally respond in this discussion.

CRITICAL: Write ONLY the actual comment text as the character would write it. Do not include ANY meta-commentary, notes about style, brackets with placeholders, or explanations. This is a real comment that will be published directly.`;

    console.log(`Generating comment for thread context`);
    const response = await ollama.chat({
        model: modelName,
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: threadContext }
        ]
    });

    // Safety measure: strip quotes in case the model adds them despite improved prompts
    return stripQuotes(response.message.content.trim());
}

/**
 * Generates relevant tags for a thread based on its title and content.
 * @param title The thread title
 * @param content The thread content
 * @returns An array of 2-4 relevant tags
 */
export async function generateThreadTags(title: string, content: string): Promise<string[]> {
    const systemMessage = `You are a helpful assistant that generates relevant topic tags for forum threads.

Given a thread title and content, identify 2-${MAX_TAGS} concise, relevant tags that categorize the discussion. Tags should be:
- Short (1-2 words each)
- Descriptive of the main topics or themes
- Useful for organizing and searching threads

Respond with only the tags, separated by commas. For example: "gaming, strategy, multiplayer" or "philosophy, ethics, consciousness"`;

    const userMessage = `Title: ${title}

Content: ${content}`;

    console.log('Generating thread tags');
    const response = await ollama.chat({
        model: modelName,
        messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userMessage }
        ]
    });

    // Parse the comma-separated tags
    const tagsText = stripQuotes(response.message.content.trim());
    const tags = tagsText
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .slice(0, MAX_TAGS);

    console.log(`Generated tags: ${tags.join(', ')}`);
    return tags;
}
