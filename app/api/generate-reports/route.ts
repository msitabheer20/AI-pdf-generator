import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Create OpenAI instance with timeout configuration
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 60000, // 60 second timeout
    maxRetries: 2 // Limit retries to prevent excessive token usage
});

// Set API response timeout
export const config = {
    runtime: 'edge',
    regions: ['iad1'], // Deploy to a fast region (US East)
    maxDuration: 90 // 90 seconds max
};

const requestSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .max(50, 'First name is too long')
        .regex(/^[a-zA-Z\s\-']+$/, 'First name should only contain letters, spaces, hyphens, or apostrophes'),

    email: z
        .string()
        .email('Please enter a valid email')
        .max(100, 'Email is too long')
        .refine(email => email.includes('.'), { message: 'Email must include a domain extension (e.g., .com)' }),

    ques1: z
        .string()
        .min(15, 'Please provide a more detailed response (at least 15 characters)')
        .max(2000, 'Response is too long (maximum 2000 characters)')
        .refine(text => text.split(' ').length >= 3, {
            message: 'Please provide a meaningful response with at least a few words'
        }),

    ques2: z
        .string()
        .min(15, 'Please provide a more detailed response (at least 15 characters)')
        .max(2000, 'Response is too long (maximum 2000 characters)')
        .refine(text => text.split(' ').length >= 3, {
            message: 'Please provide a meaningful response with at least a few words'
        }),

    ques3: z
        .string()
        .min(15, 'Please provide a more detailed response (at least 15 characters)')
        .max(2000, 'Response is too long (maximum 2000 characters)')
        .refine(text => text.split(' ').length >= 3, {
            message: 'Please provide a meaningful response with at least a few words'
        }),

    ques4: z
        .string()
        .min(15, 'Please provide a more detailed response (at least 15 characters)')
        .max(2000, 'Response is too long (maximum 2000 characters)')
        .refine(text => text.split(' ').length >= 3, {
            message: 'Please provide a meaningful response with at least a few words'
        }),

    ques5: z
        .string()
        .min(15, 'Please provide a more detailed response (at least 15 characters)')
        .max(2000, 'Response is too long (maximum 2000 characters)')
        .refine(text => text.split(' ').length >= 3, {
            message: 'Please provide a meaningful response with at least a few words'
        }),
});

function sanitizeFormData(data: any) {
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            sanitized[key] = DOMPurify.sanitize(value.trim());
        }
    }

    return sanitized;
}

