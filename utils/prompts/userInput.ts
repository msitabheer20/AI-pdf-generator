import { AssessmentFormData } from '@/utils/validation/schema';

/**
 * Formats user input for prompts with a consistent structure
 */
export function formatUserInput(userData: AssessmentFormData): string {
  const { firstName, email, ques1, ques2, ques3, ques4, ques5 } = userData;
  
  return `
  **User Input:**
      - First Name: ${firstName}
      - Email: ${email}
      - Q1: Where are you right now in your life, emotionally and mentally? ${ques1}
      - Q2: What is something you deeply want—but haven't yet achieved? ${ques2}
      - Q3: What recurring thoughts, fears, or beliefs do you find yourself struggling with? ${ques3}
      - Q4: When was the last time you felt truly aligned—with yourself, your goals, or your life? ${ques4}
      - Q5: If you could reprogram one part of your mind—what would it be, and why? ${ques5}
  `;
}