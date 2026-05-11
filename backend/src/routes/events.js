import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/events/current
router.get('/current', async (_req, res, next) => {
  try {
    const event = await prisma.event.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        ticketTypes: {
          orderBy: { price: 'asc' },
        },
      },
    });

    if (!event) {
      return res.status(404).json({ error: 'No active event found', code: 'EVENT_NOT_FOUND' });
    }

    res.json(event);
  } catch (err) {
    next(err);
  }
});

export default router;
