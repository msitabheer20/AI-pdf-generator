'use client';
import AssessmentForm from '@/components/AssessmentForm';
import Image from 'next/image';

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center p-4 pb-16">
      <div className="w-full max-w-4xl mb-8 font-open-sans">
        <h1 className="text-4xl md:text-6xl mb-6 text-gray-900">
          Discover the Hidden You
        </h1>
        <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-900">
          DreamScape AI<span className="font-open-sans">™</span>: The Free Self-Discovery Tool Every Person Deserves
        </h2>

        <p className="text-sm md:text-base mb-6 text-gray-900">
          Unlock the Hidden Forces Driving Your Life—In Just Minutes What if an advanced AI could reveal your true purpose, your deepest desires, and the unconscious beliefs that shape your life—all in one beautifully personal, FREE self-assessment?
        </p>

        <p className="text-lg md:text-xl font-bold mb-2 text-gray-900">
          DreamScape AI<span className="font-open-sans">™</span> – a revolutionary tool designed for people who want more out of life.
        </p>

        <div className="mb-6">
          <ul className="list-disc pl-6 mb-4 text-sm md:text-base text-gray-900">
            <li className="mb-2 list-none font-bold">
              ✨ What You'll Discover with DreamScape AI<span className="font-open-sans">™</span> (for FREE):
            </li>
            <li className="mb-2 list-none">
              <span>✅ What your subconscious mind is really seeking—beyond surface-level goals</span>
            </li>
            <li className="mb-2 list-none">
              <span>✅ The emotional patterns and hidden beliefs that may be holding you back</span>
            </li>
            <li className="mb-2 list-none">
              <span>✅ A personalized AI-generated blueprint to create more confidence, freedom, purpose, and balance</span>
            </li>
            <li className="mb-2 list-none">
              <span>✅ How to align your thoughts, energy, and actions to live life on your own terms</span>
            </li>
            <li className="mb-2 list-none">
              <span>The first steps to finally feel seen, strong, and in control of your story</span>
            </li>
          </ul>
        </div>

        <p className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
          Just answer 5 powerful questions.
        </p>

        <p className="text-sm md:text-base mb-6 text-gray-900">
          <span className="font-bold">DreamScape AI<span className="font-open-sans">™</span></span> does the rest. You'll receive a personalized roadmap for real, measurable change — based entirely on your unique way of thinking, feeling, speaking, and acting. This is not guesswork. It's tailored transformation.
        </p>

        <p className="text-sm md:text-base mb-6 text-gray-900">
          <span className="font-bold">DreamScape AI<span className="font-open-sans">™</span></span> identifies the hidden patterns holding you back and gives you a clear, direct path forward — so you can reach your goals with clarity, speed, and confidence.
        </p>

        <p className="text-sm md:text-base font-bold mb-8 text-gray-900">
          It's not magic. It's you — finally aligned with what works.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row max-w-6xl gap-6 md:gap-12 lg:gap-20 items-center">
        <div className="w-full md:w-1/2 relative self-start">
          <Image 
            src="/neurochange-form.png" 
            alt="NeuroChange Assessment" 
            width={600} 
            height={600} 
            className="w-full h-auto object-contain"
            priority
          />
        </div>
        <div className="w-full md:w-1/2">
          <AssessmentForm />
        </div>
      </div>
    </div>
  );
} 