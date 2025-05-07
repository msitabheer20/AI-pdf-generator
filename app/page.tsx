'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center overflow-x-hidden">
      <main className="container max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        <h1 className="text-center mb-6 md:mb-12 font-syne">
          <span className="block text-4xl md:text-5xl lg:text-9xl text-gray-800">Welcome to</span>
          <span className="block text-4xl md:text-5xl lg:text-9xl text-gray-800 break-words sm:whitespace-nowrap">DreamScape AI™</span>
        </h1>
      </main>

      <div className="w-full relative mt-4">
        {/* Mobile version */}
        <div className="flex flex-col md:hidden">
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

          <div className="p-6 max-w-full font-syne">
            <h2 className="text-xl font-bold mb-3 text-black leading-tight">
              Feeling stuck, off-track, or like you&apos;re meant for more?
            </h2>
            <p className="mb-3 text-base text-black leading-relaxed">
              You&apos;re not alone. Most people sense a greater purpose — but feel held back without knowing why.
            </p>
            <p className="mb-4 text-base text-black leading-relaxed">
              You&apos;re not stuck — you&apos;re being driven by forces you can&apos;t yet see. Answer just five key questions, and DreamScape AI™ will reveal
              what&apos;s holding you back — and how to move forward.
            </p>
            <div className="flex justify-center">
              <Link
                href="/assessment"
                className="inline-block px-6 py-3 text-base text-orange-600 font-semibold rounded-full border border-orange-200 bg-white overflow-hidden transition-all duration-300 ease-in-out hover:bg-orange-600 hover:border-transparent hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 font-syne"
              >
                Personalized Report
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop version */}
        <div className="hidden md:block">
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
              <div className="max-w-xl md:max-w-lg ml-0 sm:ml-6 md:ml-24 lg:ml-36 p-6 rounded-lg font-syne">
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold mb-4 text-white leading-tight">
                  Feeling stuck, off-track, or like you&apos;re meant for more?
                </h2>
                <p className="mb-4 text-lg md:text-xl text-white leading-relaxed">
                  You&apos;re not alone. Most people sense a greater purpose — but feel held back without knowing why.
                </p>
                <p className="mb-6 text-lg md:text-xl text-white leading-relaxed">
                  You&apos;re not stuck — you&apos;re being driven by forces you can&apos;t yet see. Answer just five key questions, and DreamScape AI™ will reveal
                  what&apos;s holding you back — and how to move forward. You&apos;ll receive a personalized, science-based roadmap designed to align
                  your thoughts, emotions, and actions with your highest potential.
                </p>
                <Link
                  href="/assessment"
                  className="inline-block px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-lg sm:text-xl md:text-2xl text-orange-600 font-semibold rounded-full border border-orange-200 bg-white overflow-hidden transition-all duration-300 ease-in-out hover:bg-orange-600 hover:border-transparent hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 font-syne"
                >
                  Personalized Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}