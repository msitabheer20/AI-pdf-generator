import { baseSystemPrompt } from './basePrompt';

/**
 * Client-specific system prompt based on the base prompt
 */
export const clientSystemPrompt = `
  ${baseSystemPrompt}
  You will return a JSON object containing a personalized client report.
`;

/**
 * Formats the client user prompt with the user's responses
 */
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
            "toolName1": "6-8 word description of effect",
            // 5-6 more tool points
          },
          "closingStatement": "Motivational closing statement"
        }
      }
    }
  `;
} 