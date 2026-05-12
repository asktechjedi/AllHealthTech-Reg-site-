import { describe, it, expect } from 'vitest';
import { calculateBackoffDelay } from './retryManager.js';

describe('Retry Manager', () => {
  describe('calculateBackoffDelay', () => {
    it('should calculate correct exponential backoff for retry 0', () => {
      const delay = calculateBackoffDelay(0, 1000, 2);
      expect(delay).toBe(1000); // 1000 * 2^0 = 1000
    });

    it('should calculate correct exponential backoff for retry 1', () => {
      const delay = calculateBackoffDelay(1, 1000, 2);
      expect(delay).toBe(2000); // 1000 * 2^1 = 2000
    });

    it('should calculate correct exponential backoff for retry 2', () => {
      const delay = calculateBackoffDelay(2, 1000, 2);
      expect(delay).toBe(4000); // 1000 * 2^2 = 4000
    });

    it('should calculate correct exponential backoff for retry 3', () => {
      const delay = calculateBackoffDelay(3, 1000, 2);
      expect(delay).toBe(8000); // 1000 * 2^3 = 8000
    });

    it('should handle different initial delays', () => {
      const delay = calculateBackoffDelay(2, 500, 2);
      expect(delay).toBe(2000); // 500 * 2^2 = 2000
    });

    it('should handle different multipliers', () => {
      const delay = calculateBackoffDelay(2, 1000, 3);
      expect(delay).toBe(9000); // 1000 * 3^2 = 9000
    });

    it('should handle multiplier of 1 (no backoff)', () => {
      const delay = calculateBackoffDelay(5, 1000, 1);
      expect(delay).toBe(1000); // 1000 * 1^5 = 1000
    });

    it('should handle large retry counts', () => {
      const delay = calculateBackoffDelay(10, 1000, 2);
      expect(delay).toBe(1024000); // 1000 * 2^10 = 1024000
    });

    it('should handle fractional multipliers', () => {
      const delay = calculateBackoffDelay(2, 1000, 1.5);
      expect(delay).toBe(2250); // 1000 * 1.5^2 = 2250
    });

    it('should handle very small initial delays', () => {
      const delay = calculateBackoffDelay(2, 100, 2);
      expect(delay).toBe(400); // 100 * 2^2 = 400
    });

    it('should handle very large initial delays', () => {
      const delay = calculateBackoffDelay(2, 10000, 2);
      expect(delay).toBe(40000); // 10000 * 2^2 = 40000
    });

    it('should produce increasing delays for increasing retry counts', () => {
      const delay0 = calculateBackoffDelay(0, 1000, 2);
      const delay1 = calculateBackoffDelay(1, 1000, 2);
      const delay2 = calculateBackoffDelay(2, 1000, 2);
      const delay3 = calculateBackoffDelay(3, 1000, 2);

      expect(delay0).toBeLessThan(delay1);
      expect(delay1).toBeLessThan(delay2);
      expect(delay2).toBeLessThan(delay3);
    });

    it('should match the exponential backoff formula: initialDelay * multiplier^retryCount', () => {
      const testCases = [
        { retryCount: 0, initialDelay: 1000, multiplier: 2, expected: 1000 },
        { retryCount: 1, initialDelay: 1000, multiplier: 2, expected: 2000 },
        { retryCount: 2, initialDelay: 1000, multiplier: 2, expected: 4000 },
        { retryCount: 0, initialDelay: 500, multiplier: 3, expected: 500 },
        { retryCount: 1, initialDelay: 500, multiplier: 3, expected: 1500 },
        { retryCount: 2, initialDelay: 500, multiplier: 3, expected: 4500 },
      ];

      testCases.forEach(({ retryCount, initialDelay, multiplier, expected }) => {
        const delay = calculateBackoffDelay(retryCount, initialDelay, multiplier);
        expect(delay).toBe(expected);
      });
    });
  });

  describe('Exponential Backoff Sequence', () => {
    it('should produce correct sequence for 1s, 2s, 4s backoff', () => {
      const delays = [0, 1, 2, 3].map((retry) => calculateBackoffDelay(retry, 1000, 2));
      expect(delays).toEqual([1000, 2000, 4000, 8000]);
    });

    it('should produce correct sequence for 500ms, 1s, 2s backoff', () => {
      const delays = [0, 1, 2, 3].map((retry) => calculateBackoffDelay(retry, 500, 2));
      expect(delays).toEqual([500, 1000, 2000, 4000]);
    });

    it('should produce correct sequence for 100ms, 300ms, 900ms backoff', () => {
      const delays = [0, 1, 2, 3].map((retry) => calculateBackoffDelay(retry, 100, 3));
      expect(delays).toEqual([100, 300, 900, 2700]);
    });
  });
});
