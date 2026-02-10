export function roundToPlaces(value: number, places: number) {
  if (!Number.isFinite(value)) return value;
  const p = Math.max(0, Math.floor(places));
  const factor = 10 ** p;
  return Math.round(value * factor) / factor;
}

export function defaultFormatDisplay(value: number, maxDecimalPlaces: number | undefined) {
  // Keep it conservative: avoid locale surprises in tests.
  // Note: Intl/NumberFormat will clamp maximumFractionDigits internally.
  const clampedMax =
    typeof maxDecimalPlaces === 'number'
      ? Math.min(20, Math.max(0, Math.floor(maxDecimalPlaces)))
      : 20;

  return value.toLocaleString('en-US', {
    maximumFractionDigits: clampedMax
  });
}

export function formattedIndexToRawIndex(formattedText: string, formattedIndex: number) {
  // Best-effort mapping for formatted display strings that introduce separators
  // like commas/spaces/emoji. We count only the characters that also exist in the
  // raw numeric string (digits, '.', '-').
  let rawIndex = 0;
  const end = Math.max(0, Math.min(formattedIndex, formattedText.length));
  for (let i = 0; i < end; i++) {
    const ch = formattedText[i];
    if (ch >= '0' && ch <= '9') rawIndex++;
    else if (ch === '.' || ch === '-') rawIndex++;
  }
  return rawIndex;
}

function isSignificantChar(ch: string) {
  return (ch >= '0' && ch <= '9') || ch === '.' || ch === '-';
}

export function digitsToRightOfCursor(text: string, cursorPos: number): number {
  let count = 0;
  for (let i = cursorPos; i < text.length; i++) {
    if (isSignificantChar(text[i])) count++;
  }
  return count;
}

export function cursorPosForDigitsFromRight(text: string, digitsFromRight: number): number {
  if (digitsFromRight <= 0) return text.length;

  // Scan from the right, counting significant chars.
  // Returns the cursor position right before the Nth significant char from the end.
  let count = 0;
  for (let i = text.length - 1; i >= 0; i--) {
    if (isSignificantChar(text[i])) {
      count++;
      if (count === digitsFromRight) return i;
    }
  }
  return 0;
}

export function findDigitToDelete(
  text: string,
  cursorPos: number,
  direction: 'back' | 'forward'
): number {
  if (direction === 'back') {
    for (let i = cursorPos - 1; i >= 0; i--) {
      if (isSignificantChar(text[i])) return i;
    }
  } else {
    for (let i = cursorPos; i < text.length; i++) {
      if (isSignificantChar(text[i])) return i;
    }
  }
  return -1;
}

export function sanitizeNumericText(text: string) {
  // Keep digits, dot, minus; then enforce:
  // - at most one leading '-'
  // - at most one '.'
  const keep = text.replace(/[^0-9.-]/g, '');

  const negative = keep.startsWith('-');
  const noMinus = keep.replace(/-/g, '');

  const [intPartRaw, ...decimalParts] = noMinus.split('.');
  const intPart = intPartRaw ?? '';
  const decimalPart = decimalParts.join(''); // collapse extra dots

  const rebuilt = `${negative ? '-' : ''}${intPart}${decimalParts.length ? '.' : ''}${decimalPart}`;
  return rebuilt;
}
