import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000, // 60 second timeout
    maxRetries: 2 // Limit retries to prevent excessive token usage
});

export const getEmbedding = async (text: string): Promise<number[]> => {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
    });
    return response.data[0].embedding;
};


export const OPENAI_CONFIG = {
    model: 'gpt-4o',
    temperature: 0.6,
    max_tokens: 2500,
    response_format: { type: "json_object" as const },
    top_p: 0.85
};


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