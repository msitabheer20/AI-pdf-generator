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

// export const sendPractitionerReport = async (
//   practitionerEmail: string, 
//   clientName: string,
//   pdfBuffer: Buffer
// ): Promise<boolean> => {
//   const options: EmailOptions = {
//     to: practitionerEmail,
//     subject: `Neuro Change Method™ - Practitioner Report for ${clientName}`,
//     text: `Dear Practitioner,\n\nAttached is the practitioner report for ${clientName} generated using the Neuro Change Method™.\n\nBest regards,\nDreamScape AI Team`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #6633CC;">Neuro Change Method™ - Practitioner Report</h2>
//         <p>Dear Practitioner,</p>
//         <p>Attached is the practitioner report for <strong>${clientName}</strong> generated using the Neuro Change Method™.</p>
//         <p>This report contains a comprehensive analysis of the client's responses and recommendations for their transformation journey.</p>
//         <p style="margin-top: 20px;">Best regards,</p>
//         <p><strong>DreamScape AI Team</strong></p>
//       </div>
//     `,
//     attachments: [
//       {
//         filename: `Practitioner_Report_${clientName}.pdf`,
//         content: pdfBuffer,
//         contentType: 'application/pdf',
//       },
//     ],
//   };

//   return sendEmail(options);
// }; 


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