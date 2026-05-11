import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import validate from '../middleware/validate.js';
import { registrationLimiter } from '../middleware/rateLimit.js';
import { generateTicketId } from '../services/ticketService.js';
import { initiateRefund } from '../services/paymentService.js';
import { sendCancellationEmail } from '../services/emailService.js';

const router = Router();

const createRegistrationSchema = z.object({
  ticketTypeId: z.string().min(1),
  attendeeName: z.string().min(1),
  attendeeEmail: z.string().email(),
  attendeePhone: z.string().min(7),
  organization: z.string().optional(),
  role: z.string().optional(),
});

router.post(
  '/',
  registrationLimiter,
  validate(createRegistrationSchema),
  async (req, res, next) => {
    try {
      const { ticketTypeId, attendeeName, attendeeEmail, attendeePhone, organization, role } =
        req.body;

      // Check ticket type exists and capacity
      const ticketType = await prisma.ticketType.findUnique({
        where: { id: ticketTypeId },
      });

      if (!ticketType || !ticketType.isActive) {
        return res.status(404).json({ error: 'Ticket type not found' });
      }

      if (ticketType.capacity !== null && ticketType.soldCount >= ticketType.capacity) {
        return res.status(409).json({
          error: 'Ticket type is sold out',
          code: 'TICKET_SOLD_OUT',
        });
      }

      // Get the current (most recent) event
      const event = await prisma.event.findFirst({
        orderBy: { date: 'desc' },
      });

      if (!event) {
        return res.status(404).json({ error: 'No event found' });
      }

      // Generate ticket ID and create registration atomically
      const ticketId = await generateTicketId(prisma);

      const registration = await prisma.$transaction(async (tx) => {
        const reg = await tx.registration.create({
          data: {
            ticketId,
            eventId: event.id,
            ticketTypeId,
            attendeeName,
            attendeeEmail,
            attendeePhone,
            organization,
            role,
            status: 'PENDING',
            paymentStatus: 'PENDING',
          },
        });

        await tx.ticketType.update({
          where: { id: ticketTypeId },
          data: { soldCount: { increment: 1 } },
        });

        return reg;
      });

      return res.status(201).json({
        registrationId: registration.id,
        ticketId: registration.ticketId,
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /lookup?email=&ticketId=
const lookupSchema = z.object({
  email: z.string().email(),
  ticketId: z.string().min(1),
});

router.get('/lookup', validate(lookupSchema, 'query'), async (req, res, next) => {
  try {
    const { email, ticketId } = req.query;

    const registration = await prisma.registration.findFirst({
      where: { attendeeEmail: email, ticketId: ticketId },
      include: { event: true, ticketType: true },
    });

    if (!registration) {
      return res.status(404).json({
        error:
          'No registration found with the provided email and Ticket ID. Please check your details and try again.',
        code: 'REGISTRATION_NOT_FOUND',
      });
    }

    return res.json({
      registrationId: registration.id,
      ticketId: registration.ticketId,
      attendeeName: registration.attendeeName,
      attendeeEmail: registration.attendeeEmail,
      ticketType: registration.ticketType.name,
      paymentStatus: registration.paymentStatus,
      registrationStatus: registration.status,
      eventName: registration.event.name,
      eventDate: registration.event.date,
      eventLocation: registration.event.location,
      createdAt: registration.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

// POST /:id/cancel
const cancelRegistrationSchema = z.object({
  email: z.string().email(),
  ticketId: z.string().min(1),
});

router.post('/:id/cancel', validate(cancelRegistrationSchema), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, ticketId } = req.body;

    const registration = await prisma.registration.findUnique({
      where: { id },
    });

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found', code: 'NOT_FOUND' });
    }

    if (registration.attendeeEmail !== email || registration.ticketId !== ticketId) {
      return res.status(403).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    if (registration.status === 'CANCELLED') {
      return res.status(409).json({
        error: 'Registration is already cancelled',
        code: 'ALREADY_CANCELLED',
      });
    }

    if (registration.status !== 'CONFIRMED') {
      return res.status(400).json({
        error: 'Only confirmed registrations can be cancelled',
        code: 'NOT_CONFIRMED',
      });
    }

    const refund = await initiateRefund(
      registration.razorpayPaymentId,
      registration.amountPaid
    );

    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: new Date(),
        refundId: refund.id,
        refundStatus: 'INITIATED',
      },
      include: { event: true, ticketType: true },
    });

    sendCancellationEmail({
      ...updatedRegistration,
      amountPaid: registration.amountPaid,
      refundId: refund.id,
      refundStatus: 'INITIATED',
    }).catch(err => console.error('Failed to send cancellation email:', err));

    return res.json({
      success: true,
      refundId: updatedRegistration.refundId,
      message: 'Registration cancelled and refund initiated',
    });
  } catch (err) {
    next(err);
  }
});

export default router;
