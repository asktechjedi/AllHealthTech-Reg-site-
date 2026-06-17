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

  // Hardcoded event information (single event)
  const eventName = 'AllHealthTech 2026';
  const eventDate = 'October 15-17, 2026';
  const eventLocation = 'Bombay Exhibition Centre, Mumbai';
  const ticketTypeName = 'General Admission';

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
    <div style="font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF3FF; border-radius: 8px; overflow: hidden;">

      <!-- HEADER -->
      <div style="background: #000E7A; padding: 32px 40px; text-align: center; border-bottom: 3px solid #EB42FA;">
        <img src="https://allhealthtech.com/email-logo.png" alt="AllHealthTech" height="44" style="display: block; margin: 0 auto 20px; height: 44px; width: auto;" />
        <h1 style="color: #ffffff; margin: 0 0 6px; font-size: 22px; font-weight: 600; letter-spacing: -0.3px;">Registration Confirmed</h1>
        <p style="color: #D6CFFF; margin: 0; font-size: 14px;">${eventName}</p>
      </div>

      <!-- BODY -->
      <div style="background: #FAF3FF; padding: 36px 40px;">
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
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Date</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${eventDate}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Location</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${eventLocation}</td>
          </tr>
          <tr style="background: #FAF3FF;">
            <td style="padding: 12px 16px; font-size: 13px; font-weight: 600; color: #000E7A; border-bottom: 1px solid #D6CFFF;">Ticket Type</td>
            <td style="padding: 12px 16px; font-size: 13px; color: #1A2A8A; border-bottom: 1px solid #D6CFFF;">${ticketTypeName}</td>
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

        <!-- Instructions -->
        <div style="background: #EDE8FF; border-left: 4px solid #000E7A; padding: 16px 20px; margin: 0 0 20px; border-radius: 6px;">
          <p style="margin: 0 0 10px; font-size: 11px; font-weight: 700; color: #000E7A; text-transform: uppercase; letter-spacing: 1px;">Important — Save This Email</p>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #1A2A8A; line-height: 1.9;">
            <li>Bring this email (or a screenshot) to the event for check-in</li>
            <li>Your Ticket ID <strong>${ticketId}</strong> is required at the entrance</li>
            <li>This ticket is non-transferable</li>
          </ul>
        </div>

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

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: attendeeEmail,
    subject: `Your ${eventName} Ticket Confirmation - ${ticketId}`,
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
 */
export async function sendCancellationEmail(registration) {
  const { ticketId, attendeeName, attendeeEmail, refundId, refundStatus, amountPaid } =
    registration;

  // Hardcoded event information (single event)
  const eventName = 'AllHealthTech 2026';

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountPaid / 100); // amountPaid stored in paise

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <div style="background: #dc2626; padding: 32px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #fff; margin: 0; font-size: 24px;">Registration Cancelled</h1>
        <p style="color: #fecaca; margin: 8px 0 0;">${eventName}</p>
      </div>
      <div style="background: #f9fafb; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
        <p style="font-size: 16px;">Dear <strong>${attendeeName}</strong>,</p>
        <p>Your registration for <strong>${eventName}</strong> has been successfully cancelled.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr style="background: #fef2f2;">
            <td style="padding: 12px 16px; font-weight: bold; width: 40%; border-bottom: 1px solid #e5e7eb;">Ticket ID</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-family: monospace; font-size: 15px;">${ticketId}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Event</td>
            <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${eventName}</td>
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
