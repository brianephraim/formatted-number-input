export function getDefaultWebInputMode(
  maxDecimalPlaces?: number
): 'numeric' | 'decimal' {
  if (
    typeof maxDecimalPlaces !== 'number' ||
    !Number.isFinite(maxDecimalPlaces)
  ) {
    return 'decimal';
  }

  return Math.max(0, Math.floor(maxDecimalPlaces)) === 0
    ? 'numeric'
    : 'decimal';
}
