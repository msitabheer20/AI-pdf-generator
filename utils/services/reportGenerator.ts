import { callOpenAIWithTimeout } from './openai';
import { 
    clientSystemPrompt, 
    formatClientUserPrompt, 
    practitionerSystemPrompt, 
    formatPractitionerUserPrompt,
    formatUserInput
} from '@/utils/prompts';
import { AssessmentFormData } from '@/utils/validation/schema';
import { retrieveContext } from '@/lib/retrieve';

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
 * Retrieves contextual data from Pinecone based on user input
 */
async function retrievePineconeContext(userInput: string): Promise<string> {
    try {
        console.log("=== RETRIEVING CONTEXT FROM PINECONE ===");
        
        // Extract only the questions and answers part, removing personal info
        // Find the index of Q1 and extract everything from there
        const q1Index = userInput.indexOf("Q1:");
        
        if (q1Index === -1) {
            console.log("=== COULD NOT EXTRACT QUESTIONS FROM INPUT ===");
            // Fallback to using the original approach with truncation
            const retrievalQuery = userInput.substring(0, 500);
            const contextData = await retrieveContext(retrievalQuery, 10);
            
            if (!contextData || contextData.length === 0) {
                return "No specific context found for this case.";
            }
            
            const formattedContext = contextData.map((ctx, i) => 
                `CONTEXT ITEM ${i + 1}:\n${ctx}`
            ).join('\n\n');
            
            return formattedContext;
        }
        
        // Extract text from Q1 onwards (which contains all questions and answers)
        const questionsOnly = userInput.substring(q1Index);
        console.log("=== USING ONLY QUESTIONS AND ANSWERS FOR RETRIEVAL ===");
        
        // Create a combined query from all questions
        const questionsText = questionsOnly
            .replace(/- Q\d: /g, '')  // Remove Q1:, Q2:, etc.
            .replace(/\s+/g, ' ')     // Normalize whitespace
            .trim();
            
        console.log(`=== QUESTION TEXT LENGTH: ${questionsText.length} CHARS ===`);
        
        // Get context data from Pinecone
        const contextData = await retrieveContext(questionsText, 10);
        
        if (!contextData || contextData.length === 0) {
            console.log("=== NO RELEVANT CONTEXT FOUND IN PINECONE ===");
            return "No specific context found for this case.";
        }
        
        // Process and format the context data
        const formattedContext = contextData.map((ctx, i) => 
            `CONTEXT ITEM ${i + 1}:\n${ctx}`
        ).join('\n\n');
        
        console.log(`=== RETRIEVED ${contextData.length} CONTEXT ITEMS FROM PINECONE ===`);
        return formattedContext;
    } catch (error) {
        console.error("Error retrieving context from Pinecone:", error);
        return "Error retrieving context data. Proceeding without additional context.";
    }
}


export async function generateReports(
    formData: AssessmentFormData
): Promise<ReportsResult> {
    const { firstName } = formData;
    
    // Format the user input for the prompts
    const userInput = formatUserInput(formData);
    
    // Retrieve relevant context from Pinecone
    const contextString = await retrievePineconeContext(userInput);
    
    // Enhance system prompts with retrieved context
    const enhancedClientSystemPrompt = `
        ${clientSystemPrompt}
        
        The following context from our knowledge base is relevant to this client:
        ${contextString}
    `;
    
    const enhancedPractitionerSystemPrompt = `
        ${practitionerSystemPrompt}
        
        The following context from our knowledge base is relevant to this client:
        ${contextString}
    `;
    
    console.log("=== STARTING CONCURRENT API CALLS ===");
    const startTime = Date.now();
    
    // Run client and practitioner report generation concurrently
    const [clientContent, practitionerContent] = await Promise.all([
        callOpenAIWithTimeout(
            enhancedClientSystemPrompt, 
            formatClientUserPrompt(userInput)
        ),
        callOpenAIWithTimeout(
            enhancedPractitionerSystemPrompt, 
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