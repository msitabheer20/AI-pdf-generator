// Re-export all prompt-related functions and constants
import { baseSystemPrompt } from './basePrompt';
import { clientSystemPrompt, formatClientUserPrompt } from './clientPrompt';
import { practitionerSystemPrompt, formatPractitionerUserPrompt } from './practitionerPrompt';
import { formatUserInput } from './userInput';

export {
  baseSystemPrompt,
  clientSystemPrompt,
  formatClientUserPrompt,
  practitionerSystemPrompt,
  formatPractitionerUserPrompt,
  formatUserInput
}; 