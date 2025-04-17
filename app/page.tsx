'use client';
import { generateClientPDF, generatePractitionerPDF } from '@/utils/pdfUtils';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Define the validation schema with Zod with enhanced pattern checks
const formSchema = z.object({
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

// Type for form data based on schema
type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    email: '',
    ques1: '',
    ques2: '',
    ques3: '',
    ques4: '',
    ques5: '',
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [clientPdfUrl, setClientPdfUrl] = useState('');
  const [practitionerPdfUrl, setPractitionerPdfUrl] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    
    setFormData({ ...formData, [name]: sanitizedValue });
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedData = Object.entries(formData).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? DOMPurify.sanitize(value.trim()) : value;
      return acc;
    }, {} as Record<string, any>);
    
    try {
      formSchema.parse(sanitizedData);
      setValidationErrors({});
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Format and set validation errors
        const errors: Record<string, string> = {};
        err.errors.forEach((error: any) => {
          if (error.path) {
            errors[error.path[0]] = error.message;
          }
        });
        setValidationErrors(errors);
        return;
      }
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate reports');
      }
      
      const { clientContent, practitionerContent, firstName } = await response.json();
      
      setGenerating(true);
      
      const clientSections = clientContent
        .split('\n\n')
        .filter(Boolean)
        .map((section: string) => section.trim());
        
      const practitionerSections = practitionerContent
        .split('\n\n')
        .filter(Boolean)
        .map((section: string) => section.trim());
      
      const clientBlob = await generateClientPDF(firstName, clientSections);
      const practitionerBlob = await generatePractitionerPDF(firstName, practitionerSections);
      
      const clientUrl = window.URL.createObjectURL(clientBlob);
      setClientPdfUrl(clientUrl);
      
      const practitionerUrl = window.URL.createObjectURL(practitionerBlob);
      setPractitionerPdfUrl(practitionerUrl);

      setFormData({
        firstName: '',
        email: '',
        ques1: '',
        ques2: '',
        ques3: '',
        ques4: '',
        ques5: '',
      });
      
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
      setGenerating(false);
    }
  };
  
  useEffect(() => {
    return () => {
      if (clientPdfUrl) window.URL.revokeObjectURL(clientPdfUrl);
      if (practitionerPdfUrl) window.URL.revokeObjectURL(practitionerPdfUrl);
    };
  }, [clientPdfUrl, practitionerPdfUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 mr-3">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#6633CC", stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#0066CC", stopOpacity:1}} />
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="80" fill="url(#grad1)" />
              <path d="M100,40 C115,50 130,60 130,80 C130,100 115,110 100,120 C85,110 70,100 70,80 C70,60 85,50 100,40" fill="white" />
              <circle cx="100" cy="100" r="15" fill="white" />
              <path d="M70,120 C85,130 115,130 130,120" stroke="white" strokeWidth="4" fill="none" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">DreamScape AI Assessment</h1>
            <p className="text-sm text-gray-500">The Neuro Change Institute</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium text-gray-600">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
                className={`mt-1 block w-full p-2 border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500`}
            />
              {validationErrors.firstName && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.firstName}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
                className={`mt-1 block w-full p-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500`}
            />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
          <div>
              <label className="block text-sm font-medium text-gray-600">
              Where are you right now in your life, emotionally and mentally?
            </label>
            <textarea
              name="ques1"
              value={formData.ques1}
              onChange={handleChange}
              required
                className={`mt-1 block w-full p-2 border ${validationErrors.ques1 ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 overflow-y-auto`}
            />
              {validationErrors.ques1 && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.ques1}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-600">
                What is something you deeply want—but haven't yet achieved?
            </label>
            <textarea
              name="ques2"
              value={formData.ques2}
              onChange={handleChange}
              required
                className={`mt-1 block w-full p-2 border ${validationErrors.ques2 ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 overflow-y-auto`}
            />
              {validationErrors.ques2 && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.ques2}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-600">
              What recurring thoughts, fears, or beliefs do you find yourself struggling with?
            </label>
            <textarea
              name="ques3"
              value={formData.ques3}
              onChange={handleChange}
              required
                className={`mt-1 block w-full p-2 border ${validationErrors.ques3 ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 overflow-y-auto`}
            />
              {validationErrors.ques3 && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.ques3}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-600">
              When was the last time you felt truly aligned—with yourself, your goals, or your life?
            </label>
            <textarea
              name="ques4"
              value={formData.ques4}
              onChange={handleChange}
              required
                className={`mt-1 block w-full p-2 border ${validationErrors.ques4 ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 overflow-y-auto`}
            />
              {validationErrors.ques4 && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.ques4}</p>
              )}
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-600">
              If you could reprogram one part of your mind—one habit, belief, or emotional pattern—what would it be, and why?
            </label>
            <textarea
              name="ques5"
              value={formData.ques5}
              onChange={handleChange}
              required
                className={`mt-1 block w-full p-2 border ${validationErrors.ques5 ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 overflow-y-auto`}
            />
              {validationErrors.ques5 && (
                <p className="mt-1 text-sm text-red-500">{validationErrors.ques5}</p>
              )}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading || generating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded-md hover:from-purple-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-300 transition-all duration-200 font-medium"
          >
            {loading ? 'Processing Responses...' : generating ? 'Generating PDFs...' : 'Submit Assessment'}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-md">
            {error}
          </div>
        )}
        
        {(clientPdfUrl || practitionerPdfUrl) && (
          <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-lg font-medium text-gray-700">Your Assessment Reports</h2>
            <p className="text-sm text-gray-500">Your personalized reports have been generated and are ready for download.</p>
            
            <div className="space-y-2">
              {clientPdfUrl && (
                <a
                  href={clientPdfUrl}
                  download={`Client_Assessment_${formData.firstName || 'Report'}.pdf`}
                  className="flex items-center justify-between px-4 py-3 bg-white text-blue-500 rounded-md border border-blue-100 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                >
                  <span className="font-medium">Client Assessment Report</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              )}
              
              {practitionerPdfUrl && (
                <a
                  href={practitionerPdfUrl}
                  download={`Practitioner_Report_${formData.firstName || 'Report'}.pdf`}
                  className="flex items-center justify-between px-4 py-3 bg-white text-purple-500 rounded-md border border-purple-100 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                >
                  <span className="font-medium">Practitioner Case Report</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}