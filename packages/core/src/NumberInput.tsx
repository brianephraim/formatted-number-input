import { OverlayNumberInput } from './modes/overlay/OverlayNumberInput';
import { LiveNumberInput } from './modes/live/LiveNumberInput';
import type { ModeProps } from './modes/types';

export type NumberInputProps = ModeProps & {
  /**
   * When true, commas (group separators) remain visible while the input is focused
   * and the user is typing. Backspace/Delete intelligently skip over separators
   * to delete the nearest significant digit.
   *
   * When false (default), commas are only shown in the display overlay while blurred.
   */
  showCommasWhileEditing?: boolean;
};

/**
 * Hub component that routes to the appropriate mode implementation.
 */
export function NumberInput({ showCommasWhileEditing = false, ...modeProps }: NumberInputProps) {
  if (showCommasWhileEditing) {
    return <LiveNumberInput {...modeProps} />;
  }
  return <OverlayNumberInput {...modeProps} />;
}
