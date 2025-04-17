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

// Function to sanitize form data
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
        
        // Sanitize input data
        const sanitizedData = sanitizeFormData(formData);
        
        // Validate request data
        const result = requestSchema.safeParse(sanitizedData);
        if (!result.success) {
            // Return validation errors
            return NextResponse.json(
                { error: 'Validation failed', issues: result.error.issues },
                { status: 400 }
            );
        }

        // Extract validated data
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
                Start with a title:
                "Client Assessment Report for ${firstName}
                Prepared by DreamScape AI"

                Then add an introduction paragraph about this being more than a reflection but a revelation based on evidence-based psychological frameworks.

                For each of the 5 questions:
                1. Include "Client Response:" followed by the exact user input
                2. Follow with "DreamScape AI Reflection:" with an insightful analysis that shows understanding of the client's challenges, strengths, and needs

                End with a section titled "💡 What the Neuro Change Method™ Can Do for You" that describes the benefits of working with a Certified Neuro Change Practitioner, including:
                - Self-Concordance Mapping
                - Automaticity Training
                - Belief Engineering
                - Purpose Integration Protocols
                - Flow State Activation

                Then add a final section titled "💎 Why Now, Why You, and Why a Neuro Change Practitioner?" with compelling reasons to act now and book a discovery session.

                **PRACTITIONER CASE REPORT**
                Start with a title:
                "🧭 Practitioner Case Report: ${firstName}"

                Then add these sections in order:
                1. "Client Summary" - A comprehensive overview of the client's situation, challenges, and goals
                2. "Primary Objective:" - A single clear goal statement
                3. "Key Barriers:" - A bulleted list of 3-5 obstacles
                4. "Transformation Theme:" - A one-line transformation statement
                5. "Neuro Change Method™: Your 4-Phase Transformation Journey" with these phases:
                - 🧠 Phase 1: Consciousness (with Focus, Tools, Goal subsections)
                - 🧠 Phase 2: Mindset (Neuroplasticity) (with Focus, Tools, Goal subsections)
                - 🧠 Phase 3: The Subconscious (with Focus, Tools, Goal subsections)
                - 🧠 Phase 4: The Brain (Permanent Integration) (with Focus, Tools, Goal subsections)
                6. "12-Week Milestone Map" - A table with Milestone, Target Week, and Tools & Focus columns
                7. "Projected Transformation Outcomes" - A bulleted list of 4-6 specific outcomes
                8. End with a motivational statement
                9. "Practitioner Notes" - With Temperament and Best Practices subsections

                Keep each section properly formatted with appropriate spacing.
                
                Return these as two separate documents, separated by the delimiter "---DOCUMENT_SEPARATOR---".
            `;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
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