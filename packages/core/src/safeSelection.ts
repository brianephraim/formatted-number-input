import type { InputHandle } from './adapters/types';

export function safeFocus(handle: InputHandle | null) {
  handle?.focus?.();
}

export function safeGetSelectionStart(
  handle: InputHandle | null
): number | null {
  const v = handle?.getSelectionStart?.();
  return typeof v === 'number' ? v : null;
}

export function safeSetSelectionRange(
  handle: InputHandle | null,
  start: number,
  end: number
) {
  try {
    handle?.setSelectionRange?.(start, end);
  } catch {
    // best-effort; some environments may not support selection APIs
  }
}
