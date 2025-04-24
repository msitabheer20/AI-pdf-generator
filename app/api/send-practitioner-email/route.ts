import { NextResponse } from 'next/server';
import { sendPractitionerReport } from '@/utils/services/emailService';

export async function POST(request: Request) {
  try {
    const { practitionerEmail, firstName, pdfBase64 } = await request.json();
    
    if (!practitionerEmail || !firstName || !pdfBase64) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    // Send email with PDF attachment
    const emailSent = await sendPractitionerReport(
      practitionerEmail,
      firstName,
      pdfBuffer
    );

    if (emailSent) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error: any) {
    console.error('Email sending error:', error.message);
    
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
} 