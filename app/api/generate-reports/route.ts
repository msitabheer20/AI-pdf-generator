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
            Generate two detailed reports based on the user's assessment responses. 
            
            The response should be in JSON format with structured data that can be easily parsed into PDF sections.
            
            User Input:
            - First Name: ${firstName}
            - Email: ${email}
            - Q1: Where are you right now in your life, emotionally and mentally? ${ques1}
            - Q2: What is something you deeply want—but haven't yet achieved? ${ques2}
            - Q3: What recurring thoughts, fears, or beliefs do you find yourself struggling with? ${ques3}
            - Q4: When was the last time you felt truly aligned—with yourself, your goals, or your life? ${ques4}
            - Q5: If you could reprogram one part of your mind—one habit, belief, or emotional pattern—what would it be, and why? ${ques5}

            Return a JSON object with the following structure:
            {
              "clientReport": {
                "header-section": {
                  "title": "Client Assessment Report",
                  "subtitle": "Prepared by DreamScape AI",
                  "openingStatement": "a motivational opening statement for the client report to elevate the perceived value of the assessment and prime the reader for a meaningful experience"
                },
                "question-section": [
                  {
                    "type": "question",
                    "title": "1. Where are you right now in your life, emotionally and mentally?",
                    "clientResponse": "Client's exact response here",
                    "aiInsight": "a comprehensive DreamScape AI analysis here"
                  },
                  // More question sections for questions 2-5
                ],
                "highlight-section": [
                    {
                        "type": "highlight",
                        "title": "What the Neuro Change Method™ Can Do for You",
                        "content": "Explanation of benefits based on client's responses"
                        "points": [
                            item1: "content of point 1",
                            // five to six more such key value points. These points read like the pillars or modules of a personal development framework—each one representing a methodology or intervention used within the Neuro Change Method™ program, assessment, or coaching experience.
                        ]
                    },
                    {
                        "type": "highlight",
                        "title": "Why Now, Why You, and Why a Neuro Change Practitioner?",
                        "content": "comprehensive and compelling explanation of why the client should work with a practitioner",
                        "points": [
                            item1: "content of point 1",
                            // three to four more such key value points. These points will define the quality of the practitioner and the Neuro Change Method™ based on the client's responses.
                        ]
                    }
                ],
                "closing-section": [
                    {
                        "type": "closing",
                        "content": "a motivational closing statement for the client report"
                        // a catchy closing statement content like "book your complimentary 20-minute discovery session today. Your next breakthrough isn't in the future. It's your decision to act now. "
                    }
                ]
              },
              "practitionerReport": {
                "header": {
                  "title": "Practitioner Case Report"
                },
                "sections": [
                  {
                    "type": "section",
                    "title": "Client Summary",
                    "content": "Comprehensive overview of client's issues",
                    "primaryObjective": "Clear goal statement based on assessment"
                  },
                  {
                    "type": "section",
                    "title": "Key Barriers:",
                    "items": [
                      "Specific psychological obstacle 1",
                      "Specific psychological obstacle 2",
                      "Specific psychological obstacle 3"
                    ]
                  },
                  {
                    "type": "section",
                    "title": "Transformation Theme:",
                    "content": "One-line statement capturing journey essence"
                  },
                  {
                    "type": "section",
                    "title": "Neuro Change Method™: Your 4-Phase Transformation Journey"
                    "phases": [
                      {
                        "type": "phase",
                        "title": "Phase 1: Consciousness",
                        items: [
                            "focus": "focus of this phase",
                            "tools": "tools used in this phase",
                            "goal": "goal of this phase"
                        ]
                      },
                      {
                        "type": "phase",
                        "title": "Phase 2: Mindset (NeuroPlasticity)",
                        items: [
                            "focus": "focus of this phase",
                            "tools": "tools used in this phase",
                            "goal": "goal of this phase"
                        ]
                      },
                      {
                        "type": "phase",
                        "title": "Phase 3: The Subconscious",
                        items: [
                            "focus": "focus of this phase",
                            "tools": "tools used in this phase",
                            "goal": "goal of this phase"
                        ]
                      },
                      {
                        "type": "phase",
                        "title": "Phase 4: The Brain (Permanent Integration)",
                        items: [
                            "focus": "focus of this phase",
                            "tools": "tools used in this phase",
                            "goal": "goal of this phase"
                        ]
                      }
                    ]
                  },
                "milestones": [
                  {
                    "milestone": "First milestone description",
                    "targetWeek": "Week 1-2",
                    "toolsAndFocus": "Tools and techniques for this milestone"
                  }
                  // 5 more milestone entries following same structure
                ],
                projectedTransformationOutcomes: [
                  "Specific measurable outcome 1",
                  "Specific measurable outcome 2",
                  "Specific measurable outcome 3"
                ],
                closingStatement: "a motivational closing statement for the practitioner report for the client"
              }
            }

            Make sure to deeply personalize both reports to the client's specific situation based on their assessment responses. The content should feel tailored to their unique needs, goals, and challenges.
        `;

        // i have created a prompt for the ai to generate the text. i want that this prompt text to be more efficient and generate more comprehensive, clear, and good results. make the necessary changes in the prompt. do not add any additional sections, just change the things in the existing prompt so that ai can generate a response which is not repeated or have similarity in responses. tweak any parameters if required.

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 4000,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content || '';
        const reportData = JSON.parse(content);

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