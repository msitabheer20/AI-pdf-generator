'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center">
      <main className="container max-w-4xl mx-auto px-4">
        <h1 className="text-center mb-8 md:mb-16">
          <span className="block text-4xl md:text-6xl lg:text-9xl text-gray-800 font-open-sans">Welcome to</span>
          <span className="block text-4xl md:text-6xl lg:text-9xl text-gray-800 font-open-sans whitespace-nowrap">DreamScape AI™</span>
        </h1>
      </main>
      
      <div className="w-full relative">
        <Image
          src="/neurochange-home.png"
          alt="DreamScape AI"
          width={1920}
          height={1080}
          priority
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl md:max-w-lg ml-12 md:ml-36 lg:ml-48 p-6 rounded-lg">
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-4 text-white leading-tight font-open-sans">
                Feeling stuck, off-track, or like you're meant for more?
              </h2>
              <p className="mb-4 text-lg md:text-xl text-white leading-relaxed font-open-sans">
                You're not alone. Most people sense a greater purpose — but feel held back without knowing why.
              </p>
              <p className="mb-6 text-lg md:text-xl text-white leading-relaxed font-open-sans">
                You're not stuck — you're being driven by forces you can't yet see. Answer just five key questions, and DreamScape AI™ will reveal 
                what's holding you back — and how to move forward. You'll receive a personalized, science-based roadmap designed to align 
                your thoughts, emotions, and actions with your highest potential.
              </p>
              <Link 
                href="/assessment" 
                className="inline-block px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-lg sm:text-xl md:text-2xl text-white font-semibold rounded-full border border-blue-200 bg-blue-700 overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#446AFF] hover:border-transparent hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 font-open-sans"
              >
                Personalized Report
              </Link>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}