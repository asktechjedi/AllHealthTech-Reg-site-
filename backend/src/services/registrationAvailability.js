import prisma from '../lib/prisma.js';

const ACTIVE_REGISTRATION = { status: { not: 'CANCELLED' } };

/**
 * Normalize phone to digits for comparison (+91, spaces, dashes ignored).
 * @param {string} phone
 * @returns {string}
 */
export function normalizePhone(phone) {
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    digits = digits.slice(-10);
  }
  return digits;
}

/**
 * @param {string} attendeeEmail
 * @returns {Promise<import('@prisma/client').Registration | null>}
 */
export async function findRegistrationByEmail(attendeeEmail) {
  const email = attendeeEmail.trim().toLowerCase();
  if (!email) return null;

  return prisma.registration.findFirst({
    where: {
      attendeeEmail: email,
      ...ACTIVE_REGISTRATION,
    },
  });
}

/**
 * @param {string} attendeePhone
 * @returns {Promise<import('@prisma/client').Registration | null>}
 */
export async function findRegistrationByPhone(attendeePhone) {
  const normalized = normalizePhone(attendeePhone);
  if (normalized.length < 7) return null;

  const registrations = await prisma.registration.findMany({
    where: ACTIVE_REGISTRATION,
    select: { id: true, ticketId: true, attendeePhone: true },
  });

  return (
    registrations.find((row) => normalizePhone(row.attendeePhone) === normalized) ?? null
  );
}

/**
 * @param {{ attendeeEmail?: string, attendeePhone?: string }} params
 * @returns {Promise<{
 *   available: boolean,
 *   emailAvailable: boolean,
 *   phoneAvailable: boolean,
 *   errors: { email?: string, phone?: string }
 * }>}
 */
export async function checkRegistrationAvailability({ attendeeEmail, attendeePhone }) {
  const result = {
    available: true,
    emailAvailable: true,
    phoneAvailable: true,
    errors: {},
  };

  if (attendeeEmail?.trim()) {
    const existingEmail = await findRegistrationByEmail(attendeeEmail);
    if (existingEmail) {
      result.emailAvailable = false;
      result.errors.email = 'This email is already registered for the event.';
    }
  }

  if (attendeePhone?.trim()) {
    const existingPhone = await findRegistrationByPhone(attendeePhone);
    if (existingPhone) {
      result.phoneAvailable = false;
      result.errors.phone = 'This phone number is already registered for the event.';
    }
  }

  result.available = result.emailAvailable && result.phoneAvailable;
  return result;
}

/**
 * @param {{ attendeeEmail?: string, attendeePhone?: string }} params
 * @returns {Promise<{ statusCode: number, body: object } | null>}
 */
export async function getAvailabilityConflictResponse({ attendeeEmail, attendeePhone }) {
  const availability = await checkRegistrationAvailability({ attendeeEmail, attendeePhone });

  if (availability.available) {
    return null;
  }

  if (!availability.emailAvailable) {
    return {
      statusCode: 409,
      body: {
        error: availability.errors.email,
        code: 'DUPLICATE_EMAIL',
        emailAvailable: false,
        phoneAvailable: availability.phoneAvailable,
      },
    };
  }

  return {
    statusCode: 409,
    body: {
      error: availability.errors.phone,
      code: 'DUPLICATE_PHONE',
      emailAvailable: true,
      phoneAvailable: false,
    },
  };
}
