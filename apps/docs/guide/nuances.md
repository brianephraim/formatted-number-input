# Nuances and edge cases

This page documents behaviors and edge cases that may affect integration or UX.

## Input parsing

### Negative numbers

A leading `-` is supported (e.g. `-1234.56`). Minus signs in the middle of the string are stripped; `12-3` becomes `123`, `--12` becomes `-12`.

### Multiple decimal points

Extra `.` characters are collapsed into a single decimal point. For example, `12.3.4.567` becomes `12.34567` (first `.` kept, remainder joined as decimal digits).

### Invalid characters

In overlay mode, the typing input is uncontrolled. If the user types letters (e.g. `12abc34`), they remain visible while focused. On blur, the input remounts and reseeds from the controlled value; letters are stripped and the user sees `1234` on refocus.

## formatDisplay and custom separators

`formatDisplay` can return any string. The library treats only digits, `.`, and `-` as significant for:

- **Overlay mode**: Mapping click position in the formatted overlay to caret position in the raw typing input.
- **Live mode**: Finding the digit to delete when Backspace/Delete skips separators.

Custom separators (emoji, spaces, other Unicode) work because they are ignored during these operations.

## Overlay mode reseeding

The overlay mode TypingInput remounts on blur. This ensures that when the user focuses again, the input shows the canonical controlled value rather than stale DOM text (e.g. letters typed before blur). The remount key only updates while blurred, so typing stability is preserved—no caret jump during input.

## Platform differences

- **Web**: `inputMode="numeric"` is used; `keyboardType` is omitted.
- **React Native**: `keyboardType="numeric"` is used; `inputMode` is omitted.
- **Overlay focus transfer**: On web, the display overlay is focusable and forwards focus to the typing input with caret mapping. On native, the overlay has `pointerEvents="none"` and is non-interactive.

## JavaScript number precision

JavaScript `number` precision and `Intl.NumberFormat` fraction digit limits mean "unlimited decimals" is not truly possible. Large values or many decimal places may lose precision.
