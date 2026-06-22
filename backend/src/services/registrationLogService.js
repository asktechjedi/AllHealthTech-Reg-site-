import prisma from '../lib/prisma.js'

/**
 * Write one row to RegistrationLog using raw SQL.
 * This table is created manually via pgAdmin — NOT managed by Prisma migrations.
 * All writes are fire-and-forget: callers do .catch() so failures never block the request.
 *
 * @param {Object} params
 * @param {string|null}  [params.sessionId]
 * @param {string|null}  [params.registrationId]
 * @param {string|null}  [params.ticketId]
 * @param {string}        params.event           - LogEvent enum value
 * @param {string}        params.status          - LogStatus enum value
 * @param {string|null}  [params.attendeeEmail]
 * @param {string|null}  [params.attendeePhone]
 * @param {string|null}  [params.razorpayOrderId]
 * @param {string|null}  [params.razorpayPaymentId]
 * @param {number|null}  [params.amountPaise]
 * @param {string|null}  [params.message]
 * @param {string|null}  [params.errorCode]
 * @param {string|null}  [params.errorMessage]
 * @param {string|null}  [params.ipAddress]
 * @param {string|null}  [params.userAgent]
 * @param {number|null}  [params.durationMs]
 * @param {Object|null}  [params.metadata]
 */
export async function writeLog({
  sessionId = null,
  registrationId = null,
  ticketId = null,
  event,
  status,
  attendeeEmail = null,
  attendeePhone = null,
  razorpayOrderId = null,
  razorpayPaymentId = null,
  amountPaise = null,
  message = null,
  errorCode = null,
  errorMessage = null,
  ipAddress = null,
  userAgent = null,
  durationMs = null,
  metadata = null,
}) {
  await prisma.$executeRaw`
    INSERT INTO "RegistrationLog" (
      "sessionId", "registrationId", "ticketId",
      "event", "status",
      "attendeeEmail", "attendeePhone",
      "razorpayOrderId", "razorpayPaymentId",
      "amountPaise", "message",
      "errorCode", "errorMessage",
      "ipAddress", "userAgent",
      "durationMs", "metadata"
    ) VALUES (
      ${sessionId}, ${registrationId}, ${ticketId},
      ${event}::"log_event", ${status}::"log_status",
      ${attendeeEmail}, ${attendeePhone},
      ${razorpayOrderId}, ${razorpayPaymentId},
      ${amountPaise}, ${message},
      ${errorCode}, ${errorMessage},
      ${ipAddress}, ${userAgent},
      ${durationMs}, ${metadata ? JSON.stringify(metadata) : null}::jsonb
    )
  `
}

export function maskEmail(email) {
  if (!email) return null
  const [local, domain] = email.split('@')
  return `${local.slice(0, 3)}***@${domain}`
}

export function maskPhone(phone) {
  if (!phone) return null
  return `${'*'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`
}

export function getIp(req) {
  return (
    req?.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
    req?.socket?.remoteAddress ||
    null
  )
}
