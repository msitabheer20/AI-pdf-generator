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
    
    // Return success immediately - email will be sent in the background
    const response = NextResponse.json({ success: true });
    
    // Send email with PDF attachment (no await - runs in background)
    sendPractitionerReport(
      practitionerEmail,
      firstName,
      pdfBuffer
    ).catch(error => {
      console.error('Background email sending error:', error.message);
    });

    return response;
  } catch (error: any) {
    console.error('Email processing error:', error.message);
    
    return NextResponse.json(
      { error: 'Failed to process email request. Please try again.' },
      { status: 500 }
    );
  }
}