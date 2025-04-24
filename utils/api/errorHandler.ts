import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * API Error response interface
 */
export interface ApiErrorResponse {
    error: string;
    issues?: any[];
    status: number;
}

/**
 * Handles validation errors from Zod
 */
export function handleValidationError(error: ZodError): NextResponse<ApiErrorResponse> {
    return NextResponse.json(
        { 
            error: 'Validation failed', 
            issues: error.issues,
            status: 400
        },
        { status: 400 }
    );
}

/**
 * Handles API service errors (like OpenAI timeouts)
 */
export function handleApiError(error: Error): NextResponse<ApiErrorResponse> {
    console.error('API call error:', error.message);
    
    return NextResponse.json({ 
        error: 'We experienced a delay generating your reports. Please try again with shorter responses.',
        status: 503
    }, { status: 503 });
}

/**
 * Handles general server errors
 */
export function handleServerError(error: Error): NextResponse<ApiErrorResponse> {
    console.error('General server error:', error.message);
    
    return NextResponse.json({ 
        error: 'Failed to generate reports. Please try again shortly.',
        status: 500
    }, { status: 500 });
} 