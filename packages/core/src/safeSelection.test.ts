import { describe, expect, it } from 'vitest';

import { safeGetSelectionStart } from './safeSelection';

describe('safeGetSelectionStart', () => {
  it('reads from adapter-style refs that expose getSelectionStart()', () => {
    expect(
      safeGetSelectionStart({
        getSelectionStart: () => 4,
      })
    ).toBe(4);
  });

  it('reads from DOM-backed refs that expose selectionStart directly', () => {
    expect(
      safeGetSelectionStart({
        selectionStart: 7,
      } as unknown as { getSelectionStart?: () => number | null })
    ).toBe(7);
  });

  it('returns null when neither selection API is available', () => {
    expect(safeGetSelectionStart({})).toBeNull();
  });
});
