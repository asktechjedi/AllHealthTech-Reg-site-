import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendConfirmationEmail } from './emailService.js';

// Mock nodemailer
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    })),
  },
}));

describe('sendConfirmationEmail', () => {
  const mockRegistration = {
    ticketId: 'AHT-2025-00001',
    attendeeName: 'John Doe',
    attendeeEmail: 'john@example.com',
    ticketType: {
      name: 'General Admission',
    },
    event: {
      name: 'AllHealthTech 2025',
      date: new Date('2025-06-15'),
      location: 'Mumbai Convention Center',
    },
  };

  it('should send email with required fields only', async () => {
    await expect(sendConfirmationEmail(mockRegistration)).resolves.not.toThrow();
  });

  it('should send email with all optional fields', async () => {
    const registrationWithOptionalFields = {
      ...mockRegistration,
      organization: 'HealthTech Inc',
      role: 'Software Engineer',
      dietaryRestrictions: 'Vegetarian',
      accessibilityNeeds: 'Wheelchair access',
    };

    await expect(sendConfirmationEmail(registrationWithOptionalFields)).resolves.not.toThrow();
  });

  it('should send email with some optional fields', async () => {
    const registrationWithSomeFields = {
      ...mockRegistration,
      organization: 'HealthTech Inc',
      dietaryRestrictions: 'Vegan',
    };

    await expect(sendConfirmationEmail(registrationWithSomeFields)).resolves.not.toThrow();
  });

  it('should handle missing optional fields gracefully', async () => {
    const registrationWithNullFields = {
      ...mockRegistration,
      organization: null,
      role: undefined,
      dietaryRestrictions: '',
      accessibilityNeeds: null,
    };

    await expect(sendConfirmationEmail(registrationWithNullFields)).resolves.not.toThrow();
  });
});
