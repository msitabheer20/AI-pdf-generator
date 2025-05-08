'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const PrivacyPolicy = () => {
  const router = useRouter();

  const navigateToAssessment = () => {
    router.push('/assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <main className="max-w-4xl w-full font-open-sans">
        <h1 className="text-4xl md:text-6xl lg:text-8xl mb-8 md:mb-16 text-gray-900 text-center">Privacy Policy</h1>

        <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-gray-800">
          Privacy and Data Protection Policy (EU GDPR Compliant)
        </p>

        <p className="mb-4 text-gray-700">
          <strong className="text-gray-900">Effective Date:</strong> May 1st, 2025<br />
          <strong className="text-gray-900">Applies to:</strong> European Union Residents
        </p>

        <p className="mb-6 text-sm md:text-base text-gray-700">
          While this policy is designed to meet the requirements of the General Data Protection Regulation (GDPR)
          for European Union residents, DreamScape AI is equally committed to complying with all relevant privacy
          and data protection laws in the jurisdictions in which we operate, including those in the United States,
          Australia, Canada, the United Kingdom, and others.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">1. Introduction</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          At DreamScape AI, your privacy and the protection of your personal data are of the utmost importance.
          This Privacy Policy outlines how we collect, use, store, and protect your personal information in
          accordance with the General Data Protection Regulation (GDPR) (EU Regulation 2016/679).
        </p>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          By submitting your assessment on our platform, you explicitly consent to the collection and processing
          of your personal data as described in this policy.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">2. Who We Are</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          <strong className="text-gray-900">Data Controller:</strong><br />
          DreamScape AI a brand name owned by<br />
          Neuro Change Institute Pty Ltd
        </p>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          427 South Rod Moorabbin Victoria 3189<br />
          info@neurochangeinstitute.org
        </p>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          We are the legal entity responsible for determining the purposes and means of processing your personal data.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">3. What Personal Data We Collect</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          To deliver your personalized assessment and support your personal development journey, we collect the following:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm md:text-base text-gray-700">
          <li>First Name</li>
          <li>Email Address</li>
          <li>Responses to five specific self-assessment questions</li>
        </ul>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          We do not collect or process special categories of personal data (such as health data, racial or ethnic origin,
          political opinions, etc.).
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">4. Purpose and Legal Basis for Processing</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          Your personal data is processed for the following specific purposes:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm md:text-base text-gray-700">
          <li>To generate your personalized assessment report</li>
          <li>To automatically generate a Case Report based on your responses</li>
          <li>To share that Case Report with a certified Neuro Change Practitioner for tailored support</li>
        </ul>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          The legal basis for this processing is your explicit consent, as required under Article 6(1)(a) of the GDPR.
          You provide this consent when you check the required box and submit your responses.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">5. Data Sharing and Disclosure</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          Your Case Report is automatically and securely shared with a certified Neuro Change Practitioner as part of the
          DreamScape AI experience. This is a core part of the service you are opting into by submitting your responses.
        </p>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          We do not sell, rent, or otherwise disclose your personal data to any third parties for marketing purposes.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">6. Data Retention</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          We retain your data only as long as necessary to fulfill the purposes described above:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm md:text-base text-gray-700">
          <li>Your assessment data and Case Report are stored securely for up to 90 days unless you withdraw your consent earlier.</li>
          <li>After that period, data may be anonymized for research and service improvement, or permanently deleted.</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">7. Your Rights Under the GDPR</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          As a resident of the European Union, you have the following rights under the GDPR:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm md:text-base text-gray-700">
          <li><strong className="text-gray-900">Right to Access</strong> – You can request a copy of the data we hold about you.</li>
          <li><strong className="text-gray-900">Right to Rectification</strong> – You can request that we correct inaccurate or incomplete data.</li>
          <li><strong className="text-gray-900">Right to Erasure</strong> (&ldquo;Right to be Forgotten&rdquo;) – You can request that we delete your data, subject to applicable legal obligations.</li>
          <li><strong className="text-gray-900">Right to Withdraw Consent</strong> – You can withdraw your consent at any time.</li>
          <li><strong className="text-gray-900">Right to Data Portability</strong> – You may request a copy of your data in a structured, machine-readable format.</li>
          <li><strong className="text-gray-900">Right to Lodge a Complaint</strong> – You may file a complaint with your local Data Protection Authority.</li>
        </ul>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          To exercise any of these rights, please contact us at info@neurochangeinstitute.org
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">8. Data Security</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          We implement industry-standard physical, administrative, and technical safeguards to protect your personal data from
          unauthorized access, loss, misuse, or disclosure. This includes:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm md:text-base text-gray-700">
          <li>End-to-end encryption of submitted data</li>
          <li>Access controls and authentication protocols</li>
          <li>Regular review of data handling policies</li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">9. International Transfers</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          While our systems are hosted securely, some data may be stored or processed outside the European Economic Area (EEA).
          In such cases, we ensure that adequate safeguards (such as Standard Contractual Clauses) are in place to protect
          your personal data in compliance with GDPR requirements.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">10. Automated Decision-Making and Profiling</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          We do not use your personal data for automated decision-making that produces legal or similarly significant effects.
          Our assessments are personalized but not algorithmically determinative of outcomes.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">11. Policy Updates</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          This Privacy Policy may be updated from time to time. We will notify you of any significant changes through our
          website or by email where appropriate.
        </p>

        <h2 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-gray-900">12. Contact Information</h2>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          For privacy inquiries or to exercise your data rights, contact:
        </p>
        <p className="mb-4 text-sm md:text-base text-gray-700">
          Data Protection Officer<br />
          DreamScape AI<br />
          427 South Rd Moorabbin Victoria Australia<br />
          info@neurochangeinstitute.org
        </p>

        <div className="flex justify-center mt-12 mb-12">
          <button
            className="relative px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg text-white font-semibold rounded-full border border-blue-200 bg-blue-700 overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#446AFF] hover:border-transparent hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 font-open-sans"
            onClick={navigateToAssessment}
          >
            Take an Assessment
          </button>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy; 