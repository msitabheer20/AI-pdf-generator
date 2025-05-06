import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import FooterWithScroll from "@/components/FooterWithScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NCI",
  description: "The Neuro Change Institute",
  icons: [
    {
      url: "/nci-logo.png",
      href: "/nci-logo.png",
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <div className="flex-grow">
          {children}
        </div>
        <FooterWithScroll />
      </body>
    </html>
  );
}
