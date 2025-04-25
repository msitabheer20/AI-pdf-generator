import { NextResponse } from 'next/server';
import { sendClientAndPractitionerReports } from '@/utils/services/emailService';

export async function POST(request: Request) {
  try {
    const { practitionerEmail, firstName, practitionerPdfBase64, clientPdfBase64 } = await request.json();
    
    if (!practitionerEmail || !firstName || !practitionerPdfBase64 || !clientPdfBase64) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert base64 to buffer
    const practitionerPdfBuffer = Buffer.from(practitionerPdfBase64, 'base64');
    const clientPdfBuffer = Buffer.from(clientPdfBase64, 'base64');
    
    // Return success immediately - email will be sent in the background
    const response = NextResponse.json({ success: true });
    
    // Send email with PDF attachments (no await - runs in background)
    sendClientAndPractitionerReports(
      practitionerEmail,
      firstName,
      practitionerPdfBuffer,
      clientPdfBuffer
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