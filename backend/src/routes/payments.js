import { Router } from 'express';
import { z } from 'zod';
import validate from '../middleware/validate.js';
import {
  createRegistrationOrder,
  REGISTRATION_AMOUNT_PAISE,
  REGISTRATION_CURRENCY,
} from '../services/paymentService.js';
import { getAvailabilityConflictResponse } from '../services/registrationAvailability.js';
import { paymentLimiter } from '../middleware/rateLimit.js';
import { writeLog, maskEmail, maskPhone, getIp } from '../services/registrationLogService.js';

const router = Router();

const createOrderSchema = z.object({
  attendeeName: z.string().min(1, 'Name is required').max(100).trim(),
  attendeeEmail: z.string().max(255).trim().email('Invalid email format').toLowerCase(),
  attendeePhone: z
    .string()
    .min(7, 'Phone number must be at least 7 characters')
    .max(20, 'Phone number must be less than 20 characters')
    .trim()
    .regex(/^[0-9+\-\s()]+$/, 'Phone number can only contain numbers, +, -, spaces, and parentheses'),
});

router.post('/order', paymentLimiter, validate(createOrderSchema), async (req, res, next) => {
  try {
    const { attendeeName, attendeeEmail, attendeePhone } = req.body;

    console.log(`[Payment] ORDER_REQUEST | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} phone=${maskPhone(attendeePhone)} name="${attendeeName}"`);

    writeLog({
      event: 'FORM_SUBMITTED', status: 'SUCCESS',
      attendeeEmail: maskEmail(attendeeEmail), attendeePhone: maskPhone(attendeePhone),
      ipAddress: getIp(req), userAgent: req.headers['user-agent'] ?? null,
      message: 'User submitted registration form',
    }).catch((e) => console.error('[Log] FORM_SUBMITTED write failed:', e.message))

    const availabilityConflict = await getAvailabilityConflictResponse({
      attendeeEmail,
      attendeePhone,
    });

    console.log(`[Payment] AVAILABILITY_CHECK | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} available=${!availabilityConflict}`);

    if (availabilityConflict) {
      console.warn(`[Payment] AVAILABILITY_CONFLICT | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} code=${availabilityConflict.body.code}`);
      writeLog({
        event: 'AVAILABILITY_CHECKED', status: 'FAILED',
        attendeeEmail: maskEmail(attendeeEmail), attendeePhone: maskPhone(attendeePhone),
        message: availabilityConflict.body.error,
        errorCode: availabilityConflict.body.code,
        metadata: { emailAvailable: false },
      }).catch((e) => console.error('[Log] AVAILABILITY_CHECKED write failed:', e.message))
      return res.status(availabilityConflict.statusCode).json(availabilityConflict.body);
    }

    writeLog({
      event: 'AVAILABILITY_CHECKED', status: 'SUCCESS',
      attendeeEmail: maskEmail(attendeeEmail), attendeePhone: maskPhone(attendeePhone),
      message: 'Email and phone are available',
      metadata: { emailAvailable: true, phoneAvailable: true },
    }).catch((e) => console.error('[Log] AVAILABILITY_CHECKED write failed:', e.message))

    console.log(`[Payment] RAZORPAY_ORDER_CREATING | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)}`);
    const t0 = Date.now();
    const order = await createRegistrationOrder({ attendeeName, attendeeEmail });
    const orderDuration = Date.now() - t0
    console.log(`[Payment] RAZORPAY_ORDER_CREATED | ts=${new Date().toISOString()} orderId=${order.id} amount=${REGISTRATION_AMOUNT_PAISE} currency=${REGISTRATION_CURRENCY} durationMs=${orderDuration} email=${maskEmail(attendeeEmail)}`);

    writeLog({
      event: 'PAYMENT_ORDER_CREATED', status: 'SUCCESS',
      attendeeEmail: maskEmail(attendeeEmail),
      razorpayOrderId: order.id,
      amountPaise: REGISTRATION_AMOUNT_PAISE,
      durationMs: orderDuration,
      message: 'Razorpay order created successfully',
    }).catch((e) => console.error('[Log] PAYMENT_ORDER_CREATED write failed:', e.message))

    return res.status(201).json({
      success: true,
      orderId: order.id,
      amount: REGISTRATION_AMOUNT_PAISE,
      currency: REGISTRATION_CURRENCY,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(`[Payment] ORDER_ERROR | ts=${new Date().toISOString()} error="${err.message}" code=${err.code ?? 'UNKNOWN'}`);
    next(err);
  }
});

router.post('/cancelled', paymentLimiter, async (req, res) => {
  const { orderId, reason, email } = req.body;
  const maskedEmail = email ? maskEmail(email) : 'unknown';
  console.warn(`[Payment] PAYMENT_CANCELLED | ts=${new Date().toISOString()} orderId=${orderId ?? 'unknown'} email=${maskedEmail} reason="${reason ?? 'modal_dismissed'}"`);
  writeLog({
    event: 'PAYMENT_CANCELLED', status: 'CANCELLED',
    attendeeEmail: maskedEmail,
    razorpayOrderId: orderId ?? null,
    message: 'User cancelled payment modal',
    metadata: { reason: reason ?? 'modal_dismissed' },
  }).catch((e) => console.error('[Log] PAYMENT_CANCELLED write failed:', e.message))
  return res.status(200).json({ received: true });
});

export default router;
