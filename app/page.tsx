'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center">
      <main className="container max-w-4xl mx-auto font-syne px-4 pt-6 md:pt-10">
        <h1 className="text-center mb-6 md:mb-16">
          <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-9xl text-gray-800 font-sans">Welcome to</span>
          <span className="block text-3xl sm:text-4xl md:text-6xl lg:text-9xl text-gray-800 font-sans whitespace-nowrap">DreamScape AI™</span>
        </h1>
      </main>
      
      {/* Mobile view (text below image) */}
      <div className="w-full block md:hidden">
        <div className="w-full">
          <Image
            src="/neurochange-home.png"
            alt="DreamScape AI"
            width={1920}
            height={1080}
            priority
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 leading-tight">
              Feeling stuck, off-track, or like you're meant for more?
            </h2>
            <p className="mb-3 text-base sm:text-lg text-gray-800 leading-relaxed">
              You're not alone. Most people sense a greater purpose — but feel held back without knowing why.
            </p>
            <p className="mb-5 text-base sm:text-lg text-gray-800 leading-relaxed">
              You're not stuck — you're being driven by forces you can't yet see. Answer just five key questions, and DreamScape AI™ will reveal 
              what's holding you back — and how to move forward. You'll receive a personalized, science-based roadmap designed to align 
              your thoughts, emotions, and actions with your highest potential.
            </p>
            <div className="text-center">
              <Link 
                href="/assessment" 
                className="inline-block px-5 sm:px-8 py-3 sm:py-4 text-base sm:text-lg text-white font-semibold rounded-full border border-blue-200 bg-blue-700 overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#446AFF] hover:border-transparent hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
              >
                Personalized Report
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop view (text overlay) */}
      <div className="w-full relative hidden md:block">
        <Image
          src="/neurochange-home.png"
          alt="DreamScape AI"
          width={1920}
          height={1080}
          priority
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover'
          }}
        />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl md:max-w-lg ml-0 md:ml-36 lg:ml-48 p-4 md:p-6 rounded-lg">
              <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-4 text-white leading-tight">
                Feeling stuck, off-track, or like you're meant for more?
              </h2>
              <p className="mb-4 text-lg md:text-xl text-white leading-relaxed">
                You're not alone. Most people sense a greater purpose — but feel held back without knowing why.
              </p>
              <p className="mb-6 text-lg md:text-xl text-white leading-relaxed">
                You're not stuck — you're being driven by forces you can't yet see. Answer just five key questions, and DreamScape AI™ will reveal 
                what's holding you back — and how to move forward. You'll receive a personalized, science-based roadmap designed to align 
                your thoughts, emotions, and actions with your highest potential.
              </p>
              <Link 
                href="/assessment" 
                className="inline-block px-6 md:px-10 py-3 md:py-5 text-lg md:text-xl lg:text-2xl text-white font-semibold rounded-full border border-blue-200 bg-blue-700 overflow-hidden transition-all duration-300 ease-in-out hover:bg-[#446AFF] hover:border-transparent hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
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