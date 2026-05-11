import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import validate from '../middleware/validate.js';
import { paymentLimiter } from '../middleware/rateLimit.js';
import { createOrder, verifySignature } from '../services/paymentService.js';
import { sendConfirmationEmail } from '../services/emailService.js';

const router = Router();

const initiateSchema = z.object({
  registrationId: z.string().min(1),
});

const verifySchema = z.object({
  registrationId: z.string().min(1),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

// POST /api/payments/initiate
router.post('/initiate', paymentLimiter, validate(initiateSchema), async (req, res, next) => {
  try {
    const { registrationId } = req.body;

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { ticketType: true },
    });

    if (!registration || registration.status !== 'PENDING') {
      return res.status(404).json({ error: 'Registration not found or not in PENDING state' });
    }

    const { ticketType } = registration;
    const order = await createOrder(ticketType.price, ticketType.currency, registration.ticketId);

    await prisma.registration.update({
      where: { id: registrationId },
      data: { razorpayOrderId: order.id },
    });

    return res.json({
      razorpayOrderId: order.id,
      amount: ticketType.price,
      currency: ticketType.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/verify
router.post('/verify', paymentLimiter, validate(verifySchema), async (req, res, next) => {
  try {
    const { registrationId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return res.status(400).json({
        error: 'Invalid payment signature',
        code: 'INVALID_SIGNATURE',
      });
    }

    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        razorpayPaymentId,
        razorpaySignature,
        paymentTransactionId: razorpayPaymentId,
      },
    });

    sendConfirmationEmail(registration).catch((err) => {
      console.error('Failed to send confirmation email:', err);
    });

    return res.json({
      success: true,
      ticketId: registration.ticketId,
      message: 'Payment verified successfully',
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/payments/demo-confirm  (DEMO MODE — bypasses Razorpay)
router.post('/demo-confirm', async (req, res, next) => {
  try {
    const { registrationId } = req.body
    if (!registrationId) {
      return res.status(400).json({ error: 'registrationId is required' })
    }

    const registration = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentTransactionId: `DEMO-${Date.now()}`,
      },
    })

    sendConfirmationEmail(registration).catch(err => {
      console.error('Failed to send confirmation email:', err)
    })

    return res.json({
      success: true,
      ticketId: registration.ticketId,
      message: 'Demo registration confirmed',
    })
  } catch (err) {
    next(err)
  }
})

export default router;
