'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const TermsAndConditions = () => {
  const router = useRouter();

  const navigateToAssessment = () => {
    router.push('/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <main className="max-w-4xl w-full font-open-sans">
        <h1 className="text-4xl md:text-6xl lg:text-8xl mb-8 md:mb-16 text-gray-900 text-center">Terms & Conditions</h1>

        <section className="mb-10">
          <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-gray-800">
            Disclaimer and Limitation of Liability
          </p>

          <div className="space-y-6 text-gray-700">
            <p className="mb-4 text-sm md:text-base">
              <strong className="text-gray-900">Nature of Service:</strong> DreamScape AI, in association with Neuro Change Institute Pty Ltd, provides personalized assessments using advanced AI tools trained on our proprietary, evidence-based Neuro Change Method. It is important to note that the services offered by DreamScape AI are not therapeutic in nature and are not intended to replace professional medical advice, diagnosis, or treatment.
            </p>

            <p className="mb-4 text-sm md:text-base">
              <strong className="text-gray-900">Accuracy of Information:</strong> While DreamScape AI strives to provide valuable insights, the accuracy of the reports generated depends on the information you provide and the inherent limitations of artificial intelligence. The suggestions and information provided are intended to assist you in your personal development journey but should not be seen as definitive or exhaustive.
            </p>

            <p className="mb-4 text-sm md:text-base">
              <strong className="text-gray-900">No Liability for Decisions:</strong> The use of any information provided by DreamScape AI is solely at your own risk. DreamScape AI, Neuro Change Institute Pty Ltd, its affiliates, and its service providers shall not be liable for any decisions made or actions taken in reliance on the information provided through this service.
            </p>

            <p className="mb-4 text-sm md:text-base">
              <strong className="text-gray-900">Limitations of AI:</strong> Please be aware that the AI components of DreamScape AI do not have human judgment, emotional understanding, or personal knowledge of your unique circumstances; therefore, their applicability may be limited in certain scenarios.
            </p>

            <p className="mb-4 text-sm md:text-base">
              <strong className="text-gray-900">Indemnification:</strong> By using DreamScape AI, you agree to indemnify, defend, and hold harmless DreamScape AI, Neuro Change Institute Pty Ltd, and their affiliates, officers, agents, employees, and partners from any claim or demand, including reasonable attorney&apos;s fees, made by any third party due to or arising out of your use of the services, your breach of this disclaimer, or your violation of any rights of another.
            </p>
          </div>

          <div className="flex justify-center mt-12 mb-12">
            <button
              className="relative px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg text-white font-semibold rounded-full border border-blue-200 bg-blue-700 overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#446AFF] hover:border-transparent hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 font-open-sans"
              onClick={navigateToAssessment}
            >
              Take an Assessment
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsAndConditions; 