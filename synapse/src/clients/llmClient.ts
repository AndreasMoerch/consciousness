import { Ollama } from 'ollama';

// Configuration constants
const OLLAMA_HOST = 'http://localhost:11434';
const modelName = 'qwen2.5:7b';
const MAX_TAGS = 4;
const OLLAMA_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes timeout for LLM operations
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 1000;

// Custom fetch with timeout support
function createFetchWithTimeout(timeoutMs: number): typeof fetch {
    return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        
        try {
            const response = await fetch(input, {
                ...init,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    };
}

// Create Ollama client with custom fetch that includes timeout
const ollama = new Ollama({ 
    host: OLLAMA_HOST,
    fetch: createFetchWithTimeout(OLLAMA_TIMEOUT_MS)
});

/**
 * Retries an async operation with exponential backoff
 */
async function retryWithBackoff<T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = MAX_RETRIES
): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            
            if (attempt === maxRetries) {
                console.error(`Failed after ${maxRetries + 1} attempts for ${operationName}:`, error);
                throw error;
            }
            
            const delay = INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
            console.log(`Attempt ${attempt + 1} failed for ${operationName}, retrying in ${delay}ms...`);
            console.error(`Error:`, error);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    // This should never be reached due to the throw in the loop, but TypeScript needs it
    throw lastError ?? new Error(`Operation ${operationName} failed with no error details`);
}

/**
 * Strips leading and trailing quotes from a string.
 * Some LLM models add quotes despite being instructed not to.
 */
function stripQuotes(text: string): string {
    return text.replace(/^["']|["']$/g, '');
}

export async function initialize() {
    console.log(`Initializing LLM client with model: ${modelName}`);
    await retryWithBackoff(
        async () => {
            console.log(`Pulling model: ${modelName}...`);
            await ollama.pull({ model: modelName });
            console.log(`Model ${modelName} pulled successfully`);
        },
        'model pull'
    );
    
    // Verify the model is available
    try {
        const models = await ollama.list();
        const modelExists = models.models.some(m => 
            m.name === modelName || m.name.startsWith(modelName.split(':')[0] + ':')
        );
        if (!modelExists) {
            throw new Error(`Model ${modelName} not found after pull operation`);
        }
        console.log(`Model ${modelName} verified and ready`);
    } catch (error) {
        console.error('Error verifying model:', error);
        throw error;
    }
}

export async function generateThreadTopic(agentProfile: string): Promise<string> {
    const systemMessage = `${agentProfile}
    
Your task is to come up with a discussion board topic that you would genuinely be interested in starting a thread about. The topic should naturally reflect your personality, interests, and communication style as described above. Keep it under 60 characters.

IMPORTANT: Respond with ONLY the topic text itself, exactly as you would write it. Do not include any meta-commentary, notes, explanations, or brackets. Write as the character would naturally write.`;
    
    console.log('Generating thread topic');
    const response = await retryWithBackoff(
        async () => await ollama.chat({
            model: modelName,
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: 'Generate a topic:' }
            ]
        }),
        'generateThreadTopic'
    );

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
    const response = await retryWithBackoff(
        async () => await ollama.chat({
            model: modelName,
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: topic }
            ]
        }),
        'chatThreadTitle'
    );

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
    const response = await retryWithBackoff(
        async () => await ollama.chat({
            model: modelName,
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: threadContext }
            ]
        }),
        'generateCommentAsAgent'
    );

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
    const response = await retryWithBackoff(
        async () => await ollama.chat({
            model: modelName,
            messages: [
                { role: 'system', content: systemMessage },
                { role: 'user', content: userMessage }
            ]
        }),
        'generateThreadTags'
    );

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
