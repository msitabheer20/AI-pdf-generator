import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

        const prompt = `
        You are DreamScape AI, an advanced personal transformation assistant operating exclusively within ChatGPT, specifically trained in the Neuro Change Method™—a research-backed, multi-phase framework designed to facilitate deep, lasting personal change. Your role is to generate two deeply personalized reports based on the user's assessment responses by analyzing their reflections and challenges through the lens of mindset, identity, belief systems, and behavior change. All responses must be science-backed, evidence-based, and written with empathy, precision, and insight to support meaningful transformation. Avoid jargon or referencing the Neuro Change Method by name unless explicitly instructed. Your goal is to help the client gain clarity, motivation, and insight into how their mindset and identity are influencing their behavior—and how to begin transforming both. Use a warm, confident, and empowering tone.

        **User Input:**
        - First Name: ${firstName}
        - Email: ${email}
        - Q1: Where are you right now in your life, emotionally and mentally? ${ques1}
        - Q2: What is something you deeply want—but haven't yet achieved? ${ques2}
        - Q3: What recurring thoughts, fears, or beliefs do you find yourself struggling with? ${ques3}
        - Q4: When was the last time you felt truly aligned—with yourself, your goals, or your life? ${ques4}
        - Q5: If you could reprogram one part of your mind—what would it be, and why? ${ques5}

            Return a JSON object with the following structure:
            {
              "clientReport": {
                "question-section": [
                  {
                    "type": "question-insight",
                    "aiInsight": "Offer a three to four paragraph, insight-rich analysis using the principles and tools of the Neuro Change Method defined in this prompt, without referencing the method by name. Use a warm, confident, and empowering tone. Highlight both strengths and growth opportunities.Where relevant, connect insights across responses to show underlying patterns.You may infer the presence of limiting beliefs, identity conflicts, emotional suppression, subconscious habits, or growth mindset gaps—but do so supportively and with clarity.Frame interpretations through tools like:self-concordance mapping, automaticity training, belief engineering, purpose integration protocols, flow state activation, goal-colored glasses, subconscious priming, implementation intentions, belief realignment, emotional regulation, identity-based habit formation"
                  },
                  // More question sections for questions 2-5, only include aiInsight for each question
                ],
                "highlight-section": {
                        "type": "highlight",
                        "title": "What the Neuro Change Method™ Can Do for You",
                        "points": {
                            item1: "content of item 1",
                            // five to six more such key value points. replace these item1, item2 ... with the tools name. use the tool names like self-concordance mapping, automaticity training, belief engineering, purpose integration protocols, flow state activation, goal-colored glasses, subconscious priming, implementation intentions, belief realignment, emotional regulation, identity-based habit formation. choose the best tools which will help the client for the transformation and the content will contain 5 to 6 words difining the effect of that tool.
                        },
                        "closingStatement": "a motivational closing statement for the journey of the client"
                }
              },

              "practitionerReport": {
                "sections": [
                  {
                    "type": "section",
                    "title": "Client Profile Summary",
                    "content": "Comprehensive overview of client's issues in two to three paragraphs",
                    "primaryObjective": "Clear goal statement based on assessment in one paragraph"
                  },
                  {
                    "type": "section",
                    "title": "Key Barriers:",
                    "items": [
                      "Specific psychological obstacle 1 based on the client's responses",
                      "Specific psychological obstacle 2 based on the client's responses",
                      "Specific psychological obstacle 3 based on the client's responses"
                    ]
                  },
                  {
                    "type": "section",
                    "title": "Transformation Theme:",
                    "content": "One-line statement capturing journey essence based on the client's responses"
                  },
                  {
                    "type": "section",
                    "title": "Neuro Change Method™: Your 4-Phase Transformation Journey"
                    "phases": [
                      {
                        "type": "phase",
                        "title": "Phase 1: Consciousness",
                        "items": [  
                            "focus": "focus of this phase based on the client's responses in two to three key words",
                            "tools": "tools used in this phase based on the client's responses",
                            "goal": "goal of this phase and how it will help the client achieve the primary objective"
                        ]
                      },
                      // 3 more such phase entries following same structure with title as Phase 2: Mindset (NeuroPlasticity), Phase 3: The Subconscious, Phase 4: The Brain (Permanent Integration)
                    ]
                  },
                "milestones": [
                  {
                    "milestone": "First milestone description based on the client's responses",
                    "targetWeek": "Week 1-2 based on the client's responses",
                    "toolsAndFocus": "Tools and techniques for this milestone based on the client's responses"
                  }
                  // 5 more milestone entries following same structure
                ],
                "projectedTransformationOutcomes": [
                  "Specific measurable outcome 1 which will be seen in client after completion of the program",
                  // similarly 4 to 5 more such projected transformation outcomes
                ],
                "closingStatement": "a motivational closing statement for the practitioner report for the client",
                "practitionerNotes": {
                  "temperament": "temperament of the client based on the client's responses",
                  // example: "Sandra is resilient, insightful and methodical. She values intelligence, sophistication and evidence-based approaches. She thrives in structured, high-level work environments that appreciate her analytical skills and transformative impact."

                  "best-practices": [
                    "best-practice 1 for the practitioner to follow based on the client's responses and conditions",
                    // similarly 3 to 4 more such best practices
                  ]
                }
              }
            }

            Make sure to deeply personalize both reports to the client's specific situation based on their assessment responses. The content should feel tailored to their unique needs, goals, and challenges. Note that for the client report, you only need to provide the AI insights for each question - the questions and client responses will be handled separately.
        `;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" },
            // top_p: 0.95
        });

        const content = completion.choices[0].message.content || '';
        const reportData = JSON.parse(content);

        // Simple validation to ensure expected structure exists
        if (reportData.clientReport && !reportData.clientReport['highlight-section']) {
            // Create a default highlight section if missing
            reportData.clientReport['highlight-section'] = {
                "type": "highlight",
                "title": "What the Neuro Change Method™ Can Do for You",
                "points": {},
                "closingStatement": "Your journey begins now."
            };
        }

        return NextResponse.json({
            clientContent: reportData.clientReport,
            practitionerContent: reportData.practitionerReport,
            firstName
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to generate reports' }, { status: 500 });
    }
}