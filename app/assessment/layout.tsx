import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DreamScape AI™ Assessment | Neuro Change Institute',
  description: 'Discover the hidden forces driving your life with DreamScape AI™, the free self-discovery tool. Unlock your true purpose and transform your life with our personalized assessment.',
  keywords: 'DreamScape AI, assessment, self-discovery, personal development, neuro change, free assessment',
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 