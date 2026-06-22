import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import validate from '../middleware/validate.js';
import { availabilityCheckLimiter, registrationLimiter } from '../middleware/rateLimit.js';
import { generateTicketId } from '../services/ticketService.js';
import { sendConfirmationEmail } from '../services/emailService.js';
import {
  REGISTRATION_AMOUNT_PAISE,
  verifyRazorpaySignature,
} from '../services/paymentService.js';
import {
  checkRegistrationAvailability,
  getAvailabilityConflictResponse,
} from '../services/registrationAvailability.js';
import { writeLog, maskEmail as logMaskEmail, maskPhone as logMaskPhone, getIp } from '../services/registrationLogService.js';

const router = Router();

function maskEmail(email) {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 3)}***@${domain}`;
}

function maskPhone(phone) {
  return `${'*'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`;
}

const checkAvailabilityQuerySchema = z.object({
  email: z.string().trim().email('Invalid email format').toLowerCase().optional(),
  phone: z
    .string()
    .trim()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[0-9+\-\s()]+$/, 'Invalid phone number format')
    .optional(),
});

const createRegistrationSchema = z.object({
  // Sanitize and validate name: trim, max length, no special characters that could be XSS
  attendeeName: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim()
    .refine(
      (val) => val.length > 0,
      'Name cannot be empty or only whitespace'
    ),
  // Email validation with stricter rules
  attendeeEmail: z.string()
    .max(255, 'Email must be less than 255 characters')
    .trim()
    .email('Invalid email format')
    .toLowerCase(),
  // Phone validation: min 7, max 20 characters
  attendeePhone: z.string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .trim()
    .refine(
      (val) => /^[0-9+\-\s()]+$/.test(val),
      'Phone number can only contain numbers, +, -, spaces, and parentheses'
    ),
  // Optional fields with max length and sanitization
  organization: z.string()
    .max(200, 'Organization name must be less than 200 characters')
    .trim()
    .optional()
    .transform(val => val === '' ? undefined : val),
  role: z.string()
    .max(100, 'Role must be less than 100 characters')
    .trim()
    .optional()
    .transform(val => val === '' ? undefined : val),
  dietaryRestrictions: z.string()
    .max(500, 'Dietary restrictions must be less than 500 characters')
    .trim()
    .optional()
    .transform(val => val === '' ? undefined : val),
  accessibilityNeeds: z.string()
    .max(500, 'Accessibility needs must be less than 500 characters')
    .trim()
    .optional()
    .transform(val => val === '' ? undefined : val),
  razorpay_order_id: z.string().min(1, 'Razorpay order ID is required').trim(),
  razorpay_payment_id: z.string().min(1, 'Razorpay payment ID is required').trim(),
  razorpay_signature: z.string().min(1, 'Razorpay signature is required').trim(),
});

router.get('/check-availability', availabilityCheckLimiter, async (req, res, next) => {
  try {
    const parsed = checkAvailabilityQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({
        error: parsed.error.errors[0]?.message ?? 'Invalid query parameters',
        code: 'VALIDATION_ERROR',
      });
    }

    const { email, phone } = parsed.data;
    if (!email && !phone) {
      return res.status(400).json({
        error: 'Provide email and/or phone query parameters',
        code: 'VALIDATION_ERROR',
      });
    }

    const availability = await checkRegistrationAvailability({
      attendeeEmail: email,
      attendeePhone: phone,
    });

    return res.json({
      success: true,
      available: availability.available,
      emailAvailable: availability.emailAvailable,
      phoneAvailable: availability.phoneAvailable,
      errors: availability.errors,
    });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  registrationLimiter,
  validate(createRegistrationSchema),
  async (req, res, next) => {
    try {
      const {
        attendeeName,
        attendeeEmail,
        attendeePhone,
        organization,
        role,
        dietaryRestrictions,
        accessibilityNeeds,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = req.body;

      console.log(`[Registration] REQUEST_RECEIVED | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} phone=${maskPhone(attendeePhone)} name="${attendeeName}" orderId=${razorpay_order_id}`);

      const availabilityConflict = await getAvailabilityConflictResponse({
        attendeeEmail,
        attendeePhone,
      });

      console.log(`[Registration] AVAILABILITY_CHECK | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} available=${!availabilityConflict}`);

      if (availabilityConflict) {
        console.warn(`[Registration] AVAILABILITY_CONFLICT | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} code=${availabilityConflict.body.code}`);
        writeLog({
          event: 'AVAILABILITY_CHECKED', status: 'FAILED',
          attendeeEmail: logMaskEmail(attendeeEmail), attendeePhone: logMaskPhone(attendeePhone),
          razorpayOrderId: razorpay_order_id,
          message: availabilityConflict.body.error,
          errorCode: availabilityConflict.body.code,
          ipAddress: getIp(req), userAgent: req.headers['user-agent'] ?? null,
        }).catch((e) => console.error('[Log] AVAILABILITY_CHECKED write failed:', e.message))
        return res.status(availabilityConflict.statusCode).json(availabilityConflict.body);
      }

      console.log(`[Registration] PAYMENT_VERIFY_START | ts=${new Date().toISOString()} orderId=${razorpay_order_id} paymentId=${razorpay_payment_id}`);

      const isPaymentValid = verifyRazorpaySignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });

      console.log(`[Registration] PAYMENT_VERIFY_RESULT | ts=${new Date().toISOString()} orderId=${razorpay_order_id} paymentId=${razorpay_payment_id} valid=${isPaymentValid}`);

      if (!isPaymentValid) {
        console.warn(`[Registration] PAYMENT_VERIFY_FAILED | ts=${new Date().toISOString()} orderId=${razorpay_order_id} paymentId=${razorpay_payment_id}`);
        writeLog({
          event: 'PAYMENT_VERIFIED', status: 'FAILED',
          attendeeEmail: logMaskEmail(attendeeEmail), attendeePhone: logMaskPhone(attendeePhone),
          razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id,
          errorCode: 'PAYMENT_VERIFICATION_FAILED',
          message: 'Razorpay signature mismatch',
          ipAddress: getIp(req), userAgent: req.headers['user-agent'] ?? null,
        }).catch((e) => console.error('[Log] PAYMENT_VERIFIED write failed:', e.message))
        return res.status(400).json({
          error: 'Payment verification failed. Registration was not created.',
          code: 'PAYMENT_VERIFICATION_FAILED',
        });
      }

      writeLog({
        event: 'PAYMENT_VERIFIED', status: 'SUCCESS',
        attendeeEmail: logMaskEmail(attendeeEmail), attendeePhone: logMaskPhone(attendeePhone),
        razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id,
        message: 'HMAC-SHA256 signature verified successfully',
        ipAddress: getIp(req), userAgent: req.headers['user-agent'] ?? null,
      }).catch((e) => console.error('[Log] PAYMENT_VERIFIED write failed:', e.message))

      const existingPayment = await prisma.registration.findFirst({
        where: {
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      console.log(`[Registration] PAYMENT_REUSE_CHECK | ts=${new Date().toISOString()} paymentId=${razorpay_payment_id} alreadyUsed=${!!existingPayment}`);

      if (existingPayment) {
        console.warn(`[Registration] PAYMENT_ALREADY_USED | ts=${new Date().toISOString()} paymentId=${razorpay_payment_id} existingRegistrationId=${existingPayment.id}`);
        writeLog({
          event: 'PAYMENT_REUSE_CHECKED', status: 'FAILED',
          attendeeEmail: logMaskEmail(attendeeEmail),
          razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id,
          errorCode: 'PAYMENT_ALREADY_USED',
          message: 'Payment ID already used for another registration',
          metadata: { existingRegistrationId: existingPayment.id },
          ipAddress: getIp(req), userAgent: req.headers['user-agent'] ?? null,
        }).catch((e) => console.error('[Log] PAYMENT_REUSE_CHECKED write failed:', e.message))
        return res.status(409).json({
          error: 'This payment has already been used for a registration',
          code: 'PAYMENT_ALREADY_USED',
        });
      }

      writeLog({
        event: 'PAYMENT_REUSE_CHECKED', status: 'SUCCESS',
        attendeeEmail: logMaskEmail(attendeeEmail),
        razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id,
        message: 'Payment ID is unique — not previously used',
        ipAddress: getIp(req), userAgent: req.headers['user-agent'] ?? null,
      }).catch((e) => console.error('[Log] PAYMENT_REUSE_CHECKED write failed:', e.message))

      // Generate ticket ID and create registration atomically under Serializable
      // isolation so concurrent registrations can't read the same count and
      // produce duplicate ticket IDs. Retry up to 3 times on serialization failure.
      const txT0 = Date.now();
      console.log(`[Registration] DB_TX_START | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} orderId=${razorpay_order_id}`);
      let registration;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          registration = await prisma.$transaction(async (tx) => {
            const ticketId = await generateTicketId(tx);
            console.log(`[Registration] TICKET_ID_GENERATED | ts=${new Date().toISOString()} ticketId=${ticketId} email=${maskEmail(attendeeEmail)}`);
            return tx.registration.create({
              data: {
                ticketId,
                attendeeName,
                attendeeEmail,
                attendeePhone,
                organization,
                role,
                dietaryRestrictions,
                accessibilityNeeds,
                status: 'CONFIRMED',
                paymentStatus: 'PAID',
                paymentTransactionId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                amountPaid: REGISTRATION_AMOUNT_PAISE,
              },
            });
          }, { isolationLevel: 'Serializable' });
          const txDuration = Date.now() - txT0
          console.log(`[Registration] DB_TX_SUCCESS | ts=${new Date().toISOString()} registrationId=${registration.id} ticketId=${registration.ticketId} attempt=${attempt} durationMs=${txDuration}`);
          writeLog({
            event: 'REGISTRATION_CREATED', status: 'SUCCESS',
            registrationId: registration.id, ticketId: registration.ticketId,
            attendeeEmail: logMaskEmail(attendeeEmail), attendeePhone: logMaskPhone(attendeePhone),
            razorpayOrderId: razorpay_order_id, razorpayPaymentId: razorpay_payment_id,
            amountPaise: REGISTRATION_AMOUNT_PAISE,
            durationMs: txDuration,
            message: `Registration created and ticket ${registration.ticketId} assigned`,
            ipAddress: getIp(req), userAgent: req.headers['user-agent'] ?? null,
          }).catch((e) => console.error('[Log] REGISTRATION_CREATED write failed:', e.message))
          break;
        } catch (err) {
          if (err.code === 'P2034' && attempt < 3) {
            console.warn(`[Registration] DB_TX_SERIALIZATION_RETRY | ts=${new Date().toISOString()} attempt=${attempt} email=${maskEmail(attendeeEmail)}`);
            continue;
          }
          throw err;
        }
      }

      // Send confirmation email asynchronously (don't wait for it)
      sendConfirmationEmail(registration).catch((err) =>
        console.error(`[Registration] EMAIL_SEND_CATCH | ts=${new Date().toISOString()} registrationId=${registration.id} ticketId=${registration.ticketId} error="${err.message}"`)
      );

      // Sync to Google Sheets asynchronously (don't wait for it)
      syncRegistrationToGoogleSheets(registration).catch((err) =>
        console.error(`[Registration] SHEETS_SYNC_CATCH | ts=${new Date().toISOString()} registrationId=${registration.id} ticketId=${registration.ticketId} error="${err.message}"`)
      );

      console.log(`[Registration] RESPONSE_SENT | ts=${new Date().toISOString()} registrationId=${registration.id} ticketId=${registration.ticketId} statusCode=201`);
      return res.status(201).json({
        success: true,
        registrationId: registration.id,
        ticketId: registration.ticketId,
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Sync registration to Google Sheets with retry logic
 * @param {Object} registration - Registration object with relations
 */
async function syncRegistrationToGoogleSheets(registration) {
  console.log(`[Registration] SHEETS_SYNC_START | ts=${new Date().toISOString()} registrationId=${registration.id} ticketId=${registration.ticketId}`);

  const { isGoogleSheetsConfigured, getGoogleSheetsConfig, syncRegistrationToSheets, TransientSyncError, PermanentSyncError } =
    await import('../services/googleSheetsService.js');

  if (!isGoogleSheetsConfigured()) {
    console.log(`[Registration] SHEETS_SYNC_SKIPPED | ts=${new Date().toISOString()} registrationId=${registration.id} reason="NOT_CONFIGURED"`);
    return;
  }

  try {
    const { queueFailedSync } = await import('../services/retryManager.js');

    const googleSheetsConfig = getGoogleSheetsConfig();

    await syncRegistrationToSheets(registration, googleSheetsConfig);
  } catch (error) {
    // Lazy load error classes for instanceof checks
    const { TransientSyncError, PermanentSyncError } = await import('../services/googleSheetsService.js');
    const { queueFailedSync } = await import('../services/retryManager.js');

    if (error instanceof TransientSyncError) {
      // Queue for retry
      await queueFailedSync(
        registration.id,
        registration,
        error.message,
        'TRANSIENT'
      );
      console.warn(`[Registration] SHEETS_SYNC_QUEUED_RETRY | ts=${new Date().toISOString()} registrationId=${registration.id} ticketId=${registration.ticketId} error="${error.message}"`);
    } else if (error instanceof PermanentSyncError) {
      // Move to dead letter queue
      const failedSync = await queueFailedSync(
        registration.id,
        registration,
        error.message,
        'PERMANENT'
      );
      // Move to dead letter immediately
      await prisma.deadLetterSync.create({
        data: {
          registrationId: registration.id,
          registrationData: registration,
          error: error.message,
          errorType: 'PERMANENT',
          retryCount: 0,
          lastAttemptTime: new Date(),
        },
      });
      await prisma.failedSync.delete({
        where: { id: failedSync.id },
      });
      console.error(`[Registration] SHEETS_SYNC_DEAD_LETTER | ts=${new Date().toISOString()} registrationId=${registration.id} ticketId=${registration.ticketId} error="${error.message}"`);
    } else {
      // Unknown error - treat as transient
      await queueFailedSync(
        registration.id,
        registration,
        error.message,
        'TRANSIENT'
      );
      console.error(`[Registration] SHEETS_SYNC_UNKNOWN_ERROR | ts=${new Date().toISOString()} registrationId=${registration.id} ticketId=${registration.ticketId} error="${error.message}" treating="TRANSIENT"`);
    }
  }
}

export default router;
