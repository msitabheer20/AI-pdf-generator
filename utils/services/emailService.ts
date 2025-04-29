import nodemailer from 'nodemailer';

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

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    const transporter = createTransporter();

    // Set up email data with unicode symbols
    const mailOptions = {
      from: `"DreamScape AI" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    };

    // Send mail with defined transport object
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);

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
  userEmail?: string
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
          <p>Attached are the assessment reports for ${clientName}, submitted under you.</p>
          <p>Please send a message to <a href="mailto:charlyn@neurochangeinsitute.org" style="color: blue;">charlyn@neurochangeinsitute.org</a> if you need any further information.</p>
        </div>
      `,
      attachments: [
        {
          filename: `Neuro_Change_Method™_Practitioner_Report.pdf`,
          content: practitionerPdfBuffer,
          contentType: 'application/pdf',
        },
        {
          filename: `Neuro_Change_Method™_Client_Assessment_Report.pdf`,
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
          filename: `Neuro_Change_Method™_Client_Assessment_Report.pdf`,
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
    subject: `Subject: DSAI Assessment Reports for ${clientName} - ${practitionerEmail}`,
    text: `Dear Admin,\n\nAttached are the assessment reports for ${clientName}, submitted under ${practitionerEmail}.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0; text-align: left;">
        <p>Dear Admin,</p>
        <p>Attached are the assessment reports for ${clientName}, submitted under ${practitionerEmail}.</p>
        <p>Please send a message to <a href="mailto:charlyn@neurochangeinsitute.org" style="color: blue;">charlyn@neurochangeinsitute.org</a> if you need any further information.</p>
      </div>
    `,
    attachments: [
      {
        filename: `Neuro_Change_Method™_Practitioner_Report.pdf`,
        content: practitionerPdfBuffer,
        contentType: 'application/pdf',
      },
      {
        filename: `Neuro_Change_Method™_Client_Assessment_Report.pdf`,
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
  pdfBuffer: Buffer
): Promise<boolean> => {
  let success = true;

  // Only send to practitioner if an email is provided
  if (practitionerEmail) {
    const options: EmailOptions = {
      to: practitionerEmail,
      subject: `Neuro Change Method™ - Practitioner Report for ${clientName}`,
      text: `Dear Practitioner,\n\nAttached is the practitioner report for ${clientName} generated using the Neuro Change Method™.\n\nBest regards,\nDreamScape AI Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6633CC;">Neuro Change Method™ - Practitioner Report</h2>
          <p>Dear Practitioner,</p>
          <p>Attached is the practitioner report for <strong>${clientName}</strong> generated using the Neuro Change Method™.</p>
          <p>This report contains a comprehensive analysis of the client's responses and recommendations for their transformation journey.</p>
          <p style="margin-top: 20px;">Best regards,</p>
          <p><strong>DreamScape AI Team</strong></p>
        </div>
      `,
      attachments: [
        {
          filename: `Practitioner_Report_${clientName}.pdf`,
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
    subject: `[COPY] Neuro Change Method™ - Practitioner Report for ${clientName}`,
    text: `Admin Copy - Practitioner Report\n\nAttached is the practitioner report for ${clientName} generated using the Neuro Change Method™.\n\nSelected practitioner: ${practitionerEmail || 'None'}\n\nBest regards,\nDreamScape AI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6633CC;">[ADMIN COPY] Neuro Change Method™ - Practitioner Report</h2>
        <p>This is an admin copy of the practitioner report.</p>
        <p>Attached is the practitioner report for <strong>${clientName}</strong> generated using the Neuro Change Method™.</p>
        <p><strong>Selected practitioner:</strong> ${practitionerEmail || 'None'}</p>
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