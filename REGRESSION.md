# Regression Test Plan — rn-number-input

This document is a manual regression checklist for the web demo (`apps/web`) that exercises the core behaviors of the `@rn-number-input/core` `NumberInput` component.

It is designed to be executable by a human (or later automated with Playwright), and covers:
- the overlay (DisplayInput) vs TypingInput model
- controlled updates
- style splitting
- decimals + rounding modes
- caret mapping from formatted display to raw typing input (web)

> Notes
> - Many behaviors (caret/selection mapping) are inherently web/DOM-specific. We currently test these in the Vite dev demo.
> - JavaScript `number` precision and `Intl.NumberFormat` fraction digit limits mean “unlimited decimals” is not truly possible.

---

## 0) Setup / sanity

1. Start dev server (`npm run dev:web`).
2. Open the demo page in Chrome.
3. Hard refresh (Cmd+Shift+R).
4. Confirm the following demo rows exist:
   - Default
   - Bigger text + more padding + thicker border + rounded
   - Dark theme
   - Layout/container styles (fixed width + margin)
   - Decimals (default mode)
   - decimalRoundingMode=displayOnly
   - decimalRoundingMode=displayAndOutput
   - Custom formatDisplay (emoji separators)

**Pass:** No console errors and all sections render.

---

## 1) Controlled behavior (external updates)

For **each** row that has a “set to 1234.987654321” button:

1. Click the button.
2. Verify the monospace `value:` readout updates immediately.
3. Verify the display overlay updates appropriately when blurred.

**Pass:** Readout changes immediately; overlay reflects new value (with formatting/rounding per mode).

---

## 2) Overlay show/hide behavior (focus/blur)

Run on at least one integer row and one decimal row.

1. While blurred, verify the overlay text is visible (formatted).
2. Click into the input.
   - overlay should disappear
   - TypingInput should be focused
3. Blur the input (click outside).
   - overlay should reappear

**Pass:** overlay only shows while blurred; no double-rendered text.

---

## 3) Typing stability (no remount while typing)

Goal: ensure the TypingInput key (`remountKeyForTypingInput`) does **not** update on each keystroke.

1. Focus an input with a long value.
2. Click in the middle of the text to place caret.
3. Type several characters quickly.

**Pass:** caret stays stable; no “jump to end” behavior while typing.

---

## 4) Decimal parsing: multiple decimal points

1. Focus any input.
2. Type: `12.3.4.567`
3. Verify the component doesn’t crash.
4. Verify output is a valid number and extra `.` are collapsed (best effort).

**Pass:** extra decimal points do not break parsing.

---

## 5) Rounding modes: correctness

### 5A) Default mode (Decimals… default mode = displayAndOutput)
Props: `maxDecimalPlaces=2`, `decimalRoundingMode` default.

1. Focus input.
2. Type `1.239999999999` (or add many decimals).
3. While still focused, verify TypingInput can temporarily show extra decimals (no snapping while typing).
4. Blur.
5. Refocus.

**Pass:**
- While focused, TypingInput does **not** snap/round mid-typing.
- On blur, value is rounded to 2 places.
- After blur → refocus, TypingInput is reseeded from the rounded value (long decimals should not reappear).

### 5B) displayOnly mode
Props: `maxDecimalPlaces=2`, `decimalRoundingMode="displayOnly"`.

1. Click “set to 1234.987654321”.
2. Verify readout is unrounded (full value).
3. Blur: overlay should show rounded.
4. Focus: TypingInput should reflect the unrounded controlled value.

**Pass:** display rounds; output/state does not.

### 5C) displayAndOutput explicit mode
Props: `maxDecimalPlaces=2`, `decimalRoundingMode="displayAndOutput"`.

1. Type a value with many decimals.
2. Verify readout rounds.
3. Blur and refocus.

**Pass:** emitted output rounds; TypingInput reseeds to rounded value after blur.

---

## 6) Default display formatting: no accidental 3-decimal clamp

Goal: ensure non-decimal examples do not truncate to 3 decimals due to `toLocaleString` defaults.

1. On the Default row, click “set to 1234.987654321”.
2. Blur (overlay visible).
3. Confirm overlay shows more than 3 fractional digits (within Intl/JS limits).

**Pass:** overlay is not clamped to 3 fractional digits by default.

---

## 7) Web caret mapping from formatted overlay → TypingInput

Goal: clicking on formatted overlay should place caret correctly in raw TypingInput.

### 7A) Commas + right aligned
1. Use an input that shows commas and is `textAlign: 'right'` (e.g. fixed-width example).
2. Blur so overlay is visible.
3. Click *between* two digits (e.g. just after a `3`).
4. Verify TypingInput focuses and caret is placed near that position (not always at end; not consistently off-by-one).

**Pass:** caret placement matches click intent; not systematically shifted by commas.

### 7B) Emoji separator formatting
1. Use the “Custom formatDisplay (emoji separators)” row.
2. Blur so emoji separators are visible.
3. Click near an emoji separator between digits.
4. Verify focus transfer works and caret is placed sensibly in TypingInput.

**Pass:** caret mapping ignores separators and counts only `[0-9.-]`.

---

## 8) Style splitting / layout

1. "Bigger text" row:
   - border width/color/radius are applied to the whole control
   - font size + padding affect both typing and display identically
2. "Dark theme" row:
   - background + text color apply correctly
3. "Fixed width" row:
   - wrapper layout (width/margins) applied correctly

**Pass:** no visible shift between blurred and focused states; box styles apply once (wrapper) and text/padding align.

---

## 9) Focus bounce / caret flash (web)

1. Blur so overlay is visible.
2. Click overlay text.

**Pass:** focus transfer feels natural; minimal visible caret flash on overlay.

---

## Optional future automation notes (Playwright)

Candidate automation targets:
- button click → assert readout text
- focus/blur → overlay present/absent
- basic typing → assert readout
- caret mapping: click at specific x offsets; read `selectionStart` in focused TypingInput via `page.evaluate`.
