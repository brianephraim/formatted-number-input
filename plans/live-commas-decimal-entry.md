# Plan: Live Commas Decimal Entry

## Goal

Allow users to type a decimal point in `showCommasWhileEditing` mode on web without the `.` disappearing before the next digit is entered.

## Reproduction

1. Open the web demo with `inputComponent=html`, `wrapperComponent=html`, and `showCommasWhileEditing=true`.
2. Focus the live-commas input.
3. Replace the current value and type `12.`.
4. Observe that the field collapses back to `12` instead of preserving `12.`.

## Root-Cause Hypothesis

Live mode treats the focused text as a fully formatted numeric value on every keystroke. When the sanitized text is `12.`, `Number("12.")` becomes `12`, so the controlled formatted text loses the trailing decimal point.

## Fix Approach

1. Preserve transient editing states that are meaningful to users but lossy when coerced to `number`.
2. Keep emitting numeric updates when the text parses cleanly.
3. Preserve a trailing decimal point in the focused display so the next typed digit lands in the fractional part.

## Verification

1. Add a targeted web e2e regression for typing `12.` and then `3`.
2. Add a focused core unit test for the helper that preserves transient decimal editing state.
3. Re-verify in the browser against the isolated live-commas permutation.
