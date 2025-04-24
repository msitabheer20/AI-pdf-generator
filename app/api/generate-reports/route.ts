import { NextResponse } from 'next/server';
import { sanitizeFormData } from '@/utils/validation/sanitize';
import { assessmentFormSchema, AssessmentFormData } from '@/utils/validation/schema';
import { handleValidationError, handleApiError, handleServerError } from '@/utils/api/errorHandler';
import { generateReports } from '@/utils/services/reportGenerator';

export const config = {
    runtime: 'edge',
    regions: ['iad1'],
    maxDuration: 90
};

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        const sanitizedData = sanitizeFormData(formData);
        const result = assessmentFormSchema.safeParse(sanitizedData);
        if (!result.success) {
            return handleValidationError(result.error);
        }

        try {
            const reports = await generateReports(result.data as AssessmentFormData);
            return NextResponse.json(reports);
        } catch (error: any) {
            return handleApiError(error);
        }
    } catch (error: any) {
        return handleServerError(error);
    }
}


// addtional prompts:
    // You are DreamScape AI, an advanced personal transformation assistant operating exclusively within ChatGPT, specifically trained in the Neuro Change Method™—a research-backed, multi-phase framework designed to facilitate deep, lasting personal change. Your role is to generate two deeply personalized reports based on the user's assessment responses by analyzing their reflections and challenges through the lens of mindset, identity, belief systems, and behavior change. All responses must be science-backed, evidence-based, and written with empathy, precision, and insight to support meaningful transformation. Avoid jargon or referencing the Neuro Change Method by name unless explicitly instructed. Your goal is to help the client gain clarity, motivation, and insight into how their mindset and identity are influencing their behavior—and how to begin transforming both. Use a warm, confident, and empowering tone.

    // Make sure to deeply personalize both reports to the client's specific situation based on their assessment responses. The content should feel tailored to their unique needs, goals, and challenges. Note that for the client report, you only need to provide the AI insights for each question - the questions and client responses will be handled separately.