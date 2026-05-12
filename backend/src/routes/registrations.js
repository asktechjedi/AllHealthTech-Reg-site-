import { Router } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import validate from '../middleware/validate.js';
import { registrationLimiter } from '../middleware/rateLimit.js';
import { generateTicketId } from '../services/ticketService.js';
import { sendConfirmationEmail } from '../services/emailService.js';

const router = Router();

const createRegistrationSchema = z.object({
  ticketTypeId: z.string().min(1).max(100).optional(),
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
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .trim()
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
});

router.post(
  '/',
  registrationLimiter,
  validate(createRegistrationSchema),
  async (req, res, next) => {
    try {
      const {
        ticketTypeId,
        attendeeName,
        attendeeEmail,
        attendeePhone,
        organization,
        role,
        dietaryRestrictions,
        accessibilityNeeds,
      } = req.body;

      // Get the current (most recent) event
      const event = await prisma.event.findFirst({
        orderBy: { date: 'desc' },
      });

      if (!event) {
        return res.status(404).json({ error: 'No event found' });
      }

      // Check for duplicate email registration for this event
      const existingRegistration = await prisma.registration.findFirst({
        where: {
          attendeeEmail,
          eventId: event.id,
          status: { not: 'CANCELLED' },
        },
      });

      if (existingRegistration) {
        return res.status(409).json({
          error: 'This email is already registered for the event',
          code: 'DUPLICATE_EMAIL',
        });
      }

      // Get ticket type (use provided or default to first active ticket type)
      let ticketType;
      if (ticketTypeId) {
        ticketType = await prisma.ticketType.findUnique({
          where: { id: ticketTypeId },
        });

        if (!ticketType || !ticketType.isActive) {
          return res.status(404).json({ error: 'Ticket type not found' });
        }
      } else {
        // Get default (first active) ticket type for the event
        ticketType = await prisma.ticketType.findFirst({
          where: {
            eventId: event.id,
            isActive: true,
          },
          orderBy: { createdAt: 'asc' },
        });

        if (!ticketType) {
          return res.status(404).json({ error: 'No active ticket type found' });
        }
      }

      // Check capacity
      if (ticketType.capacity !== null && ticketType.soldCount >= ticketType.capacity) {
        return res.status(409).json({
          error: 'Ticket type is sold out',
          code: 'TICKET_SOLD_OUT',
        });
      }

      // Generate ticket ID and create registration atomically
      const ticketId = await generateTicketId(prisma);

      const registration = await prisma.$transaction(async (tx) => {
        const reg = await tx.registration.create({
          data: {
            ticketId,
            eventId: event.id,
            ticketTypeId: ticketType.id,
            attendeeName,
            attendeeEmail,
            attendeePhone,
            organization,
            role,
            dietaryRestrictions,
            accessibilityNeeds,
            status: 'CONFIRMED',
            paymentStatus: 'PAID',
          },
          include: {
            event: true,
            ticketType: true,
          },
        });

        await tx.ticketType.update({
          where: { id: ticketType.id },
          data: { soldCount: { increment: 1 } },
        });

        return reg;
      });

      // Send confirmation email asynchronously (don't wait for it)
      sendConfirmationEmail(registration).catch((err) =>
        console.error('Failed to send confirmation email:', err)
      );

      // Sync to Google Sheets asynchronously (don't wait for it)
      syncRegistrationToGoogleSheets(registration).catch((err) =>
        console.error('Failed to sync registration to Google Sheets:', err)
      );

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
  // Skip if Google Sheets is not configured
  if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SHEETS_CREDENTIALS_PATH) {
    console.log('[Registration] Google Sheets sync is not configured, skipping');
    return;
  }

  try {
    // Lazy load Google Sheets modules
    const { syncRegistrationToSheets, TransientSyncError, PermanentSyncError } = await import('../services/googleSheetsService.js');
    const { queueFailedSync } = await import('../services/retryManager.js');

    const googleSheetsConfig = {
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Registrations',
      credentialsPath: process.env.GOOGLE_SHEETS_CREDENTIALS_PATH,
    };

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
      console.log('[Registration] Transient sync error queued for retry:', {
        registrationId: registration.id,
        error: error.message,
      });
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
      console.error('[Registration] Permanent sync error moved to dead letter queue:', {
        registrationId: registration.id,
        error: error.message,
      });
      // TODO: Alert support team
    } else {
      // Unknown error - treat as transient
      await queueFailedSync(
        registration.id,
        registration,
        error.message,
        'TRANSIENT'
      );
      console.error('[Registration] Unknown sync error queued for retry:', {
        registrationId: registration.id,
        error: error.message,
      });
    }
  }
}

export default router;
