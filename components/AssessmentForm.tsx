'use client';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generateClientPDF, generatePractitionerPDF } from '@/utils/structuredPdfUtils';
import { questions } from '@/utils/questions';
import { sanitizeFormData } from '@/utils/validation/sanitize';
import { AssessmentFormData, assessmentFormSchema } from '@/utils/validation/schema';
import Image from 'next/image';

interface Practitioner {
  email: string;
  label: string;
  code: string;
}

type FormDataWithDuplicateCheck = AssessmentFormData & {
  duplicateResponses?: string
}

const formSchemaWithDuplicateCheck = assessmentFormSchema.superRefine((data, ctx) => {
  const responses = [data.ques1, data.ques2, data.ques3, data.ques4, data.ques5];
  const trimmedResponses = responses.map(response => response.trim().toLowerCase());
  const uniqueResponses = new Set(trimmedResponses);

  if (uniqueResponses.size !== responses.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Try to provide unique answers for each question — It helps us better understand",
      path: ["duplicateResponses"]
    });
  }
});

export default function AssessmentForm() {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [clientPdfUrl, setClientPdfUrl] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [retryMode, setRetryMode] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);

  const defaultValues = {
    firstName: '',
    email: '',
    practitionerCode: '',
    practitionerEmail: '',
    ques1: '',
    ques2: '',
    ques3: '',
    ques4: '',
    ques5: '',
  };

  const {
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
    watch
  } = useForm<FormDataWithDuplicateCheck>({
    resolver: zodResolver(formSchemaWithDuplicateCheck),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues
  });

  // Watch practitioner code value
  const practitionerCode = watch('practitionerCode');

  // Fetch practitioner data from JSON
  useEffect(() => {
    fetch('/practitioners.json')
      .then(response => response.json())
      .then(data => {
        setPractitioners(data);
      })
      .catch(error => {
        console.error('Error fetching practitioners:', error);
      });
  }, []);

  useEffect(() => {
    if (showConfirmation) {
      setClientPdfUrl('');
    }
  }, [showConfirmation]);

  // Validate practitioner code and update practitioner email whenever the code changes
  useEffect(() => {
    if (practitionerCode) {
      const practitioner = practitioners.find(p => p.code === practitionerCode);
      if (practitioner) {
        setValue('practitionerEmail', practitioner.email);
      } else {
        setValue('practitionerEmail', '');
        // Set custom error for invalid code
        if (practitioners.length > 0) {
          setValue('practitionerCode', practitionerCode, {
            shouldValidate: true,
            shouldDirty: true
          });
        }
      }
    } else {
      setValue('practitionerEmail', '');
    }
  }, [practitionerCode, practitioners, setValue]);

  const onSubmit = () => {
    setShowConfirmation(true);
  };

  const handleConfirmedSubmit = async () => {
    setShowConfirmation(false);
    setLoading(true);
    setError('');
    setRetryMode(false);

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

      // Extract just the first name if user entered full name
      const firstNameOnly = firstName.split(' ')[0];

      setGenerating(true);

      const frontendResponses = {
        questions: [...questions] as string[],
        responses: sanitizedData
      };

      try {
        const clientBlob = await generateClientPDF(firstNameOnly, clientContent, frontendResponses);
        const clientUrl = window.URL.createObjectURL(clientBlob);

        setLoading(false);
        setGenerating(false);
        setClientPdfUrl(clientUrl);

        if (sanitizedData.practitionerEmail) {
          const practitionerBlob = await generatePractitionerPDF(firstNameOnly, practitionerContent);

          const practitionerBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(practitionerBlob);
            reader.onloadend = () => {
              const base64data = reader.result as string;
              resolve(base64data.split(',')[1]);
            };
          });

          const clientBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(clientBlob);
            reader.onloadend = () => {
              const base64data = reader.result as string;
              resolve(base64data.split(',')[1]);
            };
          });

          fetch('/api/send-practitioner-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              practitionerEmail: sanitizedData.practitionerEmail,
              firstName: sanitizedData.firstName,
              practitionerPdfBase64: practitionerBase64,
              clientPdfBase64: clientBase64,
              userEmail: sanitizedData.email
            }),
          }).then(emailResponse => {
            if (!emailResponse.ok) {
              console.error('Background email sending failed');
              setEmailError(true);
            }
          }).catch(err => {
            console.error('Background email error:', err);
            setEmailError(true);
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
    <div className="bg-transparent max-w-2xl w-full font-[system-ui,-apple-system,BlinkMacSystemFont,Segoe_UI,Roboto,Oxygen,Ubuntu,Cantarell,Open_Sans,Helvetica_Neue,sans-serif]">
      {/* <div className="flex items-center justify-center mb-6">
        <div className="w-25 h-25 mr-3 relative">
          <Image
            src="/nci-logo.png"
            alt=''
            fill
            style={{ objectFit: 'contain' }}
            priority
            sizes='25'
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">DreamScape AI Assessment</h1>
          <p className="text-sm text-gray-500">The Neuro Change Institute</p>
        </div>
      </div> */}

      <form onSubmit={(e) => { e.preventDefault(); handleButtonClick(); }} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor='firstName' className="block text-sm font-bold text-gray-600">Name <span className="text-red-500">*</span></label>
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <input
                  id="firstName"
                  type="text"
                  placeholder="Your name"
                  aria-invalid={errors.firstName ? "true" : "false"}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  className={`mt-1 block w-full p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-blue-500 focus:border-blue-500`}
                  {...field}
                />
              )}
            />
            {errors.firstName && (
              <p id="firstName-error" className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor='email' className="block text-sm font-bold text-gray-600">Email <span className="text-red-500">*</span></label>
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
                  className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-blue-500 focus:border-blue-500`}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="practitionerCode" className="block text-sm font-bold text-gray-600">
              Practitioner Code <span className="text-red-500">*</span>
            </label>
            <Controller
              name="practitionerCode"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="practitionerCode"
                  placeholder="Your practitioner code"
                  disabled={practitioners.length === 0}
                  aria-invalid={errors.practitionerCode ? "true" : "false"}
                  aria-describedby={errors.practitionerCode ? "practitionerCode-error" : undefined}
                  className={`mt-1 block w-full p-2 border ${errors.practitionerEmail ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-blue-500 focus:border-blue-500`}
                  {...field}
                />
              )}
            />
            {errors.practitionerEmail && (
              <p id="practitionerEmail-error" className="mt-1 text-sm text-red-500">{errors.practitionerEmail.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="practitionerEmail" className="block text-sm font-bold text-gray-600">

            </label>
            <Controller
              name="practitionerEmail"
              control={control}
              render={({ field }) => (
                <select
                  id="practitionerEmail"
                  aria-invalid={errors.practitionerEmail ? "true" : "false"}
                  aria-describedby={errors.practitionerEmail ? "practitionerEmail-error" : undefined}
                  className={`mt-1 block w-full p-2 border border-gray-300
                    text-gray-800 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed appearance-none`}
                  {...field}
                  disabled={true}
                >
                  <option value=""></option>
                  {practitioners.map((practitioner) => (
                    <option key={practitioner.email} value={practitioner.email}>
                      {practitioner.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

        </div>

        {questions.map((question, index) => {
          const fieldName = `ques${index + 1}` as keyof FormDataWithDuplicateCheck;
          const hasError = !!errors[fieldName];

          return (
            <div key={index}>
              <label htmlFor={fieldName} className="block text-sm font-bold text-gray-600">
                {question} <span className="text-red-500">*</span>
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
                    className={`mt-1 block w-full p-2 border ${hasError ? 'border-red-500' : 'border-gray-300'} text-gray-800 focus:ring-blue-500 focus:border-blue-500 resize-none h-24 overflow-y-auto`}
                    {...field}
                  />
                )}
              />
              {hasError && (
                <p id={`${fieldName}-error`} className="mt-1 text-sm text-red-500">{errors[fieldName]?.message as string}</p>
              )}
            </div>
          );
        })}

        <div className="text-sm text-gray-500 italic">
          {/* <p>Fields marked with <span className="text-red-500">*</span> are required.</p> */}
        </div>

        {hasDuplicateError && (
          <div className="p-3 text-[13px] bg-yellow-50 text-yellow-700 ">
            Try to provide unique answers for each question — It helps us better understand your condition.
          </div>
        )}

        {clientPdfUrl && (
          <div className="p-3 text-[13px] bg-green-50 text-green-700">
            Thank you for submitting and for your patience — we appreciate you!
          </div>
        )}

        {emailError && clientPdfUrl && (
          <div className="p-3 text-[13px] bg-red-50 text-red-700">
            We couldn&apos;t send the report to your email. Please download your report below or check your spam folder if you think it went through.
          </div>
        )}

        {error && (
          <div className="mt-2 p-3 bg-red-50 text-red-500">
            <p>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || generating}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white p-3  hover:from-purple-700 hover:to-blue-600 disabled:from-gray-400 disabled:to-gray-300 transition-all duration-200 font-medium"
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
        <div className="mt-6 space-y-3 p-4 bg-gray-50 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-700">Your Assessment Report</h2>
          <p className="text-sm text-gray-500">Your personalized report has been sent to your email. You may also download it using the link below.</p>

          <div className="space-y-2">
            <a
              href={clientPdfUrl}
              download={`Neuro_Change_Method\u2122_Client_Assessment_Report.pdf`}
              className="flex items-center justify-between px-4 py-3 bg-white text-blue-500  border border-blue-100 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200"
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

      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-xl max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Confirm Submission</h3>
            <p className="text-gray-600 mb-4">Please review your responses carefully before submitting. They will be processed to generate your personalized reports.</p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelConfirmation}
                className="px-4 py-2 bg-gray-200 text-gray-800  hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmedSubmit}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white  hover:from-purple-700 hover:to-blue-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 