import OpenAI from 'openai';

// Create OpenAI instance with timeout configuration
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000, // 60 second timeout
    maxRetries: 2 // Limit retries to prevent excessive token usage
});

// OpenAI call configuration
export const OPENAI_CONFIG = {
    model: 'gpt-4o',
    temperature: 0.6,
    max_tokens: 2500,
    response_format: { type: "json_object" as const },
    top_p: 0.85
};

/**
 * Helper function to handle API call with timeout handling
 * @param systemPrompt The system prompt to guide the AI
 * @param userPrompt The user prompt with content to process
 * @returns The AI-generated content
 */
export async function callOpenAIWithTimeout(systemPrompt: string, userPrompt: string): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            ...OPENAI_CONFIG,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
        });
        
        return completion.choices[0].message.content || '';
    } catch (error: any) {
        console.error(`OpenAI API error: ${error.message}`);
        if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
            throw new Error('The request timed out. Please try again.');
        }
        throw error;
    }
} 