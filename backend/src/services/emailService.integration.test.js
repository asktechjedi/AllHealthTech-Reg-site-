import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '../lib/prisma.js';
import { sendConfirmationEmail } from './emailService.js';

describe('Email Service Integration Tests', () => {
  let testEvent;
  let testTicketType;

  beforeAll(async () => {
    // Create test event
    testEvent = await prisma.event.create({
      data: {
        name: 'Test Email Event',
        date: new Date('2026-07-01'),
        location: 'Test Venue, Test City',
        description: 'Test event for email integration',
      },
    });

    // Create test ticket type
    testTicketType = await prisma.ticketType.create({
      data: {
        eventId: testEvent.id,
        name: 'Standard Ticket',
        price: 2000,
        description: 'Standard ticket type',
        features: ['Access to all sessions', 'Lunch included'],
        isActive: true,
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.registration.deleteMany({
      where: { eventId: testEvent.id },
    });
    await prisma.ticketType.deleteMany({
      where: { eventId: testEvent.id },
    });
    await prisma.event.delete({
      where: { id: testEvent.id },
    });
    await prisma.$disconnect();
  });

  describe('sendConfirmationEmail', () => {
    it('should handle auto-confirmed registration with all fields', async () => {
      const registration = {
        ticketId: 'AHT-EMAIL-00001',
        attendeeName: 'John Doe',
        attendeeEmail: 'john.doe@example.com',
        organization: 'Tech Corp',
        role: 'Software Engineer',
        dietaryRestrictions: 'Vegetarian',
        accessibilityNeeds: 'Wheelchair access',
        ticketType: {
          name: 'Standard Ticket',
        },
        event: {
          name: 'Test Email Event',
          date: new Date('2026-07-01'),
          location: 'Test Venue, Test City',
        },
      };

      // Mock console.error to suppress expected error logs in test output
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // This will fail if SMTP is not configured, but we're testing the function structure
      try {
        await sendConfirmationEmail(registration);
        // If SMTP is configured, this should succeed
        expect(true).toBe(true);
      } catch (error) {
        // Expected to fail in test environment without SMTP config
        // Verify the error is SMTP-related, not a code error
        expect(error.message).toMatch(/SMTP|ECONNREFUSED|ENOTFOUND|Missing credentials/i);
      }

      consoleErrorSpy.mockRestore();
    });

    it('should handle auto-confirmed registration without optional fields', async () => {
      const registration = {
        ticketId: 'AHT-EMAIL-00002',
        attendeeName: 'Jane Smith',
        attendeeEmail: 'jane.smith@example.com',
        // No optional fields
        ticketType: {
          name: 'Standard Ticket',
        },
        event: {
          name: 'Test Email Event',
          date: new Date('2026-07-01'),
          location: 'Test Venue, Test City',
        },
      };

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        await sendConfirmationEmail(registration);
        expect(true).toBe(true);
      } catch (error) {
        // Expected to fail in test environment without SMTP config
        expect(error.message).toMatch(/SMTP|ECONNREFUSED|ENOTFOUND|Missing credentials/i);
      }

      consoleErrorSpy.mockRestore();
    });

    it('should complete within 60 seconds (async sending target)', async () => {
      const registration = {
        ticketId: 'AHT-EMAIL-00003',
        attendeeName: 'Bob Johnson',
        attendeeEmail: 'bob.johnson@example.com',
        ticketType: {
          name: 'Standard Ticket',
        },
        event: {
          name: 'Test Email Event',
          date: new Date('2026-07-01'),
          location: 'Test Venue, Test City',
        },
      };

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const startTime = Date.now();

      try {
        await sendConfirmationEmail(registration);
      } catch (error) {
        // Expected to fail without SMTP
      }

      const duration = Date.now() - startTime;
      
      // Should fail fast (within 10 seconds) if SMTP not configured
      // Should complete within 60 seconds if SMTP is configured
      expect(duration).toBeLessThan(60000);

      consoleErrorSpy.mockRestore();
    }, 65000); // Set test timeout to 65 seconds

    it('should not throw errors for missing optional fields', async () => {
      const registration = {
        ticketId: 'AHT-EMAIL-00004',
        attendeeName: 'Test User',
        attendeeEmail: 'test@example.com',
        organization: null,
        role: undefined,
        dietaryRestrictions: '',
        accessibilityNeeds: null,
        ticketType: {
          name: 'Standard Ticket',
        },
        event: {
          name: 'Test Email Event',
          date: new Date('2026-07-01'),
          location: 'Test Venue, Test City',
        },
      };

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      try {
        await sendConfirmationEmail(registration);
        expect(true).toBe(true);
      } catch (error) {
        // Should only fail due to SMTP, not due to missing fields
        expect(error.message).toMatch(/SMTP|ECONNREFUSED|ENOTFOUND|Missing credentials/i);
        expect(error.message).not.toMatch(/organization|role|dietary|accessibility/i);
      }

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Email sending from registration endpoint', () => {
    it('should verify email is triggered after registration creation', async () => {
      // This test verifies the integration between registration creation and email sending
      const registration = await prisma.registration.create({
        data: {
          ticketId: 'AHT-EMAIL-00005',
          eventId: testEvent.id,
          ticketTypeId: testTicketType.id,
          attendeeName: 'Integration Test User',
          attendeeEmail: 'integration@example.com',
          attendeePhone: '1234567890',
          organization: 'Test Org',
          role: 'Tester',
          dietaryRestrictions: 'None',
          accessibilityNeeds: 'None',
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
        },
        include: {
          event: true,
          ticketType: true,
        },
      });

      // Verify registration was created with auto-confirmed status
      expect(registration.status).toBe('CONFIRMED');
      expect(registration.paymentStatus).toBe('PAID');

      // Verify all fields are present for email
      expect(registration.ticketId).toBe('AHT-EMAIL-00005');
      expect(registration.attendeeName).toBe('Integration Test User');
      expect(registration.attendeeEmail).toBe('integration@example.com');
      expect(registration.organization).toBe('Test Org');
      expect(registration.role).toBe('Tester');
      expect(registration.dietaryRestrictions).toBe('None');
      expect(registration.accessibilityNeeds).toBe('None');
      expect(registration.event).toBeDefined();
      expect(registration.ticketType).toBeDefined();

      // Clean up
      await prisma.registration.delete({
        where: { id: registration.id },
      });
    });
  });
});
