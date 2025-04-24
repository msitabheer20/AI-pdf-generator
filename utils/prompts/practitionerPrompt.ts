import { baseSystemPrompt } from './basePrompt';

/**
 * Practitioner-specific system prompt based on the base prompt
 */
export const practitionerSystemPrompt = `
  ${baseSystemPrompt}
  You will return a JSON object containing a comprehensive practitioner report.
`;

/**
 * Formats the practitioner user prompt with the user's responses
 */
export function formatPractitionerUserPrompt(userInput: string): string {
  return `
    ${userInput}

    Return a JSON object with this structure:
    {
      "practitionerReport": {
        "sections": [
          {
            "type": "section",
            "title": "Client Profile Summary",
            "content": "Two paragraphs: 1) general overview (100 words) 2) comprehensive overview (200-300 words)",
            "primaryObjective": "Clear goal statement based on assessment"
          },
          {
            "type": "section",
            "title": "Key Barriers:",
            "items": [
              "Specific psychological obstacle 1",
              // 4-5 more obstacles
            ]
          },
          {
            "type": "section",
            "title": "Transformation Theme:",
            "sub-title": "One-line statement capturing journey essence",
            "reason": "Paragraph on theme alignment with journey"
          },
          {
            "type": "section",
            "title": "Neuro Change Method™: Your 4-Phase Transformation Journey",
            "phases": [
              {
                "type": "phase",
                "title": "Phase 1: Consciousness",
                "items": {  
                  "focus": "Key Word 1 + Key Word 2 + Key Word 3",
                  "tools": "Tool One | Tool Two | Tool Three",
                  "goal": "Two line goal showing change from current to future state"
                }
              }
              // 3 more phases (Mindset, Subconscious, Integration)
            ]
          }
        ],
        "milestones": [
          {
            "milestone": "First milestone description",
            "targetWeek": "Week X-Y",
            "toolsAndFocus": "Tools and techniques"
          }
          // 5 more milestones
        ],
        "projectedTransformationOutcomes": [
          "Specific measurable outcome 1",
          // 4-5 more outcomes
        ],
        "closingStatement": "Motivational closing statement",
        "practitionerNotes": {
          "temperament": "Client temperament assessment",
          "best-practices": [
            "Best practice 1 for practitioner",
            // 3-4 more best practices
          ]
        }
      }
    }

    IMPORTANT FORMATTING REQUIREMENTS:
    1. For the "focus" field and "tools" field in each phase:
       - Each key word or phrase MUST be capitalized (e.g., "Self Awareness" not "self-awareness")
       - Use plus signs WITH spaces between words (e.g., "Self Awareness + Rest + Presence")
       - Use 2-3 words/phrases maximum
       - Use pipe symbols WITH spaces between tools (e.g., "Self Concordance Mapping | Belief Engineering")
  `;
} 