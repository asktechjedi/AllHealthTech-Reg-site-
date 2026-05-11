import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a registration confirmation email.
 * @param {Object} registration
 * @param {string} registration.ticketId
 * @param {string} registration.attendeeName
 * @param {string} registration.attendeeEmail
 * @param {{ name: string }} registration.ticketType
 * @param {{ name: string, date: string|Date, location: string }} registration.event
 */
export async function sendConfirmationEmail(registration) {
  const { ticketId, attendeeName, attendeeEmail, ticketType, event } = registration;

  const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: linear-gradient(135deg, #1e40af, #059669); padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Registration Confirmed!</h1>
        <p style="color: #d1fae5; margin: 8px 0 0;">AllHealthTech 2025</p>
      </div>
      <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px;">Dear <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${event.name}</strong> has been confirmed. Here are your ticket details:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr style="background: #eff6ff;">
            <td style="padding: 12px 16px; font-weight: bold; width: 40%; border-bottom: 1px solid #e5e7eb;">Ticket ID</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 15px; color: #1e40af;">${ticketId}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Event</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${event.name}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Date</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Location</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${event.location}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold;">Ticket Type</td>
            <td style="padding: 12px 16px;">${ticketType.name}</td>
          </tr>
        </table>

        <p style="color: #6b7280; font-size: 14px;">Please keep this email as proof of your registration. You will need your Ticket ID to check in at the event.</p>
        <p style="color: #6b7280; font-size: 14px;">We look forward to seeing you at <strong>${event.name}</strong>!</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.ORGANIZER_EMAIL,
    to: attendeeEmail,
    subject: `Your AllHealthTech 2025 Ticket Confirmation - ${ticketId}`,
    html,
  });
}

/**
 * Send a cancellation confirmation email.
 * @param {Object} registration
 * @param {string} registration.ticketId
 * @param {string} registration.attendeeName
 * @param {string} registration.attendeeEmail
 * @param {string} registration.refundId
 * @param {string} registration.refundStatus
 * @param {number} registration.amountPaid
 * @param {{ name: string }} registration.ticketType
 * @param {{ name: string }} registration.event
 */
export async function sendCancellationEmail(registration) {
  const { ticketId, attendeeName, attendeeEmail, refundId, refundStatus, amountPaid, event } =
    registration;

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountPaid / 100); // amountPaid stored in paise

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #dc2626; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Registration Cancelled</h1>
        <p style="color: #fecaca; margin: 8px 0 0;">AllHealthTech 2025</p>
      </div>
      <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px;">Dear <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${event.name}</strong> has been successfully cancelled.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr style="background: #fef2f2;">
            <td style="padding: 12px 16px; font-weight: bold; width: 40%; border-bottom: 1px solid #e5e7eb;">Ticket ID</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 15px;">${ticketId}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Event</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${event.name}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Refund ID</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-family: monospace;">${refundId}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Refund Amount</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; color: #059669; font-weight: bold;">${formattedAmount}</td>
          </tr>
          <tr style="background: #f9fafb;">
            <td style="padding: 12px 16px; font-weight: bold;">Refund Status</td>
            <td style="padding: 12px 16px;">${refundStatus}</td>
          </tr>
        </table>

        <p style="color: #6b7280; font-size: 14px;">Refunds typically take 5–7 business days to reflect in your account, depending on your bank.</p>
        <p style="color: #6b7280; font-size: 14px;">If you have any questions, please contact us with your Ticket ID.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.ORGANIZER_EMAIL,
    to: attendeeEmail,
    subject: `Registration Cancellation Confirmed - ${ticketId}`,
    html,
  });
}

export { transporter };
