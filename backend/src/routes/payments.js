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

    const availabilityConflict = await getAvailabilityConflictResponse({
      attendeeEmail,
      attendeePhone,
    });

    if (availabilityConflict) {
      return res.status(availabilityConflict.statusCode).json(availabilityConflict.body);
    }

    const order = await createRegistrationOrder({ attendeeName, attendeeEmail });

    return res.status(201).json({
      success: true,
      orderId: order.id,
      amount: REGISTRATION_AMOUNT_PAISE,
      currency: REGISTRATION_CURRENCY,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
