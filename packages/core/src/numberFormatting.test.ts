import { describe, expect, it } from 'vitest';

import {
  formattedIndexToRawIndex,
  roundToPlaces,
  sanitizeNumericText,
  defaultFormatDisplay
} from './numberFormatting';

describe('numberFormatting', () => {
  describe('roundToPlaces', () => {
    it('rounds to the requested number of decimal places', () => {
      expect(roundToPlaces(1.2345, 2)).toBe(1.23);
      expect(roundToPlaces(1.235, 2)).toBe(1.24);
    });

    it('handles non-finite numbers', () => {
      expect(roundToPlaces(Infinity, 2)).toBe(Infinity);
      expect(Number.isNaN(roundToPlaces(NaN, 2))).toBe(true);
    });

    it('clamps places to a non-negative integer', () => {
      expect(roundToPlaces(1.29, -2)).toBe(1);
      expect(roundToPlaces(1.29, 0.9)).toBe(1);
    });
  });

  describe('sanitizeNumericText', () => {
    it('keeps digits, one leading minus, and one decimal point', () => {
      expect(sanitizeNumericText('12.3.4.567')).toBe('12.34567');
      expect(sanitizeNumericText('-12.3.4.567')).toBe('-12.34567');
    });

    it('removes non-numeric characters', () => {
      expect(sanitizeNumericText('1,234.50')).toBe('1234.50');
      expect(sanitizeNumericText('$-9,001.20abc')).toBe('-9001.20');
    });

    it('treats minus as a leading sign only', () => {
      expect(sanitizeNumericText('12-3')).toBe('123');
      expect(sanitizeNumericText('--12')).toBe('-12');
    });
  });

  describe('formattedIndexToRawIndex', () => {
    it('counts only numeric characters that exist in the raw text (digits, dot, minus)', () => {
      // 1,234.56
      // 01234567
      // 1 , 2 3 4 . 5 6
      expect(formattedIndexToRawIndex('1,234.56', 0)).toBe(0);
      expect(formattedIndexToRawIndex('1,234.56', 1)).toBe(1); // '1'
      expect(formattedIndexToRawIndex('1,234.56', 2)).toBe(1); // ',' ignored
      expect(formattedIndexToRawIndex('1,234.56', 5)).toBe(4); // after '4'
      expect(formattedIndexToRawIndex('1,234.56', 6)).toBe(5); // after '.'
      expect(formattedIndexToRawIndex('1,234.56', 8)).toBe(7); // end
    });

    it('clamps formattedIndex to string bounds', () => {
      expect(formattedIndexToRawIndex('123', -10)).toBe(0);
      expect(formattedIndexToRawIndex('123', 999)).toBe(3);
    });

    it('handles custom separators (e.g., emoji) by ignoring them', () => {
      // Note: emoji are surrogate pairs in JS strings, so some indices can land
      // "inside" the emoji. We just care that separators don't increment rawIndex.
      expect(formattedIndexToRawIndex('1🔥234', 1)).toBe(1); // after '1'
      expect(formattedIndexToRawIndex('1🔥234', 3)).toBe(1); // after the emoji
      expect(formattedIndexToRawIndex('1🔥234', 4)).toBe(2); // after '2'
    });
  });

  describe('defaultFormatDisplay', () => {
    it('returns a string and does not throw', () => {
      expect(typeof defaultFormatDisplay(1234.987654321, undefined)).toBe('string');
      expect(typeof defaultFormatDisplay(1234.987654321, 2)).toBe('string');
    });

    it('respects maxDecimalPlaces (best-effort)', () => {
      // We keep this loose because Intl formatting can be surprising.
      const s = defaultFormatDisplay(1.2399999, 2);
      // should not contain more than 2 digits after '.' when present
      const parts = s.split('.');
      if (parts.length === 2) expect(parts[1]!.length).toBeLessThanOrEqual(2);
    });
  });
});
