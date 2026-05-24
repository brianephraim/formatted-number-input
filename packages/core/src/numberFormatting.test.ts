import { describe, expect, it } from 'vitest';

import {
  countFractionDigits,
  formattedIndexToRawIndex,
  formatSanitizedNumericTextWithCommas,
  formatSanitizedNumericTextWithGroupSeparator,
  getNumberRoundTripInfo,
  hasNumberRoundTripMismatch,
  inferGroupingSeparatorFromFormattedNumber,
  normalizeNumericText,
  roundNumericTextToDecimalPlaces,
  roundToPlaces,
  sanitizeNumericText,
  stripLeadingIntegerZeros,
  defaultFormatDisplay,
  digitsToRightOfCursor,
  cursorPosForDigitsFromRight,
  findDigitToDelete,
  preserveEditingStateInFormattedText,
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

  describe('roundNumericTextToDecimalPlaces', () => {
    it('rounds only the decimal text without converting the integer through Number', () => {
      expect(roundNumericTextToDecimalPlaces('111111111111111111.223', 2)).toBe(
        '111111111111111111.22'
      );
      expect(roundNumericTextToDecimalPlaces('111111111111111111.226', 2)).toBe(
        '111111111111111111.23'
      );
    });

    it('carries across very large integer text when the fraction rounds up', () => {
      expect(roundNumericTextToDecimalPlaces('999999999999999999.999', 2)).toBe(
        '1000000000000000000.00'
      );
      expect(roundNumericTextToDecimalPlaces('.999', 2)).toBe('1.00');
    });

    it('preserves normal editing shapes when no rounding is needed', () => {
      expect(roundNumericTextToDecimalPlaces('12.3', 2)).toBe('12.3');
      expect(roundNumericTextToDecimalPlaces('12.', 2)).toBe('12.');
      expect(roundNumericTextToDecimalPlaces('.', 2)).toBe('.');
      expect(roundNumericTextToDecimalPlaces('-', 2)).toBe('-');
    });

    it('strips leading integer zeros and keeps the requested decimal width after rounding', () => {
      expect(roundNumericTextToDecimalPlaces('00012.3400', 2)).toBe('12.34');
      expect(roundNumericTextToDecimalPlaces('12.300', 2)).toBe('12.30');
      expect(roundNumericTextToDecimalPlaces('-00012.346', 2)).toBe('-12.35');
    });

    it('supports integer-only rounding when places is zero', () => {
      expect(roundNumericTextToDecimalPlaces('999.5', 0)).toBe('1000');
      expect(roundNumericTextToDecimalPlaces('999.4', 0)).toBe('999');
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

  describe('digitsToRightOfCursor', () => {
    it('counts significant chars to the right of cursor', () => {
      // '1,234,567'
      //  0123456789
      expect(digitsToRightOfCursor('1,234,567', 0)).toBe(7); // all digits
      expect(digitsToRightOfCursor('1,234,567', 1)).toBe(6); // after '1'
      expect(digitsToRightOfCursor('1,234,567', 2)).toBe(6); // after ','  — comma not counted
      expect(digitsToRightOfCursor('1,234,567', 5)).toBe(3); // after '4,'
      expect(digitsToRightOfCursor('1,234,567', 9)).toBe(0); // end
    });

    it('counts dot and minus as significant', () => {
      expect(digitsToRightOfCursor('-1,234.56', 0)).toBe(8); // -1234.56
      expect(digitsToRightOfCursor('-1,234.56', 1)).toBe(7); // after '-'
    });
  });

  describe('cursorPosForDigitsFromRight', () => {
    it('finds position with N significant digits to the right', () => {
      // '1,234,567' — cursor lands right before the Nth significant char from the right
      expect(cursorPosForDigitsFromRight('1,234,567', 7)).toBe(0); // before '1'
      expect(cursorPosForDigitsFromRight('1,234,567', 6)).toBe(2); // before '2'
      expect(cursorPosForDigitsFromRight('1,234,567', 3)).toBe(6); // before '5'
      expect(cursorPosForDigitsFromRight('1,234,567', 0)).toBe(9); // end
    });

    it('clamps to start if digitsFromRight exceeds total', () => {
      expect(cursorPosForDigitsFromRight('1,234', 99)).toBe(0);
    });
  });

  describe('findDigitToDelete', () => {
    it('finds the digit to delete on backspace (skipping commas)', () => {
      // '1,234,567'  cursor at index 2 (just after comma)
      //  0123456789
      expect(findDigitToDelete('1,234,567', 2, 'back')).toBe(0); // the '1'
      expect(findDigitToDelete('1,234,567', 1, 'back')).toBe(0); // the '1'
      expect(findDigitToDelete('1,234,567', 6, 'back')).toBe(4); // the '4'
      expect(findDigitToDelete('1,234,567', 5, 'back')).toBe(4); // cursor after comma → '4'
    });

    it('finds the digit to delete on forward delete (skipping commas)', () => {
      // '1,234,567' cursor at index 1 (just before comma)
      expect(findDigitToDelete('1,234,567', 1, 'forward')).toBe(2); // the '2'
      expect(findDigitToDelete('1,234,567', 2, 'forward')).toBe(2); // the '2'
      expect(findDigitToDelete('1,234,567', 5, 'forward')).toBe(6); // the '5'
    });

    it('returns -1 when there is nothing to delete', () => {
      expect(findDigitToDelete('1,234', 0, 'back')).toBe(-1);
      expect(findDigitToDelete('1,234', 5, 'forward')).toBe(-1);
    });
  });

  describe('defaultFormatDisplay', () => {
    it('returns a string and does not throw', () => {
      expect(typeof defaultFormatDisplay(1234.987654321, undefined)).toBe(
        'string'
      );
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

  describe('normalizeNumericText', () => {
    it('normalizes leading zeros and trailing decimal zeros', () => {
      expect(normalizeNumericText('00123.4500')).toBe('123.45');
      expect(normalizeNumericText('-000.500')).toBe('-0.5');
      expect(normalizeNumericText('0.000')).toBe('0');
      expect(normalizeNumericText('')).toBe('');
    });
  });

  describe('countFractionDigits', () => {
    it('counts digits after the decimal point without normalizing the text', () => {
      expect(countFractionDigits('12')).toBe(0);
      expect(countFractionDigits('12.3400')).toBe(4);
      expect(countFractionDigits('-0.22')).toBe(2);
      expect(countFractionDigits('12.')).toBe(0);
    });
  });

  describe('stripLeadingIntegerZeros', () => {
    it('removes leading integer zeros while preserving decimal editing text', () => {
      expect(stripLeadingIntegerZeros('000123')).toBe('123');
      expect(stripLeadingIntegerZeros('000123.4500')).toBe('123.4500');
      expect(stripLeadingIntegerZeros('000.4500')).toBe('0.4500');
      expect(stripLeadingIntegerZeros('00012.')).toBe('12.');
      expect(stripLeadingIntegerZeros('-00012.3400')).toBe('-12.3400');
    });

    it('does not add a leading zero when the user started with a decimal point', () => {
      expect(stripLeadingIntegerZeros('.25')).toBe('.25');
      expect(stripLeadingIntegerZeros('-.25')).toBe('-.25');
    });
  });

  describe('hasNumberRoundTripMismatch', () => {
    it('returns false when Number can round-trip the text representation', () => {
      expect(hasNumberRoundTripMismatch('123.45')).toBe(false);
      expect(hasNumberRoundTripMismatch('00123.450')).toBe(false);
      expect(hasNumberRoundTripMismatch('111111111111111.22')).toBe(false);
    });

    it('returns true when Number round-tripping changes significant digits', () => {
      expect(hasNumberRoundTripMismatch('1111111111111111.21')).toBe(true);
      expect(hasNumberRoundTripMismatch('111111111111111111.21')).toBe(true);
      expect(hasNumberRoundTripMismatch('999999999999999.25')).toBe(true);
    });
  });

  describe('getNumberRoundTripInfo', () => {
    it('exposes the normalized text, lossy number, and rounded string', () => {
      expect(getNumberRoundTripInfo('123123123123435688')).toEqual({
        normalized: '123123123123435688',
        parsed: 123123123123435680,
        roundTripped: '123123123123435680',
        normalizedRoundTripped: '123123123123435680',
        usesExponentialNotation: false,
        roundTripMismatch: true,
      });
    });
  });

  describe('formatSanitizedNumericTextWithCommas', () => {
    it('formats integer and decimal parts without converting to Number', () => {
      expect(formatSanitizedNumericTextWithCommas('1111111111111111.22')).toBe(
        '1,111,111,111,111,111.22'
      );
      expect(
        formatSanitizedNumericTextWithCommas('111111111111111111.22')
      ).toBe('111,111,111,111,111,111.22');
    });

    it('preserves trailing decimal points and fractional digits', () => {
      expect(formatSanitizedNumericTextWithCommas('12.')).toBe('12.');
      expect(formatSanitizedNumericTextWithCommas('00012.340')).toBe('12.340');
      expect(formatSanitizedNumericTextWithCommas('.25')).toBe('0.25');
    });
  });

  describe('inferGroupingSeparatorFromFormattedNumber', () => {
    it('detects a custom grouping separator from a normal grouped reference value', () => {
      expect(inferGroupingSeparatorFromFormattedNumber('1🍌234🍌567.89')).toBe(
        '🍌'
      );
      expect(inferGroupingSeparatorFromFormattedNumber('1,234,567.89')).toBe(
        ','
      );
    });

    it('returns null when the formatter shape is not a plain grouped number', () => {
      expect(
        inferGroupingSeparatorFromFormattedNumber('$1,234,567.89')
      ).toBeNull();
      expect(
        inferGroupingSeparatorFromFormattedNumber('1,234 567.89')
      ).toBeNull();
      expect(
        inferGroupingSeparatorFromFormattedNumber('1234567.89')
      ).toBeNull();
    });
  });

  describe('formatSanitizedNumericTextWithGroupSeparator', () => {
    it('formats exact numeric text with a custom separator without converting to Number', () => {
      expect(
        formatSanitizedNumericTextWithGroupSeparator(
          '111111111111111111.22',
          '🍌'
        )
      ).toBe('111🍌111🍌111🍌111🍌111🍌111.22');
    });
  });

  describe('preserveEditingStateInFormattedText', () => {
    it('preserves partial numeric editing states', () => {
      expect(preserveEditingStateInFormattedText('-', '')).toBe('-');
      expect(preserveEditingStateInFormattedText('.', '')).toBe('.');
      expect(preserveEditingStateInFormattedText('-.', '')).toBe('-.');
    });

    it('keeps a trailing decimal point visible while editing', () => {
      expect(preserveEditingStateInFormattedText('12.', '12')).toBe('12.');
      expect(preserveEditingStateInFormattedText('-1,234.', '-1,234')).toBe(
        '-1,234.'
      );
    });

    it('leaves fully formatted numeric text unchanged', () => {
      expect(preserveEditingStateInFormattedText('1234', '1,234')).toBe(
        '1,234'
      );
      expect(preserveEditingStateInFormattedText('1234.5', '1,234.5')).toBe(
        '1,234.5'
      );
    });
  });
});
