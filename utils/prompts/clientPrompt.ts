import { baseSystemPrompt } from './basePrompt';


export const clientSystemPrompt = `
  ${baseSystemPrompt}
  You will return a JSON object containing a personalized client report.
  
  You have access to Pinecone-retrieved context, including transformation journeys, challenges, and evidence-based approaches matching the client's situation. Use this to deliver personalized insights, reference proven methods, ground recommendations in real-world success, and identify patterns linked to known pathways.
`;

export function formatClientUserPrompt(userInput: string): string {
  return `
    ${userInput}

    Return a JSON object with this structure:
    {
      "clientReport": {
        "question-section": [
          {
            "type": "question-insight",
            "aiInsights": [
              "First paragraph analyzing response (150 words)",
              "Second paragraph with additional insights (150 words)"
            ]
          }
          // 4 more insight objects for remaining questions
        ],
        "highlight-section": {
          "type": "highlight",
          "title": "What the Neuro Change Method™ Can Do for You",
          "points": {
            "toolName": "6-8 word description of effect of this tool on the client",
            // replace the toolName with actual tool names and add 5-6 more tool points which are neccessary according to client condition
          },
          "closingStatement": "Motivational closing statement"
        }
      }
    }
  `;
}