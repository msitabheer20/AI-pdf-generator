'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FooterWithScroll() {
  const pathname = usePathname();

  const handleSmoothScroll = (e: React.MouseEvent) => {
    // Check if we're on the same page as the link target
    if ((pathname === '/privacy-policy' && e.currentTarget.getAttribute('href') === '/privacy-policy') ||
      (pathname === '/terms-and-conditions' && e.currentTarget.getAttribute('href') === '/terms-and-conditions')) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="py-4 md:py-6 border-t border-gray-200 font-open-sans">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 mb-4 md:mb-8">
          <Link
            href="/terms-and-conditions"
            className="text-sm md:text-base hover:text-gray-600 underline font-open-sans"
            onClick={handleSmoothScroll}
          >
            Terms and Conditions
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm md:text-base hover:text-gray-600 underline font-open-sans"
            onClick={handleSmoothScroll}
          >
            Privacy Policy
          </Link>
        </div>
        <h2 className="text-lg md:text-2xl text-gray-400 font-open-sans">Proudly brought to you by the Neuro Change Institute ®</h2>
      </div>
    </footer>
  );
} 