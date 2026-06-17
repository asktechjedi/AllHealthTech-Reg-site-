import '../src/config/env.js';
import { sendConfirmationEmail } from '../src/services/emailService.js';

const to = process.argv[2];
if (!to) {
  console.error('Usage: node scripts/test-email.js your@email.com');
  process.exit(1);
}

console.log(`Sending test confirmation email to ${to}...`);

await sendConfirmationEmail({
  ticketId: 'AHT2026-TEST01',
  attendeeName: 'Test Attendee',
  attendeeEmail: to,
  organization: 'AllHealthTech',
  role: 'Developer',
  dietaryRestrictions: 'Vegetarian',
});

console.log('Done! Check your inbox.');
