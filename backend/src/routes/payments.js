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

const router = Router();

function maskEmail(email) {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 3)}***@${domain}`;
}

function maskPhone(phone) {
  return `${'*'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`;
}

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

    const availabilityConflict = await getAvailabilityConflictResponse({
      attendeeEmail,
      attendeePhone,
    });

    console.log(`[Payment] AVAILABILITY_CHECK | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} available=${!availabilityConflict}`);

    if (availabilityConflict) {
      console.warn(`[Payment] AVAILABILITY_CONFLICT | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)} code=${availabilityConflict.body.code}`);
      return res.status(availabilityConflict.statusCode).json(availabilityConflict.body);
    }

    console.log(`[Payment] RAZORPAY_ORDER_CREATING | ts=${new Date().toISOString()} email=${maskEmail(attendeeEmail)}`);
    const t0 = Date.now();
    const order = await createRegistrationOrder({ attendeeName, attendeeEmail });
    console.log(`[Payment] RAZORPAY_ORDER_CREATED | ts=${new Date().toISOString()} orderId=${order.id} amount=${REGISTRATION_AMOUNT_PAISE} currency=${REGISTRATION_CURRENCY} durationMs=${Date.now() - t0} email=${maskEmail(attendeeEmail)}`);

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

export default router;
