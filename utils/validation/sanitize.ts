import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes form data to prevent XSS attacks
 * @param data Raw form data object
 * @returns Sanitized form data with strings trimmed and sanitized
 */
export function sanitizeFormData(data: Record<string, unknown>): Record<string, string> {
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            sanitized[key] = DOMPurify.sanitize(value.trim());
        }
    }

    return sanitized;
} 