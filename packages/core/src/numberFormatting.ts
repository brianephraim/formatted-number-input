export function roundToPlaces(value: number, places: number) {
  if (!Number.isFinite(value)) return value;
  const p = Math.max(0, Math.floor(places));
  const factor = 10 ** p;
  return Math.round(value * factor) / factor;
}

export function defaultFormatDisplay(value: number, maxDecimalPlaces: number | undefined) {
  // Keep it conservative: avoid locale surprises in tests.
  // Note: Intl/NumberFormat will clamp maximumFractionDigits internally.
  return value.toLocaleString('en-US', {
    maximumFractionDigits: maxDecimalPlaces ?? 100
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
