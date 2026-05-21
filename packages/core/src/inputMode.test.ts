import { describe, expect, it } from 'vitest';

import { getDefaultWebInputMode } from './inputMode';

describe('getDefaultWebInputMode', () => {
  it('uses the numeric keypad when decimal places resolve to zero', () => {
    expect(getDefaultWebInputMode(0)).toBe('numeric');
    expect(getDefaultWebInputMode(0.9)).toBe('numeric');
    expect(getDefaultWebInputMode(-2)).toBe('numeric');
  });

  it('uses the decimal keypad when fractional input is allowed', () => {
    expect(getDefaultWebInputMode()).toBe('decimal');
    expect(getDefaultWebInputMode(2)).toBe('decimal');
    expect(getDefaultWebInputMode(Number.NaN)).toBe('decimal');
  });
});
