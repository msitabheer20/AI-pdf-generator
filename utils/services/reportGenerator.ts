import { callOpenAIWithTimeout } from './openai';
import { 
    clientSystemPrompt, 
    formatClientUserPrompt, 
    practitionerSystemPrompt, 
    formatPractitionerUserPrompt,
    formatUserInput
} from '@/utils/prompts';
import { AssessmentFormData } from '@/utils/validation/schema';

// Fallback client report structure for error cases
const fallbackClientReport = {
    "question-section": [],
    "highlight-section": {
        "type": "highlight",
        "title": "What the Neuro Change Method™ Can Do for You",
        "points": {},
        "closingStatement": "Your journey begins now."
    }
};

// Fallback practitioner report structure for error cases
const fallbackPractitionerReport = {
    sections: [],
    milestones: [],
    projectedTransformationOutcomes: []
};

/**
 * Client report data interface
 */
export interface ClientReport {
    'question-section': any[];
    'highlight-section': {
        type: string;
        title: string;
        points: Record<string, string>;
        closingStatement: string;
    };
}

/**
 * Practitioner report data interface
 */
export interface PractitionerReport {
    sections: any[];
    milestones: any[];
    projectedTransformationOutcomes: any[];
    [key: string]: any;
}

/**
 * Combined reports result interface
 */
export interface ReportsResult {
    clientContent: ClientReport;
    practitionerContent: PractitionerReport;
    firstName: string;
}

/**
 * Safely parses JSON from a string with fallback for errors
 */
function safeJsonParse<T>(jsonString: string, fallback: T, logName: string): T {
    try {
        const parsed = JSON.parse(jsonString);
        console.log(`=== ${logName} PARSED SUCCESSFULLY ===`);
        return parsed;
    } catch (error) {
        console.error(`Error parsing ${logName}:`, error);
        return fallback;
    }
}

/**
 * Validates and fixes client report structure if needed
 */
function validateClientReport(report: any): ClientReport {
    if (!report || !report.clientReport) {
        return fallbackClientReport;
    }
    
    const clientReport = report.clientReport;

    // Ensure highlight-section exists
    if (!clientReport['highlight-section']) {
        clientReport['highlight-section'] = fallbackClientReport['highlight-section'];
    }

    return clientReport;
}

/**
 * Generate both client and practitioner reports concurrently
 */
export async function generateReports(
    formData: AssessmentFormData
): Promise<ReportsResult> {
    const { firstName } = formData;
    
    // Format the user input for the prompts
    const userInput = formatUserInput(formData);
    
    console.log("=== STARTING CONCURRENT API CALLS ===");
    const startTime = Date.now();
    
    // Run client and practitioner report generation concurrently
    const [clientContent, practitionerContent] = await Promise.all([
        callOpenAIWithTimeout(
            clientSystemPrompt, 
            formatClientUserPrompt(userInput)
        ),
        callOpenAIWithTimeout(
            practitionerSystemPrompt, 
            formatPractitionerUserPrompt(userInput)
        )
    ]);
    
    console.log(`=== API CALLS COMPLETED IN ${(Date.now() - startTime) / 1000}s ===`);
    
    // Parse and validate the JSON responses
    const clientReportData = safeJsonParse(
        clientContent, 
        { clientReport: fallbackClientReport }, 
        "CLIENT REPORT"
    );
    
    const practitionerReportData = safeJsonParse(
        practitionerContent, 
        { practitionerReport: fallbackPractitionerReport }, 
        "PRACTITIONER REPORT"
    );
    
    // Validate report structures
    const validatedClientReport = validateClientReport(clientReportData);
    
    // Return the processed reports
    return {
        clientContent: validatedClientReport,
        practitionerContent: practitionerReportData.practitionerReport,
        firstName
    };
} 