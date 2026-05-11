import express from 'express';
import cors from 'cors';

import rateLimiter from './middleware/rateLimit.js';
import errorHandler from './middleware/errorHandler.js';

import eventsRouter from './routes/events.js';
import speakersRouter from './routes/speakers.js';
import agendaRouter from './routes/agenda.js';
import registrationsRouter from './routes/registrations.js';
import paymentsRouter from './routes/payments.js';
import contactRouter from './routes/contact.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
app.use(express.json());
app.use(rateLimiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/events', eventsRouter);
app.use('/api/speakers', speakersRouter);
app.use('/api/agenda', agendaRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/contact', contactRouter);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

export default app;
