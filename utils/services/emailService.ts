import sgMail from '@sendgrid/mail';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType?: string;
  }>;
}

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    // Convert options to SendGrid format
    const msg = {
      from: process.env.EMAIL_FROM || 'noreply@dreamscapeai.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || '',
      attachments: options.attachments?.map(attachment => ({
        filename: attachment.filename,
        content: attachment.content.toString('base64'),
        type: attachment.contentType || 'application/pdf',
        disposition: 'attachment'
      }))
    };

    // Send mail with SendGrid
    await sgMail.send(msg);
    console.log(`Email sent successfully to: ${options.to}`);

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL || 'admin@dreamscapeai.com';

export const sendClientAndPractitionerReports = async (
  practitionerEmail: string,
  clientName: string,
  practitionerPdfBuffer: Buffer,
  clientPdfBuffer: Buffer,
  userEmail?: string,
  practitionerName?: string
): Promise<{success: boolean, userEmailSent: boolean}> => {
  let success = true;
  let userEmailSent = true;

  // Only send to practitioner if an email is provided
  if (practitionerEmail) {
    const options: EmailOptions = {
      to: practitionerEmail,
      subject: `Subject: DSAI Assessment Reports for ${clientName}`,
      text: `Dear Practitioner,\n\nAttached are the assessment reports for ${clientName}, submitted under you.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0; text-align: left;">
          <p>Dear Practitioner,</p>
          <p>Attached are the assessment reports for ${clientName} ${userEmail ? ` (${userEmail})` : ''}, submitted under you.</p>
          <p>Please send a message to <a href="mailto:charlyn@neurochangeinsitute.org" style="color: blue;">charlyn@neurochangeinsitute.org</a> if you need any further information.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Neuro_Change_Method_TM_Practitioner_Report.pdf`,
          content: practitionerPdfBuffer,
          contentType: 'application/pdf',
        },
        {
          filename: `Neuro_Change_Method_TM_Client_Assessment_Report.pdf`,
          content: clientPdfBuffer,
          contentType: 'application/pdf',
        }
      ],
    };

    const practitionerEmailSent = await sendEmail(options);
    if (!practitionerEmailSent) {
      success = false;
      console.error(`Failed to send reports to ${practitionerEmail}`);
    }
  }

  // Send to the user if an email is provided
  if (userEmail) {
    const userOptions: EmailOptions = {
      to: userEmail,
      subject: `Your Dreamscape AI Assessment Report`,
      text: `Dear ${clientName},\n\nThank you for submitting your responses through the Dreamscape AI website. We're excited to share that your personalized client assessment report is attached to this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0; text-align: left;">
          <p>Dear ${clientName},</p>
          <p>Thank you for submitting your responses through the Dreamscape AI website. We're excited to share that your personalized client assessment report is attached to this email.</p>
          <p>If you have any questions or would like further support, please feel free to reach out to the certified Neuro Change Practitioner who introduced you to Dreamscape AI.</p>
          <p>Welcome aboard — we look forward to supporting your journey!</p>
          <p style="margin-top: 20px;">Warm regards,</p>
        </div>
      `,
      attachments: [
        {
          filename: `Neuro_Change_Method_TM_Client_Assessment_Report.pdf`,
          content: clientPdfBuffer,
          contentType: 'application/pdf',
        }
      ],
    };

    userEmailSent = await sendEmail(userOptions);
    if (!userEmailSent) {
      console.error(`Failed to send client report to user email: ${userEmail}`);
    }
  }

  // Always send a copy to the default admin email
  const adminOptions: EmailOptions = {
    to: DEFAULT_ADMIN_EMAIL,
    subject: `Subject: DSAI Assessment Reports for ${clientName} ${userEmail ? ` (${userEmail})` : ''} - ${practitionerEmail}`,
    text: `Dear Admin,\n\nAttached are the assessment reports for ${clientName} ${userEmail ? ` (${userEmail})` : ''}, submitted under ${practitionerName }.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0; text-align: left;">
        <p>Dear Admin,</p>
        <p>Attached are the assessment reports for ${clientName} ${userEmail ? ` (${userEmail})` : ''}, submitted under ${practitionerName} (${practitionerEmail}).</p>
        <p>Please send a message to <a href="mailto:charlyn@neurochangeinsitute.org" style="color: blue;">charlyn@neurochangeinsitute.org</a> if you need any further information.</p>
      </div>
    `,
    attachments: [
      {
        filename: `Neuro_Change_Method_TM_Practitioner_Report.pdf`,
        content: practitionerPdfBuffer,
        contentType: 'application/pdf',
      },
      {
        filename: `Neuro_Change_Method_TM_Client_Assessment_Report.pdf`,
        content: clientPdfBuffer,
        contentType: 'application/pdf',
      }
    ],
  };

  const adminEmailSent = await sendEmail(adminOptions);
  if (!adminEmailSent) {
    success = false;
    console.error(`Failed to send admin copy of reports to ${DEFAULT_ADMIN_EMAIL}`);
  }

  return { success, userEmailSent };
};

