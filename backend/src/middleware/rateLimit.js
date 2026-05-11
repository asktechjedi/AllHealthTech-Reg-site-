import rateLimit from 'express-rate-limit';

const rateLimitResponse = {
  error: 'Too many requests, please try again later.',
  code: 'RATE_LIMIT_EXCEEDED',
};

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(rateLimitResponse);
  },
});

export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(rateLimitResponse);
  },
});

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(rateLimitResponse);
  },
});

export default generalLimiter;
