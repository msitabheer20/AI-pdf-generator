'use client';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateClientPDF, generatePractitionerPDF } from '@/utils/structuredPdfUtils';
import { questions } from '@/utils/questions';
import { sanitizeFormData } from '@/utils/validation/sanitize';
import { AssessmentFormData, assessmentFormSchema } from '@/utils/validation/schema';

type FormDataWithDuplicateCheck = AssessmentFormData &  {
  duplicateResponses?: string
}

const formSchemaWithDuplicateCheck = assessmentFormSchema.superRefine((data, ctx) => {
  const responses = [data.ques1, data.ques2, data.ques3, data.ques4, data.ques5];
  const trimmedResponses = responses.map(response => response.trim().toLowerCase());
  const uniqueResponses = new Set(trimmedResponses);

  if (uniqueResponses.size !== responses.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please provide unique answers for each question. Some of your responses appear to be identical.",
      path: ["duplicateResponses"]
    });
  }
});

const practitionerEmails = [
  { value: "", label: "Select a practitioner" },
  { value: "ologin486@gmail.com", label: "Practioner 1" },
  { value: "charlyn.tom@icloud.com", label: "Practioner 2" },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [clientPdfUrl, setClientPdfUrl] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  // const [emailStatus, setEmailStatus] = useState('');

  const {
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors, isValid, touchedFields },
    getValues,
    reset
  } = useForm<FormDataWithDuplicateCheck>({
    resolver: zodResolver(formSchemaWithDuplicateCheck),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      email: '',
      practitionerEmail: '',
      ques1: '',
      ques2: '',
      ques3: '',
      ques4: '',
      ques5: '',
    }
  });

  useEffect(() => {
    if (showConfirmation) {
      setClientPdfUrl('');
    }
  }, [showConfirmation]);

  const onSubmit = () => {
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);
    setError('');
    setRetryMode(false);
    // setEmailStatus('');

    try {
      const sanitizedData = sanitizeFormData(getValues());

      const response = await fetch('/api/generate-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        throw new Error('Our servers are having a moment — please try again shortly');
      }

      const { clientContent, practitionerContent, firstName } = await response.json();

      setGenerating(true);

      // Pass the frontend questions and responses directly to the PDF generator
      const frontendResponses = {
        questions: [...questions] as string[],
        responses: sanitizedData
      };

      try {
        // Generate client PDF first
        const clientBlob = await generateClientPDF(firstName, clientContent, frontendResponses);
        const clientUrl = window.URL.createObjectURL(clientBlob);
        
        // Stop loading indicator as soon as client PDF is ready
        setLoading(false);
        setGenerating(false);
        setClientPdfUrl(clientUrl);
        
        // Now handle practitioner PDF and email in the background
        if (sanitizedData.practitionerEmail) {
          // setEmailStatus('Sending emails in background...');
          
          // Generate practitioner PDF
          const practitionerBlob = await generatePractitionerPDF(firstName, practitionerContent);
          
          // Convert blob to base64
          const base64Data = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(practitionerBlob);
            reader.onloadend = () => {
              const base64data = reader.result as string;
              // Remove data URL prefix
              resolve(base64data.split(',')[1]);
            };
          });
          
          // Send practitioner email in background
          fetch('/api/send-practitioner-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              practitionerEmail: sanitizedData.practitionerEmail,
              firstName: sanitizedData.firstName,
              pdfBase64: base64Data
            }),
          }).then(emailResponse => {
            if (emailResponse.ok) {
              console.log("Email sent successfully in background");
              // setEmailStatus('');
            } else {
              console.error('Background email sending failed');
              // Don't show error to user since client PDF was generated successfully
            }
          }).catch(err => {
            console.error('Background email error:', err);
            // Don't show error to user since client PDF was generated successfully
          });
        }
        
        reset();
        
      } catch (pdfError) {
        console.error('PDF generation error:', pdfError);
        setError('Error generating PDFs. Please try again.');
        setRetryMode(true);
        setLoading(false);
        setGenerating(false);
      }

    } catch (err) {
      console.error('Error:', err);
      setError('Whoops! Something went wrong — please try again in a moment');
      setRetryMode(true);
      setLoading(false);
      setGenerating(false);
    }
  };

  const handleButtonClick = () => {
    if (retryMode) {
      setError('');
      handleConfirmedSubmit();
    } else {
      hookFormSubmit(onSubmit)();
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  useEffect(() => {
    return () => {
      if (clientPdfUrl) window.URL.revokeObjectURL(clientPdfUrl);
    };
  }, [clientPdfUrl]);

  const getButtonText = () => {
    if (loading) return 'Processing Responses...';
    if (generating) return 'Generating PDFs...';
    if (retryMode) return 'Retry Submission';
    return 'Submit Assessment';
  };

  const hasDuplicateError = 'duplicateResponses' in errors;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 mr-3">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#6633CC", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#0066CC", stopOpacity: 1 }} />
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

        <form onSubmit={(e) => { e.preventDefault(); handleButtonClick(); }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor='firstName' className="block text-sm font-bold text-black">First Name</label>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Your first name"
                    aria-invalid={errors.firstName ? "true" : "false"}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    className={`mt-1 block w-full p-2 border ${errors.firstName && touchedFields.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500`}
                    {...field}
                  />
                )}
              />
              {errors.firstName && touchedFields.firstName && (
                <p id="firstName-error" className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor='email' className="block text-sm font-bold text-black">Email</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`mt-1 block w-full p-2 border ${errors.email && touchedFields.email ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500`}
                    {...field}
                  />
                )}
              />
              {errors.email && touchedFields.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor='practitionerEmail' className="block text-sm font-bold text-black">
                Practitioner Email
              </label>
              <Controller
                name="practitionerEmail"
                control={control}
                render={({ field }) => (
                  <select
                    id="practitionerEmail"
                    aria-invalid={errors.practitionerEmail ? "true" : "false"}
                    aria-describedby={errors.practitionerEmail ? "practitionerEmail-error" : undefined}
                    className={`mt-1 block w-full p-2.5 border ${errors.practitionerEmail && touchedFields.practitionerEmail ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500`}
                    {...field}
                  >
                    {practitionerEmails.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.practitionerEmail && touchedFields.practitionerEmail && (
                <p id="practitionerEmail-error" className="mt-1 text-sm text-red-500">{errors.practitionerEmail.message}</p>
              )}
            </div>
          </div>

          {/* Questions Inputs for the User */}
          {questions.map((question, index) => {
            const fieldName = `ques${index + 1}` as keyof FormDataWithDuplicateCheck;
            const hasError = !!errors[fieldName];
            const isTouched = !!touchedFields[fieldName];

            return (
              <div key={index}>
                <label htmlFor={fieldName} className="block text-sm font-bold text-black">
                  {question}
                </label>
                <Controller
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <textarea
                      id={fieldName}
                      placeholder="Your response..."
                      aria-invalid={hasError ? "true" : "false"}
                      aria-describedby={hasError ? `${fieldName}-error` : undefined}
                      className={`mt-1 block w-full p-2 border ${hasError && isTouched ? 'border-red-500' : 'border-gray-300'} rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 overflow-y-auto`}
                      {...field}
                    />
                  )}
                />
                {hasError && isTouched && (
                  <p id={`${fieldName}-error`} className="mt-1 text-sm text-red-500">{errors[fieldName]?.message as string}</p>
                )}
              </div>
            );
          })}

          {hasDuplicateError && (
            <div className="p-3 bg-yellow-50 text-yellow-700 rounded-md">
              Please provide unique answers for each question. Some of your responses appear to be identical.
            </div>
          )}

          {error && (
            <div className="mt-2 p-3 bg-red-50 text-red-500 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {/* {emailStatus && (
            <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
              <p>{emailStatus}</p>
            </div>
          )} */}

          <button
            type="submit"
            disabled={loading || generating || (!retryMode && !isValid)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3 rounded-md hover:from-purple-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-300 transition-all duration-200 font-medium"
          >
            {(loading || generating) ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {getButtonText()}
              </span>
            ) : (
              getButtonText()
            )}
          </button>
        </form>

        {clientPdfUrl && (
          <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h2 className="text-lg font-medium text-gray-700">Your Assessment Report</h2>
            <p className="text-sm text-gray-500">Your personalized report has been generated and is ready for download.</p>

            <div className="space-y-2">
              <a
                href={clientPdfUrl}
                download={`Client_Assessment_${getValues().firstName || 'Report'}.pdf`}
                className="flex items-center justify-between px-4 py-3 bg-white text-blue-500 rounded-md border border-blue-100 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
                aria-label="Download Client Assessment Report PDF"
              >
                <span className="font-medium">Client Assessment Report</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Confirm Submission</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to submit your assessment? Your responses will be processed to generate personalized reports.</p>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelConfirmation}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmedSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded hover:from-purple-700 hover:to-blue-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}