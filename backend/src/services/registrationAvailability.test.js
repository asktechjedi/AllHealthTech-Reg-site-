import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../lib/prisma.js', () => ({
  default: {
    registration: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import prisma from '../lib/prisma.js';
import {
  normalizePhone,
  findRegistrationByPhone,
  checkRegistrationAvailability,
} from './registrationAvailability.js';

describe('normalizePhone', () => {
  it('strips formatting and country code', () => {
    expect(normalizePhone('+91 98765 43210')).toBe('9876543210');
    expect(normalizePhone('9876543210')).toBe('9876543210');
  });
});

describe('findRegistrationByPhone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('matches phones that differ only by formatting', async () => {
    prisma.registration.findMany.mockResolvedValue([
      { id: '1', ticketId: 'AHT-1', attendeePhone: '+91 98765 43210' },
    ]);

    const match = await findRegistrationByPhone('9876543210');
    expect(match?.ticketId).toBe('AHT-1');
  });

  it('returns null when no active registration uses the phone', async () => {
    prisma.registration.findMany.mockResolvedValue([
      { id: '1', ticketId: 'AHT-1', attendeePhone: '1111111111' },
    ]);

    expect(await findRegistrationByPhone('9876543210')).toBeNull();
  });
});

describe('checkRegistrationAvailability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports both conflicts', async () => {
    prisma.registration.findFirst.mockResolvedValue({ id: 'email-reg' });
    prisma.registration.findMany.mockResolvedValue([
      { id: 'phone-reg', ticketId: 'AHT-2', attendeePhone: '9999999999' },
    ]);

    const result = await checkRegistrationAvailability({
      attendeeEmail: 'taken@example.com',
      attendeePhone: '9999999999',
    });

    expect(result.available).toBe(false);
    expect(result.emailAvailable).toBe(false);
    expect(result.phoneAvailable).toBe(false);
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.phone).toBeTruthy();
  });
});
