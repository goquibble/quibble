import { FormatDate } from '$lib/functions/date';
import { describe, it, expect } from 'vitest';

describe('FormatDate', () => {
  describe('timeAgo', () => {
    it('should throw Error "invalid date format" for invalid date strings', () => {
      expect(() => new FormatDate('invalid-date').timeAgo()).toThrowError('invalid date format');
    });

    it('should return "just now" for future dates', () => {
      const future_date = new Date(Date.now() + 1000).toISOString();
      const result = new FormatDate(future_date).timeAgo();
      expect(result).toBe('just now');
    });

    it('should return correct time ago for minutes', () => {
      const past_date = new Date(Date.now() - 60 * 1000).toISOString();
      const result = new FormatDate(past_date).timeAgo();
      expect(result).toBe('1min ago');
    });
  });
});
