import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/agenda
router.get('/', async (req, res, next) => {
  try {
    const { track } = req.query;

    const where = track
      ? { track: { equals: track, mode: 'insensitive' } }
      : {};

    const agendaItems = await prisma.agendaItem.findMany({
      where,
      orderBy: { startTime: 'asc' },
      include: {
        speaker: {
          select: {
            id: true,
            name: true,
            title: true,
            organization: true,
            photoUrl: true,
          },
        },
      },
    });

    res.json(agendaItems);
  } catch (err) {
    next(err);
  }
});

export default router;