// Helper function to handle API call with timeout
async function callOpenAIWithTimeout(systemPrompt: string, userPrompt: string) {
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.6,
            max_tokens: 2500, // Reduced token count
            response_format: { type: "json_object" },
            top_p: 0.85
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

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        const sanitizedData = sanitizeFormData(formData);

        const result = requestSchema.safeParse(sanitizedData);
        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', issues: result.error.issues },
                { status: 400 }
            );
        }

        const { firstName, email, ques1, ques2, ques3, ques4, ques5 } = result.data;

        // Create more concise prompts
        const baseSystemPrompt = `
          You are DreamScape AI, an advanced personal transformation assistant trained in the Neuro Change Method™.
          Your responses must be science-backed, evidence-based, and written with empathy.
          
          When analyzing responses, look for limiting beliefs, identity conflicts, emotional patterns, and mindset gaps.
          Frame insights using tools like: self-concordance mapping, belief engineering, flow state activation, 
          implementation intentions, belief realignment, identity-based habit formation, emotional rewiring, 
          strategy bridging, and purpose mapping.
          
          Speak directly to the client using "you" and highlight strengths and growth areas.
        `;

        // Client-specific system prompt
        const clientSystemPrompt = `
          ${baseSystemPrompt}
          You will return a JSON object containing a personalized client report.
        `;

        // Practitioner-specific system prompt
        const practitionerSystemPrompt = `
          ${baseSystemPrompt}
          You will return a JSON object containing a comprehensive practitioner report.
        `;

        // More concise user input
        const userInput = `
        **User Input:**
            - First Name: ${firstName}
            - Email: ${email}
            - Q1: Where are you right now in your life, emotionally and mentally? ${ques1}
            - Q2: What is something you deeply want—but haven't yet achieved? ${ques2}
            - Q3: What recurring thoughts, fears, or beliefs do you find yourself struggling with? ${ques3}
            - Q4: When was the last time you felt truly aligned—with yourself, your goals, or your life? ${ques4}
            - Q5: If you could reprogram one part of your mind—what would it be, and why? ${ques5}
        `;

        // Client-specific user prompt
        const clientUserPrompt = `
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

        // Practitioner-specific user prompt
        const practitionerUserPrompt = `
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

        // Run both API calls concurrently
        console.log("=== STARTING CONCURRENT API CALLS ===");
        const startTime = Date.now();
        
        try {
            const [clientContent, practitionerContent] = await Promise.all([
                callOpenAIWithTimeout(clientSystemPrompt, clientUserPrompt),
                callOpenAIWithTimeout(practitionerSystemPrompt, practitionerUserPrompt)
            ]);
            
            console.log(`=== API CALLS COMPLETED IN ${(Date.now() - startTime) / 1000}s ===`);
            
            // Parse the JSON responses
            let clientReportData, practitionerReportData;
            
            try {
                clientReportData = JSON.parse(clientContent);
                console.log("=== CLIENT REPORT PARSED SUCCESSFULLY ===");
            } catch (error) {
                console.error("Error parsing client report:", error);
                clientReportData = { 
                    clientReport: {
                        "question-section": [],
                        "highlight-section": {
                            "type": "highlight",
                            "title": "What the Neuro Change Method™ Can Do for You",
                            "points": {},
                            "closingStatement": "Your journey begins now."
                        }
                    }
                };
            }
            
            try {
                practitionerReportData = JSON.parse(practitionerContent);
                console.log("=== PRACTITIONER REPORT PARSED SUCCESSFULLY ===");
            } catch (error) {
                console.error("Error parsing practitioner report:", error);
                practitionerReportData = { practitionerReport: { sections: [], milestones: [], projectedTransformationOutcomes: [] } };
            }

            // Validate client report structure
            if (clientReportData.clientReport && !clientReportData.clientReport['highlight-section']) {
                clientReportData.clientReport['highlight-section'] = {
                    "type": "highlight",
                    "title": "What the Neuro Change Method™ Can Do for You",
                    "points": {},
                    "closingStatement": "Your journey begins now."
                };
            }

            return NextResponse.json({
                clientContent: clientReportData.clientReport,
                practitionerContent: practitionerReportData.practitionerReport,
                firstName
            });
        } catch (error: any) {
            console.error('API call error:', error.message);
            return NextResponse.json({ 
                error: 'We experienced a delay generating your reports. Please try again with shorter responses.' 
            }, { status: 503 });
        }
    } catch (error: any) {
        console.error('General error:', error.message);
        return NextResponse.json({ 
            error: 'Failed to generate reports. Please try again shortly.' 
        }, { status: 500 });
    }
}



// addtional prompts:
        // You are DreamScape AI, an advanced personal transformation assistant operating exclusively within ChatGPT, specifically trained in the Neuro Change Method™—a research-backed, multi-phase framework designed to facilitate deep, lasting personal change. Your role is to generate two deeply personalized reports based on the user's assessment responses by analyzing their reflections and challenges through the lens of mindset, identity, belief systems, and behavior change. All responses must be science-backed, evidence-based, and written with empathy, precision, and insight to support meaningful transformation. Avoid jargon or referencing the Neuro Change Method by name unless explicitly instructed. Your goal is to help the client gain clarity, motivation, and insight into how their mindset and identity are influencing their behavior—and how to begin transforming both. Use a warm, confident, and empowering tone.

        // Make sure to deeply personalize both reports to the client's specific situation based on their assessment responses. The content should feel tailored to their unique needs, goals, and challenges. Note that for the client report, you only need to provide the AI insights for each question - the questions and client responses will be handled separately.