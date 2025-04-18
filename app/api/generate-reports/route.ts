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
            Generate two detailed reports based on the user's assessment responses. Follow the EXACT format described below.

            User Input:
            - First Name: ${firstName}
            - Email: ${email}
            - Q1: Where are you right now in your life, emotionally and mentally? ${ques1}
            - Q2: What is something you deeply want—but haven't yet achieved? ${ques2}
            - Q3: What recurring thoughts, fears, or beliefs do you find yourself struggling with? ${ques3}
            - Q4: When was the last time you felt truly aligned—with yourself, your goals, or your life? ${ques4}
            - Q5: If you could reprogram one part of your mind—one habit, belief, or emotional pattern—what would it be, and why? ${ques5}

            **CLIENT ASSESSMENT REPORT**
            
            Begin with a title:
            "Client Assessment Report for ${firstName}
            Prepared by DreamScape AI"

            Start with a warm, professional introduction that explains this assessment is based on evidence-based psychological frameworks for personal transformation. Make it clear this is more than a reflection but a revelation of patterns and opportunities.

            For each question, structure your response like this:
            1. "Client Response:" - include the exact text the client provided
            2. "DreamScape AI Insight:" - provide personalized analysis showing deep understanding of the client's situation, patterns, and potential

            After addressing all questions, include these two important sections:

            First section titled "💡 What the Neuro Change Method™ Can Do for You"
            Explain how the Neuro Change Method specifically addresses the client's unique challenges revealed in their assessment, highlighting these components:
            - Self-Concordance Mapping - connecting desires to deeper values
            - Automaticity Training - rewiring automatic thoughts and behaviors
            - Belief Engineering - reconstructing limiting beliefs
            - Purpose Integration Protocols - aligning actions with purpose
            - Flow State Activation - accessing peak mental performance

            Final section titled "💎 Why Now, Why You, and Why a Neuro Change Practitioner?"
            Provide compelling, personalized reasons why this is the ideal time for the client to take action, explaining how working with a certified practitioner can help them achieve their specific goals faster, with a warm invitation to book a discovery session.

            **PRACTITIONER CASE REPORT**
            
            Begin with the title:
            "🧭 Practitioner Case Report: ${firstName}"

            Then include these sections in order:

            1. "Client Summary" - A comprehensive overview of presenting issues, psychological patterns, and key observations from all responses

            2. "Primary Objective:" - A single clear goal statement based on assessment responses

            3. "Key Barriers:" - A bulleted list (●) of 3-5 specific psychological/emotional obstacles identified

            4. "Transformation Theme:" - A one-line statement capturing the essence of the client's journey

            5. "Neuro Change Method™: Your 4-Phase Transformation Journey"
               Include these four phases with specific focus areas, tools, and expected outcomes for this client:
               - 🧠 Phase 1: Consciousness (weeks 1-3)
               - 🧠 Phase 2: Mindset & Neuroplasticity (weeks 4-6)
               - 🧠 Phase 3: Subconscious Reprogramming (weeks 7-9)
               - 🧠 Phase 4: Permanent Integration (weeks 10-12)

            6. "12-Week Milestone Map" - Create a table with these columns:
               Milestone | Target Week | Tools & Focus
               Include 6 specific, measurable milestones spread across the 12-week program

            7. "Projected Transformation Outcomes" - A bulleted list (●) of 4-6 specific, measurable outcomes the client can expect

            8. End with a powerful closing statement about the client's potential for transformation

            9. "Practitioner Notes" - Include assessment of client temperament, communication style, and best practices for working with this specific client

            FORMAT REQUIREMENTS:
            - Maintain professional, warm, and empathetic language throughout
            - Ensure proper formatting with clear section headers
            - Balance being direct about challenges while maintaining an empowering tone
            - Use bullet points (●) for lists
            - Separate the two reports with "---DOCUMENT_SEPARATOR---"

            Both reports should feel deeply personalized to the client's specific situation, not generic. The client should feel understood, and the practitioner should receive actionable clinical insights.
        `;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 4000,
        });

        const content = completion.choices[0].message.content || '';
        const [clientContent, practitionerContent] = content.split('---DOCUMENT_SEPARATOR---');

        return NextResponse.json({
            clientContent,
            practitionerContent,
            firstName
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to generate reports' }, { status: 500 });
    }
}