// Keep the original function for backward compatibility
export const sendPractitionerReport = async (
  practitionerEmail: string,
  clientName: string,
  pdfBuffer: Buffer,
  userEmail?: string,
  practitionerName?: string
): Promise<boolean> => {
  let success = true;

  // Only send to practitioner if an email is provided
  if (practitionerEmail) {
    const options: EmailOptions = {
      to: practitionerEmail,
      subject: `Neuro Change Method™ - Practitioner Report for ${clientName}`,
      text: `Dear Practitioner,\n\nAttached is the practitioner report for ${clientName}${userEmail ? ` (${userEmail})` : ''} generated using the Neuro Change Method™.\n\nBest regards,\nDreamScape AI Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6633CC;">Neuro Change Method™ - Practitioner Report</h2>
          <p>Dear Practitioner,</p>
          <p>Attached is the practitioner report for <strong>${clientName}${userEmail ? ` (${userEmail})` : ''}</strong> generated using the Neuro Change Method™.</p>
          <p>This report contains a comprehensive analysis of the client's responses and recommendations for their transformation journey.</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p><strong>DreamScape AI Team</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: `Neuro_Change_Method_TM_Practitioner_Report.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    const practitionerEmailSent = await sendEmail(options);
    if (!practitionerEmailSent) {
      success = false;
      console.error(`Failed to send practitioner report to ${practitionerEmail}`);
    }
  }

  // Always send a copy to the default admin email
  const adminOptions: EmailOptions = {
    to: DEFAULT_ADMIN_EMAIL,
    subject: `[COPY] Neuro Change Method™ - Practitioner Report for ${clientName}${userEmail ? ` (${userEmail})` : ''}`,
    text: `Admin Copy - Practitioner Report\n\nAttached is the practitioner report for ${clientName}${userEmail ? ` (${userEmail})` : ''} generated using the Neuro Change Method™.\n\nSelected practitioner: ${practitionerName ? `${practitionerName} (${practitionerEmail})` : practitionerEmail || 'None'}\n\nBest regards,\nDreamScape AI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6633CC;">[ADMIN COPY] Neuro Change Method™ - Practitioner Report</h2>
        <p>This is an admin copy of the practitioner report.</p>
        <p>Attached is the practitioner report for <strong>${clientName}${userEmail ? ` (${userEmail})` : ''}</strong> generated using the Neuro Change Method™.</p>
        <p><strong>Selected practitioner:</strong> ${practitionerName ? `${practitionerName} (${practitionerEmail})` : practitionerEmail || 'None'}</p>
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>DreamScape AI Team</strong></p>
      </div>
    `,
    attachments: [
      {
        filename: `Admin_Copy_Practitioner_Report_${clientName}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  const adminEmailSent = await sendEmail(adminOptions);
  if (!adminEmailSent) {
    success = false;
    console.error(`Failed to send admin copy of practitioner report to ${DEFAULT_ADMIN_EMAIL}`);
  }

  return success;
};