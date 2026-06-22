import nodemailer from 'nodemailer';
import aws from '@aws-sdk/client-ses';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeLog, maskEmail as logMaskEmail } from './registrationLogService.js';

const LOGO_PATH = join(dirname(fileURLToPath(import.meta.url)), '../assets/png - aht-logo.png');

function maskEmail(email) {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 3)}***@${domain}`;
}

const { SESClient } = aws;

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const transporter = nodemailer.createTransport({
  SES: { ses: sesClient, aws },
});

/**
 * Send a registration confirmation email.
 * @param {Object} registration
 * @param {string} registration.ticketId
 * @param {string} registration.attendeeName
 * @param {string} registration.attendeeEmail
 * @param {string} [registration.organization]
 * @param {string} [registration.role]
 * @param {string} [registration.dietaryRestrictions]
 * @param {string} [registration.accessibilityNeeds]
 */
export async function sendConfirmationEmail(registration) {
  const {
    ticketId,
    attendeeName,
    attendeeEmail,
    organization,
    role,
    dietaryRestrictions,
    accessibilityNeeds,
  } = registration;

  const t0 = Date.now();
  console.log(`[Email] SEND_START | ts=${new Date().toISOString()} ticketId=${ticketId} to=${maskEmail(attendeeEmail)}`);

  // Hardcoded event information (single event)
  const eventName = 'AllHealthTech 2026';
  const eventLocation = 'Hotel Royal Orchid, Domlur, Bangalore';

  // Build optional fields rows
  let optionalFieldsRows = '';

  if (organization) {
    optionalFieldsRows += `
          <tr>
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF; width: 38%;">Organization</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${organization}</td>
          </tr>`;
  }

  if (role) {
    optionalFieldsRows += `
          <tr style="background: #FAF3FF;">
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Role</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${role}</td>
          </tr>`;
  }

  if (dietaryRestrictions) {
    optionalFieldsRows += `
          <tr>
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Dietary Restrictions</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${dietaryRestrictions}</td>
          </tr>`;
  }

  if (accessibilityNeeds) {
    optionalFieldsRows += `
          <tr style="background: #FAF3FF;">
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Accessibility Needs</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${accessibilityNeeds}</td>
          </tr>`;
  }

  const html = `
    <div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFEF9; border-radius: 8px; overflow: hidden; border: 1px solid #D6CFFF;">

      <!-- HEADER -->
      <div style="background: #FAF3FF; padding: 32px 40px; text-align: center; border-bottom: 3px solid #EB42FA;">
        <img src="cid:logo" alt="AllHealthTech" height="90" style="display: block; margin: 0 auto 20px; height: 90px; width: auto;" />
        <h1 style="color: #000E7A; margin: 0 0 6px; font-size: 19px; font-weight: 700; letter-spacing: -0.3px;">Registration Confirmed</h1>
        <p style="color: #0023FD; margin: 0; font-size: 13px; font-weight: 500;">${eventName}</p>
      </div>

      <!-- BODY -->
      <div style="background: #FFFEF9; padding: 36px 40px;">
        <p style="font-size: 15px; margin: 0 0 6px; color: #00084A;">Dear <strong>${attendeeName}</strong>,</p>
        <p style="font-size: 14px; color: #1A2A8A; margin: 0 0 28px; line-height: 1.6;">Your registration for <strong>${eventName}</strong> is confirmed. Here are your details:</p>

        <!-- Ticket ID -->
        <div style="background: #EDE8FF; border-left: 4px solid #EB42FA; padding: 18px 20px; margin: 0 0 24px; border-radius: 6px;">
          <p style="margin: 0 0 6px; font-size: 11px; font-weight: 700; color: #000E7A; text-transform: uppercase; letter-spacing: 1px;">Your Ticket ID</p>
          <p style="margin: 0 0 6px; font-family: 'Courier New', Courier, monospace; font-size: 22px; font-weight: 700; color: #00084A; letter-spacing: 3px;">${ticketId}</p>
          <p style="margin: 0; font-size: 12px; color: #4B5BB0;">Keep this ID safe — you'll need it for check-in</p>
        </div>

        <!-- Event Details -->
        <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px; background: #FFFEF9; border-radius: 8px; overflow: hidden; border: 1px solid #D6CFFF;">
          <tr>
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF; width: 38%;">Event</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${eventName}</td>
          </tr>
          <tr style="background: #FAF3FF;">
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Location</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${eventLocation}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Name</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${attendeeName}</td>
          </tr>
          <tr style="background: #FAF3FF;">
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Email</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${attendeeEmail}</td>
          </tr>${optionalFieldsRows}
        </table>

        <!-- Non-refundable notice -->
        <p style="font-size: 12px; color: #4B5BB0; margin: 0 0 20px; padding: 10px 14px; background: #EDE8FF; border-radius: 6px;">
          Please note: all ticket sales are <strong>final and non-refundable</strong>. This ticket is non-transferable.
        </p>

        <!-- Help -->
        <div style="background: #FFFEF9; border: 1px solid #D6CFFF; padding: 16px 20px; border-radius: 6px; margin: 0 0 28px;">
          <p style="margin: 0 0 8px; font-size: 11px; font-weight: 700; color: #000E7A; text-transform: uppercase; letter-spacing: 1px;">Need Help?</p>
          <p style="margin: 0 0 4px; font-size: 13px; color: #1A2A8A;">
            <strong>Email:</strong> <a href="mailto:maklabs@allhealthtech.com" style="color: #000E7A; text-decoration: none;">maklabs@allhealthtech.com</a>
          </p>
          <p style="margin: 0; font-size: 13px; color: #1A2A8A;">
            <strong>Phone:</strong> <a href="tel:+919900741100" style="color: #000E7A; text-decoration: none;">+91 99007 41100</a>
          </p>
        </div>

        <p style="font-size: 13px; color: #4B5BB0; margin: 0;">We look forward to seeing you at <strong>${eventName}</strong>!</p>
      </div>

      <!-- FOOTER -->
      <div style="background: #00084A; padding: 20px 40px; text-align: center;">
        <p style="margin: 0 0 4px; font-size: 12px; color: #D6CFFF;">© 2026 AllHealthTech. All rights reserved.</p>
        <p style="margin: 0; font-size: 12px; color: #4B5BB0;">allhealthtech.com</p>
      </div>

    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_ADDRESS}>`,
      replyTo: 'maklabs@allhealthtech.com',
      to: attendeeEmail,
      ...(process.env.BCC_EMAIL ? { bcc: process.env.BCC_EMAIL } : {}),
      subject: `Your ${eventName} Ticket Confirmation - ${ticketId}`,
      html,
      text: `Dear ${attendeeName},\n\nYour registration for ${eventName} is confirmed.\n\nTicket ID: ${ticketId}\nEvent: ${eventName}\nLocation: ${eventLocation}\nName: ${attendeeName}\nEmail: ${attendeeEmail}\n\nNeed help? Email: maklabs@allhealthtech.com | Phone: +91 99007 41100\n\nAllHealthTech 2026`,
      attachments: [{ filename: 'logo.png', path: LOGO_PATH, cid: 'logo' }],
      headers: {
        'List-Unsubscribe': '<mailto:maklabs@allhealthtech.com?subject=unsubscribe>',
      },
    });
    const duration = Date.now() - t0
    console.log(`[Email] SEND_SUCCESS | ts=${new Date().toISOString()} ticketId=${ticketId} to=${maskEmail(attendeeEmail)} durationMs=${duration}`);
    writeLog({
      event: 'EMAIL_SENT', status: 'SUCCESS',
      registrationId: registration.id ?? null,
      ticketId,
      attendeeEmail: logMaskEmail(attendeeEmail),
      durationMs: duration,
      message: 'Confirmation email sent via AWS SES',
    }).catch((e) => console.error('[Log] EMAIL_SENT write failed:', e.message))
  } catch (err) {
    const duration = Date.now() - t0
    console.error(`[Email] SEND_FAILED | ts=${new Date().toISOString()} ticketId=${ticketId} to=${maskEmail(attendeeEmail)} error="${err.message}" durationMs=${duration}`);
    writeLog({
      event: 'EMAIL_FAILED', status: 'FAILED',
      registrationId: registration.id ?? null,
      ticketId,
      attendeeEmail: logMaskEmail(attendeeEmail),
      durationMs: duration,
      errorCode: 'SES_SEND_ERROR',
      errorMessage: err.message,
      message: 'Confirmation email failed',
    }).catch((e) => console.error('[Log] EMAIL_FAILED write failed:', e.message))
    throw err;
  }
}


export { transporter };
