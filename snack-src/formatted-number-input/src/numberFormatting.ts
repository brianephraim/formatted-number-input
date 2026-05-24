export function roundToPlaces(value: number, places: number) {
  if (!Number.isFinite(value)) return value;
  const p = Math.max(0, Math.floor(places));
  const factor = 10 ** p;
  return Math.round(value * factor) / factor;
}

export function defaultFormatDisplay(
  value: number,
  maxDecimalPlaces: number | undefined
) {
  // Keep it conservative: avoid locale surprises in tests.
  // Note: Intl/NumberFormat will clamp maximumFractionDigits internally.
  const clampedMax =
    typeof maxDecimalPlaces === 'number'
      ? Math.min(20, Math.max(0, Math.floor(maxDecimalPlaces)))
      : 20;

  return value.toLocaleString('en-US', {
    maximumFractionDigits: clampedMax,
  });
}

export function preserveEditingStateInFormattedText(
  sanitizedText: string,
  formattedNumberText: string
) {
  if (
    sanitizedText === '-' ||
    sanitizedText === '.' ||
    sanitizedText === '-.'
  ) {
    return sanitizedText;
  }

  if (sanitizedText.endsWith('.')) {
    return `${formattedNumberText}.`;
  }

  return formattedNumberText;
}

export function normalizeNumericText(text: string) {
  if (text === '') return '';

  const negative = text.startsWith('-');
  const unsigned = negative ? text.slice(1) : text;
  const hasDecimalPoint = unsigned.includes('.');
  const [intPartRaw = '', fractionPartRaw = ''] = unsigned.split('.');
  const normalizedIntPart = intPartRaw.replace(/^0+(?=\d)/, '') || '0';
  const normalizedFractionPart = hasDecimalPoint
    ? fractionPartRaw.replace(/0+$/, '')
    : '';

  const normalizedMagnitude = normalizedFractionPart
    ? `${normalizedIntPart}.${normalizedFractionPart}`
    : normalizedIntPart;

  if (normalizedMagnitude === '0') return '0';
  return `${negative ? '-' : ''}${normalizedMagnitude}`;
}

export function countFractionDigits(text: string) {
  const unsigned = text.startsWith('-') ? text.slice(1) : text;
  const decimalIndex = unsigned.indexOf('.');
  return decimalIndex === -1 ? 0 : unsigned.length - decimalIndex - 1;
}

export function stripLeadingIntegerZeros(text: string) {
  if (text === '') return '';

  const negative = text.startsWith('-');
  const unsigned = negative ? text.slice(1) : text;
  const hasDecimalPoint = unsigned.includes('.');
  const [intPartRaw = '', fractionPart = ''] = unsigned.split('.');
  const strippedIntPart =
    intPartRaw === '' ? '' : intPartRaw.replace(/^0+(?=\d)/, '') || '0';

  return `${negative ? '-' : ''}${strippedIntPart}${hasDecimalPoint ? '.' : ''}${fractionPart}`;
}

export function getNumberRoundTripInfo(text: string) {
  const normalized = normalizeNumericText(text);
  if (normalized === '') {
    return {
      normalized,
      parsed: Number.NaN,
      roundTripped: '',
      normalizedRoundTripped: '',
      usesExponentialNotation: false,
      roundTripMismatch: false,
    };
  }

  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) {
    return {
      normalized,
      parsed,
      roundTripped: '',
      normalizedRoundTripped: '',
      usesExponentialNotation: false,
      roundTripMismatch: false,
    };
  }

  const roundTripped = parsed.toString();
  const usesExponentialNotation =
    roundTripped.includes('e') || roundTripped.includes('E');
  const normalizedRoundTripped = usesExponentialNotation
    ? roundTripped
    : normalizeNumericText(roundTripped);

  return {
    normalized,
    parsed,
    roundTripped,
    normalizedRoundTripped,
    usesExponentialNotation,
    roundTripMismatch:
      usesExponentialNotation || normalizedRoundTripped !== normalized,
  };
}

export function hasNumberRoundTripMismatch(text: string) {
  return getNumberRoundTripInfo(text).roundTripMismatch;
}

export function inferGroupingSeparatorFromFormattedNumber(
  formattedNumber: string
) {
  const match = /^1(.+)234(.+)567\.89$/.exec(formattedNumber);
  if (!match) return null;
  const [, firstSeparator, secondSeparator] = match;
  return firstSeparator === secondSeparator ? firstSeparator : null;
}

export function formatSanitizedNumericTextWithGroupSeparator(
  text: string,
  groupSeparator: string
) {
  const negative = text.startsWith('-');
  const unsigned = negative ? text.slice(1) : text;
  const hasDecimalPoint = unsigned.includes('.');
  const [intPartRaw = '', fractionPart = ''] = unsigned.split('.');

  const normalizedIntPart =
    intPartRaw === '' && hasDecimalPoint
      ? '0'
      : intPartRaw.replace(/^0+(?=\d)/, '') || '0';
  const groupedIntPart = normalizedIntPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    () => groupSeparator
  );

  return `${negative ? '-' : ''}${groupedIntPart}${hasDecimalPoint ? '.' : ''}${fractionPart}`;
}

export function formatSanitizedNumericTextWithCommas(text: string) {
  return formatSanitizedNumericTextWithGroupSeparator(text, ',');
}

export function formattedIndexToRawIndex(
  formattedText: string,
  formattedIndex: number
) {
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

export function cursorPosForDigitsFromRight(
  text: string,
  digitsFromRight: number
): number {
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
