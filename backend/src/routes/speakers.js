import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// GET /api/speakers
router.get('/', async (_req, res, next) => {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: { displayOrder: 'asc' },
    });

    res.json(speakers);
  } catch (err) {
    next(err);
  }
});

export default router;
